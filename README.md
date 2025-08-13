# Alex's Blog

一个使用 Next.js 构建的个人博客网站。

## 功能特性

- 📝 支持 Markdown 格式的博客文章
- 🏷️ 文章标签和分类系统
- 📱 响应式设计，支持移动端
- 🔍 文章归档功能
- ⚡ 静态站点生成，快速加载
- 🎨 简洁现代的设计风格

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: CSS-in-JS + CSS Modules
- **内容**: Markdown + Gray Matter
- **部署**: Vercel (推荐)

## 项目结构

```
blog/
├── components/          # React 组件
│   ├── Layout.tsx      # 页面布局
│   └── PostCard.tsx    # 文章卡片
├── lib/                # 工具函数
│   └── posts.ts        # 文章处理逻辑
├── pages/              # 页面文件
│   ├── index.tsx       # 首页
│   ├── about.tsx       # 关于页面
│   ├── archive.tsx     # 归档页面
│   └── posts/
│       └── [id].tsx    # 文章详情页
├── posts/              # Markdown 文章
├── styles/             # 全局样式
└── public/             # 静态资源
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 3. 添加新文章

在 `posts/` 目录下创建新的 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2024-01-01"
excerpt: "文章摘要"
tags: ["标签1", "标签2"]
category: "分类"
---

# 文章内容

这里是文章的正文内容...
```

## 构建和部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

### 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 自动部署完成

## 自定义配置

### 修改网站信息

编辑以下文件来自定义网站信息：

- `components/Layout.tsx` - 网站标题和导航
- `pages/about.tsx` - 关于页面内容
- `pages/index.tsx` - 首页介绍文字

### 添加新页面

在 `pages/` 目录下创建新的 `.tsx` 文件即可自动生成路由。

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎联系：

- 邮箱：alex@example.com
- GitHub：github.com/alex
