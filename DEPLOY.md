# PM Master 部署指南

## 架构
- 前端：GitHub Pages（React + Vite）
- 后端：Vercel（Hono.js + SQLite）
- AI：OpenAI GPT-4o-mini

## 环境变量

### 后端（Vercel）
在 Vercel Dashboard > Project Settings > Environment Variables 中配置：

| 变量名 | 说明 |
|--------|------|
| `DATABASE_URL` | SQLite 文件路径，Vercel 环境建议用 `/tmp/pm-master.db` |
| `GITHUB_CLIENT_ID` | GitHub OAuth App 的 Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App 的 Client Secret |
| `DEEPSEEK_API_KEY` | DeepSeek API Key（从 https://platform.deepseek.com 获取） |
| `APP_URL` | 后端域名，如 `https://pm-master-api.vercel.app` |
| `FRONTEND_URL` | 前端域名，如 `https://yourname.github.io/pm-master` |

### 前端（GitHub Secrets）
在 GitHub Repo > Settings > Secrets and variables > Actions 中配置：

| 变量名 | 说明 |
|--------|------|
| `VITE_API_URL` | 后端 API 地址 |

## 部署步骤

### 1. 创建 GitHub OAuth App
- 访问 https://github.com/settings/developers
- New OAuth App
- Authorization callback URL: `https://your-backend-url.vercel.app/auth/github/callback`

### 2. 部署后端到 Vercel
```bash
cd server
vercel --prod
```

注意：Vercel Serverless 的 `/tmp` 目录是临时的，冷启动会丢失 SQLite 数据。如需持久化用户数据，建议迁移到 Vercel Postgres 或 Turso。

### 3. 部署前端到 GitHub Pages
- 将代码 push 到 GitHub main 分支
- GitHub Actions 会自动构建并部署
- 在 Repo > Settings > Pages 中查看部署状态

## 本地开发

```bash
# 后端
cd server
cp .env.example .env
# 编辑 .env 填入你的密钥
npm run dev

# 前端（新终端）
cd app
cp .env.production .env.local
# 编辑 .env.local 中的 API 地址
npm run dev
```

## 数据库迁移

```bash
cd server
npm run db:migrate
npm run db:seed
```
