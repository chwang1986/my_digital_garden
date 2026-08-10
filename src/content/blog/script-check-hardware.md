---
title: '用脚本检测 Windows 硬件，挑能跑的本地模型'
description: '不想每次开任务管理器翻数字？一段 Python 脚本把内存、CPU、显卡显存一次性打出来，照着显存挑 Ollama 模型。'
pubDate: '2026-08-10'
heroImage: '../../assets/hero-ollama.png'
theme: 'ollama的使用'
series: 'Ollama 实战'
order: 11
tags: ['Ollama', '本地大模型', 'Windows', '硬件', 'Python']
---

上一篇讲了怎么用任务管理器、dxdiag、PowerShell 看硬件。那套能用，但每次都要手动开、手动读数字，久了嫌烦。我后来写了个 Python 脚本，一条命令把关键指标全打出来，专门盯着本地模型最吃的两样：内存和显卡显存。下面把脚本和用法记下来。

## 脚本：check_hardware.py

存成 `check_hardware.py`，装个依赖就能跑：

```bash
pip install psutil
# 可选，NVIDIA 显存信息更准
pip install pynvml
python check_hardware.py
```

脚本内容：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Windows 服务器硬件信息采集脚本
用于评估本地大模型（Ollama）可运行规模
"""

import platform
import subprocess
import sys

def get_cpu_info():
    info = {
        "processor": platform.processor() or "未知",
        "architecture": platform.machine(),
        "cores_physical": None,
        "cores_logical": None,
    }
    try:
        import psutil
        info["cores_physical"] = psutil.cpu_count(logical=False)
        info["cores_logical"] = psutil.cpu_count(logical=True)
    except ImportError:
        pass
    return info

def get_memory_info():
    try:
        import psutil
        mem = psutil.virtual_memory()
        return {
            "total_gb": round(mem.total / (1024 ** 3), 2),
            "available_gb": round(mem.available / (1024 ** 3), 2),
            "used_percent": mem.percent,
        }
    except ImportError:
        return {"error": "需要安装 psutil: pip install psutil"}

def get_disk_info():
    try:
        import psutil
        disk = psutil.disk_usage("C:\\")
        return {
            "total_gb": round(disk.total / (1024 ** 3), 2),
            "free_gb": round(disk.free / (1024 ** 3), 2),
            "used_percent": disk.percent,
        }
    except Exception:
        return {"error": "无法获取磁盘信息"}

def get_gpu_info():
    """优先使用 nvidia-smi，其次尝试 pynvml"""
    # 方法1：nvidia-smi（最可靠）
    try:
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=name,memory.total,memory.free,driver_version", "--format=csv,noheader,nounits"],
            capture_output=True,
            text=True,
            timeout=10,
            encoding="utf-8",
            errors="ignore"
        )
        if result.returncode == 0 and result.stdout.strip():
            gpus = []
            for line in result.stdout.strip().splitlines():
                parts = [p.strip() for p in line.split(",")]
                if len(parts) >= 4:
                    gpus.append({
                        "name": parts[0],
                        "vram_total_mb": parts[1],
                        "vram_free_mb": parts[2],
                        "driver": parts[3],
                    })
            return {"source": "nvidia-smi", "gpus": gpus}
    except Exception:
        pass

    # 方法2：pynvml
    try:
        import pynvml
        pynvml.nvmlInit()
        count = pynvml.nvmlDeviceGetCount()
        gpus = []
        for i in range(count):
            handle = pynvml.nvmlDeviceGetHandleByIndex(i)
            name = pynvml.nvmlDeviceGetName(handle)
            if isinstance(name, bytes):
                name = name.decode("utf-8")
            mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
            gpus.append({
                "name": name,
                "vram_total_mb": round(mem.total / (1024 ** 2)),
                "vram_free_mb": round(mem.free / (1024 ** 2)),
            })
        pynvml.nvmlShutdown()
        return {"source": "pynvml", "gpus": gpus}
    except Exception:
        pass

    return {"error": "未检测到 NVIDIA GPU 或驱动未安装。若使用 AMD/Intel 显卡，请手动说明。"}

def main():
    print("=" * 60)
    print("Windows 服务器硬件信息采集（用于 Ollama 模型选型）")
    print("=" * 60)

    print("\n【操作系统】")
    print(f"  系统     : {platform.system()} {platform.release()}")
    print(f"  版本     : {platform.version()}")
    print(f"  Python   : {platform.python_version()}")

    print("\n【CPU】")
    cpu = get_cpu_info()
    print(f"  处理器   : {cpu['processor']}")
    print(f"  架构     : {cpu['architecture']}")
    if cpu["cores_physical"]:
        print(f"  物理核心 : {cpu['cores_physical']}")
        print(f"  逻辑核心 : {cpu['cores_logical']}")

    print("\n【内存 (RAM)】")
    mem = get_memory_info()
    if "error" in mem:
        print(f"  {mem['error']}")
    else:
        print(f"  总内存   : {mem['total_gb']} GB")
        print(f"  可用内存 : {mem['available_gb']} GB")
        print(f"  使用率   : {mem['used_percent']}%")

    print("\n【系统盘 (C:)】")
    disk = get_disk_info()
    if "error" in disk:
        print(f"  {disk['error']}")
    else:
        print(f"  总容量   : {disk['total_gb']} GB")
        print(f"  剩余空间 : {disk['free_gb']} GB")
        print(f"  使用率   : {disk['used_percent']}%")

    print("\n【GPU 显存】")
    gpu = get_gpu_info()
    if "error" in gpu:
        print(f"  {gpu['error']}")
    else:
        print(f"  检测来源 : {gpu['source']}")
        for i, g in enumerate(gpu["gpus"]):
            print(f"  GPU {i}:")
            print(f"    名称     : {g['name']}")
            print(f"    总显存   : {g['vram_total_mb']} MB")
            if "driver" in g:
                print(f"    驱动版本 : {g['driver']}")

    print("\n" + "=" * 60)
    print("以上是完整硬件输出，对照显存挑模型就行。")
    print("=" * 60)

if __name__ == "__main__":
    # 检查必要依赖
    missing = []
    try:
        import psutil
    except ImportError:
        missing.append("psutil")

    if missing:
        print("缺少依赖库，请先执行：")
        print(f"  pip install {' '.join(missing)}")
        print("（可选）如需更准确的 GPU 信息，可额外安装：pip install pynvml")
        print()

    main()
```

## 跑完看什么

脚本把系统、CPU、内存、系统盘、GPU 显存分块打印。对选模型真正有用的就两样：

**内存（RAM）**。模型权重先住进内存。内存不够，大模型连加载都加载不进来。大致：8GB 很紧，只能很小的模型；16GB 跑 7B 舒服；32GB 以上能上 14B、34B。如果你没有独显、靠 CPU 跑，内存就是天花板。

**GPU 显存**。显存够不够，基本就决定了本地模型能不能跑得动。有专用显存，模型丢进去跑，比纯 CPU 快得多。脚本优先用 `nvidia-smi` 读，读不到再试 `pynvml`；都没有就直说没检测到 NVIDIA 显卡——那基本得走 CPU 路线。挑模型主要看「总显存」多大：显存越大，能装下的模型越大。

## 照显存选模型

显存决定你能跑多大的模型。在 Ollama 上直接 `ollama pull 模型名` 就能拉到能跑的版本，不用自己挑具体规格。一张表对应一下显存和模型大小（留了点余量给上下文缓存）：

| 专用显存 | 能跑的模型 |
| --- | --- |
| 4GB | 7B 将将能跑 |
| 6–8GB | 7B 流畅，可以试 14B |
| 10–12GB | 14B 比较稳；7B 飞快；32B 太吃力 |
| 16GB | 14B 轻松，34B 能上 |
| 24GB | 34B 很稳 |

## 拿一台 10GB 显存的机器举例

我自己的服务器是一张 RTX 3080（10GB 显存），内存 128GB，16 物理核 / 32 逻辑核。脚本跑出来大致是这样：

```text
【内存 (RAM)】
  总内存   : 128.0 GB
  可用内存 : 107.0 GB
  使用率   : 16.0%

【GPU 显存】
  检测来源 : nvidia-smi
  GPU 0:
    名称     : NVIDIA GeForce RTX 3080
    总显存   : 10240 MB
    驱动版本 : 560.xx
```

内存和 CPU 完全不是瓶颈，真正卡人的是那 10GB 显存。在 Ollama 上直接拉模型名就能跑，我这张卡优先试 **qwen2.5-coder:14b**：比 7B/8B 明显强，工具调用更稳，显存也装得下。拉取：

```bash
ollama pull qwen2.5-coder:14b
```

如果加载后显存还是紧或者慢，就退回 7B/8B。想上 32B 及以上就别勉强了，10GB 容易 OOM 或者慢到没法用。

## 接上 Continue 之类的客户端

局域网里别的机器要用这个模型，把客户端指向 Ollama 的地址就行。Continue 的 `config.yaml` 大概这样（IP 换成你服务器的局域网地址）：

```yaml
models:
  - name: qwen2.5-coder:14b
    provider: ollama
    model: qwen2.5-coder:14b
    apiBase: http://192.168.1.100:11434
    capabilities: ["tool_use"]
    roles:
      - chat
      - edit
      - apply
```

Ollama 那头记得开放 `0.0.0.0:11434` 并把防火墙端口放行，不然局域网连不进来。

## 下一步

硬件看清了、模型也定了个大概，接下来就是去 ollama.com 或 modelscope.cn 把模型弄下来。怎么挑、怎么下，另一篇 [在 ollama.com 和 modelscope.cn 上找模型](/blog/find-models-ollama-modelscope/) 专门写过。
