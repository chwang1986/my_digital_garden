import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		// 系列与顺序：同一 series 内按 order 升序排列
		series: z.string().optional(),
		order: z.number().optional(),
		// 主题（一级归类，作者指派，每篇一个）：默认「随笔」，如 建站技术 / 写作方法 / 笔记方法
		theme: z.string().default('随笔'),
		// 标签：用于归档与标签页（二级细化）
		tags: z.array(z.string()).default([]),
		// 置顶：true 时浮到列表（首页头条 / 文章归档 / 主题页）最前，用于栏目发刊词等长期置顶文
		pinned: z.boolean().optional().default(false),
		}),
});

export const collections = { blog };
