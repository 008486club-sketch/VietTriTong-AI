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

## What's in this repo {#use-docker}

> 📦 This repository contains the **Next.js web frontend** (`src/`) and the **standalone marketplace service** (`marketplace/`).
> The NestJS backend (server / ai) and the full-stack `docker-compose` are not part of this repo.

---

## Build from Source {#use-source}

Requires Node.js 20+.

```bash
git clone https://github.com/008486club-sketch/VietTriTong-AI.git
cd VietTriTong-AI
npm install
npm run dev          # http://localhost:6060
```

To use a local backend: `npm run dev:local` (API at `http://localhost:7001/api`), or set `NEXT_PUBLIC_PROXY_URL=http://localhost:8080` to proxy `/api/*`.

Useful scripts: `npm run build` (standalone output) · `npm run type-check` · `npm run lint` · `npm test` (Playwright)

### i18n (Locize)

`syncLocales` / `migrateToLocize` need a Locize API key. **Pass it via environment variable — never commit it to package.json**:

```bash
LOCIZE_API_KEY=xxxx npm run syncLocales
```

---


## 🧩 Marketplace (standalone service)

> `marketplace/` is a standalone FastAPI service (content marketplace backend), not part of the Next.js app. Secrets are injected via environment variables only (2026-09-02 security remediation: API keys / JWT / DB passwords were previously committed to this public repo — all code is now env-based).

```bash
cd marketplace
cp .env.example .env   # fill in: MONGODB_URI / REDIS_URL / JWT_SECRET / INTERNAL_TOKEN / CORS_ORIGINS
docker compose up -d --build
```

- ⚠️ **Never** hardcode secrets in source/config; `.env` stays out of git (`.env.example` is the template)
- AI chat endpoint `/api/market/ai/chat` is discontinued (returns 503); no third-party AI keys
- Listens on 8010 (internal); expose via Nginx reverse proxy if needed
- The service **refuses to start** without `JWT_SECRET`; leaving `INTERNAL_TOKEN` empty disables the internal admin token
- The container runs as a non-root user; `/marketplace` is served from `marketplace.html`


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
