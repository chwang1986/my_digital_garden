/**
 * 中文友好的阅读时长估算。
 * reading-time 包只按空白分词（\w+），对中文几乎全计为 0，故自定义。
 * 启发式：CJK 字符 ~250 字/分钟（技术文要停下看命令/思考，比流畅阅读慢），拉丁词 ~200 词/分钟。
 */
export function readingTime(text: string): string {
	let body = text;
	// 去掉代码块，避免代码行被算成"字数"
	body = body.replace(/```[\s\S]*?```/g, ' ');
	body = body.replace(/`[^`]*`/g, ' ');
	// 去掉 markdown 标记符号
	body = body.replace(/[#>*_~\-\[\]()!]/g, ' ');

	const cjk = (body.match(/[一-鿿]/g) || []).length;
	const words = (body.match(/[A-Za-z0-9]+/g) || []).length;
	const minutes = Math.max(1, Math.round(cjk / 250 + words / 200));
	return `${minutes} 分钟阅读`;
}
