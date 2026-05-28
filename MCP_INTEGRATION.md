# VietTriTong MCP 集成指南

## 概述

越智通AI平台支持 MCP (Model Context Protocol)，允许 Claude Desktop、Cursor 等 AI 工具直接调用越智通的发布、聊天等功能。

## 快速配置

### Claude Desktop

编辑 `claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "viettritong": {
      "type": "http",
      "url": "https://ai.yuezhitong.com/api/unified/mcp",
      "headers": {
        "x-api-key": "你的API-Key"
      }
    }
  }
}
```

### Cursor

在 Cursor 的 MCP 设置中添加：
- **MCP URL**: `https://ai.yuezhitong.com/api/unified/mcp`
- **Auth Header**: `x-api-key: 你的API-Key`

## 可用工具

### 发布工具
| 工具 | 说明 |
|------|------|
| `publishPostToTiktok` | 发布到 TikTok |
| `publishPostToYoutube` | 发布到 YouTube |
| `publishPostToFacebook` | 发布到 Facebook |
| `publishPostToInstagram` | 发布到 Instagram |
| `publishPostToTwitter` | 发布到 Twitter/X |
| `publishPostToLinkedIn` | 发布到 LinkedIn |
| `getPublishingTaskStatus` | 查询发布状态 |
| `publishRestrictions` | 获取各平台发布限制 |

### 聊天工具
| 工具 | 说明 |
|------|------|
| `chat` | AI聊天（通义千问等） |
| `generateVideo` | AI视频生成（Seedance 2.0） |

## SSO 地址

支持 SSE 长连接方式：
`https://ai.yuezhitong.com/api/unified/sse`

## 获取 API Key

1. 登录 [ai.yuezhitong.com](https://ai.yuezhitong.com)
2. 进入 **设置 → API Key**
3. 点击创建，复制生成的 Key

## 私有部署

如果自部署越智通，将 `ai.yuezhitong.com` 替换为自己服务器的地址即可。
