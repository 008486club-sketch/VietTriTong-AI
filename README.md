# 越智通AI平台 / VietTriTong AI Platform

[![GitHub stars](https://img.shields.io/github/stars/008486club-sketch/VietTriTong-AI)](https://github.com/008486club-sketch/VietTriTong-AI/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Required Node.js](https://img.shields.io/badge/node-20.18.x-brightgreen)](https://nodejs.org)

**Monetize · Publish · Engage · Create —— 一站式越南市场AI社媒内容平台。**

**Kiếm tiền · Xuất bản · Tương tác · Sáng tạo —— Nền tảng nội dung truyền thông xã hội AI cho thị trường Việt Nam.**

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
- 🔗 **线上访问**: `https://ai.yuezhitong.com/api/market/tasks`

---

## 🚀 快速开始 / Quick Start

### 在线使用 / Use Online

🌐 **官方网站**: [https://ai.yuezhitong.com](https://ai.yuezhitong.com)

### Docker 一键部署 / Docker One-Click Deploy

```bash
git clone https://github.com/008486club-sketch/VietTriTong-AI.git
cd VietTriTong-AI
docker compose up -d
```

打开 [http://localhost:8080](http://localhost:8080) 即可使用。

### 源码开发 / Source Development

```bash
cd project/aitoearn-backend
pnpm install
pnpm nx serve aitoearn-ai
# 在另一个终端
pnpm nx serve aitoearn-server
```

```bash
cd project/aitoearn-web
pnpm install
pnpm run dev
```

---

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
| Next.js 15 | NestJS | Seedance 2.0 | Docker |
| React 19 | Nx workspace | Grok Video | MongoDB |
| TypeScript | pnpm | Gemini | Redis |
| Tailwind CSS | MongoDB | Qwen (通义千问) | RustFS |
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
- **邮件**: hello@yuezhitong.com
- **Telegram**: [t.me/yuezhitong](https://t.me/yuezhitong)

---

<p align="center">
  <b>BytePlus 生态合作伙伴 · Seedance 2.0 驱动</b>
  <br>
  Made with ❤️ for Vietnam Market
</p>
