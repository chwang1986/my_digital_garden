import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts';

const OG_HOST = 'my-digital-garden.vercel.app';
const CREAM = '#FBF5EA';
const GREEN = '#356b54';
const INK = '#2c2620';
const SECONDARY = '#7a6f5c';
const MUTED = '#9a8f7c';

function escapeHtml(input: string): string {
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
	};
	return input.replace(/[&<>"']/g, (ch) => map[ch]);
}

function truncate(input: string, max = 30): string {
	return input.length > max ? `${input.slice(0, max)}…` : input;
}

export const getStaticPaths = async () => {
	const posts = await getCollection('blog');
	const postNodes = posts.map((post) => ({
		params: { slug: post.id },
		props: { title: post.data.title, description: post.data.description ?? '' },
	}));
	return [
		...postNodes,
		{ params: { slug: 'default' }, props: { title: SITE_TITLE, description: SITE_DESCRIPTION, default: true } },
	];
};

export const GET: APIRoute = async ({ props }) => {
	const { title, description, default: isDefault } = props as {
		title: string;
		description: string;
		default?: boolean;
	};

	const noto = fs.readFileSync(`${process.cwd()}/public/fonts/NotoSansSC-Regular.otf`);
	const atkinsonRegular = fs.readFileSync(`${process.cwd()}/src/assets/fonts/atkinson-regular.woff`);
	const atkinsonBold = fs.readFileSync(`${process.cwd()}/src/assets/fonts/atkinson-bold.woff`);

	const safeTitle = escapeHtml(title);
	const tagline = description
		? escapeHtml(truncate(description, 30))
		: '技术随笔 · 系统思考';

	const brand = isDefault ? 'Wang’s Notes' : 'Wang’s Notes';
	const footerLeft = isDefault ? '技术随笔 · 系统思考' : tagline;
	const footerRight = OG_HOST;

	const tree = {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: '1200px',
				height: '630px',
				background: CREAM,
				padding: '80px 88px',
				boxSizing: 'border-box',
				fontFamily: 'Noto',
			},
			children: [
				{
					type: 'div',
					props: {
						style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 },
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontFamily: 'Atkinson',
										fontWeight: 700,
										fontSize: '30px',
										letterSpacing: '5px',
										color: GREEN,
										textTransform: 'uppercase',
									},
									children: brand,
								},
							},
							{
								type: 'div',
								props: {
									style: {
										width: '72px',
										height: '6px',
										background: GREEN,
										borderRadius: '3px',
										marginTop: '22px',
										marginBottom: '44px',
									},
								},
							},
							{
								type: 'div',
								props: {
									style: {
										fontFamily: 'Noto',
										fontWeight: 400,
										fontSize: '62px',
										lineHeight: 1.28,
										color: INK,
									},
									children: safeTitle,
								},
							},
							{
								type: 'div',
								props: {
									style: {
										fontFamily: 'Noto',
										fontWeight: 400,
										fontSize: '26px',
										color: SECONDARY,
										marginTop: '30px',
									},
									children: tagline,
								},
							},
						],
					},
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							fontFamily: 'Noto',
							fontSize: '20px',
							color: MUTED,
						},
						children: [
							{ type: 'span', props: { children: footerLeft } },
							{ type: 'span', props: { children: footerRight } },
						],
					},
				},
			],
		},
	};

	const svg = await satori(tree, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Atkinson', data: atkinsonRegular, weight: 400 },
			{ name: 'Atkinson', data: atkinsonBold, weight: 700 },
			{ name: 'Noto', data: noto, weight: 400 },
		],
	});

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const png = resvg.render().asPng();

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
