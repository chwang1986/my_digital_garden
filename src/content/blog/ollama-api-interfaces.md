---
title: Ollama 的接口：从补全到对话，再到工具调用
description: 聊一下 Ollama 为什么会提供一套兼容 OpenAI 的接口。从最早 /v1/completions 的文本补全，到 /v1/chat/completions 的多轮对话，再到工具调用和结构化输出，顺带说清楚这些接口用在什么场景。
pubDate: 2026-08-11
theme: 'ollama的使用'
tags: ["ollama", "API", "OpenAI", "接口", "大模型"]
---

Ollama 在本地起服务的时候，顺手提供了一套兼容 OpenAI 的接口。要弄明白它为什么这么干，得先看看 OpenAI 的接口自己是怎么变过来的。

## 一、这些接口的历史演进

**早期（大概 2020–2022 年）**，OpenAI 的主接口是 `/v1/completions`。

从字面就能猜到当时程序员想干啥：让模型一次性把"我"没写完的内容补全。比如我写了"我在西安……"，希望模型把后面是什么补出来。这个接口其实正好对应大模型最原始的用途——拿已知的"信息"（我更习惯叫它信息，而不是知识），去预测、也就是补全不完整的句子或段落。

问题是它不适合对话。要做多轮聊天，开发者得自己把所有历史对话手动拼成一条超长字符串发给模型，上下文管理非常麻烦，效果也不稳定。

**2023 年 3 月**，ChatGPT 爆火，GPT-3.5-turbo 发布，OpenAI 推出了 `/v1/chat/completions`。这一版引入了结构化的 `message` 数组，每条消息带上明确角色：`system`（系统提示）、`user`（用户输入）、`assistant`（模型回答）。模型因此能更好地理解上下文，支持多轮对话和少样本提示。接口从"吐一段连续文本"进化成了"像人一样对话"。对话类应用证明了人们要的是多轮交互，而不是单次补全。

后来这套接口被封装成 SDK，开发者不用再手动拼接历史了，渐渐地成了事实上的标准。再往后，又陆续加上了工具调用（Tool calling / Function calling）、结构化输出、视觉理解这些能力。我们熟悉的流式输出、JSON 结构化输出、多模态输入（图片），其实都依赖这些接口。

## 二、既然是 OpenAI 的接口，Ollama 为什么也提供？

Ollama 做了一层完整封装。原因很简单：OpenAI 的接口已经是事实上的标准，照着它做一个兼容接口，比自己发明一套更省事，也更方便接已有的程序。

想想有多少工具和框架是围着 OpenAI SDK 转的——LangChain、LlamaIndex、CrewAI、Cursor IDE、Vercel AI SDK……数不清。开发者在本地用 Ollama 快速测试和开发，代码几乎不用改，就能从本地模型切到云端，或者反过来。

## 三、这些接口用在什么场景

- **构建聊天机器人、客服助手、智能问答系统**。
- **开发 RAG（检索增强生成）**，让模型基于自己的文档回答问题。
- **构建 AI agent**，让模型自动调用工具——算个账、搜个索、查个数据库之类的。
- **在代码编辑器、IDE 里集成 AI 能力**。

## 四、动手调一下（示例）

光说概念不够，跑一个最直观。假设本地已经 `ollama pull llama3` 把模型拉好，服务默认端口 `11434`。

**1）用 Ollama 原生接口 `/api/chat`：**

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3",
  "messages": [{"role": "user", "content": "用一句话解释什么是电压"}],
  "stream": false
}'
```

返回里的 `message.content` 就是模型的回答。

**2）用 OpenAI 兼容接口 `/v1/chat/completions`：**

```bash
curl http://localhost:11434/v1/chat/completions -d '{
  "model": "llama3",
  "messages": [{"role": "user", "content": "用一句话解释什么是电压"}]
}'
```

注意 payload 和上面几乎一样——这就是"兼容"的意思：同一套写法，服务端换成 Ollama 而已。

**3）用 OpenAI 的 Python SDK 指向本地 Ollama：**

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # 本地调用随便填，Ollama 不校验
)

resp = client.chat.completions.create(
    model="llama3",
    messages=[{"role": "user", "content": "用一句话解释什么是电压"}],
)
print(resp.choices[0].message.content)
```

这一段最关键：你平时调 OpenAI 云端的代码，只要把 `base_url` 改成 `http://localhost:11434/v1`，模型名换成本地拉取的那个，其余一行都不用改。这就是"在本地快速测试、几乎不改代码切到云端"的实锤。

## 五、Ollama 的两套接口与常用参数

Ollama 其实对外提供**两套**接口：

- **原生接口** `/api/chat`、`/api/generate`：Ollama 自己设计的，功能最全。其中 `/api/generate` 对应老式的"文本补全"风格，和早期 OpenAI 的 `/v1/completions` 一个思路。
- **兼容接口** `/v1/chat/completions` 等：照着 OpenAI 做的，方便接现成生态。

日常用兼容接口最省事，要更底层的能力再去翻原生接口。

几个常用参数（兼容接口里和 OpenAI 一致）：

- `temperature`：0–1，越高回答越发散、越有创造力，越低越稳重确定。
- `max_tokens`（Ollama 原生里叫 `num_predict`）：控制回答长度上限。
- `stream: true`：流式输出，模型边生成边返回，聊天界面那种"一个字一个字蹦"就是它。
- **系统提示**：在 `messages` 里加一条 `role: "system"` 的消息，用来定人设、定规则。

## 补一句：Few-shot（少样本提示）

向模型提问时，附带 1–5 个示例，这种用法叫 few-shot。对应的还有 zero-shot（零样本，不给示例）和 one-shot（单样本，给一个示例）。它的核心思想是：模型不会被重新训练——这跟微调（fine-tuning）不一样——而是靠着上下文里给的几个例子，当场学着做。
