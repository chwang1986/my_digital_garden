---
title: '我选这个平台，它给我什么'
description: '记录如何从选型、本地环境搭建，实现代码Push即自动部署的全流程。'
pubDate: '2026-08-07'
heroImage: '../../assets/hero-3-platform.png'
series: '数字花园构建笔记'
order: 3
theme: '自建blog平台'
tags: ['Astro', 'GitHub', 'Vercel', '部署']
---

这是系列的第三篇。前面两篇讲了记录和分享，接下来轮到平台：我为什么选 Astro + GitHub + Vercel 这套，它到底给了我什么。

在尝试过几个服务托管方案后，我决定重新搭建一个低成本、低运维负担、响应毫秒级、且完全免费的静态个人站点。

下面是我从零开始，使用 **Astro** 框架，结合 **GitHub** 仓库与 **Vercel** 自动化CI/CD流水线建立个人数字花园的全过程。

---

前置条件：装好 Node.js（LTS）、有一个 GitHub 账号。Vercel 用 GitHub 登录即可，不用单独准备。整个过程大概半小时。

![部署流程：本地 Astro → git push → GitHub → Vercel 构建 → 线上站点](/diagrams/deploy.svg)

## 1.为什么选择这个技术栈？

在工程选型上，我最在意的几点是：**低成本、不休眠、高可读性、未来可扩展**。

- **Astro：** 工程化实现群岛架构（Islands Architecture），页面不包含交互组件时(没有JavaScript)。绝大多数内容直接输出静态HTML，首屏体验优异；交互组件（如Leaflet地图）可作为独立“岛屿”按需隔离挂载。
- **GitHub：** 作为版本控制中心与内容资产的唯一仓库。
- **Vercel：** 绑定 GitHub 后，每次`git push`会在20秒内自动完成编译和 CDN 部署，不用再管服务器休眠和手动运维。

---

## 2.本地环境初始化

### 安装Node.js与创建项目
首先确保本地开发环境安装了Node.js（LTS版本），在终端运行Astro官方脚手架：

```bash
npm create astro@latest -- --template blog
```
根据提示选择基础配置并自动安装依赖。初始化完成后，在项目根目录下运行：
```bash
npm run dev
```
打开 http://localhost:4321 即可在本地实时预览站点

## 3. 代码托管GitHub 
在将本地代码推送到GitHub时,需要身份验证,一劳永逸的办法是切换为SSH密钥验证。

**生成与配置SSH密钥:**
1. 在终端生成密钥：
```bash
ssh-keygen -t ed25519 -C "your_email"
```
2. 复制公钥内容
```bash
pbcopy < ~/.ssh/id_ed25519.pub
```
3. 打开 GitHub Settings -> SSH and GPG keys，添加新的 SSH Key。

**关联远程仓库并推送**

将远程仓库的连接模式切换为 SSH 格式：
```bash
git remote set-url origin git@github.com:your_username/your_repo.git
git branch -M main
git push -u origin main
```

## 4.Vercel自动化部署
1. 登录 Vercel，选择 Continue with GitHub 登录。
2. 在 Dashboard 点击 Add New -> Project，导入刚才推送的 GitHub 仓库。
3. 框架预设选择 Astro，无需更改任何默认构建参数，点击 Deploy。

## 5.日常写作工作流
今后所有的内容创作只需三步：
1. 在本地使用 Markdown 撰写随笔或技术文章。
2. 运行 npm run dev 本地预览排版。
3. 执行 Git 提交命令：
```bash
git add .
git commit -m "docs: 发布新文章"
git push
```

---

## 6. 常用命令

```bash
npm run dev      # 本地预览，http://localhost:4321
npm run build    # 构建静态文件到 dist/
npm run preview  # 本地预览构建结果
git add . && git commit -m "docs: 新文章" && git push  # 一键发布
```