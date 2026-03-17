![截图](./media/screenshot.jpg)

# Convex 图片装饰

一个实时图片装饰应用，允许用户上传图片并获取 AI 生成的装饰版本。基于 Convex、React 和 TypeScript 构建。

## 功能特性

- 通过拖放或文件选择上传图片
- 支持移动端相机拍照
- 图片处理的实时状态更新
- 用户身份认证
- 使用 Convex Storage 进行安全的文件存储
- 响应式设计，支持桌面端和移动端
- 并排图片对比

## 技术栈

- Convex - 后端、数据库和文件存储
- React + Vite - 前端框架
- TypeScript - 类型安全
- TailwindCSS - 样式
- type-route - 类型安全路由

## 安装配置

1. 克隆仓库

2. 安装依赖：
   ```bash
   bun install
   ```
3. 启动开发服务器，将自动创建 `.env.local` 文件

   ```bash
   bun dev
   ```

4. 设置 OpenAI API 密钥：

   ```bash
   bun convex env set OPEN_API_KEY <你的密钥>
   bun convex env set GEMINI_API_KEY <你的密钥>
   ```

5. 在另一个终端窗口运行 TypeScript 类型检查

```bash
bun dev:ts
```

5. 在浏览器中访问 `http://localhost:5173`

## 开发流程

1. 通过拖放区域或文件选择器上传图片
2. 图片会被调整大小并上传到 Convex Storage
3. 系统会通过以下状态处理图片：
   - uploading：初始文件上传到 Convex Storage
   - uploaded：文件成功存储
   - generating：AI 装饰进行中
   - generated：最终装饰图片已可用

## 项目结构

- `/convex` - 后端逻辑和数据库模式
- `/src` - 前端 React 应用
- `/public` - 静态资源
- `/shared` - 共享类型和工具函数

## 许可证

MIT
