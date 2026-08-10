---
title: '给文章加可折叠代码块，再顺手插张图'
description: '写长代码贴满屏，读者一进来先被代码墙吓退。记一下怎么在 Astro 上让代码默认收起，以及正文里怎么放图片。'
pubDate: '2026-08-10'
heroImage: '../../assets/hero-3-platform.png'
theme: '自建blog平台'
tags: ['Astro', '博客平台', '前端']
---

前面几篇讲平台搭建，多是步骤和命令。最近写带代码的文章发现一个问题：一贴就是一两百行，读者点进来先看到一堵代码墙，没耐心就划走了。这回顺手改了两处：代码默认收起、正文里能插图。下面记一下怎么做的，都是已经在站点上跑起来的。

## 代码块折叠

思路不复杂：文章页加载后，用一段脚本把每个代码块（`<pre>`）包进一个 `<details>` 里，只露出一个摘要条，点一下才展开。短代码（4 行以内）直接展开，长代码默认收起，免得又变成墙。

脚本加在文章页布局 `BlogPost.astro` 的客户端脚本里：

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

这段脚本改的是 DOM，所以样式不能写在 Astro 的 scoped `<style>` 里（运行时生成的元素拿不到作用域属性）。我把折叠相关的样式放到全局 `global.css`：

```css
/* 文章内代码块折叠：把 <pre> 包进 <details>，默认收起长代码 */
.prose details.code-fold {
  margin: 1.2em 0;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
  background: color-mix(in srgb, var(--surface) 72%, transparent);
}

.prose details.code-fold > summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-secondary);
  user-select: none;
  background: color-mix(in srgb, var(--surface) 55%, transparent);
}

.prose details.code-fold > summary::-webkit-details-marker {
  display: none;
}

.prose details.code-fold > summary:hover {
  color: var(--primary-color);
}

.prose details.code-fold > summary .chev {
  opacity: 0.7;
  font-size: 0.78rem;
}

.prose details.code-fold > pre {
  margin: 0 !important;
  border-radius: 0 !important;
  border-top: 1px solid var(--border-color);
  padding-top: 1.1em !important;
}

/* 折叠后不显示 shiki 顶部的语言标签，避免和摘要重复 */
.prose details.code-fold > pre[data-lang]::before {
  display: none;
}
```

有一点要注意：代码块右上角那个「复制」按钮和 shiki 的语言标签，原本是挂在 `<pre>` 上的，包进 `<details>` 之后照常工作，不用改。折叠时 `<pre>` 被藏起来，展开后按钮和标签都在。

效果大概是这样：

![代码块折叠示意](/diagrams/code-fold-demo.svg)

左边是展开状态，右边是收起状态——读者一眼能看清「这里有一段 python 代码」，想看再点。

## 正文里放图片

这个其实 Astro 的 markdown 原生就支持，不用装插件。图片放 `public/` 目录下（我放在 `public/diagrams/`），正文里用普通 markdown 语法引用就行：

```md
![代码块折叠示意](/diagrams/code-fold-demo.svg)
```

`public/` 下的文件部署后就在网站根路径，所以写绝对路径 `/diagrams/code-fold-demo.svg` 即可，开发和生产环境都能加载。

图片的展示样式我也补到了全局 `global.css`，让它和代码块风格一致：

```css
/* 文章内图片 */
.prose img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1.6em auto;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}
```

如果哪天想加图注，用 markdown 的 `figure` 写法（外层包 `![...]` 再加一行居中文字）也行，样式里已经留了 `figure figcaption` 的位置。

## 小结

两件事都不复杂：折叠靠一段运行时脚本 + 全局样式，图片靠 `public/` 目录 + 原生 markdown。改完之后，长代码不再一上来糊读者一脸，必要的配图也能直接进正文。下一篇可以聊聊怎么给代码块加「行高亮」或者「显示行号」，那种更细的排版。
