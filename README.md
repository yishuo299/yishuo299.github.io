# 燚燿 | 个人项目档案

这是一个基于 Astro 构建的个人博客与项目展示站点，用来整理我的项目实践、技术笔记、学习资料和成长记录。网站整体风格参考了个人项目归档界面，首页会根据时间切换背景氛围，并在进入站点时展示技术栈加载动画与粒子消散效果。

## 主页预览

![博客主页预览](https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsX2qf7WG_6XZUul4fB7q1xOdR-YO3AALrIwACnMUBVdOMA1J4BETRPQQ.jpg)

## 项目说明

本项目用于展示个人作品与学习路径，内容主要包含：

- 项目档案：按技术栈整理 Python、STM32、Django、Vue、Spring Boot、Android 等方向的项目实践。
- 技术文章：记录项目复盘、工具思考、开源学习和开发经验。
- 个人介绍：展示学习方向、项目经历和持续构建的过程。
- 资源整理：沉淀常用模板、效率工具、学习资料与笔记。
- RSS 订阅：方便持续关注博客内容更新。

首页支持项目搜索、技术栈筛选、项目详情弹层、时间背景切换，以及进入网站时的加载动效。整体目标是让博客既能展示作品，也能留下清晰的学习轨迹。

## 功能特点

- 响应式个人主页，适配桌面端与移动端浏览。
- 根据当前时间切换背景氛围，让页面更有沉浸感。
- 加载阶段展示技术栈图标与进度动画。
- 主页面加载完成后展示粒子消散效果。
- 项目卡片支持筛选、搜索和详情查看。
- Markdown 内容驱动博客文章与资源页面。
- 支持静态构建，适合部署到 GitHub Pages。

## 技术栈

- [Astro](https://astro.build/)：负责静态站点构建与页面组织。
- [Tailwind CSS](https://tailwindcss.com/)：负责工具类样式与响应式布局。
- [DaisyUI](https://daisyui.com/)：提供部分基础 UI 能力。
- [TypeScript](https://www.typescriptlang.org/)：用于类型约束与项目数据维护。
- [Markdown / MDX](https://docs.astro.build/en/guides/markdown-content/)：用于编写博客文章与资源内容。
- [GitHub Pages](https://pages.github.com/)：用于静态站点托管。

## 本地运行

安装依赖：

```bash
pnpm install
```

启动开发服务：

```bash
pnpm run dev
```

构建生产版本：

```bash
pnpm run build
```

预览构建结果：

```bash
pnpm run preview
```

## 目录结构

```text
.
├── public/                  # 静态资源，例如头像、社交预览图等
├── src/
│   ├── components/          # 页面组件
│   ├── content/             # Markdown 内容集合
│   │   ├── blog/            # 博客文章
│   │   └── store/           # 资源内容
│   ├── data/                # 项目数据与技术栈图标配置
│   ├── layouts/             # 页面布局
│   ├── pages/               # 路由页面
│   └── styles/              # 全局样式
├── astro.config.mjs         # Astro 配置
├── tailwind.config.cjs      # Tailwind 配置
└── package.json             # 项目脚本与依赖
```

## 内容维护

博客文章位于 `src/content/blog/`，资源内容位于 `src/content/store/`。新增文章时，可以使用下面的格式：

```md
---
title: "文章标题"
description: "文章简介"
pubDate: "Sep 08 2026"
heroImage: "/post_img.webp"
badge: "文章标签"
tags: ["项目复盘", "学习记录"]
---

这里编写正文内容。
```

项目列表与技术栈展示主要由 `src/data/projects.json` 和 `src/data/techMeta.ts` 维护。

## 部署

项目支持静态构建，适合部署到 GitHub Pages。通常流程是：

1. 修改内容或样式。
2. 运行 `pnpm run build` 确认构建正常。
3. 使用 GitHub Desktop 填写提交 Summary 并提交。
4. 推送到 GitHub 后由 GitHub Pages 发布。

## 技术支持

如果你在使用或二次修改这个项目时遇到问题，可以优先查看：

- Astro 官方文档：[https://docs.astro.build/](https://docs.astro.build/)
- Tailwind CSS 官方文档：[https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- DaisyUI 官方文档：[https://daisyui.com/](https://daisyui.com/)
- GitHub Pages 文档：[https://docs.github.com/pages](https://docs.github.com/pages)

也可以通过 GitHub Issues 或仓库讨论区记录问题、建议与后续优化方向。

## 致谢

- 感谢 [Astro](https://astro.build/)、[Tailwind CSS](https://tailwindcss.com/) 与 [DaisyUI](https://daisyui.com/) 提供的优秀开源能力。
- 感谢 Astrofy 模板提供的基础项目结构，让个人站点可以更快开始搭建。
- 感谢开源社区中持续分享经验、代码和灵感的开发者们。
- 感谢每一次项目实践，它们共同构成了这个博客的内容来源。

## License

本项目基于 MIT License 开源，详细信息见 [LICENSE](./LICENSE)。
