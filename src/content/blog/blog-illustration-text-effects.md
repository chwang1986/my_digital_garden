---
title: 给博客加点卡通插图和花式文字
description: 研究了一下那些"插图和背景长在一起"的博客是怎么做的，顺手给自己加了一套，并记下文中的特殊文字效果怎么实现。
pubDate: 2026-08-11
theme: 写作方法
tags: ["博客","排版","插图"]
---

前阵子逛别人的博客，挺羡慕那种感觉：卡通插图像是"长"在页面里，文字也有渐变、有荧光笔划过的重点。研究了一下，发现没那么玄，核心就几招。这篇文章本身就是一个例子——里面的插图和几处特殊文字，就是按下面说的方法做的。

## 插图怎么"长"在背景里

<figure class="art">

![博客插图示意：笔记本与一盆小绿植](/diagrams/blog-illustration-demo.svg)

</figure>

我以前以为那种融合感是靠模糊或者渐变做出来的，其实不是。关键在三点：

1. **透明背景**。插图本身是 SVG（或者去背的 PNG），画布是透明的，<span class="mark">绝不带一个白色底方块</span>。这一步最容易被忽略——图要是带白底，一贴就"浮"出来了。
2. **同色系**。填充色直接用站点的主色（我这里是墨绿）。颜色一致，大脑就判定它"属于这里"。
3. **置留白**。放在标题旁、段落间隙、页脚角落，而不是压住正文。配图是配角，抢戏就俗了。

进阶一点的还有"破框"：让插图的一部分故意盖到标题上，产生前后层次；或者插画和区块用同一底色，让它"连"成一片。上面这张图就是透明背景 + 墨绿同色系，塞在正文里，所以看起来是长在页面上的，而不是贴上去的贴纸。

## 三种文字效果

下面这三个效果全是纯 CSS，零图片、零依赖，而且跟着亮/暗主题自动变色（因为我用的是 CSS 变量）。

### 渐变文字

<span class="grad-text">这一行是渐变文字</span>，做法是用背景渐变裁成文字形状：

```css
.grad-text {
  background: linear-gradient(100deg, var(--text-main), var(--primary-color));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

适合做小节标题，比纯色标题多一点呼吸感。

### 荧光笔高亮

普通文字里，<span class="mark">这一截像被荧光笔划过</span>，很适合标金句。原理是背景只覆盖底部一截：

```css
.mark {
  background: linear-gradient(transparent 58%, color-mix(in srgb, var(--primary-color) 26%, transparent) 58%);
  padding: 0 0.14em;
  border-radius: 3px;
}
```

这里用了 `color-mix` 把主色调淡，所以暗色模式下也不会刺眼。

### 空心描边文字

<span class="outline-text">空心描边文字</span>，给关键词一种手绘海报感：

```css
.outline-text {
  -webkit-text-stroke: 1.5px var(--text-main);
  color: transparent;
}
```

## 在 Astro 站里怎么落地

我的站是 Astro 静态站，步骤很简单：

- 把上面的三个类加进 `src/styles/global.css`（全局类，正文里都能用）；
- 插图存到 `public/diagrams/`，正文用 `![说明](/diagrams/xxx.svg)` 引用；
- 正文里想用特殊文字，直接写行内 HTML：`<span class="mark">重点</span>`、`<span class="grad-text">标题</span>`。

就这些。这篇文章里的插图和上面那几处彩色文字，就是照这套做出来的——你看到的，就是例子本身。
