// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
	site: 'https://my-digital-garden-topaz-five.vercel.app',
	integrations: [mdx(), sitemap()],
	markdown: {
		// 数学公式：行内 $...$ 与块级 $$...$$，由 KaTeX 渲染（需配套 CSS，见 BlogPost.astro）
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
		shikiConfig: {
			// 双主题：跟随站点 .dark 切换，避免代码块在白天模式下深底深字看不见
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			wrap: true,
		},
	},
});
