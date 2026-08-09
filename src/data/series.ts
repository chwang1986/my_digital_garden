// 系列（series）元数据：每篇用 series 字段归到一个有序连续篇。
// 这里集中存放每个系列的「主题/简介」与「规划方向」，供系列落地页展示。
// 新增系列时在此追加一项即可；若某系列无描述，页面会回退为仅显示名称。

export interface SeriesMeta {
	/** 系列一句话主题 / 简介，显示在系列页头部 */
	description: string;
	/** 规划中的文章方向（仅主题，非真实文章），显示在「系列规划」 */
	plan?: string[];
}

export const seriesMeta: Record<string, SeriesMeta> = {
	'数字花园构建笔记': {
		description:
			'从零搭建这个数字花园博客的全过程记录——用 Astro 写内容、GitHub 做版本与协作、Vercel 自动部署，再到打磨 UI 与写作方法。',
	},
	'Ollama 实战': {
		description:
			'面向想在自己电脑上跑大模型的普通开发者与爱好者，用最少的背景知识和命令，把 Ollama 从「听说过」真正用到「跑通、接进自己的应用」——全程本地、离线、数据可控。',
	},
	'历史故事': {
		description:
			'读史小记：从《史记》等典籍里挑有意思的人和事，原文照录，加一点不啰嗦的议论。连载中，想到哪写到哪。',
	},
};
