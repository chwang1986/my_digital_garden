import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import sharp from 'sharp';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts';

const OG_HOST = 'my-digital-garden-topaz-five.vercel.app';
const CREAM = '#FBF5EA';
const GREEN = '#356b54';
const INK = '#2c2620';
const SECONDARY = '#7a6f5c';
const MUTED = '#9a8f7c';

function truncate(input: string, max = 30): string {
	return input.length > max ? `${input.slice(0, max)}…` : input;
}

export const getStaticPaths = async () => {
	const posts = await getCollection('blog');
	const postNodes = posts.map((post) => ({
		params: { slug: post.id },
		props: {
			title: post.data.title,
			description: post.data.description ?? '',
			heroSrc: post.data.heroImage?.src ?? null,
		},
	}));
	return [
		...postNodes,
		{ params: { slug: 'default' }, props: { title: SITE_TITLE, description: SITE_DESCRIPTION, heroSrc: null, default: true } },
	];
};

function textCard(title: string, tagline: string, isDefault: boolean) {
	const brand = 'Wang’s Notes';
	const footerLeft = isDefault ? '技术随笔 · 系统思考' : tagline;
	return {
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
									children: title,
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
							{ type: 'span', props: { children: OG_HOST } },
						],
					},
				},
			],
		},
	};
}

async function photoCard(title: string, heroSrc: string) {
	// satori 仅能解码 PNG/JPEG，故用 sharp 把构建产物(webp)转成 png 再内联
	const png = sharp(`${process.cwd()}/dist${heroSrc}`).png();
	const buf = await png.toBuffer();
	const dataUri = `data:image/png;base64,${buf.toString('base64')}`;
	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: '1200px',
				height: '630px',
				backgroundImage: `url(${dataUri})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				padding: '56px 64px',
				boxSizing: 'border-box',
				fontFamily: 'Noto',
				position: 'relative',
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background:
								'linear-gradient(180deg, rgba(20,28,22,0.35) 0%, rgba(20,28,22,0.15) 35%, rgba(20,28,22,0.78) 100%)',
						},
					},
				},
				{
					type: 'div',
					props: {
						style: { position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' },
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontFamily: 'Atkinson',
										fontWeight: 700,
										fontSize: '26px',
										letterSpacing: '3px',
										color: '#faf6ee',
										textTransform: 'uppercase',
									},
									children: 'Wang’s Notes',
								},
							},
						],
					},
				},
				{
					type: 'div',
					props: {
						style: { position: 'relative', display: 'flex', flexDirection: 'column' },
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontFamily: 'Noto',
										fontWeight: 700,
										fontSize: '58px',
										lineHeight: 1.22,
										color: '#ffffff',
										maxWidth: '900px',
									},
									children: title,
								},
							},
							{
								type: 'div',
								props: {
									style: {
										fontFamily: 'Noto',
										fontWeight: 400,
										fontSize: '20px',
										color: 'rgba(250,246,238,0.82)',
										marginTop: '18px',
									},
									children: OG_HOST,
								},
							},
						],
					},
				},
			],
		},
	};
}

export const GET: APIRoute = async ({ props }) => {
	const { title, description, heroSrc, default: isDefault } = props as {
		title: string;
		description: string;
		heroSrc?: string | null;
		default?: boolean;
	};

	const noto = fs.readFileSync(`${process.cwd()}/public/fonts/NotoSansSC-Regular.otf`);
	const atkinsonRegular = fs.readFileSync(`${process.cwd()}/src/assets/fonts/atkinson-regular.woff`);
	const atkinsonBold = fs.readFileSync(`${process.cwd()}/src/assets/fonts/atkinson-bold.woff`);

	const tagline = description ? truncate(description, 30) : '技术随笔 · 系统思考';

	let tree: object;
	try {
		if (heroSrc) {
			tree = await photoCard(title, heroSrc);
		} else {
			tree = textCard(title, tagline, !!isDefault);
		}
	} catch {
		tree = textCard(title, tagline, !!isDefault);
	}

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
