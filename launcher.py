import json
import os
import socket
import subprocess
import sys
import threading
import tkinter as tk
from functools import partial
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

import yaml

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

def get_base_dir():
    """Directory where the exe (or script) lives."""
    if getattr(sys, 'frozen', False):
        return Path(sys.executable).parent
    return Path(__file__).parent


def get_dist_dir():
    """Pre-built web assets."""
    if getattr(sys, 'frozen', False):
        return Path(sys._MEIPASS) / 'dist'
    return Path(__file__).parent / 'dist'


def find_firefox():
    """Return path to firefox.exe or None."""
    candidates = [
        os.path.expandvars(r'%ProgramFiles%\Mozilla Firefox\firefox.exe'),
        os.path.expandvars(r'%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe'),
        os.path.expandvars(r'%LocalAppData%\Mozilla Firefox\firefox.exe'),
    ]
    for path in candidates:
        if os.path.isfile(path):
            return path
    return None


def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

# ---------------------------------------------------------------------------
# HTTP Server
# ---------------------------------------------------------------------------

class GameHandler(SimpleHTTPRequestHandler):
    """Serves the built dist/ folder and a /api/config endpoint."""

    game_config = None

    def do_GET(self):
        if self.path == '/api/config':
            body = json.dumps(self.game_config).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', len(body))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def log_message(self, format, *args):
        pass  # silence logs


def start_server(dist_dir, config, port):
    GameHandler.game_config = config
    handler = partial(GameHandler, directory=str(dist_dir))
    server = HTTPServer(('127.0.0.1', port), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server

# ---------------------------------------------------------------------------
# Tkinter GUI
# ---------------------------------------------------------------------------

BG = '#020220'
PANEL = '#060644'
TILE = '#1515A0'
GOLD = '#FFCC00'
WHITE = '#FFFFFF'
MUTED = '#8888AA'
FONT = 'Segoe UI'


def build_gui():
    base_dir = get_base_dir()
    dist_dir = get_dist_dir()
    yaml_files = sorted(base_dir.glob('*.yaml')) + sorted(base_dir.glob('*.yml'))

    root = tk.Tk()
    root.title('Jeopardy!')
    root.configure(bg=BG)
    root.resizable(False, False)

    w, h = 480, 500
    sx = root.winfo_screenwidth() // 2 - w // 2
    sy = root.winfo_screenheight() // 2 - h // 2
    root.geometry(f'{w}x{h}+{sx}+{sy}')

    # Logo
    logo_path = dist_dir / 'jeopardy-logo.png'
    if logo_path.is_file():
        logo_img = tk.PhotoImage(file=str(logo_path))
        # Scale down — PhotoImage only supports integer subsample
        scale = max(1, logo_img.width() // 300)
        logo_img = logo_img.subsample(scale, scale)
        logo_label = tk.Label(root, image=logo_img, bg=BG, bd=0)
        logo_label.image = logo_img
        logo_label.pack(pady=(40, 30))
    else:
        tk.Label(
            root, text='JEOPARDY!', font=(FONT, 42, 'bold'),
            fg=GOLD, bg=BG,
        ).pack(pady=(40, 30))

    # Main card
    card = tk.Frame(root, bg=PANEL, bd=0)
    card.pack(padx=50, fill='x')

    # Thin gold accent line at top of card
    tk.Frame(card, bg=GOLD, height=2).pack(fill='x')

    inner = tk.Frame(card, bg=PANEL)
    inner.pack(fill='x', padx=24, pady=20)

    tk.Label(
        inner, text='GAME FILE', font=(FONT, 10, 'bold'),
        fg=MUTED, bg=PANEL, anchor='w',
    ).pack(fill='x', pady=(0, 6))

    selected_file = tk.StringVar()
    if yaml_files:
        selected_file.set(yaml_files[0].name)

    file_choices = [f.name for f in yaml_files] if yaml_files else ['No .yaml files found']
    dropdown = tk.OptionMenu(inner, selected_file, *file_choices)
    dropdown.config(
        font=(FONT, 14), bg=BG, fg=WHITE, activebackground=TILE,
        activeforeground=WHITE, highlightthickness=1, highlightbackground=TILE,
        bd=0, relief='flat', anchor='w', padx=12,
    )
    dropdown['menu'].config(
        font=(FONT, 13), bg=BG, fg=WHITE,
        activebackground=GOLD, activeforeground=BG, bd=0,
    )
    dropdown.pack(fill='x')

    def on_browse():
        from tkinter import filedialog
        path = filedialog.askopenfilename(
            title='Select a game YAML file',
            filetypes=[('YAML files', '*.yaml *.yml')],
            initialdir=str(base_dir),
        )
        if path:
            p = Path(path)
            menu = dropdown['menu']
            try:
                existing = [menu.entrycget(i, 'label') for i in range(menu.index('end') + 1)]
            except Exception:
                existing = []
            if p.name not in existing:
                menu.add_command(label=p.name, command=tk._setit(selected_file, p.name))
                yaml_files.append(p)
            selected_file.set(p.name)

    tk.Button(
        inner, text='Browse for file...', font=(FONT, 9),
        fg=MUTED, bg=PANEL, activebackground=PANEL, activeforeground=GOLD,
        bd=0, cursor='hand2', anchor='w', padx=0,
        command=on_browse,
    ).pack(anchor='w', pady=(6, 0))

    status_var = tk.StringVar(value='')
    tk.Label(
        root, textvariable=status_var, font=(FONT, 10),
        fg=GOLD, bg=BG,
    ).pack(pady=(12, 0))

    def on_launch():
        filename = selected_file.get()
        if not filename or filename.startswith('No '):
            status_var.set('No game file selected.')
            return

        filepath = base_dir / filename
        if not filepath.is_file():
            for yf in yaml_files:
                if yf.name == filename:
                    filepath = yf
                    break
            if not filepath.is_file():
                status_var.set(f'File not found: {filename}')
                return

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
        except Exception as e:
            status_var.set(f'Error reading YAML: {e}')
            return

        if not (dist_dir / 'index.html').is_file():
            status_var.set('Built game files not found.')
            return

        port = find_free_port()
        start_server(dist_dir, config, port)
        url = f'http://127.0.0.1:{port}'

        firefox = find_firefox()
        if firefox:
            subprocess.Popen([firefox, '--new-window', '-fullscreen', url])
        else:
            os.startfile(url)

        status_var.set('Game launched — press F11 to exit fullscreen')

    tk.Button(
        root, text='LAUNCH', font=(FONT, 20, 'bold'),
        fg=BG, bg=GOLD, activebackground='#FFD633', activeforeground=BG,
        bd=0, cursor='hand2', padx=48, pady=12, relief='flat',
        command=on_launch,
    ).pack(pady=(20, 0))

    root.mainloop()


if __name__ == '__main__':
    build_gui()
