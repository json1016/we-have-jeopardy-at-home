# Jeopardy! Home Game

A fullscreen Jeopardy! game for Windows. No install needed — just download, double-click, and play.

---

## How to Play (3 steps)

### Step 1: Download the game

- [**Download Jeopardy.exe**](https://github.com/json1016/we-have-jeopardy-at-home/releases/latest/download/Jeopardy.exe) — this is the game itself
- [**Download example_game.yaml**](https://github.com/json1016/we-have-jeopardy-at-home/releases/latest/download/example_game.yaml) — this is a sample game with categories and clues

> **Important:** Put both files in the **same folder** (e.g., your Desktop).

### Step 2: Launch

1. Double-click **Jeopardy.exe**
2. A small window pops up — your game file should appear in the dropdown
3. Click **LAUNCH**

### Step 3: Play

1. Enter player names and click **START GAME**
2. Click a dollar amount to reveal a clue — read it out loud
3. When someone answers, click **✓** (correct) or **✗** (wrong) next to their name
4. Click **SKIP** if nobody gets it
5. Keep going until the board is cleared

That's it. You're playing Jeopardy.

### Helpful Shortcuts

| Key | What it does |
|-----|-------------|
| **Ctrl+Z** | Undo the last action (misclick protection) |
| **F11** | Exit fullscreen |

### Requirements

- **Windows 10 or later**
- **Firefox** (recommended) — the game will use Firefox if installed, otherwise your default browser

---

## Making Your Own Game Files

Want to write your own categories? Game files are plain text files ending in `.yaml`. Open one in **Notepad** and follow this format:

```yaml
rounds:
  - categories:
      - name: "Category Name"
        clues:
          - prompt: "This is the clue players will see"
          - prompt: "Another clue"
          - prompt: "A third clue"
          - prompt: "A fourth clue"
          - prompt: "A fifth clue"

      - name: "Another Category"
        clues:
          - prompt: "First clue"
          - prompt: "Second clue"
          - prompt: "Third clue"
          - prompt: "Fourth clue — this one is a Daily Double"
            daily_double: true
          - prompt: "Fifth clue"

final_jeopardy:
  category: "Final Category"
  prompt: "The final clue"
```

### Tips

- Every category needs the **same number of clues** (5 is standard, like the show)
- Add `daily_double: true` under any clue to make it a Daily Double
- You can add a **second round** by adding another block under `rounds:` (values double automatically)
- `final_jeopardy` is optional
- **Spacing matters** — use spaces, not tabs, and keep the indentation consistent
- Look at `example_game.yaml` for a complete working example

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Windows says "Windows protected your PC" | Click **More info** → **Run anyway** (this is normal for unsigned .exe files) |
| No game files show up in the launcher | Make sure the `.yaml` file is in the **same folder** as `Jeopardy.exe` |
| The game doesn't open | Make sure you have a web browser installed (Firefox recommended) |
| The text looks wrong | Make sure you're using a modern browser — Firefox or Chrome work best |

---

## Building From Source

Only needed if you want to modify the game or rebuild the exe.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)

### Build

```bash
npm install
pip install pyyaml pyinstaller
npx vite build
python -m PyInstaller --onefile --windowed --name Jeopardy --add-data "dist;dist" --hidden-import yaml launcher.py
```

The exe appears in `output/`.

### Dev Mode (no exe needed)

```bash
cross-env GAME_FILE=example_game.yaml npm run dev
```
