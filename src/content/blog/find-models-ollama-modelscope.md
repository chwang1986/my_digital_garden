---
title: '在 ollama.com 和 modelscope.cn 上找模型、下模型'
description: 'Ollama 官方模型库直接给 ollama pull 命令，拉下来就能跑；魔搭社区中文模型多、国内下载快。两个网站的用法，以及各自适合什么场景。'
pubDate: '2026-08-10'
heroImage: '../../assets/hero-ollama.png'
theme: 'ollama的使用'
series: 'Ollama 实战'
order: 10
tags: ['Ollama', 'ModelScope', '模型下载', '本地大模型']
---

前面几篇讲了怎么装 Ollama、怎么看硬件、怎么拉模型跑起来。但「到底去哪找模型」这件事，其实有两个网站最常用：一个是 **ollama.com**，Ollama 自家的模型库；一个是 **modelscope.cn**，阿里的魔搭社区。

这两个站定位不太一样，用对了能省很多事。

## ollama.com：拉下来就能跑

ollama.com 是 Ollama 的官网，对本地跑模型的人来说，最有用的就是它的 **模型库（Library）**。

打开 [ollama.com/library](https://ollama.com/library)，你会看到一个模型卡片的网格。随便点一张，比如 `qwen2.5` 或者 `llama3.1`，进去之后重点看这几样：

- **模型名和参数量**：比如 `qwen2.5` 下面有 `0.5b`、`1.5b`、`3b`、`7b`、`14b`、`32b`、`72b`，数字越大通常越能聊，但也越吃机器；
- **能力标签**：卡片上会标这个模型能干什么，常见的有 `vision`（能看图）、`tools`（能调工具/函数）、`thinking`（会先推理再答）、`embedding`（出向量，不是用来聊天）；
- **Tags 列表**：点进模型详情页（比如 `ollama.com/library/qwen2.5/tags`）能看到所有可用版本，每个都标了磁盘体积、量化方式、上下文窗口。同一个模型常分 `q4_K_M`、`q8_0` 这些量化档，Q4 小、省资源，Q8 大、更准；
- **拉取命令**：每个页面上都写着 `ollama pull qwen2.5:7b` 这种命令，复制就能用。

所以 ollama.com 的玩法特别简单：在网页上挑好模型 → 复制它给的 `ollama pull` 命令 → 回到命令行粘贴执行。比如：

```bash
ollama pull qwen2.5:7b
```

拉完直接 `ollama run qwen2.5:7b` 就能聊。也可以一步到位：`ollama run qwen2.5:7b` 会先拉再聊。

想按能力筛模型的话，库页面也支持，比如只看支持视觉的：

```
https://ollama.com/search?c=vision
```

ollama.com 上的模型都是**已经打包好的**，拉下来就是 Ollama 能直接用的格式。只想在本地跑起来的话，从这里开始就行。

## modelscope.cn：中文模型多、国内下得快

[modelscope.cn](https://modelscope.cn) 是阿里的魔搭社区，可以理解成「国内的 Hugging Face」。很多中文模型（尤其是通义千问 Qwen 系列）会在这首发，而且服务器在国内，**下载速度比从国外拉快很多**。

它下模型有三种方式，从轻到重：

**方式一：网页直接下**

进到某个模型的文件页面，直接点文件旁边的下载按钮就行。适合「我就想下一个文件看看」的场景，比如某个配置文件、tokenizer。

**方式二：命令行 CLI（最常用）**

先装一下工具：

```bash
pip install modelscope
```

然后下载整个模型到指定目录：

```bash
modelscope download --model Qwen/Qwen2.5-7B --local_dir ./qwen25
```

其中 `Qwen/Qwen2.5-7B` 是「组织/模型名」这种格式（在模型主页的地址栏里能看到），`--local_dir` 指定存到本地的哪个文件夹。

只想下某几个文件也行，用 `--include` / `--exclude` 按后缀筛：

```bash
modelscope download --model Qwen/Qwen2.5-7B --include "*.safetensors"
```

默认会下到 `~/.cache/modelscope/hub`，想换地方可以设环境变量 `MODELSCOPE_CACHE`。如果是私有模型，先登录再下：

```bash
modelscope login --token 你的访问令牌
```

令牌在魔搭官网「My Access Tokens」页面拿。

**方式三：Python SDK**

在 Notebook 或者你自己的 Python 代码里，用 SDK 更顺手：

```python
from modelscope.hub.snapshot_download import snapshot_download

model_dir = snapshot_download('Qwen/Qwen2.5-7B', local_dir='./qwen25')
print(f"模型已下载至: {model_dir}")
```

## 两个站的关键区别：下下来的东西不一样

这点最容易搞混：

- 在 **ollama.com** 上下的是 **Ollama 专用格式**（GGUF 打包好的），`ollama pull` 完直接 `ollama run` 就能聊，不用你再处理；
- 在 **modelscope.cn** 上下的是 **原始权重文件**（`.safetensors`、配置文件那些），是给训练、微调、或者别的框架（transformers 等）用的。它不能直接丢进 Ollama 跑，要进 Ollama 还得自己转成 GGUF、写 Modelfile 再 `ollama create`。

所以两个站不是二选一，而是看你要干啥：

| | ollama.com | modelscope.cn |
| --- | --- | --- |
| 下下来是什么 | Ollama 直接能跑的格式 | 原始模型权重 |
| 国内下载速度 | 一般 | 快 |
| 中文模型丰富度 | 有主流的 | 非常全，很多首发 |
| 适合场景 | 只想本地跑起来聊 | 要拿原始权重做研究/微调/换框架 |

## 怎么配合着用

我一般是这么分的：

1. **只想在本地用模型聊天**：直接上 ollama.com/library，挑好模型复制 `ollama pull` 命令，拉完就完事，不用碰 modelscope；
2. **想要某个中文模型、或者国外源下载慢**：先看 ollama.com 有没有这个模型（大部分主流都有），没有再去 modelscope 下原始权重；
3. **要做微调、研究，或者把模型接进别的程序**：去 modelscope.cn 下原始权重，那边资源最全。

对新手来说，先把 ollama.com 用熟就够了。等哪天发现「ollama 库里没有我要的版本」或者「我想改模型」，再回头逛 modelscope。

## 魔搭模型跑进 Ollama：先确认是不是 GGUF

**Ollama 只认 GGUF 格式**。所以魔搭上下来的模型能不能直接跑，看名字后缀：

- 名称带 `-gguf` 的（如 `qwen/Qwen2.5-7B-Instruct-gguf`）：已经是 Ollama 能用的格式，零转换；
- 普通的原版权重（文件夹里是 `model.safetensors`、`config.json`、`tokenizer` 那些）：**不能直接用**，必须先转成 GGUF。

### 情况一：带 `-gguf` 后缀（推荐，不用转）

可以让 Ollama 直接去魔搭拉（Ollama ≥ 0.3.12 原生对接 ModelScope）：

```bash
ollama run modelscope.cn/qwen/Qwen2.5-7B-Instruct-gguf
# 指定量化版本
ollama run modelscope.cn/qwen/Qwen2.5-7B-Instruct-gguf:Q4_K_M
```

如果你已经手动把 GGUF 文件下到了本地，在同目录建个 `Modelfile`：

```Modelfile
FROM ./qwen2.5-7b.Q4_K_M.gguf
PARAMETER num_ctx 32768
# 必须填入该模型的对话模板（TEMPLATE），否则回答会乱
```

然后打包进 Ollama：

```bash
ollama create qwen2.5-7b -f Modelfile
ollama run qwen2.5-7b
```

### 情况二：普通原版权重（要先转 GGUF）

用 llama.cpp 转一下（需先 `pip install torch transformers sentencepiece protobuf`）：

```bash
git clone https://github.com/ggerganov/llama.cpp && cd llama.cpp
python convert_hf_to_gguf.py 你的模型文件夹路径 --outfile model.Q4_K_M.gguf --q4_k_m
```

拿到 `.gguf` 后，再走上面「本地 Modelfile」那几步包进 Ollama。

### 接进局域网 Continue 插件（完整链路）

1. Ollama 服务端开放 `0.0.0.0:11434`，防火墙放行该端口；
2. 要么 `ollama run modelscope.cn/xxx` 在线拉 GGUF，要么本地转好导入；
3. Continue 的 `config.yaml` 填局域网地址和模型名：

```yaml
models:
  - name: Qwen2.5 7B LAN
    provider: ollama
    model: qwen2.5-7b
    apiBase: http://192.168.x.x:11434
```

### 几个避坑点

- Ollama 唯一原生格式就是 GGUF，其他格式一律要先转；
- 转完或导入时，`Modelfile` 里的 **TEMPLATE 对话模板一定要对**（Qwen、Llama3、DeepSeek 各不相同），不然输出逻辑会错乱；
- 优先在魔搭搜带 `gguf` 后缀的镜像，能省下转几十 GB 模型的时间；
- 多模态（VL）视觉模型同样需要 GGUF 量化包才能在 Ollama 跑。

到这，「找模型 → 下模型 → 把魔搭模型跑进 Ollama」这条线就接上了。
