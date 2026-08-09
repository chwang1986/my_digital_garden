import type { CollectionEntry } from 'astro:content';

/**
 * 文章列表排序：统一按发布时间倒序（新的在上，最早的在最底）。
 * 同一天的文章用 order 升序做次级排序，保证同系列内部顺序稳定。
 * 注意：数字 1→5 的阅读顺序不进入时间流，只在文章页内的"本系列"导航里出现。
 */
export function sortPosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
	return [...posts].sort((a, b) => {
		const byDate = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
		if (byDate !== 0) return byDate;
		return (a.data.order ?? 0) - (b.data.order ?? 0);
	});
}
