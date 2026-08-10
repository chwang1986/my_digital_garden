---
title: '改造模板，哪些能改、怎么改'
description: '调自己博客时反复用到的几件事：框架怎么调、基础元素怎么改最快、界面怎么弄干净。'
pubDate: '2026-08-08'
heroImage: '../../assets/hero-4-tune.png'
series: '数字花园构建笔记'
order: 4
theme: '自建blog平台'
tags: ['Astro', 'CSS', '主题', '性能']
---

这是系列的第四篇。平台搭好了，但模板是别人的，得改造成自己顺手的样子——哪些能改，又该怎么改。

很多人改 Astro 模板，第一反应是去翻各个 `.astro` 文件改 style。我一开始也这样，改完这边歪那边。后来发现，百分之九十的"换个感觉"根本不用动组件，只要改一个文件：`src/styles/global.css` 里的那堆 CSS 变量。

在这个文件里能直接改的：

- 主色、背景、文字颜色（换一套色调）
- 标题 / 正文字体
- 阅读宽度、留白、阴影轻重
- 暗色模式（补一套变量即可）

不用碰任何组件，改完 `global.css` 一处，全站跟着变：

![改一处变量，全站页面跟着变](/diagrams/tune.svg)

不是从零搭站的教程，就是把我这阵子调自己博客时反复用到的几件事记下来：框架怎么调、基础元素怎么改最快、还有怎么把界面弄得更干净清楚一点。

## Astro 本来就不慢

先说点背景，不然容易瞎优化。Astro 默认不往浏览器发 JS，页面在构建时就成了纯 HTML。你写的组件，除非显式标了 `client:*`，否则都是静态的。

这对"干净"这件事其实很关键：能不写 JS 就不写，加载即所见，没有白屏和转圈。这种克制本身就显得稳。

## 先动 astro.config.mjs

组件之上的事，基本都在这个文件里。我现在的配置大概这样（去掉了注释）：

```js
// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://my-digital-garden-topaz-five.vercel.app',
  integrations: [mdx(), sitemap()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Atkinson',
      cssVariable: '--font-atkinson',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/atkinson-regular.woff'], weight: 400, style: 'normal', display: 'swap' },
          { src: ['./src/assets/fonts/atkinson-bold.woff'],   weight: 700, style: 'normal', display: 'swap' },
        ],
      },
    },
  ],
});
```

几件我实际做了、也确实有用的事：

1. 把 `site` 填对。它管 OG 分享图、sitemap、canonical 的绝对地址。我之前填错过，社交平台抓到的是死链。
2. 字体自托管。用 `@astrojs/fonts` 的 local provider，把字体放本地，`display` 设 `swap`。这样不依赖 Google Fonts 的额外请求，也不会有字体闪一下。构建完它会注入成一个 CSS 变量 `--font-atkinson`，全局能用。
3. 图片交给 `astro:assets`。Markdown 里的图它自动转 `webp/avif`、按容器尺寸缩放，不用自己处理。

验证很简单：build 完看输出体积，本地 preview 起一下，跑个 Lighthouse，通常不动业务代码就能到 95 分以上。

## 改基础元素，认准 CSS 变量

我这套站点的"皮肤"全在 `global.css` 的 `:root` 里。想换感觉，只改这里：

```css
:root {
  --background-body: #faf6ee;   /* 页面底色 */
  --surface: #ffffff;          /* 卡片/表面 */
  --text-main: #2b2620;        /* 正文墨色 */
  --text-secondary: #6f6657;   /* 次要文字 */
  --primary-color: #356b54;    /* 主色 / 强调色 */
  --primary-soft: #9cc3b0;     /* 主色浅版，hover 用 */
  --primary-strong: #244c3b;   /* 主色深版 */

  --font-display: var(--font-atkinson), 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; /* 标题（与正文同族，统一无衬线） */
  --font-body: var(--font-atkinson), 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;    /* 正文 */

  --content-width: 720px;      /* 阅读宽度 */
  --border-color: #e7e0d2;     /* 分隔线 */
  --code-bg: #f1ece0;          /* 代码块底色 */
  --shadow-sm: 0 2px 10px -3px rgba(40,60,45,0.12);
}
```

改一处，全站跟着变。下面这张表是我自己用的：想改什么，找哪一行。

| 你想改的效果 | 改的变量 |
| --- | --- |
| 主色 / 强调色（链接、按钮） | `--primary-color` |
| 页面背景 | `--background-body` |
| 正文文字颜色 | `--text-main` |
| 标题字体（与正文同族，统一无衬线） | `--font-display` |
| 正文字体 | `--font-body` |
| 阅读区宽度 | `--content-width` |
| 分隔线 / 边框 | `--border-color` |
| 代码块底色 | `--code-bg` |
| 卡片阴影轻重 | `--shadow-sm` / `--shadow-md` |

暗色模式也是同一套思路：补一组 `:root.dark { ... }`，把上面的变量各给一个暗色值。切换主题的组件只负责给 `html` 加或去掉 `dark` 类，样式自动跟着走。

## 怎么弄得更干净、更清楚

变量解决"换色换字"，但"感觉"靠克制。调了好几轮，我留下几条自己信得过的：

- 只留一个强调色。我的墨绿 `#356b54`，其余全是黑白灰。彩色光晕、彩色阴影一律删，一加就显得廉价。
- 字体就一套。标题和正文用同一个无衬线字体族，层级靠字号和留白拉开，不靠堆颜色。标签、元信息用等宽排，更有技术感。
- 留白当结构用。能用 margin 和栅格留出呼吸感，就少画线。真的要分隔才画一条细线，比如引用块左边那道。
- 装饰能删就删。技术感光晕、花哨分隔线、拟物阴影，都拿掉。一道 1px 细线够了。
- 几个小地方也值得做：顶部阅读进度条、文章末尾的返回链接和上下篇、代码块复制按钮、元信息用等宽字体排。这些成本都很低。
- 动效要轻。hover 时 0.15 秒的微过渡就行，别整那种明显的。

说白了就是保持一致。Header、Footer、BaseHead 只写一次，所有页面复用，别每页各搞一套。

对照一下用力过猛和克制：

```css
/* 用力过猛：彩色光晕 + 多重阴影 */
box-shadow: 0 0 40px rgba(53,107,84,0.5), 0 10px 30px rgba(0,0,0,0.3);
background: linear-gradient(135deg, #356b54, #8fc4ab);

/* 克制：单色细阴影 + 留白 */
box-shadow: var(--shadow-sm);
background: var(--surface);
```

## 我自己的改动顺序

下次想"调一下站点"，我一般这么走，十分钟够：

1. 换主题色：改 `--primary-color`，亮色套和 `:root.dark` 各一次。
2. 换字体气质：改 `--font-display` / `--font-body`。
3. 做暗色：补 `:root.dark` 全套变量。
4. 提速：自托管字体 + 图片走 `astro:assets`。
5. 加分享卡：site 填对，BaseHead 写好 OG/Twitter meta，再用 satori 在构建期生成 `/og/[slug].png`。
6. 验证：build + preview + Lighthouse。

## 常用命令

```bash
npm run dev      # 边改边看，http://localhost:4321
npm run build    # 构建，确认没有报错
npm run preview  # 看构建后的真实效果
```

## 最后

调了这么多轮，我越来越觉得：界面干净只是底线，内容才是能不能留住人的关键。把框架调顺手，是为了让自己更愿意写，而不是陷在调样式里。

如果也要从模板起步，我的经验是先动 `global.css` 的变量，别急着改组件。大半的"焕然一新"都在那几十行里。
