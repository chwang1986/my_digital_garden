---
title: '在终端和应用里调用 Ollama'
description: '绕过界面，直接打本机 11434 端口的 API，在终端和 Python 里调用模型。'
pubDate: '2026-08-09'
heroImage: '../../assets/hero-ollama.png'
theme: 'ollama的使用'
series: 'Ollama 实战'
order: 4
tags: ['Ollama', 'API', '本地调用', 'Python']
---

前面几篇都是在 Ollama 自带的界面里聊天。这一篇换个玩法：让"程序"来问模型，而不是你亲手敲。

你平时在网页上和 AI 聊天，背后其实是你的浏览器在"问"服务商的服务器，服务器想好再回你。Ollama 也一样，只不过这个服务器在你自己电脑上，地址是 `http://localhost:11434`。

- `localhost` 就是"本机"（你自己的电脑）的意思；
- `11434` 是它占用的"端口号"，相当于这门牌号。

你不用背这个地址，只要知道"Ollama 在本地开了一个能问模型的口子"就行。下面所有调用都打这个地址。

> 小提示：如果你装的是带界面的桌面版，服务一般已经在后台跑着了；如果是纯命令行环境，先执行 `ollama serve` 把它起起来。

## 这篇文章的目标

- 明白"Ollama 在本地起了个服务"是什么意思；
- 用 curl 在终端直接问模型一个问题，并看懂它返回的回答；
- 用一个十几行的 Python 脚本，让程序也能用上本机模型。

## 两个常用接口

- `/api/generate`：一次性生成。你给一段提示词，它返回一段回答。适合摘要、翻译这种"问一次就完"的任务。
- `/api/chat`：多轮对话。你自己维护一个"对话记录"列表（每条记着"谁说的、说了啥"），模型就能记住上下文，像连续聊天一样。

## 用 curl 试

`curl` 是终端里发网络请求的小工具，大多数系统自带。

生成：

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:7b",
  "prompt": "用一句话解释什么是向量数据库"
}'
```

返回的是一段一段的文字（术语叫"流式"），它是边想边吐出来的，所以你会看到答案一段一段蹦出来。

对话：

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen2.5:7b",
  "messages": [{"role": "user", "content": "你是谁"}]
}'
```

## 用 Python 更顺手

如果你会用一点 Python，下面这个例子比 curl 好懂，也更常用。`requests` 是个发请求的工具，一般要先 `pip install requests`。

```python
import requests

r = requests.post(
    "http://localhost:11434/api/chat",
    json={
        "model": "qwen2.5:7b",
        "messages": [{"role": "user", "content": "帮我写个匹配邮箱的正则"}],
        "stream": False,
    },
)

print(r.json()["message"]["content"])
```

默认情况下模型是"一段一段"返回的（流式），这里加了 `"stream": False`，让它一次给完整回答，我们才好直接用 `r.json()` 取出来打印。

跑这个脚本前，确保 Ollama 服务在跑、且 `qwen2.5:7b` 已经 `pull` 到本机。

## 还有别的接口

- `/api/embed`：把一段文字变成"向量"（一串数字），做搜索、相似度比对时用；
- `/api/tags`：列出本机模型，和命令行 `ollama list` 一个意思。

连不上就先确认服务在跑——`ollama ps` 看一眼，或者确认桌面版开着。
