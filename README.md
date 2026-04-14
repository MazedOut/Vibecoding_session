# 4-Player Tic-Tac-Toe 🎮

A turn-based, infinite-canvas multiplayer Tic-Tac-Toe for **4 players** with automatic win detection and live win-prediction percentages.

![Game Screenshot](./screenshot.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| **4 Players** | X · O · ▽ · ● — each with a distinct color and glow effect |
| **Infinite Canvas** | Pan freely in any direction — the board never ends |
| **Turn-Based** | Players alternate turns in order |
| **Auto Win Detection** | 4 in a row (any direction) wins — highlighted instantly |
| **Win Prediction** | Live percentage bar shows each player's probability of winning |
| **Move History Log** | Scrollable log of every move with coordinates |
| **Ranking / Scoreboard** | Persistent win scores across multiple games |
| **Teal / Purple UI** | Glassmorphic dark theme with glowing pieces |

---

## 🚀 Local Setup

### Prerequisites

- **Node.js** v18 or later → [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Steps

```bash
# 1. Clone or extract the project
git clone https://github.com/YOUR_USERNAME/four-player-ttt.git
# — OR — unzip the downloaded zip

# 2. Enter the project folder
cd four-player-ttt

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The game will be available at **http://localhost:5173**

---

## 🎮 How to Play

| Action | Description |
|---|---|
| **Click** a cell | Place your piece |
| **Drag** the board | Pan around the infinite canvas |
| **4 in a row** | Win! (horizontal, vertical, or diagonal) |
| **New Game** | Start a fresh board (keeps scores) |
| **Reset All** | Clear board + scores |

The **top-center HUD** always shows whose turn it is and the move number.  
The **right panel** shows per-player win-prediction percentages, scores, and move history.

---

## 🏗️ Project Structure

```
four-player-ttt/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite config
└── src/
    ├── main.jsx            # React root
    ├── App.jsx             # App shell
    ├── index.css           # Global styles + CSS variables
    ├── hooks/
    │   └── useGameLogic.js # Game state, win detection, predictions
    └── components/
        ├── GameBoard.jsx   # Infinite canvas board
        ├── PlayerPanel.jsx # Scores, predictions, history sidebar
        ├── TurnHUD.jsx     # Turn indicator (top center)
        └── WinOverlay.jsx  # Victory screen
```

---

## 🔬 Win Prediction Algorithm

The win-prediction heuristic works by:

1. Scanning every window of 4 consecutive cells in all 4 directions across played cells
2. For each window that belongs to **only one player** (not blocked), adding `count²` to that player's score
3. Adding a bonus for existing game wins
4. Normalizing all four scores to sum to 100%

This means a player with 3-in-a-row scores `3² = 9` per open line, while 2-in-a-row only scores `4`, reflecting how close each player actually is to winning.

---

## 🛠️ Build for Production

```bash
npm run build
```

Output goes to `dist/` — deploy this to GitHub Pages, Netlify, Vercel, etc.

### Deploy to GitHub Pages

```bash
# Install gh-pages helper
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "vite build && gh-pages -d dist"

npm run deploy
```

---

## 📦 Tech Stack

- **React 18** — UI components
- **Vite 5** — Dev server & bundler
- **Canvas API** — Grid rendering
- **CSS Variables** — Theming system
- **Google Fonts** — Syne + JetBrains Mono

---

## 📝 License

MIT — free to use, modify, and share.
