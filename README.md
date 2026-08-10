# 用 Astro 搭一个自己的博客 / 数字花园

这份文档不是「这个项目介绍」，而是一份**动手教程**：跟着做，你就能拥有一个和本仓库一样的静态博客——支持代码块折叠、文章插图、主题/系列/标签分类、阅读时长、访问统计、全文搜索，并且一键部署到 Vercel。

本仓库（`my-digital-garden`）就是按下面这些步骤做出来的成品，你可以直接 `git clone` 下来改，也可以从零照着搭。

---

## 0. 准备

- 装好 **Node ≥ 22.12**（用 `node -v` 确认）。
- 有一个 **GitHub** 账号和一个 **Vercel** 账号（部署用，免费额度足够个人博客）。

---

## 1. 用官方模板起项目

```sh
npm create astro@latest
```

交互里选 **Blog** 模板，起好名（比如 `my-digital-garden`）后进入目录：

```sh
cd my-digital-garden
npm install
npm run dev      # 打开 http://localhost:4321 就能看到默认博客
```

此时你已经有一个能写 Markdown 文章的博客了。下面每一步都是在它上面加能力。

---

## 2. 装额外依赖

除了 Astro 自带，本博客还用到这些包：

```sh
npm install @vercel/analytics pagefind satori @resvg/resvg-js sharp
```

- `@vercel/analytics`：访问统计
- `pagefind`：构建后生成静态全文搜索索引
- `satori` + `@resvg/resvg-js`：在请求时动态生成 OG 分享图（PNG）
- `sharp`：图片处理

---

## 3. 定义文章的内容模型

在 `src/content.config.ts` 里给文章 frontmatter 定字段。本博客用的是「主题 / 系列 / 标签」三层：

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      series: z.string().optional(),       // 系列（有序连载），配合 order
      order: z.number().optional(),        // 同系列内的顺序
      theme: z.string().default('随笔'),    // 主题：一级归类，每篇一个
      tags: z.array(z.string()).default([]), // 标签：二级细化
    }),
});

export const collections = { blog };
```

---

## 4. 让代码块可折叠

长代码贴满屏会把读者劝退。思路是：文章页加载后，用一段客户端脚本把每个 `<pre>` 包进 `<details>`，长代码（>4 行）默认收起。

**4.1 在 `src/layouts/BlogPost.astro` 的 `<script>` 末尾加上：**

```js
// 代码块折叠：把 .prose 里的每个 pre 包进 <details>，长代码默认收起
document.querySelectorAll('.prose pre').forEach((pre) => {
  const cls = pre.className.match(/language-(\w+)/);
  const lang = cls ? cls[1] : 'code';
  const lines = (pre.innerText.match(/\n/g) || []).length + 1;
  const wrap = document.createElement('details');
  wrap.className = 'code-fold';
  const summary = document.createElement('summary');
  summary.innerHTML = `<span class="lbl">代码 · ${lang}</span><span class="chev">展开</span>`;
  pre.replaceWith(wrap);
  wrap.appendChild(summary);
  wrap.appendChild(pre);
  if (lines <= 4) wrap.open = true;
  const chev = summary.querySelector('.chev');
  chev.textContent = wrap.open ? '收起' : '展开';
  summary.addEventListener('toggle', () => {
    chev.textContent = wrap.open ? '收起' : '展开';
  });
});
```

> ⚠️ 关键点：下面 4.2 的样式必须写在**全局** `src/styles/global.css` 里，不能写在 Astro 组件的 `<style>` 里——因为这个 `<details>` 是运行时用 JS 生成的，拿不到组件 scoped 的样式属性。

**4.2 在 `src/styles/global.css` 里加（节选）：**

```css
.prose details.code-fold {
  margin: 1.2em 0;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
}
.prose details.code-fold > summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.prose details.code-fold > summary::-webkit-details-marker { display: none; }
.prose details.code-fold > pre {
  margin: 0 !important;
  border-radius: 0 !important;
  border-top: 1px solid var(--border-color);
}
/* 折叠后隐藏 shiki 顶部的语言标签，避免和摘要重复 */
.prose details.code-fold > pre[data-lang]::before { display: none; }
```

刷新页面，长代码块就会变成「代码 · javascript  ▸ 展开」的样子，点一下才展开。

---

## 5. 让文章能插图

**5.1 正文配图走 `public/`。** 把图片（如 `demo.svg`）放进 `public/diagrams/`，正文里用绝对路径引用，由全局样式统一处理圆角居中：

```md
![示意图](/diagrams/demo.svg)
```

```css
.prose img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1.6em auto;
  border-radius: 14px;
  border: 1px solid var(--border-color);
}
```

**5.2 封面图走 `src/assets/`。** 在 frontmatter 里用相对路径引用（见第 7 节），Astro 会在构建期优化它。

> 两种图片路径不要混用：正文配图放 `public/`（原样拷贝，用 `/xxx` 绝对路径），封面图放 `src/assets/`（构建期处理，用相对路径）。

---

## 6. 加上阅读时长

`reading-time` 这个包按空白分词，对中文几乎全算成 0，所以自己写一个中文友好的估算。新建 `src/utils/reading-time.ts`：

```ts
export function readingTime(text: string): string {
  let body = text
    .replace(/```[\s\S]*?```/g, ' ')   // 去掉代码块
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_~\-\[\]()!]/g, ' ');

  const cjk = (body.match(/[一-鿿]/g) || []).length;       // 中文字数
  const words = (body.match(/[A-Za-z0-9]+/g) || []).length; // 拉丁词数
  const minutes = Math.max(1, Math.round(cjk / 250 + words / 200)); // 中文 250 字/分
  return `${minutes} 分钟阅读`;
}
```

在文章页调用它，把结果渲染到元信息行里即可。

---

## 7. 接入访问统计（Vercel Analytics）

装好包之后，在 `src/components/BaseHead.astro` 的 `<head>` 里引入并放置组件：

```astro
---
import Analytics from '@vercel/analytics/astro';
---
<!-- 其他 head 标签 … -->
<Analytics />
```

部署到 Vercel 后，**还要去 Vercel 控制台手动开启 Web Analytics 开关**，统计才开始采集（这一步在平台侧，代码里开不了）。

---

## 8. 动态生成 OG 分享图

想让分享到社交平台时带上好看的封面图，用 `satori` + `@resvg/resvg-js` 在请求时画图。新建路由 `src/pages/og/[slug].ts`，按 slug 取出文章信息，套一个 HTML 模板交给 satori 转 SVG、再交给 resvg 转 PNG。同时在 `vercel.json` 里给 `/og/*` 设好响应头和长缓存：

```json
{
  "headers": [
    {
      "source": "/og/(.*)",
      "headers": [
        { "key": "Content-Type", "value": "image/png" },
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

完整的画图代码较长，直接看本仓库的 `src/pages/og/[slug].ts` 照抄即可。

---

## 9. 全文搜索（Pagefind）

Pagefind 在构建后扫描 `dist/` 生成静态索引，零后端。在 `package.json` 里把构建和索引串起来：

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "postbuild": "npx pagefind --site dist",
    "preview": "astro preview"
  }
}
```

构建后，在站点里放一个搜索框，调用 `pagefind` 暴露的 `/pagefind/pagefind.js` 即可（具体接入看本仓库的搜索组件）。

---

## 10. 部署到 Vercel

1. 把项目推到 GitHub。
2. 在 Vercel 里 **New Project → 导入这个仓库**。
3. Framework 选 **Astro**，构建命令 `astro build`、输出目录 `dist` 会被自动识别。
4. 点 Deploy。之后每次 `git push` 到 `main`，Vercel 自动重建上线。

---

## 如何新增一篇文章（重点）

不需要碰任何构建配置，只在 `src/content/blog/` 里加一个 Markdown 文件：

1. **新建文件**：`src/content/blog/你的文章.md`（文件名用英文短横线，会作为 URL）。
2. **填文件头**：最少 `title` / `description` / `pubDate`：

   ```md
   ---
   title: '文章标题'
   description: '一句话摘要'
   pubDate: '2026-08-10'
   theme: '随笔'        # 一级归类，每篇一个；省略默认「随笔」
   tags: ['标签一', '标签二']
   # series: 'Ollama 实战'  # 可选：属于某个连载
   # order: 3               # 可选：同系列顺序
   ---

   正文正常写 Markdown。
   ```

3. **加封面图（可选）**：图片放 `src/assets/`，用相对路径引用：

   ```md
   heroImage: '../../assets/hero-ollama.png'
   ```

4. **正文插图（可选）**：图片放 `public/diagrams/`，用 `/diagrams/xxx.svg` 引用。
5. **本地预览**：`npm run dev` 看实时效果（代码块已自动折叠）。
6. **发布**：`git add` → `git commit` → `git push origin main`，Vercel 自动上线。

---

## 本仓库已经做好的事（可直接参考）

这套教程对应的完整实现都在本仓库里，想抄哪块直接看源码：

| 能力 | 关键文件 |
| --- | --- |
| 内容模型（主题/系列/标签） | `src/content.config.ts` |
| 代码块折叠 | `src/layouts/BlogPost.astro` + `src/styles/global.css`（`.code-fold`） |
| 文章插图 | `src/styles/global.css`（`.prose img`）+ `public/diagrams/` |
| 阅读时长 | `src/utils/reading-time.ts` |
| 访问统计 | `src/components/BaseHead.astro`（`@vercel/analytics`） |
| OG 分享图 | `src/pages/og/[slug].ts` + `vercel.json` |
| 全文搜索 | `package.json`（`postbuild: pagefind`）+ 搜索组件 |
| 导航 / 分类页 | `src/components/Header.astro` + `src/pages/categories/index.astro` |
| 演示文章 | `src/content/blog/code-fold-and-images.md` |

> 提醒：本仓库的 `AGENTS.md` / `CLAUDE.md` 是通用 Astro 开发提示，跟这套教程无关，可忽略。
