# 4-Player Tic-Tac-Toe 🎮

A turn-based, infinite-canvas multiplayer Tic-Tac-Toe for **4 players** with automatic win detection and live win-prediction percentages.

---

## ✨ Features

| Feature | Description |
|---|---|
| **4 Players** | X · O · ▽ · ● — each with a distinct color and glow effect |
| **Infinite Canvas** | Pan freely in any direction — the board never ends |
| **Turn-Based** | Players alternate turns in order |
| **Auto Win Detection** | 4 in a row (any direction) wins — highlighted instantly |
| **Win Prediction** | Live percentage bar shows each player's probability of winning |
| **Same-Browser Multiplayer** | Multiple tabs on the same machine via BroadcastChannel API |
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
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/four-player-ttt.git

# 2. Enter the frontend folder
cd four-player-ttt/frontend

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

### Multiplayer (same machine)
1. Open the game in one tab — click **Create Room** to get a room code
2. Open 1–3 more tabs and click **Join Room**, entering the same code
3. Each tab controls one player — take turns clicking cells

The **top-center HUD** always shows whose turn it is and the move number.  
The **right panel** shows per-player win-prediction percentages, scores, and move history.

---

## 🏗️ Project Structure

```
four-player-ttt/
├── docs/                          # Project planning & specs
│   ├── plan.md
│   ├── specs.md
│   └── tasks.md
│
├── frontend/                      # All React/Vite source code
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx               # React root
│       ├── App.jsx                # App shell
│       ├── index.css              # Global styles + CSS variables
│       ├── components/
│       │   ├── GameBoard.jsx      # Infinite canvas board
│       │   ├── PlayerPanel.jsx    # Scores, predictions, history sidebar
│       │   ├── TurnHUD.jsx        # Turn indicator (top center)
│       │   ├── WinOverlay.jsx     # Victory screen
│       │   ├── LobbyScreen.jsx    # Room creation / join UI
│       │   └── MultiplayerLobby.jsx
│       ├── hooks/
│       │   ├── useGameLogic.js    # Win detection, predictions, game state
│       │   └── useMultiplayer.js  # Host/guest state machine
│       └── services/
│           └── roomService.js     # BroadcastChannel transport layer
│
├── backend/
│   └── README.md                  # Sync strategy + future migration path
│
├── .gitignore
└── README.md
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
cd frontend
npm run build
```

Output goes to `frontend/dist/` — deploy this folder to GitHub Pages, Netlify, Vercel, etc.

---

## 📦 Tech Stack

- **React 18** — UI components
- **Vite 5** — Dev server & bundler
- **BroadcastChannel API** — Same-browser tab-to-tab multiplayer
- **Canvas API** — Grid rendering
- **CSS Variables** — Theming system
- **Google Fonts** — Syne + JetBrains Mono

---

## 📝 License

MIT — free to use, modify, and share.