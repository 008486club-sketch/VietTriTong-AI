# VietTriTong AI Platform (越智通AI平台)

[![GitHub stars](https://img.shields.io/github/stars/008486club-sketch/VietTriTong-AI?style=flat&logo=github)](https://github.com/008486club-sketch/VietTriTong-AI/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/008486club-sketch/VietTriTong-AI?style=flat&logo=github)](https://github.com/008486club-sketch/VietTriTong-AI/forks)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-2496ed?logo=docker)](https://docker.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)
[![Vietnam Market](https://img.shields.io/badge/focus-Vietnam-ff4444)](https://ai.yuezhitong.com)
[![BytePlus Partner](https://img.shields.io/badge/BytePlus-Partner-3b82f6)](https://byteplus.com)

**Monetize · Publish · Engage · Create — AI-powered social media platform for Vietnam market.**

**Kiếm tiền · Xuất bản · Tương tác · Sáng tạo — Nền tảng nội dung truyền thông xã hội AI cho thị trường Việt Nam.**

---

[![Star History Chart](https://api.star-history.com/svg?repos=008486club-sketch/VietTriTong-AI&type=Date)](https://star-history.com/#008486club-sketch/VietTriTong-AI&Date)

VietTriTong AI Platform helps brands and businesses build, distribute, and monetize content with **AI-powered automation** across the Vietnam's most popular social media platforms.

Supported Channels: TikTok, YouTube, Instagram, Facebook, Twitter (X), LinkedIn, Pinterest, Threads, Xiaohongshu, Douyin, Bilibili, Kuaishou

---

## 🚀 Quick Start (3 Ways)

| Option | Best for | Deployment needed? |
|--------|----------|-------------------|
| [① Use the Website](#use-web) | Everyone | ❌ No |
| [② Docker One-Click Deploy](#use-docker) | Teams wanting self-hosted | ✅ Server needed |
| [③ Build from Source](#use-source) | Developers | ✅ Dev environment needed |

---

## Key Features

### 🎨 Create — Content Creation Agent

AI-powered content creation. Just tell the Agent what you need — it handles everything from idea to finished product.

- **Video Content**: Seedance 2.0, Grok Video, Gemini Video — text-to-video, image-to-video
- **Image & Text**: AI image generation with multiple models
- **Batch Generation**: Generate multiple pieces of content in parallel for matrix account operations

---

### 📢 Publish — Content Publishing Agent

Distribute content to 12+ major platforms worldwide with one click.

- **Multi-Platform**: TikTok, YouTube, Facebook, Instagram, Threads, X (Twitter), Pinterest, LinkedIn, Xiaohongshu, Douyin, Bilibili, Kuaishou
- **Calendar Scheduler**: Plan and coordinate content publishing across all platforms
- **Vietnamese Localization**: Vietnamese voiceover + subtitles support

---

### 💬 Engage — Content Engagement Agent

Automate engagement operations across supported platforms.

- **Automated Actions**: Auto-like, bookmark, follow
- **AI Smart Replies**: Generate targeted replies for each comment
- **Comment Mining**: Detect high-conversion signals like "how to buy"
- **Brand Monitoring**: Track brand mentions in real-time

---

### 💰 Monetize — Earn from Your Content (Coming Soon)

- **Content Marketplace**: Brands post promotion tasks, creators complete them
- **CPS/CPE/CPM Settlement**: Multiple settlement models
- **AI Verification**: Auto-verify content relevance

---

## Use the Website {#use-web}

🇻🇳 **Open**: [https://ai.yuezhitong.com](https://ai.yuezhitong.com)

---

## Docker One-Click Deploy {#use-docker}

Prerequisite: [Docker](https://docs.docker.com/get-docker/) installed.

```bash
git clone https://github.com/008486club-sketch/VietTriTong-AI.git
cd VietTriTong-AI
docker compose up -d
```

Open **[http://localhost:8080](http://localhost:8080)** and you're ready to go.

---

## Build from Source {#use-source}

### 1. Start the backend services

```bash
cd project/aitoearn-backend
pnpm install
pnpm nx serve aitoearn-ai
# in another terminal
pnpm nx serve aitoearn-server
```

### 2. Start the frontend

```bash
cd project/aitoearn-web
pnpm install
pnpm run dev
```

---

## Architecture

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

---

## License

MIT License

---

<p align="center">
  <b>BytePlus Ecosystem Partner · Powered by Seedance 2.0</b>
  <br>
  Made with ❤️ for Vietnam Market
</p>
