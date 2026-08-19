---
title: 把 Mac 变成 AI 开发机：环境一步步装
description: 想用 Mac 跑 AI 相关的开发，先把环境搭起来：Homebrew、Python、Git、Node，再加 Python 虚拟环境和常用库。每一步都给命令和验证方法。
pubDate: 2026-08-10
theme: Mac 新手笔记
tags: ["Mac", "开发环境", "Homebrew", "Python"]
series: Mac 新手笔记
order: 3
---

如果你打算用 Mac 做点 AI 相关的开发，下面这套环境基本是标配。跟着走一遍，每一步都验证一下，省得后面踩坑。

> 路径以 Apple 芯片的 Mac 为准，Homebrew 装在 `/opt/homebrew`。Intel 芯片在 `/usr/local`，把路径换一下即可。

## 第一步：装 Homebrew

Mac 上的包管理器，后面装软件、装环境都靠它。

国内网络直接跑官方脚本经常卡在 `Connection reset by peer`，所以下面先给**国内镜像装法**（推荐），网络能连 GitHub 时再用官方脚本兜底。

### 国内镜像装法（推荐，中国大陆适用）

用 Gitee 上的 HomebrewCN 脚本，安装时选「中科大镜像源」：

```bash
/bin/bash -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

装完把 Homebrew 加进环境变量（Apple 芯片）：

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

验证一下：

```bash
brew --version
brew doctor
```

少量无关警告可忽略，重点看有没有 ERROR。

> ⚠️ HomebrewCN 写进环境变量只对**新克隆的仓库**生效，已经下载的仓库不会自动切换源。手动改一下，否则后面 `brew update` 还是走 GitHub：
> ```bash
> git -C "$(brew --repo)" remote set-url origin https://mirrors.ustc.edu.cn/git/homebrew/brew.git
> git -C "$(brew --repo)" remote -v
> ```
> 看到 origin 是中科大（ustc.edu.cn）地址就对。

顺手装几个基础依赖，后面编译 Python、解压模型都用得上：

```bash
brew install git wget htop cmake openssl ffmpeg xz
```

其中 `xz` 是给后面可能自己编译 Python 用的，能避免 lzma 模块缺失报错。

### 官方脚本（网络能连 GitHub 时用）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

装完同样把 Homebrew 加进环境变量（上面那两行 `echo ... >> ~/.zprofile` 和 `eval ...`），再 `brew --version` 验证。

## 第二步：装 Python

Mac 可能自带一个 Python，但版本往往偏老，甚至较新的 macOS 根本没预装，建议用 Homebrew 装新的。

先看看有没有：

```bash
python3 --version
```

要是没装，或者版本太老，就用 Homebrew 装：

```bash
brew install python
```

装完验证：

```bash
python3 --version
pip3 --version
```

看到版本号就成功了。顺手升级一下 pip：

```bash
pip3 install --upgrade pip
```

> 提醒：以后都用 `python3` 和 `pip3`，不是 `python` / `pip`。输入 `python` 报找不到命令是正常的，别慌。

## 第三步：装 Git

Mac 可能自带 Git，但版本不一定新：

```bash
brew install git
```

配一下名字和邮箱（提交记录会用到）：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

## 第四步：装 Node.js（可选）

有些 AI 工具带网页界面，需要 Node：

```bash
brew install node
```

## 第五步：建虚拟环境（推荐）

不同项目要的库版本不一样，用虚拟环境隔开，免得互相打架：

```bash
# 建一个
python3 -m venv ~/myenv

# 激活
source ~/myenv/bin/activate

# 退出
deactivate
```

建议每个项目单独建一个环境。激活后命令行前面会出现环境名，这时候装的库只在这套环境里生效。

## 第六步：装常用 Python 库

```bash
pip3 install numpy pandas matplotlib jupyter requests
```

这几个是 AI 开发里出镜率最高的基础库。

环境齐了，后面写代码、跑 notebook 就能直接用了。具体命令怎么记，看最后一篇速查表。
