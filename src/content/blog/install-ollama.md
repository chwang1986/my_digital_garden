---
title: '怎么装 Ollama'
description: '从 macOS / Windows / Linux 三种方式把 Ollama 装起来，并跑通第一个本地模型。'
pubDate: '2026-08-09'
heroImage: '../../assets/hero-ollama.png'
theme: 'ollama的使用'
series: 'Ollama 实战'
order: 3
tags: ['Ollama', '安装', '本地大模型']
---

装之前先说一句：Ollama 是把整个模型下载到你机器上跑的，所以先看自己内存够不够。7B 量级的模型大概吃 4–5GB 内存，14B 要 8GB 以上，再大就更吃力。用 Apple 芯片的 Mac（M1/M2/M3）体验最好，因为能直接用苹果芯片的算力来跑模型，速度更快。

下面用到的命令都要在"终端"里敲（macOS 按 Cmd+空格 搜 Terminal；Windows 搜 PowerShell；Linux 一般叫终端）。如果你平时没怎么碰过，不用慌，跟着一步步复制粘贴就行。

## macOS

两种方式，随便挑：

- 去 [ollama.com](https://ollama.com) 下载 `.dmg`，拖进应用程序；
- 或者直接用 Homebrew：`brew install ollama`。

装完在启动台点开 Ollama，菜单栏会多出一个小羊驼图标，服务就一直在后台跑着了。

## Windows

同样去 ollama.com 下 exe 安装，或者用系统自带的应用商店命令：

```bash
winget install Ollama.Ollama
```

装完它会常驻后台。

## Linux

官方给了一键脚本：

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

跑完如果想手动起服务，执行 `ollama serve`。

## 验证一下

终端里敲：

```bash
ollama --version
```

能看到版本号就说明装好了。

## 跑第一个模型

```bash
ollama run llama3.2
```

它会先下载再进对话。`llama3.2` 是个 3B 的小模型，下载快，拿来试水正好。想要中文更顺一点的，可以换 `ollama run qwen2.5`（默认 7B）。

进对话后直接打字就行，退出按 `Ctrl+D` 或者输入 `/bye`。

模型下载慢是正常的，看网速。下过的模型以后直接本地跑，不会重复下载。
