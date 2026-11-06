# VietTriTong AI Platform - 越智通AI平台

欢迎贡献！以下是参与指南。

## 如何贡献

### 报告 Bug
请通过 GitHub Issues 提交，包含：
- 清晰的标题和描述
- 复现步骤
- 期望行为和实际行为
- 截图/日志（如果有）

### 提交 PR
1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交修改：`git commit -m "feat: add ..."`
4. 推送到你的仓库：`git push origin feature/your-feature`
5. 创建 Pull Request

### 开发环境

```bash
# 安装依赖（仓库根目录，Node.js 20+）
npm install

# 启动开发模式（http://localhost:6060）
npm run dev

# TypeScript 检查 / Lint
npm run type-check
npm run lint
```

## 项目结构

- `src/` - Next.js 14 前端（App Router，`src/app/[lng]` 多语言路由）
- `public/` - 静态资源
- `marketplace/` - 内容交易市场独立 FastAPI 服务（自带 Dockerfile / docker-compose）
- `scripts/` - 构建辅助脚本
- 根目录 - README（中/英/越）、MCP 集成文档

## 代码规范

- 使用 TypeScript
- 遵循 ESLint 配置
- PR 前确保 `type-check` 通过
- **禁止提交任何密钥 / token / 密码**：一律使用环境变量（参考 `marketplace/.env.example`）

## 联系方式

- 邮件: mach@paytok.com
- 网站: https://yuezhitong.com
