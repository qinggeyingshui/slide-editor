"""
Slide Editor CLI - 统一入口
Usage: python cli.py <command> [args]
"""
import sys, json, re, os, subprocess, time, signal
from pathlib import Path

PROJ = Path(__file__).parent
DATA_FILE = PROJ / 'src/model/presentationData.js'

def read_slides():
    text = DATA_FILE.read_text(encoding='utf-8')
    m = re.search(r'export const slides\s*=\s*(\[[\s\S]*\]);?\s*$', text)
    if not m: return []
    return json.loads(m.group(1))

def write_slides(slides):
    js = f"export const slides = {json.dumps(slides, ensure_ascii=False, indent=2)};\n"
    DATA_FILE.write_text(js, encoding='utf-8')

def cmd_list():
    slides = read_slides()
    print(f"共 {len(slides)} 页")
    for i, s in enumerate(slides):
        preview = s.get('innerHTML','')[:80].replace('\n',' ')
        print(f"  [{i}] {preview}...")

def cmd_add(html, position=None):
    slides = read_slides()
    entry = {"innerHTML": html}
    if position is not None:
        slides.insert(int(position), entry)
    else:
        slides.append(entry)
    write_slides(slides)
    print(f"已添加 slide，当前共 {len(slides)} 页")

def cmd_edit(index, html):
    slides = read_slides()
    idx = int(index)
    if idx >= len(slides): print(f"错误：索引 {idx} 超出范围"); return
    slides[idx]["innerHTML"] = html
    write_slides(slides)
    print(f"已更新 slide [{idx}]")

def cmd_delete(index):
    slides = read_slides()
    idx = int(index)
    if idx >= len(slides): print(f"错误：索引 {idx} 超出范围"); return
    slides.pop(idx)
    write_slides(slides)
    print(f"已删除 slide [{idx}]，剩余 {len(slides)} 页")

def cmd_export_json(output="slides.json"):
    slides = read_slides()
    Path(output).write_text(json.dumps(slides, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"已导出 → {output}")

def cmd_import_json(path):
    data = json.loads(Path(path).read_text(encoding='utf-8'))
    if isinstance(data, list):
        write_slides(data)
        print(f"已导入 {len(data)} 页")

def cmd_start(port=3001):
    """启动 vite dev server（后台）"""
    proc = subprocess.Popen(
        ['npx', 'vite', '--port', str(port)],
        cwd=str(PROJ), shell=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    # 等待服务就绪
    for _ in range(30):
        time.sleep(1)
        try:
            import urllib.request
            urllib.request.urlopen(f'http://localhost:{port}').read()
            print(f"服务已启动: http://localhost:{port} (PID: {proc.pid})")
            return proc
        except: pass
    print("启动超时，请手动检查")
    return proc

def cmd_export_pptx(output="exported.pptx", port=3001):
    """导出PPTX：自动检测服务→截图→组装"""
    # 检测服务是否运行
    running = False
    try:
        import urllib.request
        urllib.request.urlopen(f'http://localhost:{port}').read()
        running = True
    except: pass

    proc = None
    if not running:
        print("服务未启动，自动启动中...")
        proc = cmd_start(port)

    script = str(PROJ / 'scripts/export_pptx.py')
    subprocess.run([sys.executable, script, '--url', f'http://localhost:{port}', '-o', output])

    if proc:
        proc.terminate()
        print("服务已关闭")

def cmd_import_pptx(path):
    """导入PPTX模板"""
    path = str(Path(path).resolve())
    script = str(PROJ / 'scripts/pptx2slides.py')
    r = subprocess.run([sys.executable, script, path], cwd=str(PROJ))
    if r.returncode == 0:
        print("PPTX 导入完成，数据已写入 presentationData.js")
    else:
        print("导入失败，请检查环境（需要 Node.js，Windows 下需要 PowerPoint）")

COMMANDS = {
    'list': lambda args: cmd_list(),
    'add': lambda args: cmd_add(args[0], args[1] if len(args)>1 else None),
    'edit': lambda args: cmd_edit(args[0], args[1]),
    'delete': lambda args: cmd_delete(args[0]),
    'export-json': lambda args: cmd_export_json(args[0] if args else 'slides.json'),
    'import-json': lambda args: cmd_import_json(args[0]),
    'export-pptx': lambda args: cmd_export_pptx(args[0] if args else 'exported.pptx'),
    'import-pptx': lambda args: cmd_import_pptx(args[0]),
    'start': lambda args: cmd_start(int(args[0]) if args else 3001),
}

if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        print("Usage: python cli.py <command> [args]")
        print("Commands:", ', '.join(COMMANDS.keys()))
        sys.exit(1)
    COMMANDS[sys.argv[1]](sys.argv[2:])
