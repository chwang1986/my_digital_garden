---
title: '首页那团跟着鼠标走的光，是怎么做的'
description: '看到不少博客有一团柔光融在背景里、跟着鼠标移动。记一下它到底是什么，以及怎么在 Astro 上用几十行代码给首页也来一个。'
pubDate: '2026-08-10'
heroImage: '../../assets/hero-4-tune.png'
theme: '自建blog平台'
tags: ['Astro', '前端', '博客平台']
---

上次有人问我，一些 blog 那种融进背景、跟着鼠标移动的动图是什么。其实就是一层渐变，坐标实时跟着光标走。这回我给本站首页也接了一个，下面记一下做法，都是已经跑起来的。

## 它到底是什么

这类效果一般叫"交互式背景"。最常见的那种一团柔光，本质是：一个径向渐变图层，用 JS 把鼠标在元素内的坐标写进 CSS 变量，渐变中心就跟着光标移动。光晕用半透明加 `pointer-events:none`，所以它一直在文字底下、也不挡点击。

除了聚光，还有几种常见形态：

- **视差分层**：几层背景按不同系数随光标位移，制造纵深
- **粒子场**：canvas 粒子，靠近光标时排斥或吸引
- **极光 / 流光**：大块模糊渐变缓慢流动，并轻微跟随光标
- **WebGL 着色器**：流体噪声，最炫也最重

对静态博客来说，聚光和视差最划算：不塞依赖、不影响 SEO、首屏零成本。本站用的是聚光。

## 给首页加聚光

我把它加在首页的站点身份区（`.masthead`）。分两处：样式放在该页面的 scoped style 里，逻辑放在页面底部的 `<script>`。

先说样式。关键是给 `.masthead` 一个定位上下文和裁剪，再用 `::after` 画那团光。光用主题色加一点透明度，亮色和暗色主题都能用。

一个坑：如果 hero 被限制在窄栏里（比如本站首页内容区只有 960px 宽），直接把光画在那个窄栏上，鼠标一靠近左右边，光晕就被 `overflow:hidden` 裁出一道硬边，很难看。做法是让 hero 满幅——用负 margin 突破内容栏，光晕就能横跨整个视口、边缘自然淡出；文字再用一个内层容器收回到 960px。

```css
.masthead {
  position: relative;
  overflow: hidden;
  /* 满幅：突破 960px 内容栏，让光横跨整个视口 */
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.masthead-inner {
  max-width: var(--wide-width);
  margin: 0 auto;
  padding: 5rem 1.25rem 3rem;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  z-index: 1;
}

.masthead::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    600px circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--primary-color) 18%, transparent),
    transparent 68%
  );
}
```

光中心默认在 `50% 50%`（页面居中），没动鼠标时也是一团柔光，不会突兀。半径调大、淡出更晚，整体更柔。

逻辑就几行：监听 `pointermove`，把屏幕坐标换算成元素内的局部坐标，写进 `--mx` / `--my`。这里用了 `requestAnimationFrame` 节流，避免每次鼠标移动都触发重排；再用 `prefers-reduced-motion` 判断，系统关动效的用户直接跳过。

```js
const mast = document.querySelector('.masthead');
if (mast && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let raf = 0;
  let px = 0, py = 0;
  mast.addEventListener('pointermove', (e) => {
    const r = mast.getBoundingClientRect();
    px = e.clientX - r.left;
    py = e.clientY - r.top;
    if (!raf) raf = requestAnimationFrame(() => {
      mast.style.setProperty('--mx', px + 'px');
      mast.style.setProperty('--my', py + 'px');
      raf = 0;
    });
  });
}
```

`getBoundingClientRect()` 这一步不能省：它把鼠标相对视口的坐标，换算成相对 `.masthead` 左上角的坐标，光才不会偏。

## 几个提醒

- **性能**：`pointermove` 触发很频繁，rAF 节流基本是标配。
- **无障碍**：晕动症用户会在系统里关动画，`prefers-reduced-motion` 判断一下，关掉就不绑定监听。
- **别抢事件**：`::after` 一定加 `pointer-events:none`，否则那层光会盖住下面的链接和文字选中。

到这就完了。现在把鼠标移到本站首页顶端，那团墨绿色的光就会贴着光标走。想换颜色就改 `--primary-color` 的透明度，想换范围就改 `radial-gradient` 里的 `460px`。
