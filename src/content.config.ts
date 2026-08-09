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
		}),
});

export const collections = { blog };
