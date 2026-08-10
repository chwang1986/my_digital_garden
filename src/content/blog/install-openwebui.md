---
title: '安装 Open WebUI，给本地模型配个网页界面'
description: '用 Docker 或 pip 把 Open WebUI 跑起来，连上本机 Ollama，在浏览器里像用 ChatGPT 一样聊本地模型。'
pubDate: '2026-08-09'
heroImage: '../../assets/hero-ollama.png'
theme: 'ollama的使用'
series: 'Ollama 实战'
order: 9
tags: ['Ollama', 'Open WebUI', '本地大模型', '工具']
---

Ollama 装好之后，你是在命令行里跟模型聊的。能用，但总归不如网页舒服——没有会话历史、不能切模型、不能传文件。

Open WebUI 就是给本地模型补上这个网页界面的开源项目。它本来就是为 Ollama 生的，连上之后，你在浏览器里就能像用 ChatGPT 一样聊本机模型，还能存历史、切模型、传文档。这篇讲怎么把它跑起来。

## 这篇文章的目标

- 用 Docker 或 pip 其中一种方式把 Open WebUI 跑起来；
- 连上本机已经在跑的 Ollama；
- 在浏览器里打开，建好账号，开始用网页界面聊本地模型。

## 前提：Ollama 已经在跑

Open WebUI 只是个界面，模型还得靠 Ollama 提供。所以先确认：

- Ollama 已经装好（前面那篇讲过）；
- 它正在后台运行。Windows 上看任务栏有没有那个小羊驼图标；或者命令行 `ollama list` 能列出模型就说明服务在。

Ollama 默认在 `localhost:11434` 这个地址提供服务，Open WebUI 就是通过这个地址找到模型的。

## 方式一：Docker（推荐，最省心）

Docker 把 Open WebUI 连同它的运行环境一起打包，你不用操心 Python 版本那些破事。

**先装 Docker Desktop**：去 [docker.com](https://www.docker.com) 下载 Windows 版装上，打开让它跑起来（底层用的是 WSL2，第一次会自己配置）。

**然后一条命令**：

```bash
docker run -d -p 3000:8080 `
  --add-host=host.docker.internal:host-gateway `
  -v open-webui:/app/backend/data `
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 `
  --name open-webui `
  ghcr.io/open-webui/open-webui:main
```

参数简单说一下，免得复制完不知道在干嘛：

- `-p 3000:8080`：把容器里的 8080 端口映射到本机 3000，所以你待会访问 `http://localhost:3000`；
- `--add-host=host.docker.internal:host-gateway`：让容器能回过头找到你 Windows 本机上的 Ollama（关键，没这行连不上）；
- `-v open-webui:/app/backend/data`：把数据存进一个叫 `open-webui` 的卷里，重装不丢聊天记录；
- `-e OLLAMA_BASE_URL=...`：告诉它 Ollama 在哪，就是本机的 11434。

跑完等十几秒，浏览器打开 **http://localhost:3000** 就行。第一次会让你注册一个账号，这个账号就是管理员，记一下密码。

## 方式二：pip（轻量，但要 Python 3.11）

不想碰 Docker，可以用 Python 直接装。要求 **Python 3.11**（高版本偶尔有依赖冲突，3.11 最稳）。

```bash
pip install open-webui
```

装完启动：

```bash
open-webui serve
```

它默认跑在 **http://localhost:8080**。如果 Ollama 不在本机默认地址，可以先设环境变量再启动：

```bash
$env:OLLAMA_BASE_URL="http://localhost:11434"
open-webui serve
```

pip 方式的好处是简单，缺点是依赖装在你的 Python 环境里，将来清理不如 Docker 干净。新手图省事用 Docker 更稳。

## 连上 Ollama 之后怎么用

打开网页、注册登录后：

- 左上角模型下拉里，应该能直接看到 Ollama 里的模型（比如之前 `ollama pull` 过的 `qwen2.5`、`llama3.2`）；
- 新建对话，选个模型，就能聊了，体验和网页版 ChatGPT 差不多；
- 还能传文件、看历史会话、开多个会话分屏对比。

如果下拉里空空如也，说明没连上 Ollama，往下看常见问题。

## 常见问题

**页面打不开**

先确认容器在不在跑：`docker ps` 看 `open-webui` 那一行在不在；pip 方式看命令行有没有报错退出。端口被占了就改 `-p` 的映射，比如 `-p 3001:8080`，然后访问 3001。

**模型列表是空的**

九成是 Ollama 没起，或者 `OLLAMA_BASE_URL` 指错地方。确认 Ollama 后台在跑、地址填的是 `http://host.docker.internal:11434`（Docker 方式）或 `http://localhost:11434`（pip 方式）。

**想用中文模型**

先在命令行拉一个：`ollama pull qwen2.5`，回网页刷新，下拉里就出现它了，选上就能用。

## 更新

Docker 方式：

```bash
docker pull ghcr.io/open-webui/open-webui:main
docker rm -f open-webui
# 再用上面那条 docker run 重新跑一次（数据卷还在，记录不丢）
```

pip 方式：

```bash
pip install --upgrade open-webui
```

到这一步，你已经有「本机模型 + 网页界面」的完整本地 AI 环境了。前面讲过的 API 调用，在 Open WebUI 里也能直接触发，两者不冲突。
