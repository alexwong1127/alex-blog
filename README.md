# Alex的个人博客 - 集成SUNO AI音乐生成

这是一个基于Next.js的个人博客网站，集成了完整的SUNO AI音乐生成功能。

## ✨ 功能特性

### 🎵 SUNO AI音乐生成
- **三种创作模式**：
  - 灵感模式：描述音乐风格，AI自动创作歌词和旋律
  - 定制模式：提供完整歌词，控制音乐风格和结构
  - 续写模式：在现有音乐基础上继续创作
- **专业品质**：商用级音质，支持多种音乐风格
- **实时状态追踪**：生成进度实时更新
- **音乐库管理**：保存和管理创作的音乐作品
- **音频下载**：支持下载生成的音乐文件

### 📱 用户界面
- 响应式设计，支持移动端和桌面端
- 现代化的玻璃质感UI
- 暗色主题，护眼舒适
- 流畅的动画效果

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，添加您的SUNO API密钥：

```env
SUNO_API_KEY=your_actual_suno_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 📁 项目结构

```
alex-blog/
├── pages/              # 页面文件
│   ├── api/           # API路由
│   │   └── suno/      # SUNO音乐生成API
│   ├── index.tsx      # 首页
│   └── suno.tsx       # SUNO专业版页面
├── components/        # 组件
├── lib/              # 工具库
│   └── database.ts   # 数据库操作
├── styles/           # 样式文件
├── types/            # 类型定义
└── public/           # 静态资源
```

## 🎵 SUNO功能使用指南

### 灵感模式
适合有大致想法但没有具体歌词的创作：
1. 描述音乐风格、语言、主题
2. AI会自动创作歌词和旋律
3. 示例：`欢快的磁性女声歌曲，中文，主题：难忘周末`

### 定制模式
适合有完整歌词创意的创作：
1. 设置歌曲标题和风格标签
2. 输入完整歌词内容
3. 支持[Verse]、[Chorus]等结构标记
4. 可选择不同的Chirp模型版本

### 续写模式
在现有音乐基础上继续创作：
1. 提供原音乐的任务ID和片段ID
2. 设置续写起始时间点
3. 输入要续写的歌词内容
4. 可以扩展音乐长度或添加新段落

## 🔧 API说明

### SUNO音乐生成API
- `POST /api/suno` - 提交音乐生成任务
- `POST /api/suno/status` - 查询生成状态
- `GET /api/suno/audio/[clipId]` - 获取音频下载链接

### 请求示例

```javascript
// 生成音乐
const response = await fetch('/api/suno', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mode: 'custom',
    title: '我的歌曲',
    prompt: '[Verse]\\n歌词内容...',
    tags: 'pop,upbeat',
    mv: 'chirp-v3-0'
  })
})

// 查询状态
const statusResponse = await fetch('/api/suno/status', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task_id: 'your-task-id'
  })
})
```

## 🎨 技术栈

- **框架**: Next.js 14 (Pages Router)
- **UI库**: React 18
- **样式**: Tailwind CSS + 自定义CSS
- **图标**: Lucide React
- **动画**: Framer Motion
- **类型检查**: TypeScript
- **数据存储**: LocalStorage (可扩展为Supabase)
- **API**: SUNO AI via API Core

## 🔗 相关链接

- [SUNO AI官网](https://suno.ai/)
- [API Core文档](https://api.apicore.ai/)
- [Next.js文档](https://nextjs.org/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)

## 📄 许可证

本项目仅供学习和个人使用。SUNO AI服务需要遵循其官方使用条款。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📞 联系方式

如有问题或建议，请联系：[your-email@example.com]

---

⭐ 如果这个项目对你有帮助，请给它一个星星！
