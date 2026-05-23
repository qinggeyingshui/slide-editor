"""
generate_image.py - Slide Editor 生图工具
调用 gpt-image-2 生成图片，保存到 public/images/ 供幻灯片引用。

用法:
    python scripts/generate_image.py "紫色霓虹灯下的R&B歌手" --output singer.png
    python scripts/generate_image.py "抽象音乐波形" --size 1920x1080

在 GA 中调用:
    from subprocess import run
    run(["python", "scripts/generate_image.py", "prompt", "--output", "bg.png"])

或直接 import:
    from scripts.generate_image import generate
    path = generate("prompt", "output_name.png")
"""

import httpx
import base64
import argparse
import sys
from pathlib import Path

API_URL = "https://api2.tabcode.cc/openai/draw/v1/images/generations"
API_KEY = ""  # 请配置你的 API 密钥，或设置环境变量 OPENAI_IMAGE_API_KEY
MODEL = "gpt-image-2"

IMAGES_DIR = Path(__file__).parent.parent / "public" / "images"


def generate(prompt: str, filename: str = None, size: str = "1024x1024") -> str:
    """
    生成图片并保存到 public/images/
    
    Args:
        prompt: 图片描述
        filename: 文件名(不含路径)，默认自动生成
        size: 尺寸，如 1024x1024、1536x1024、1024x1536、1920x1080 等
    
    Returns: 相对路径 /images/xxx.png (可直接用于 <img src>)
    """
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    import os
    key = API_KEY or os.environ.get("OPENAI_IMAGE_API_KEY", "")
    if not key:
        raise ValueError("请配置 API_KEY：编辑脚本顶部 API_KEY 或设置环境变量 OPENAI_IMAGE_API_KEY")
    
    if not filename:
        safe = "".join(c if c.isalnum() else "_" for c in prompt[:30])
        filename = f"ai_{safe}.png"
    
    with httpx.Client(timeout=120) as client:
        resp = client.post(
            API_URL,
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json={"model": MODEL, "prompt": prompt, "size": size}
        )
        resp.raise_for_status()
        data = resp.json()["data"][0]
    
    out = IMAGES_DIR / filename
    if "b64_json" in data and data["b64_json"]:
        out.write_bytes(base64.b64decode(data["b64_json"]))
    elif "url" in data and data["url"]:
        with httpx.Client(timeout=60) as client:
            r = client.get(data["url"])
            r.raise_for_status()
            out.write_bytes(r.content)
    
    rel_path = f"/images/{filename}"
    print(f"[生图完成] {rel_path} ({out.stat().st_size // 1024}KB)")
    return rel_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="GPT-Image-2 生图工具")
    parser.add_argument("prompt", help="图片描述")
    parser.add_argument("--output", "-o", help="输出文件名", default=None)
    parser.add_argument("--size", "-s", help="尺寸(如 1024x1024)", default="1024x1024")
    args = parser.parse_args()
    
    path = generate(args.prompt, args.output, args.size)
    print(f"可在幻灯片中使用: <img src=\"{path}\" />")
