---
title: Mac 命令速查表：终端、Homebrew、Git 与 Python
description: 一块随时能翻的命令速查表：终端基础命令、Homebrew、Git、Python 虚拟环境。配环境、跑项目时存个书签，省得每次现查。
pubDate: 2026-08-10
theme: Mac 新手笔记
tags: ["Mac", "命令", "速查表"]
series: Mac 新手笔记
order: 7
---

这页是命令速查，配环境、跑项目时翻一下就行。前面几篇讲过的，这里只列最常用的一行命令。

## 终端命令

| 命令 | 作用 |
| :--- | :--- |
| `ls` | 列出当前目录文件 |
| `ls -la` | 列出全部文件（含隐藏） |
| `cd 文件夹名` | 进入文件夹 |
| `cd ..` | 返回上一级 |
| `cd ~` | 回到用户目录 |
| `pwd` | 显示当前路径 |
| `mkdir 文件夹名` | 新建文件夹 |
| `touch 文件名` | 新建空文件 |
| `rm 文件名` | 删除文件 |
| `rm -rf 文件夹名` | 删除文件夹（慎用） |
| `cp 源 目标` | 复制文件 |
| `mv 源 目标` | 移动 / 重命名 |
| `cat 文件名` | 查看文件内容 |
| `clear` | 清屏 |

## Homebrew 命令

| 命令 | 作用 |
| :--- | :--- |
| `brew install 软件名` | 安装 |
| `brew uninstall 软件名` | 卸载 |
| `brew update` | 更新 Homebrew 本身 |
| `brew upgrade` | 升级所有已装软件 |
| `brew list` | 列出已装软件 |
| `brew search 关键词` | 搜索 |
| `brew doctor` | 检查健康状态 |

## Git 命令

| 命令 | 作用 |
| :--- | :--- |
| `git init` | 初始化仓库 |
| `git clone 地址` | 克隆远程仓库 |
| `git status` | 查看文件状态 |
| `git add .` | 添加所有变更 |
| `git commit -m "描述"` | 提交 |
| `git push` | 推送到远程 |
| `git pull` | 拉取远程更新 |
| `git log` | 查看提交历史 |
| `git branch` | 查看分支 |

## Python 虚拟环境

| 命令 | 作用 |
| :--- | :--- |
| `python3 -m venv 环境名` | 创建虚拟环境 |
| `source 环境名/bin/activate` | 激活 |
| `deactivate` | 退出 |
| `pip3 install 库名` | 装库 |
| `pip3 list` | 列出已装库 |
