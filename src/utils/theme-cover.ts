// 主题 → 封面图（无单独 heroImage 时，列表卡片按主题取同一张图）
const THEME_COVER: Record<string, string> = {
	'瞎想': '/theme-covers/musings.svg',
	'Mac 新手笔记': '/theme-covers/mac-notes.svg',
	'ollama的使用': '/theme-covers/ollama.svg',
	'自建blog平台': '/theme-covers/blog-platform.svg',
	'与AI对话': '/theme-covers/ai-dialog.svg',
	'写作方法': '/theme-covers/writing.svg',
	'历史故事': '/theme-covers/history.svg',
	'随笔': '/theme-covers/essay.svg',
};

export function themeCover(theme?: string): string {
	return (theme && THEME_COVER[theme]) || THEME_COVER['随笔'];
}
