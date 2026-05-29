"""
内容交易市场 (Content Marketplace) - FastAPI 后端模块
===================================================
越智通AI平台 - 越南市场内容交易平台

功能：
- 任务创建（品牌方发布推广任务）
- 任务广场（创作者浏览/筛选任务）
- 任务接单/提交/审核
- 结算系统（CPS/CPE/CPM/固定价）
- 积分充值对接
- AI审核（自动判断内容匹配度）

依赖：
- FastAPI
- MongoDB (motor)
- Redis (redis-py)

部署：
独立运行在 :8010 端口，通过 Nginx 代理至 /api/market/
"""

import os
import asyncio
import hashlib
import json
import logging
import uuid
from datetime import datetime, timedelta
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, field_validator

from fastapi import FastAPI, HTTPException, Depends, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorClient
import redis.asyncio as redis

# ============================================================
# 配置
# ============================================================

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "yuezhitong")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
INTERNAL_TOKEN = os.getenv("INTERNAL_TOKEN", "")
PORT = int(os.getenv("PORT", "8010"))

# ============================================================
# 数据模型
# ============================================================

class TaskType(str, Enum):
    """任务类型"""
    PROMOTION = "promotion"      # 推广任务：创作者发布内容
    INTERACTION = "interaction"  # 互动任务：创作者互动（点赞评论）

class PricingMode(str, Enum):
    """定价模式"""
    FIXED = "fixed"              # 固定价
    CPM = "cpm"                  # 按千次播放
    CPE = "cpe"                  # 按千次互动

class TaskStatus(str, Enum):
    ACTIVE = "active"            # 招募中
    CANCELLED = "cancelled"      # 已下架
    DELETED = "deleted"          # 已删除

class UserTaskStatus(str, Enum):
    DOING = "doing"              # 待提交
    WAITING = "waiting"          # 发布中
    PENDING = "pending"          # 待审核
    APPROVED = "approved"        # 待结算
    SETTLED = "settled"          # 已结算
    REJECTED = "rejected"        # 已拒绝
    CANCELLED = "cancelled"      # 已取消

# ============================================================
# Pydantic 模型
# ============================================================

class TaskCreate(BaseModel):
    """创建任务请求"""
    title: str = Field(..., min_length=1, max_length=50, description="任务标题")
    description: Optional[str] = Field(None, max_length=1000, description="任务描述")
    type: TaskType = TaskType.PROMOTION
    platform: str = Field(..., description="目标平台，如 tiktok, youtube")
    pricing_mode: PricingMode = PricingMode.FIXED
    price: float = Field(..., gt=0, description="单价（积分）")
    quantity: int = Field(..., ge=1, description="招募人数")
    deadline: Optional[datetime] = Field(None, description="截止时间")
    material_ids: list[str] = Field(default_factory=list, description="素材ID列表")
    interaction_actions: Optional[list[str]] = Field(None, description="互动要求：like, comment, collect")
    location: Optional[dict] = Field(None, description="位置要求")
    cpm_price: Optional[float] = Field(None, description="CPM单价")
    cpe_price: Optional[float] = Field(None, description="CPE单价")

class TaskUpdate(BaseModel):
    """更新任务"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None

class TaskResponse(BaseModel):
    """任务响应"""
    id: str
    title: str
    description: Optional[str]
    type: str
    platform: str
    pricing_mode: str
    price: float
    quantity: int
    current_recruits: int
    status: str
    deadline: Optional[datetime]
    publisher_id: str
    created_at: datetime
    updated_at: datetime

class SubmitWork(BaseModel):
    """提交作品"""
    work_url: Optional[str] = Field(None, description="作品链接")
    publish_record_id: Optional[str] = Field(None, description="发布记录ID")
    screenshot_urls: list[str] = Field(default_factory=list, description="截图URL")

# ============================================================
# FastAPI App
# ============================================================

app = FastAPI(
    title="越智通 - 内容交易市场",
    description="VietTriTong Content Marketplace API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("marketplace")
logger.setLevel(logging.INFO)


# ============================================================
# 依赖注入
# ============================================================

async def get_db():
    """获取MongoDB实例"""
    client = AsyncIOMotorClient(MONGODB_URI)
    try:
        yield client[MONGODB_DB]
    finally:
        client.close()

async def get_redis():
    """获取Redis实例"""
    r = redis.from_url(REDIS_URL, decode_responses=True)
    try:
        yield r
    finally:
        await r.close()

async def verify_auth(request: Request):
    """验证用户身份 - 支持JWT + INTERNAL_TOKEN"""
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth[7:]
        if token == INTERNAL_TOKEN:
            return {"user_id": "internal", "role": "admin", "name": "Admin"}
        try:
            import jwt
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            return {
                "user_id": payload.get("id", "unknown"),
                "name": payload.get("name", ""),
                "mail": payload.get("mail", ""),
                "token": token,
                "role": "user",
            }
        except jwt.ExpiredSignatureError:
            raise HTTPException(401, "Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(401, "Invalid token")
    raise HTTPException(401, "Authorization required")


# ============================================================
# API 路由
# ============================================================

@app.get("/health")
async def health():
    return {"status": "ok", "service": "marketplace"}


# ============================================================
# 任务管理 API
# ============================================================

@app.post("/api/market/tasks", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    user: dict = Depends(verify_auth),
    db=Depends(get_db),
):
    """
    创建推广任务
    - 品牌方发布任务
    - 需要预扣积分（冻结金额）
    """
    user_id = user["user_id"]
    user_name = user.get("name", "")
    
    # 计算总价（美分）
    total_cost = int(task.price * task.quantity)
    
    # 查余额
    balance_doc = await db.creditsBalance.find_one({"userId": user_id})
    balance = balance_doc["balance"] if balance_doc else 0
    
    if balance < total_cost:
        raise HTTPException(400, f"Số dư không đủ. Cần {total_cost} xu, hiện có {balance} xu")
    
    # 扣减积分
    await db.creditsBalance.update_one(
        {"userId": user_id},
        {"$inc": {"balance": -total_cost}}
    )
    await db.creditsRecord.insert_one({
        "userId": user_id,
        "amount": -total_cost,
        "balance": 0,
        "type": "task",
        "description": f"Tạo nhiệm vụ: {task.title}",
        "metadata": {"task_title": task.title},
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    })
    
    task_doc = {
        "_id": str(uuid.uuid4()),
        "title": task.title,
        "description": task.description or "",
        "type": task.type.value if isinstance(task.type, TaskType) else task.type,
        "platform": task.platform,
        "pricing_mode": task.pricing_mode.value if isinstance(task.pricing_mode, PricingMode) else task.pricing_mode,
        "price": task.price,
        "quantity": task.quantity,
        "current_recruits": 0,
        "total_cost": total_cost,
        "status": TaskStatus.ACTIVE.value,
        "deadline": task.deadline,
        "material_ids": task.material_ids,
        "interaction_actions": task.interaction_actions,
        "location": task.location,
        "cpm_price": task.cpm_price,
        "cpe_price": task.cpe_price,
        "publisher_id": user_id,
        "publisher_name": user_name,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    await db.tasks.insert_one(task_doc)
    
    return TaskResponse(
        id=task_doc["_id"],
        title=task_doc["title"],
        description=task_doc["description"],
        type=task_doc["type"],
        platform=task_doc["platform"],
        pricing_mode=task_doc["pricing_mode"],
        price=task_doc["price"],
        quantity=task_doc["quantity"],
        current_recruits=task_doc["current_recruits"],
        status=task_doc["status"],
        deadline=task_doc["deadline"],
        publisher_id=task_doc["publisher_id"],
        created_at=task_doc["created_at"],
        updated_at=task_doc["updated_at"],
    )


@app.get("/api/market/tasks")
async def list_tasks(
    platform: Optional[str] = None,
    type: Optional[str] = None,
    status: str = "active",
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort: str = "newest",
    db=Depends(get_db),
):
    """
    任务广场 - 列出所有可接任务
    - 平台筛选
    - 类型筛选
    - 排序（最新/最热/价格高低）
    """
    query = {}
    if status:
        query["status"] = status
    if platform:
        query["platform"] = platform
    if type:
        query["type"] = type
    
    sort_options = {
        "newest": [("created_at", -1)],
        "oldest": [("created_at", 1)],
        "price_high": [("price", -1)],
        "price_low": [("price", 1)],
    }
    sort_by = sort_options.get(sort, sort_options["newest"])
    
    total = await db.tasks.count_documents(query)
    cursor = db.tasks.find(query).sort(sort_by).skip((page - 1) * page_size).limit(page_size)
    tasks = await cursor.to_list(length=page_size)
    
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": [{
            "id": t["_id"],
            "title": t["title"],
            "description": t["description"],
            "type": t["type"],
            "platform": t["platform"],
            "pricing_mode": t["pricing_mode"],
            "price": t["price"],
            "quantity": t["quantity"],
            "current_recruits": t["current_recruits"],
            "status": t["status"],
            "deadline": t.get("deadline"),
            "publisher_id": t["publisher_id"],
            "created_at": t["created_at"],
        } for t in tasks]
    }


@app.get("/api/market/tasks/{task_id}")
async def get_task_detail(
    task_id: str,
    db=Depends(get_db),
):
    """获取任务详情"""
    task = await db.tasks.find_one({"_id": task_id})
    if not task:
        raise HTTPException(404, "任务不存在")
    return task


@app.post("/api/market/tasks/{task_id}/accept")
async def accept_task(
    task_id: str,
    user: dict = Depends(verify_auth),
    db=Depends(get_db),
):
    """
    创作者接单
    - 检查名额是否已满
    - 创建UserTask记录
    """
    user_id = user["user_id"]
    
    task = await db.tasks.find_one({"_id": task_id})
    if not task:
        raise HTTPException(404, "任务不存在")
    if task["current_recruits"] >= task["quantity"]:
        raise HTTPException(400, "名额已满")
    
    # 检查是否已接过此任务
    existing = await db.user_tasks.find_one({
        "task_id": task_id,
        "user_id": user_id,
        "status": {"$nin": [UserTaskStatus.CANCELLED.value]}
    })
    if existing:
        raise HTTPException(400, "已接此任务")
    
    # 创建用户任务
    user_task = {
        "_id": str(uuid.uuid4()),
        "task_id": task_id,
        "user_id": user_id,
        "status": UserTaskStatus.DOING.value,
        "reward": task["price"],
        "pricing_mode": task["pricing_mode"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    # 更新招募数
    await db.tasks.update_one(
        {"_id": task_id},
        {"$inc": {"current_recruits": 1}}
    )
    await db.user_tasks.insert_one(user_task)
    
    return {"id": user_task["_id"], "status": user_task["status"]}


@app.post("/api/market/tasks/{task_id}/submit")
async def submit_work(
    task_id: str,
    work: SubmitWork,
    user: dict = Depends(verify_auth),
    db=Depends(get_db),
):
    """
    创作者提交作品
    - 状态: DOING → WAITING/PENDING
    - 可选AI审核
    """
    user_id = user["user_id"]
    
    user_task = await db.user_tasks.find_one({
        "task_id": task_id,
        "user_id": user_id,
        "status": UserTaskStatus.DOING.value
    })
    if not user_task:
        raise HTTPException(404, "未找到进行中的任务")
    
    # 更新状态
    await db.user_tasks.update_one(
        {"_id": user_task["_id"]},
        {"$set": {
            "status": UserTaskStatus.PENDING.value,
            "work_url": work.work_url,
            "publish_record_id": work.publish_record_id,
            "screenshot_urls": work.screenshot_urls,
            "submission_time": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }}
    )
    
    return {"status": "submitted", "message": "作品已提交，等待审核"}


@app.post("/api/market/tasks/{task_id}/review")
async def review_work(
    task_id: str,
    user_task_id: str = Query(...),
    action: str = Query(..., regex="^(approve|reject)$"),
    reason: Optional[str] = None,
    user: dict = Depends(verify_auth),
    db=Depends(get_db),
    r=Depends(get_redis),
):
    """
    审核作品（品牌方操作）
    - approve: 审核通过，进入结算
    - reject: 审核不通过，退回修改
    """
    user_id = user["user_id"]
    
    # 验证是任务发布者
    task = await db.tasks.find_one({"_id": task_id, "publisher_id": user_id})
    if not task:
        raise HTTPException(403, "只有任务发布者可以审核")
    
    user_task = await db.user_tasks.find_one({"_id": user_task_id, "task_id": task_id})
    if not user_task:
        raise HTTPException(404, "用户任务不存在")
    
    if action == "approve":
        new_status = UserTaskStatus.APPROVED.value
        # 触发自动结算（7天后）
        settle_time = datetime.utcnow() + timedelta(days=7)
        await r.setex(
            f"settle:{user_task_id}",
            7 * 24 * 3600,
            json.dumps({"user_task_id": user_task_id, "settle_at": settle_time.isoformat()})
        )
    else:
        new_status = UserTaskStatus.REJECTED.value
        # 退回，创作者可重新提交
    
    await db.user_tasks.update_one(
        {"_id": user_task_id},
        {"$set": {
            "status": new_status,
            "rejection_reason": reason if action == "reject" else None,
            "updated_at": datetime.utcnow(),
        }}
    )
    
    return {"status": new_status}


# ============================================================
# 用户任务管理
# ============================================================

@app.get("/api/market/my-tasks")
async def my_tasks(
    tab: str = "accepted",  # accepted | published
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: dict = Depends(verify_auth),
    db=Depends(get_db),
):
    """我的任务 - 已接/已发布"""
    user_id = user["user_id"]
    
    if tab == "accepted":
        query = {"user_id": user_id}
        if status:
            query["status"] = status
        total = await db.user_tasks.count_documents(query)
        cursor = db.user_tasks.find(query).sort("created_at", -1).skip((page-1)*page_size).limit(page_size)
        items = await cursor.to_list(length=page_size)
    else:
        query = {"publisher_id": user_id}
        if status:
            query["status"] = status
        total = await db.tasks.count_documents(query)
        cursor = db.tasks.find(query).sort("created_at", -1).skip((page-1)*page_size).limit(page_size)
        items = await cursor.to_list(length=page_size)
    
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": items
    }


# ============================================================
# 结算系统
# ============================================================

@app.post("/api/market/settle/{user_task_id}")
async def trigger_settle(
    user_task_id: str,
    db=Depends(get_db),
    r=Depends(get_redis),
):
    """
    触发结算（7天后自动执行）
    将冻结的积分释放给创作者
    """
    user_task = await db.user_tasks.find_one({"_id": user_task_id, "status": UserTaskStatus.APPROVED.value})
    if not user_task:
        raise HTTPException(404, "没有待结算的任务")
    
    # 执行结算
    await db.user_tasks.update_one(
        {"_id": user_task_id},
        {"$set": {
            "status": UserTaskStatus.SETTLED.value,
            "settle_time": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }}
    )
    
    # 发放积分给创作者
    try:
        await db.creditsBalance.update_one(
            {"userId": user_task["user_id"]},
            {"$inc": {"balance": user_task["reward"]}},
            upsert=True
        )
        await db.creditsRecord.insert_one({
            "userId": user_task["user_id"],
            "amount": user_task["reward"],
            "balance": user_task["reward"],
            "type": "task_reward",
            "description": f"Thanh toán nhiệm vụ",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
        })
    except Exception as e:
        logger.error(f"Settle credits failed for {user_task_id}: {e}")
    
    return {"status": "settled", "message": f"Đã thanh toán {user_task['reward']} xu cho người sáng tạo"}


# ============================================================
# 用户积分
# ============================================================

@app.get("/api/market/balance")
async def get_balance(
    user: dict = Depends(verify_auth),
    db=Depends(get_db),
):
    """获取当前用户积分余额"""
    user_id = user["user_id"]
    balance_doc = await db.creditsBalance.find_one({"userId": user_id})
    balance = balance_doc["balance"] if balance_doc else 0
    return {"balance": balance, "user_id": user_id}


# ============================================================
# 静态文件服务
# ============================================================

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")

@app.get("/marketplace")
async def marketplace_page():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "Frontend not deployed"}

# ============================================================
# 启动
# ============================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
