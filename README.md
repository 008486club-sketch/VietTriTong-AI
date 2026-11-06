# 越智通AI平台 / VietTriTong AI Platform

[![GitHub stars](https://img.shields.io/github/stars/008486club-sketch/VietTriTong-AI?style=flat&logo=github)](https://github.com/008486club-sketch/VietTriTong-AI)
[![GitHub forks](https://img.shields.io/github/forks/008486club-sketch/VietTriTong-AI?style=flat&logo=github)](https://github.com/008486club-sketch/VietTriTong-AI/forks)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Required Node.js](https://img.shields.io/badge/node-20.18.x-brightgreen)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-ready-2496ed?logo=docker)](https://docker.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)
[![Vietnam Market](https://img.shields.io/badge/focus-Vietnam-ff4444)](https://ai.yuezhitong.com)
[![BytePlus Partner](https://img.shields.io/badge/BytePlus-Partner-3b82f6)](https://byteplus.com)

**Monetize · Publish · Engage · Create —— 一站式越南市场AI社媒内容平台。**

**Kiếm tiền · Xuất bản · Tương tác · Sáng tạo —— Nền tảng nội dung truyền thông xã hội AI cho thị trường Việt Nam.**

---

[![Star History Chart](https://api.star-history.com/svg?repos=008486club-sketch/VietTriTong-AI&type=Date)](https://star-history.com/#008486club-sketch/VietTriTong-AI&Date)

---

🇻🇳 越智通AI平台通过 **AI 自动化**，帮助出海品牌与越南本地企业在 TikTok、YouTube、Facebook、Instagram 等平台构建、分发并变现内容。BytePlus 战略合作伙伴，Seedance 2.0 驱动。

🇻🇳 VietTriTong AI Platform helps brands and businesses build, distribute, and monetize content on TikTok, YouTube, Facebook, Instagram and more — powered by BytePlus Seedance 2.0.

---

## ✨ 核心功能 / Key Features

### 🎨 Create - AI 内容创作 / AI Content Creation
- **AI视频**：Seedance 2.0 文字转视频、图片转视频，15秒到3分钟
- **批量生成**：一次性生成多条内容，适合矩阵账号运营
- **多模型支持**：集成 Grok / Gemini / Qwen 等AI引擎

### 📢 Publish - 多平台发布 / Multi-Platform Publishing
- **一键分发**：覆盖 TikTok、YouTube、Instagram、Facebook、Twitter、LinkedIn等
- **排期管理**：统一规划和排期所有平台内容
- **越南本地化**：标准越南语配音 + 字幕

### 💬 Engage - 智能互动 / Smart Engagement
- **AI回复**：自动生成针对性评论回复
- **评论挖掘**：识别"怎么买"等高转化信号
- **品牌监测**：实时追踪品牌讨论

### 💰 Monetize - 内容变现 / Content Monetization
- **内容交易市场**：品牌方发布任务，创作者接单
- **CPS/CPE/CPM** 三种结算模式
- **AI审核**：自动判断内容匹配度
- 🔗 **任务市场**: `https://ai.yuezhitong.com/marketplace`
- 🔗 **AI视频Demo**: `https://ai.yuezhitong.com/zh-CN/welcome`（页面底部）

---

## 🚀 快速开始 / Quick Start

### 在线使用 / Use Online

🌐 **官方网站**: [https://ai.yuezhitong.com](https://ai.yuezhitong.com)

> 📦 **本仓库包含**：Next.js Web 前端（根目录 `src/`）+ 内容交易市场独立服务（`marketplace/`）。
> 后端（NestJS server / ai）与全栈 `docker-compose` 不在本仓库中。

### 前端源码开发 / Frontend Development

需要 Node.js 20+。

```bash
git clone https://github.com/008486club-sketch/VietTriTong-AI.git
cd VietTriTong-AI
npm install
npm run dev          # http://localhost:6060
```

连接本地后端：`npm run dev:local`（API 指向 `http://localhost:7001/api`），或设置 `NEXT_PUBLIC_PROXY_URL=http://localhost:8080` 让 `/api/*` 走代理。

常用命令：`npm run build`（standalone 输出）· `npm run type-check` · `npm run lint` · `npm test`（Playwright）

### 多语言同步 / i18n (Locize)

`syncLocales` / `migrateToLocize` 需要 Locize API key，**通过环境变量提供，切勿写入 package.json**：

```bash
LOCIZE_API_KEY=xxxx npm run syncLocales
```

---


## 🧩 内容交易市场（独立服务）/ Marketplace (standalone)

> `marketplace/` 是独立 FastAPI 服务（内容交易市场后端），不属于 NextJS 应用。部署 secrets 一律从环境变量注入（2026-09-02 安全整改：曾在公开仓库泄露 API key / JWT / DB 密码，代码已全部 env 化）。

```bash
cd marketplace
cp .env.example .env   # 填入真实值：MONGODB_URI / REDIS_URL / JWT_SECRET / INTERNAL_TOKEN / CORS_ORIGINS
docker compose up -d --build
```

- ⚠️ **禁止**在源码/配置里硬编码 secrets；`.env` 不入库（`.env.example` 为模板）
- AI 聊天端点 `/api/market/ai/chat` 已下线（返回 503），不依赖第三方 AI key
- 端口 8010（内部）；如需对公网，请经 Nginx 反代
- 未设置 `JWT_SECRET` 时服务**拒绝启动**；`INTERNAL_TOKEN` 留空即关闭内部管理员通道
- 容器以非 root 用户运行；`/marketplace` 页面由 `marketplace.html` 提供


## 🏗️ 系统架构 / Architecture

```
                         ┌──────────┐
                         │  Nginx   │
                         │  :8080   │
                         └────┬─────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────┴─────┐  ┌─────┴──────┐  ┌─────┴─────┐
        │  Web (FE)  │  │  Server    │  │  AI       │
        │  :3000     │  │  :3002     │  │  :3010    │
        └────────────┘  └──────┬─────┘  └─────┬─────┘
                               │              │
                  ┌────────────┼──────────────┤
                  │            │              │
             ┌────┴─────┐ ┌───┴────┐  ┌──────┴───┐
             │ MongoDB  │ │ Redis  │  │  RustFS  │
             │ :27017   │ │ :6379  │  │ :9000/01 │
             └──────────┘ └────────┘  └──────────┘
```

| 服务 | 说明 | 端口 |
|------|------|------|
| **Nginx** | 反向代理，统一入口 | 8080 |
| **web** | Next.js 前端 | 3000 |
| **server** | NestJS 主后端 API | 3002 |
| **ai** | NestJS AI 服务 | 3010 |
| **MongoDB** | 数据库 | 27017 |
| **Redis** | 缓存/队列 | 6379 |
| **RustFS** | S3 兼容对象存储 | 9000/9001 |

---

## 🛠️ 技术栈 / Tech Stack

| 前端 | 后端 | AI | 基础设施 |
|------|------|-----|---------|
| Next.js 14 | NestJS | Seedance 2.0 | Docker |
| React 18 | Nx workspace | Grok Video | MongoDB |
| TypeScript 5 | FastAPI（marketplace） | Gemini | Redis |
| Tailwind CSS 4 | MongoDB | Qwen (通义千问) | RustFS |
| i18n (中越英日韩德法) | Redis | GPT-5/4 | Nginx |

---

## 📊 支持平台 / Supported Platforms

| 平台 | 发布 | 互动 |
|------|------|------|
| TikTok | ✅ | ✅ |
| YouTube | ✅ | ✅ |
| Instagram | ✅ | ✅ |
| Facebook | ✅ | ✅ |
| Twitter / X | ✅ | ✅ |
| LinkedIn | ✅ | ✅ |
| Pinterest | ✅ | ❌ |
| Threads | ✅ | ❌ |
| 小红书 | ✅ | ✅ |
| 抖音 | ✅ | ✅ |
| Bilibili | ✅ | ✅ |
| 快手 | ✅ | ✅ |

---

## 🤝 贡献指南 / Contributing

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 开始。

---

## 📄 许可协议 / License

[MIT License](LICENSE)

---

## 📞 联系我们 / Contact

- **网站**: [https://yuezhitong.com](https://yuezhitong.com)
- **邮件**: mach@paytok.com
- **GitHub**: [008486club-sketch/VietTriTong-AI](https://github.com/008486club-sketch/VietTriTong-AI/issues)

---

<p align="center">
  <b>BytePlus 生态合作伙伴 · Seedance 2.0 驱动</b>
  <br>
  Made with ❤️ for Vietnam Market
</p>
