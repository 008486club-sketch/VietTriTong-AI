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
# 安装依赖
cd project/aitoearn-web && pnpm install

# 启动开发模式
pnpm run dev

# TypeScript 检查
pnpm run type-check
```

## 项目结构

- `project/aitoearn-backend/` - Nx + pnpm 后端工作区
- `project/aitoearn-web/` - Next.js + pnpm 前端项目
- 根目录 - README、Docker 部署文档、docker-compose.yml

## 代码规范

- 使用 TypeScript
- 遵循 ESLint 配置
- PR 前确保 `type-check` 通过

## 联系方式

- 邮件: hello@yuezhitong.com
- 网站: https://yuezhitong.com
