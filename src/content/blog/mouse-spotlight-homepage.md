---
title: '首页那团跟着鼠标走的光，是怎么做的'
description: '不少博客都有一团融入背景、随鼠标移动的柔光。本文记录它是什么，以及如何在 Astro 上给首页实现同样的效果。'
pubDate: '2026-08-10'
heroImage: '../../assets/hero-4-tune.png'
theme: '自建blog平台'
tags: ['Astro', '前端', '博客平台']
---

前阵子有人问，一些博客里那种融入背景、随鼠标移动的柔光动效是怎么做的。本质上就是一层渐变，坐标实时跟随光标。这回我也给本站首页加了一个，做法记录在下面，均已实测可用。

## 它到底是什么

这类效果通常称作"交互式背景"。最常见的柔光形态，核心只有一步：用一个径向渐变图层，借助 JS 把鼠标在元素内的坐标写入 CSS 变量，渐变中心便随光标移动。光晕为半透明，并设 `pointer-events:none`，因此它始终位于文字之下，也不影响点击。

除聚光外，还有几种常见形态：

- **视差分层**：几层背景按不同系数随光标位移，制造纵深
- **粒子场**：canvas 粒子，靠近光标时排斥或吸引
- **极光 / 流光**：大块模糊渐变缓慢流动，并轻微跟随光标
- **WebGL 着色器**：流体噪声，效果最炫，开销也最大

对静态博客而言，聚光与视差既不引入第三方依赖，也不拖慢首屏，较为合适。本站采用的是聚光。

## 先动手感受一下

下面放一个可交互的示例。将鼠标移入方框，光晕即随光标移动；移出后停在最后的位置。它与首页用的是同一套做法，只是收在小框里，便于看清坐标如何作用于光晕。

<div class="spotlight-demo">
  <p>将鼠标移入下方方框<br />光晕会跟随光标移动</p>
</div>

看过示例再读代码，会更容易理解。

## 给首页加聚光

我把它加在首页的站点身份区（`.masthead`），分两处实现：样式写在页面的 scoped style 中，逻辑写在页面底部的 `<script>` 里。

样式部分，先为 `.masthead` 建立定位上下文，再用 `::after` 绘制那团光。光取主题色并加少许透明度，亮色与暗色主题下都能用。

需要注意一点：若 hero 被限制在窄栏内（例如本站首页内容区只有 960px 宽），直接把光画在窄栏上，鼠标靠近左右边缘时，光晕会被 `overflow:hidden` 裁出一道硬边，很难看。解决办法是让 hero 满幅——用负 margin 突破内容栏，使光晕横跨整个视口、在边缘自然淡出；文字再用一个内层容器收回 960px。

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

光中心默认在 `50% 50%`（即页面正中），不移动鼠标时也是一团柔光，不会突兀。我把半径调大、让淡出更晚，整体更柔和。

逻辑很短：监听 `pointermove`，把屏幕坐标转换为元素内的局部坐标，写入 `--mx` / `--my`。`requestAnimationFrame` 用于节流，否则鼠标每动一次都会触发重排；`prefers-reduced-motion` 则面向在系统中关闭动效的用户，命中时就不绑定监听。

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

此处 `getBoundingClientRect()` 不可省略：它把鼠标相对视口的坐标，换算为相对 `.masthead` 左上角的坐标，否则光的位置会偏移。

## 几点注意

- **性能**：`pointermove` 触发非常频繁，因此用 rAF 节流。
- **无障碍**：部分用户会在系统中关闭动画（出于晕动症等考虑），故加入 `prefers-reduced-motion` 判断，关闭时不绑定监听。
- **避免遮挡**：`::after` 务必加 `pointer-events:none`，否则那层光会盖住下方链接、导致文字无法选中。

至此完成。将鼠标移到本站首页顶端，那团墨绿色的光便会跟随移动。想换颜色，调整 `--primary-color` 的透明度；想改光的范围，改 `radial-gradient` 里的 `600px` 即可。
