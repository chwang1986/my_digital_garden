# 我的数字花园 (my-digital-garden)

一个基于 [Astro](https://astro.build) 构建的静态个人博客（数字花园），部署在 Vercel。内容以中文为主，目前主要写两块：本地大模型（Ollama）的使用经验，以及用 Astro 自建博客平台本身的折腾记录，外加一些笔记方法。

站点地址：<https://my-digital-garden-topaz-five.vercel.app>

## 技术栈

- **Astro 7**（SSG 静态站点）
- **MDX** 内容写作
- **@astrojs/sitemap** 生成站点地图
- **@vercel/analytics** 访问统计（需在 Vercel 控制台开启 Web Analytics）
- **pagefind** 全文搜索（构建后生成静态索引）
- **satori + resvg** 动态生成文章 OG 分享图（PNG）
- **sharp** 图片处理；本地字体 Atkinson（自托管，不依赖外部 CDN）

## 目录结构

```text
src/
  assets/        构建期资源：文章封面图（hero）、字体等
  components/    组件与布局：Header / Footer / BaseHead / BlogPost 等
  content/blog/  所有文章（.md / .mdx），frontmatter 见下
  data/          站点数据（导航、关于等）
  layouts/       页面布局
  pages/         路由：首页与分页、分类、系列、标签、主题、/og 分享图
  styles/        全局样式
  utils/         工具函数（如阅读时长计算）
public/          静态资源：图片、字体、diagrams 等
```

## 文章 Frontmatter

每篇文章头部通过以下字段声明元信息：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 标题 |
| `description` | 是 | 摘要，用于列表与 SEO |
| `pubDate` | 是 | 发布日期 |
| `updatedDate` | 否 | 更新日期 |
| `heroImage` | 否 | 封面图（指向 `src/assets/` 下的图片） |
| `theme` | 否 | 主题（一级归类，每篇一个），默认 `随笔` |
| `series` | 否 | 系列（有序连载，如《Ollama 实战》），配合 `order` 使用 |
| `order` | 否 | 同系列内的顺序，升序排列，提供上一篇/下一篇 |
| `tags` | 否 | 标签（二级细化，可多个） |

`theme` 与 `series` 是正交的两层概念：`theme` 是常驻的归类桶，`series` 是按顺序串起来的连续篇。

## 本地开发

需要 Node >= 22.12。

```sh
npm install        # 安装依赖
npm run dev        # 本地开发服务器，默认 http://localhost:4321
npm run build      # 构建生产站点到 ./dist/（含 pagefind 搜索索引）
npm run preview    # 预览构建产物
```

若运行环境无法启动 `astro preview`，可用任意静态服务器代替，例如：

```sh
python3 -m http.server 8082 --directory dist
```

## 部署

推送到 `main` 分支后，Vercel 自动执行 `astro build` 并完成部署。`vercel.json` 给 `/og/*` 分享图设置了 `image/png` 响应头与一年长效缓存。

## 已实现的一些小特性

- **代码块折叠**：文章页加载后用脚本把每个代码块包进 `<details>`，长代码（>4 行）默认收起。
- **文章插图**：正文图片放在 `public/`，由 `.prose img` 统一处理圆角与居中。
- **分类入口**：主题、系列、标签合并为一个「分类」页，内部用纯 CSS 切换三个面板。
- **阅读时长**：中文按 250 字/分钟估算，列表中展示。
- **访问统计**：接入 Vercel Analytics，在 Vercel 控制台开启后即开始采集。
