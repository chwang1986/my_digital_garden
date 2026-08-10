---
title: AI 词典
description: 一份按 A–Z 排列的 AI 常用缩写与术语速查。点词条跳转，看完可返回顶部。涵盖大语言模型、训练优化、推理部署与本地硬件等常见概念。
pubDate: 2026-08-10
theme: 字典
tags: ["AI", "术语", "词典"]
---

<h2 id="terms">词条索引</h2>

下面按首字母 A–Z 排列，中英文并列。点词条跳转至释义，每条末尾可返回此处。

<nav class="glossary-index" aria-label="词条索引">
  <div class="gi-section"><div class="gi-letter">A</div><div class="gi-terms"><a href="#agent">Agent（智能体）</a></div></div>
  <div class="gi-section"><div class="gi-letter">C</div><div class="gi-terms"><a href="#context-window">Context Window（上下文窗口）</a></div></div>
  <div class="gi-section"><div class="gi-letter">D</div><div class="gi-terms"><a href="#distillation">Distillation（蒸馏）</a></div></div>
  <div class="gi-section"><div class="gi-letter">E</div><div class="gi-terms"><a href="#embedding">Embedding（嵌入）</a></div></div>
  <div class="gi-section"><div class="gi-letter">F</div><div class="gi-terms"><a href="#fine-tuning">Fine-tuning（微调）</a> <a href="#function-calling">Function Calling（工具调用）</a></div></div>
  <div class="gi-section"><div class="gi-letter">G</div><div class="gi-terms"><a href="#gpt">GPT</a> <a href="#gpu">GPU</a></div></div>
  <div class="gi-section"><div class="gi-letter">H</div><div class="gi-terms"><a href="#hallucination">Hallucination（幻觉）</a></div></div>
  <div class="gi-section"><div class="gi-letter">I</div><div class="gi-terms"><a href="#inference">Inference（推理）</a></div></div>
  <div class="gi-section"><div class="gi-letter">K</div><div class="gi-terms"><a href="#kv-cache">KV Cache</a></div></div>
  <div class="gi-section"><div class="gi-letter">L</div><div class="gi-terms"><a href="#llm">LLM（大语言模型）</a> <a href="#lora">LoRA（低秩适配）</a></div></div>
  <div class="gi-section"><div class="gi-letter">M</div><div class="gi-terms"><a href="#mcp">MCP</a> <a href="#moe">MoE（混合专家）</a> <a href="#multimodal">Multimodal（多模态）</a></div></div>
  <div class="gi-section"><div class="gi-letter">P</div><div class="gi-terms"><a href="#prompt">Prompt（提示词）</a></div></div>
  <div class="gi-section"><div class="gi-letter">Q</div><div class="gi-terms"><a href="#quantization">Quantization（量化）</a></div></div>
  <div class="gi-section"><div class="gi-letter">R</div><div class="gi-terms"><a href="#rag">RAG（检索增强生成）</a> <a href="#rlhf">RLHF（人类反馈强化学习）</a></div></div>
  <div class="gi-section"><div class="gi-letter">T</div><div class="gi-terms"><a href="#temperature">Temperature（温度）</a> <a href="#token">Token（词元）</a> <a href="#transformer">Transformer（变换器）</a></div></div>
  <div class="gi-section"><div class="gi-letter">V</div><div class="gi-terms"><a href="#vram">VRAM（显存）</a></div></div>
</nav>

---

<h2 id="agent">Agent（智能体）</h2>

能自主调用工具、执行多步任务的人工智能程序，不限于对话。

- 你会碰到：各类「能帮你办事」的助手；本博客用到的 WorkBuddy 即属此类
- 相关：[MCP](#mcp)、[Function Calling](#function-calling)

[↑ 返回词条列表](#terms)

<h2 id="context-window">Context Window（上下文窗口）</h2>

模型单次能处理的文本长度上限，超出部分会被截断或遗忘。

- 你会碰到：长文档总结、多轮对话中「前面的内容记不住了」
- 相关：[Token](#token)、[Inference](#inference)

[↑ 返回词条列表](#terms)

<h2 id="distillation">Distillation（蒸馏）</h2>

用大模型教小模型，使小模型在更小体积下接近大模型的能力。

- 相关：[Quantization](#quantization)、[Fine-tuning](#fine-tuning)

[↑ 返回词条列表](#terms)

<h2 id="embedding">Embedding（嵌入）</h2>

把文字、图片等转成一组数字向量，使语义相近的内容在向量空间中彼此靠近。

- 你会碰到：语义搜索、[RAG](#rag) 的检索阶段
- 相关：[RAG](#rag)

[↑ 返回词条列表](#terms)

<h2 id="fine-tuning">Fine-tuning（微调）</h2>

在已有模型基础上，用特定领域的数据继续训练，使其更适配某项任务。

- 相关：[LoRA](#lora)、[Distillation](#distillation)

[↑ 返回词条列表](#terms)

<h2 id="function-calling">Function Calling（工具调用）</h2>

让模型以结构化方式调用外部函数或 API，从而获取实时数据或执行操作。

- 相关：[Agent](#agent)、[MCP](#mcp)

[↑ 返回词条列表](#terms)

<h2 id="gpt">GPT</h2>

生成式预训练变换器（Generative Pre-trained Transformer），一类主流大语言模型架构的统称，也常用来指代 OpenAI 的相关产品。

- 相关：[Transformer](#transformer)、[LLM](#llm)

[↑ 返回词条列表](#terms)

<h2 id="gpu">GPU</h2>

图形处理器。因并行计算能力强，成为训练和运行大模型的主要硬件。

- 相关：[VRAM](#vram)、[Quantization](#quantization)

[↑ 返回词条列表](#terms)

<h2 id="hallucination">Hallucination（幻觉）</h2>

模型生成看似合理、却与事实不符的内容。

- 你会碰到：问答中出现不存在的引用、错误的日期
- 相关：[RAG](#rag)

[↑ 返回词条列表](#terms)

<h2 id="inference">Inference（推理）</h2>

用训练好的模型处理输入、产生输出的过程，区别于训练阶段。

- 你会碰到：本地用 Ollama 跑模型，做的就是推理
- 相关：[Context Window](#context-window)、[KV Cache](#kv-cache)

[↑ 返回词条列表](#terms)

<h2 id="kv-cache">KV Cache</h2>

推理时为避免重复计算，缓存注意力机制中的键（Key）与值（Value）；它随上下文增长而占用显存。

- 相关：[VRAM](#vram)、[Context Window](#context-window)

[↑ 返回词条列表](#terms)

<h2 id="llm">LLM（大语言模型）</h2>

用海量文本训练、能理解与生成自然语言的模型。

- 你会碰到：ChatGPT，以及本地通过 Ollama 运行的各类模型
- 相关：[Token](#token)、[Inference](#inference)、[Context Window](#context-window)

[↑ 返回词条列表](#terms)

<h2 id="lora">LoRA（低秩适配）</h2>

一种轻量微调方法，只训练少量新增参数即可适配新任务，显存占用低。

- 相关：[Fine-tuning](#fine-tuning)、[Quantization](#quantization)

[↑ 返回词条列表](#terms)

<h2 id="mcp">MCP</h2>

模型上下文协议（Model Context Protocol），为模型连接外部工具与数据源制定的开放标准。

- 相关：[Agent](#agent)、[Function Calling](#function-calling)

[↑ 返回词条列表](#terms)

<h2 id="moe">MoE（混合专家）</h2>

混合专家模型。将任务分给多个专用子网络，推理时只激活其中一部分，兼顾能力与效率。

- 相关：[Transformer](#transformer)

[↑ 返回词条列表](#terms)

<h2 id="multimodal">Multimodal（多模态）</h2>

模型可同时处理文本、图像、音频等多种输入或输出。

- 你会碰到：能看图、听语音的助手
- 相关：[Embedding](#embedding)

[↑ 返回词条列表](#terms)

<h2 id="prompt">Prompt（提示词）</h2>

你给模型的输入指令，用以引导其输出。

- 你会碰到：写清需求、加示例、限定格式，都属于提示词工程
- 相关：[Temperature](#temperature)

[↑ 返回词条列表](#terms)

<h2 id="quantization">Quantization（量化）</h2>

降低模型数值精度（如从 16 位到 4 位）以减小体积、加快速度，通常伴有轻微精度损失。

- 相关：[GPU](#gpu)、[VRAM](#vram)、[LoRA](#lora)

[↑ 返回词条列表](#terms)

<h2 id="rag">RAG（检索增强生成）</h2>

先检索相关资料，再让模型作答，用外部知识补足模型自身记忆。

- 你会碰到：带「引用来源」的问答系统
- 相关：[Embedding](#embedding)、[Hallucination](#hallucination)

[↑ 返回词条列表](#terms)

<h2 id="rlhf">RLHF（人类反馈强化学习）</h2>

用人类偏好反馈训练奖励模型，再据此微调，使输出更符合人的预期。

- 相关：[Fine-tuning](#fine-tuning)

[↑ 返回词条列表](#terms)

<h2 id="temperature">Temperature（温度）</h2>

控制输出随机性的参数。值越高越发散，越低越确定。

- 相关：[Prompt](#prompt)

[↑ 返回词条列表](#terms)

<h2 id="token">Token（词元）</h2>

模型处理文本的最小单位，可能是一个字、词或子词。计费与长度常按 Token 计。

- 你会碰到：上下文窗口、价格都以 Token 衡量
- 相关：[Context Window](#context-window)

[↑ 返回词条列表](#terms)

<h2 id="transformer">Transformer（变换器）</h2>

当前大语言模型普遍采用的基础神经网络架构，以注意力机制为核心。

- 相关：[GPT](#gpt)、[LLM](#llm)、[MoE](#moe)

[↑ 返回词条列表](#terms)

<h2 id="vram">VRAM（显存）</h2>

显卡上的专用内存。运行大模型时，权重与缓存都放在这里，容量直接限制可运行的模型大小。

- 相关：[GPU](#gpu)、[KV Cache](#kv-cache)、[Quantization](#quantization)

[↑ 返回词条列表](#terms)
