#!/usr/bin/env python3
"""验证 marketplace 镜像可运行且真的带上前端页面。

判据（任一不满足即失败）：
  1. 容器以非 root 运行
  2. /health 返回 200
  3. /marketplace 返回 200，且字节数与 marketplace.html 完全一致
     —— 这一条才能证明 COPY 对了文件，镜像"能起"不等于"页面在"
"""
import argparse
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
HTML = HERE / "marketplace.html"


def sh(*args, check=True):
    r = subprocess.run(args, capture_output=True, text=True, timeout=180)
    if check and r.returncode != 0:
        raise RuntimeError(f"{' '.join(args)} -> {r.returncode}: {r.stderr.strip()[:300]}")
    return r.stdout.strip()


def get(url, timeout=5):
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        with opener.open(url, timeout=timeout) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, b""
    except Exception:
        return None, b""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", default="yzt-marketplace:verify")
    ap.add_argument("--port", type=int, default=8098)
    ap.add_argument("--timeout", type=int, default=45)
    a = ap.parse_args()

    name = f"yzt-marketplace-verify-{a.port}"
    if not HTML.exists():
        print(f"FAIL marketplace.html 不存在: {HTML}")
        return 1
    expected = HTML.stat().st_size
    failures = []

    sh("docker", "rm", "-f", name, check=False)
    try:
        sh("docker", "run", "-d", "--name", name,
           "--cpus=1", "--memory=512m",
           # 固定测试值，不是真密钥；分支代码缺 JWT_SECRET 会拒绝启动
           "-e", "JWT_SECRET=verify-only-not-a-real-secret-0123456789abcdef",
           "-e", "INTERNAL_TOKEN=verify-only-internal-token",
           "-p", f"127.0.0.1:{a.port}:8010", a.image)
        print(f"PASS 容器启动  {a.image} -> 127.0.0.1:{a.port}")

        uid = sh("docker", "exec", name, "id", "-u", check=False)
        if uid and uid != "0":
            print(f"PASS 非 root 运行  uid={uid}")
        else:
            failures.append(f"容器以 root 运行 (uid={uid or '未知'})")
            print(f"FAIL 非 root 运行  uid={uid or '未知'}")

        base = f"http://127.0.0.1:{a.port}"
        deadline = time.time() + a.timeout
        status = None
        while time.time() < deadline:
            status, _ = get(f"{base}/health")
            if status == 200:
                break
            time.sleep(1)
        if status == 200:
            print("PASS /health  200")
        else:
            failures.append(f"/health 未就绪 (last={status})")
            print(f"FAIL /health  {status}")

        status, body = get(f"{base}/marketplace", timeout=15)
        if status == 200 and len(body) == expected:
            print(f"PASS /marketplace  200  {len(body)} 字节 = marketplace.html")
        elif status == 200:
            failures.append(f"/marketplace 字节数不符: {len(body)} != {expected}")
            print(f"FAIL /marketplace  200 但 {len(body)} 字节 != {expected}")
        else:
            failures.append(f"/marketplace 状态 {status}")
            print(f"FAIL /marketplace  {status}")

        if b"<html" not in body[:2048].lower():
            failures.append("/marketplace 返回的不是 HTML")
            print("FAIL /marketplace 内容不是 HTML")
    except Exception as e:
        failures.append(str(e))
        print(f"FAIL 执行异常: {e}")
    finally:
        sh("docker", "rm", "-f", name, check=False)

    print()
    if failures:
        print(f"{len(failures)} 项失败")
        return 1
    print("4/4 通过")
    return 0


if __name__ == "__main__":
    sys.exit(main())
