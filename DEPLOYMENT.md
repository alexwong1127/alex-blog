# Vercel 部署指南

## 环境变量配置

在Vercel项目设置中添加以下环境变量：

```
SUNO_API_KEY=sk-vepbk4mNiywh5PIGvfL8sqpiUhsv28Mj6Q4hIjUOpXLJ3ix7
NEXT_PUBLIC_APP_NAME=Alex的博客
NODE_ENV=production
```

注意：不要设置 NEXT_PUBLIC_APP_URL，让Vercel自动处理。

## 部署配置

确保 vercel.json 配置正确（如果需要的话）。

## 构建命令

默认的构建命令应该是：`npm run build`
启动命令：`npm run start`

## 常见问题

1. 环境变量未设置
2. API密钥无效
3. 依赖包版本冲突