# 博客接入约定

以下是现有 `E:/codex/blog` 的结构快照。执行前读取实际文件和类型，以当前实现为准。

| 接入点 | 当前文件 | 完成内容 |
| --- | --- | --- |
| 项目文章卡片 | `src/data/projects.json` | 新增/更新项目简介、分类、文章/仓库链接 |
| 完整文章数据 | `src/data/multiProjectArticles.ts`、各项目 `*ArticleData.ts` | 注册 slug，填完整文章，不遗漏数据 import |
| 完整文章路由 | `src/pages/projects/[slug].astro` 或已有专用 Astro 页面 | 生成全文、项目链接、代码与图片布局 |
| 全部项目 | `src/pages/projects.astro` | 名称搜索、固定六类筛选、文章和体验关联 |
| 体验清单 | `src/data/projectExperiences.ts` | 项目、完整栈、角色、体验 slug、文章/仓库链接 |
| 体验列表 | `src/pages/experience.astro` | 流动堆叠卡片、搜索与六类筛选 |
| 体验外壳/角色 | `src/pages/experience/[slug].astro` | roleConfigs、初始角色、iframe 路由 |
| 原界面资产/模拟 | `public/experience-native/<slug>/`、`public/experience-native/mock-api.js` | 入口、静态资源、离线业务 |
| 首页和星球 | `src/pages/index.astro` | latestProjects、CATEGORY_STARS、PROJECT_STARS |
| 六类图标 | `src/data/techMeta.ts` | 使用原图标与颜色，不随项目增加新类别 |
| 导航/加载/背景 | `src/layouts/BaseLayout.astro`、`src/scripts/galacticBackground.ts`、`src/styles/global.css` | 维持页面策略和导航生命周期 |

## 三种技术栈概念

- **分类/筛选/首页加载图标**：只有 `Python`、`STM32`、`Django`、`Vue`、`Spring Boot`、`Android`。
- **项目主分类**：`projects.json` 的 name，以及 tags 第一项对应的图标/色彩；按项目主要实现选择。Django 项目通常选择 Django，Spring 项目选择 Spring Boot，不将 Java 或 MySQL 自动变成新主分类。
- **完整技术栈**：文章 stack 和体验 stack 可以写 Vue 3、MySQL、JWT、ECharts、OpenCV 等真实依赖。筛选匹配时把 Vue 3 规范化为 Vue 等六类名称，防止项目有 Vue 却无法按 Vue 筛出；保留版本信息用于展示。

`projects.json` 常用字段：`name`、`title`、`description`、`detail`、`tags`、`articleUrl`、`projectUrl`。tags 多选但仅来自六类；第一项作为当前项目卡片主要图标。不同文章/体验中的同一项目必须名称、链接与分类一致。

`projectExperiences.ts` 常用字段：`slug`、`title`、`shortTitle`、`description`、`articleUrl`、`projectUrl`、`ui`、`accent`、`roles`、`stack`、`cards`、`panels`、`columns`、`rows`。按现有类型填写；新增 ui 判别值时更新类型及真正依赖该值的代码，不仅写入数据。

## 首页与小星球

首页 `projects.slice(0, 6)` 显示最近加入的六项，因此新项目应按当前排序规则插入；全部列表仍保留完整项目。无日期字段时不伪造发布时间。

六颗大星球来自固定 CATEGORY_STARS，靠近只突出技术分类名称，进入 `/projects/?tech=<分类>`，使用已有黑洞转场。小星球来自 `projectExperiences.map`：每个可体验项目一个，统一大小，accent 决定外围颜色，靠近显示项目名称，点击进入 `/experience/<slug>/`，使用已有坍缩、裂解和碎片爆炸转场。

新增体验会自动增加小星球；核对数量、标题、目标路由，项目增加后检查拥挤/遮挡。不要重复注册星球或把单片机文章硬塞入体验清单。

项目体验列表卡片继承现有流动堆叠样式与响应式布局：默认名称和技术栈，悬停突出简介，触屏有可访问的介绍，点击进入体验。搜索支持名称/功能，筛选只六类。手机不能堆在同一个坐标、遮挡点击或缺失“项目文章”导航。

文章导航沿用 `archive:open-article` / `data-book-transition` 的翻书动画。介绍内容点击可阅读全文，关闭介绍直接关闭。加载层在完成、错误、返回及页面切换时清理，不能卡住滚动或遮住手机页面。

## 背景与性能约定

首页宇宙保持 00:00 背景样式，时钟显示本地时间。保留已有螺旋星云、自动生成、长按光点后生成、散开、避让和碰撞消散；接入新项目不要求重做这些效果。

`/projects`、`/experience` 及其子路由由 BaseLayout 设置 `data-static-background="true"`：背景只绘制一张画面，resize 时更新，停止背景 RAF、粒子运动、鼠标生成和 CSS 无限动画。不要为新文章/体验重新启动持续绘制。

首页返回不重播加载；网络流畅时加载间隔约半小时，慢网保留进度反馈。加载不能无限卡在 0%，完成/失败要恢复滚动。保留已有 welcome 多色消散、书页和星球动画，同时减少重复初始化和不必要的全屏模糊重绘。

Astro 初始化按实际 DOM 节点幂等；不要同时由 DOMContentLoaded 与 astro:page-load 启动两次。`astro:before-swap` 清理事件、RAF、observer、timeout 和 interval；页面重新进入后正常初始化，隐藏标签页暂停持续动画。

## 接入验收

检查每个项目至少三条路径：卡片→文章、卡片/体验列表→体验、小星球→体验；大星球→分类列表→目标项目。所有路径都要首次可用，返回后再次可用。确认各处名称、六类标签和仓库链接一致，文章侧的“项目体验”不指向不存在的 slug。

build 后确认新增文章与体验实际生成到 dist，并核对静态入口及懒加载资源路径。构建成功只证明生成过程，不证明浏览器运行、权限或业务流程正确。
