# Jeopardy! Home Game

A fullscreen Jeopardy! game you can run on any Windows computer. Load your own custom game files, set up players, and play — just like the TV show.

---

## Quick Start (for players)

You only need two things:

1. **`Jeopardy.exe`** — the game launcher
2. **A `.yaml` game file** — contains your categories, clues, and answers

### Steps

1. Put `Jeopardy.exe` and your `.yaml` game file in the **same folder**
2. Double-click `Jeopardy.exe`
3. Pick your game file from the dropdown
4. Click **LAUNCH**
5. A fullscreen browser window opens — enter player names and start playing

### During the Game

- Click a dollar amount to reveal a clue
- Use the **✓** and **✗** buttons to mark correct/wrong answers
- Click **SKIP** if nobody answers
- **Ctrl+Z** to undo the last action (misclick protection)
- **F11** to exit fullscreen
- Close the browser tab when done — the launcher stays open to start another game

### Requirements

- **Windows 10 or later**
- **Firefox** is recommended — the game opens in Firefox if it's installed, otherwise it uses your default browser

---

## Creating Game Files

Game files are plain text files ending in `.yaml`. You can edit them in Notepad or any text editor.

Here's a minimal example:

```yaml
rounds:
  - categories:
      - name: "World Capitals"
        clues:
          - prompt: "The capital city of France"
          - prompt: "The capital city of Japan"
          - prompt: "This Canadian capital sits on the Ontario-Quebec border"
          - prompt: "The capital of Brazil, built from scratch in the 1950s"
          - prompt: "Though Sydney is the largest city, this is Australia's capital"

      - name: "Science"
        clues:
          - prompt: "The chemical symbol for gold"
          - prompt: "The powerhouse of the cell"
          - prompt: "This scientist developed the theory of general relativity"
          - prompt: "The atomic number of carbon"
            daily_double: true
          - prompt: "The name for the study of heredity and genes"

final_jeopardy:
  category: "American Literature"
  prompt: "This 1851 novel begins with the line 'Call me Ishmael'"
```

### Rules

- Each round has **categories**, each category has **clues**
- Every category in a round must have the **same number of clues** (5 is standard)
- Add `daily_double: true` under any clue to make it a Daily Double
- You can have **multiple rounds** — Round 1 values are $200–$1000, Round 2 is $400–$2000, etc.
- `final_jeopardy` is optional — if included, it plays after all rounds finish
- See `example_game.yaml` for a full two-round game with Final Jeopardy

---

## Building From Source

Only needed if you want to modify the game or rebuild the exe yourself.

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

### Dev Mode

Run the game directly in a browser with hot reload (no exe needed):

```bash
cross-env GAME_FILE=example_game.yaml npm run dev
```
