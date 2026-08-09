---
title: '用 Ollama 搭一个本地助手'
description: '用一个脚本或 Open WebUI，把本机模型变成随手能问的本地助手。'
pubDate: '2026-08-09'
heroImage: '../../assets/hero-ollama.png'
theme: 'ollama的使用'
series: 'Ollama 实战'
order: 5
tags: ['Ollama', 'Open WebUI', '本地助手']
---

模型能在终端跑之后，下一步就是让它变成日常随手能用的助手。

## 最简单的：包一层脚本

把上一节的调用封成一个小脚本，比如 `ask.py`：读你的问题，打 `/api/chat`，把回答打出来。之后在终端就能直接 `python ask.py "这段 CSS 什么意思"`。十来行代码的事，但用起来顺手很多。

## 想有界面：Open WebUI

社区里最常用的本地前端是 Open WebUI，docker 一行就能起：

```bash
docker run -d -p 3000:3000 \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  -v ollama:/root/.ollama \
  -v open-webui:/app/backend/data \
  --name open-webui ghcr.io/open-webui/open-webui:main
```

浏览器开 `localhost:3000`，它会自动连上本机 Ollama。之后就像用 ChatGPT 一样在本地聊天，数据不出机器。Linux 上把 `OLLAMA_BASE_URL` 改成宿主机的 `http://<内网IP>:11434` 就行。

## 在编辑器里用

VS Code 装个 Continue 插件，把 provider 指向 Ollama、模型填本地的名字，就能在编辑器里用本地模型补全和问答，读代码特别方便。

## 为什么值得

模型和数据都在你机器上：不上云、不按次计费、断网也能用。写笔记、读代码、润色中文都合适。

一个习惯提醒：本地模型再强，也别把真密码、真密钥贴进去当上下文。它确实跑在你本机，但好习惯得有。
