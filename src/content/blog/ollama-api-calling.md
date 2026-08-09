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

装好之后，Ollama 在本地起了个服务，地址是 `http://localhost:11434`。所有调用都打这个地址。注意：纯命令行环境要先 `ollama serve` 把服务起起来；点了桌面版的话它已经在后台跑着了。

## 两个常用接口

- `/api/generate`：一次性生成。给个 prompt，返回结果。适合摘要、翻译这种一次性任务。
- `/api/chat`：多轮对话。你自己维护 `messages` 列表（每条带 `role` 和 `content`），模型记住上下文。

## 用 curl 试

生成：

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:7b",
  "prompt": "用一句话解释什么是向量数据库"
}'
```

返回是一行一行的 JSON（流式），每行一个片段，边生成边吐。

对话：

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen2.5:7b",
  "messages": [{"role": "user", "content": "你是谁"}]
}'
```

## 用 Python 更顺手

不用装官方 SDK，`requests` 就够了：

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

默认是流式返回，这里加了 `"stream": False`，拿到的就是完整回答，直接 `r.json()` 解析。

## 还有别的

- `/api/embed`：拿文本向量，做检索、相似度的时候用。
- `/api/tags`：列出本机模型，等价于命令行的 `ollama list`。

连不上就先确认服务在跑——`ollama ps` 看一眼，或者确认桌面版开着。
