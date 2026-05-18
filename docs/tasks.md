# Tasks — Four-Player Tic-Tac-Toe

## Overview

This document tracks every development task for the project, organised by area. Each task maps to one or more requirements in specs.md. Completed tasks are marked with [x]. Potential future enhancements are listed at the end.

---

## 1. Project Setup

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Initialise project with Vite and React 18 | NFR-07 |
| [x] | Configure vite.config.js with correct base path | — |
| [x] | Set up src/ folder structure: hooks/, components/ | NFR-10, NFR-11 |
| [x] | Install and configure Google Fonts: Syne and JetBrains Mono | UI 5.2 |
| [x] | Define all CSS variables in index.css: colours, glows, fonts, spacing | NFR-12 |
| [x] | Create App.jsx as the top-level shell component | NFR-11 |
| [x] | Create main.jsx as the React entry point | — |
| [x] | Write index.html with correct meta tags and font preloads | — |

---

## 2. Infinite Canvas — GameBoard.jsx

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Create GameBoard component backed by a Canvas element | FR-09 |
| [x] | Implement viewport state: offset (x, y) and cell size | FR-07 |
| [x] | Implement pan interaction: mousedown, mousemove, mouseup to update offset | FR-08 |
| [x] | Distinguish pan drag from click — cancel click if mouse moved more than threshold | FR-11 |
| [x] | Implement draw loop: clear canvas and redraw on every state change | FR-09 |
| [x] | Calculate which cells are visible given current offset and canvas dimensions | FR-10 |
| [x] | Render grid lines only for the visible region | FR-12 |
| [x] | Render each placed piece in its player colour at the correct cell | FR-18 |
| [x] | Render player symbols: X drawn with two crossed lines, O as circle, triangle as polygon, circle as filled dot | FR-02, FR-03 |
| [x] | Apply glow effect to each piece using canvas shadow properties | FR-03 |
| [x] | Highlight the four winning cells with a distinct fill or outline after win detection | FR-22 |
| [x] | Map canvas click pixel coordinates to integer grid coordinates using offset and cell size | FR-11 |
| [x] | Pass click handler from useGameLogic to the canvas onClick | FR-14 |

---

## 3. Game Logic — useGameLogic.js

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Initialise board as an empty Map | Data Model 6.1 |
| [x] | Initialise currentPlayer as 0 | FR-04 |
| [x] | Initialise scores as [0, 0, 0, 0] | FR-40 |
| [x] | Initialise moveCount, winner, winningCells, history, predictions | Data Model 6.2 |
| [x] | Implement placePiece(x, y): reject if cell occupied | FR-15 |
| [x] | Implement placePiece(x, y): reject if game is already won | FR-24 |
| [x] | Implement placePiece(x, y): reject if not the calling player's turn (multiplayer) | FR-16, FR-49 |
| [x] | Append move entry to history after valid placement | FR-35, FR-36 |
| [x] | Advance currentPlayer to (currentPlayer + 1) % 4 after valid placement | FR-17 |
| [x] | Increment moveCount after valid placement | FR-06 |
| [x] | Call win detection after every placement | FR-20 |
| [x] | Trigger win state: set winner, winningCells, increment scores[winner] | FR-25 |
| [x] | Implement newGame(): reset board, moveCount, history, winner, winningCells, currentPlayer to 0 | FR-42 |
| [x] | Implement resetAll(): call newGame() and also reset scores to [0, 0, 0, 0] | FR-43 |
| [x] | Expose all state and actions as a single hook return value | NFR-10 |

---

## 4. Win Detection

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Implement checkWin(board, x, y, player): entry point called after every placement | FR-20 |
| [x] | Define the four direction vectors: [1,0], [0,1], [1,1], [1,-1] | FR-20 |
| [x] | For each direction, count consecutive same-player pieces forward from (x, y) | FR-21 |
| [x] | For each direction, count consecutive same-player pieces backward from (x, y) | FR-21 |
| [x] | If forward + backward + 1 >= 4, a win is detected | FR-19 |
| [x] | Collect the exact four (or more) winning cell coordinates into winningCells | FR-22 |
| [x] | Return the winning cells array if a win is found, or null otherwise | FR-24 |
| [x] | Verify detection handles wins that start before or end after the most recent piece | FR-21 |

---

## 5. Win Prediction

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Implement calculatePredictions(board): called after every placement | FR-26 |
| [x] | Determine the bounding box of all played cells plus a buffer of four cells in each direction | FR-27 |
| [x] | Iterate all cells in the bounding box and generate every window of four in all four directions | FR-27 |
| [x] | For each window, count pieces per player | FR-28 |
| [x] | Mark window as blocked if it contains pieces from more than one player | FR-28 |
| [x] | For unblocked windows, add count-squared to the owning player's raw score | FR-29 |
| [x] | Add win-bonus value to raw score for each player who has won a previous round | FR-30 |
| [x] | If all raw scores are zero, return [25, 25, 25, 25] | FR-32 |
| [x] | Normalise raw scores: divide each by total and multiply by 100, round to one decimal | FR-31 |
| [x] | Ensure normalised values sum to exactly 100 by adjusting the largest value for rounding error | FR-31 |
| [x] | Store result in predictions array in game state | FR-33 |

---

## 6. UI Components

### 6.1 TurnHUD.jsx

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Display current player symbol and colour in the top-centre of the screen | FR-05 |
| [x] | Display current move number | FR-06 |
| [x] | Float above the canvas using absolute positioning | UI 5.1 |
| [x] | Apply glassmorphic panel style consistent with the overall theme | UI 5.2 |
| [x] | Update immediately whenever currentPlayer or moveCount changes | FR-05 |

### 6.2 PlayerPanel.jsx

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Display each player's symbol, colour, and name | FR-03 |
| [x] | Display each player's current win count | FR-40 |
| [x] | Display each player's win-prediction percentage as a labelled progress bar | FR-33 |
| [x] | Animate prediction bar width changes smoothly using CSS transitions | FR-34 |
| [x] | Highlight the active player's panel to indicate it is their turn | FR-05 |
| [x] | Display the scrollable move history log below the player cards | FR-37 |
| [x] | Auto-scroll the log to the bottom after each new entry is appended | FR-38 |
| [x] | Include New Game and Reset All buttons with correct handlers | FR-42, FR-43 |

### 6.3 WinOverlay.jsx

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Display a full-screen overlay when winner is not null | FR-23 |
| [x] | Show the winning player's symbol, colour, and name | FR-23 |
| [x] | Include a New Game button inside the overlay | FR-42 |
| [x] | Animate the overlay in with a fade or scale transition | UI 5.2 |
| [x] | Block all canvas interaction while the overlay is visible | FR-24 |

---

## 7. Multiplayer — Room System

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Add a start screen with Create Room and Join Room options | FR-44, FR-46 |
| [x] | Implement room code generation: short alphanumeric string | FR-45 |
| [x] | Display the room code prominently for sharing | FR-51 |
| [x] | Implement Join Room input field: accept a code and connect to the matching session | FR-46 |
| [x] | Assign player index to each tab as it joins (host = 0, second = 1, etc.) | FR-47 |
| [x] | Broadcast each move to all tabs in the room after it is validated | FR-48 |
| [x] | Apply incoming moves from other tabs to the local board state | FR-48 |
| [x] | Reject placement if the acting tab's player index does not match currentPlayer | FR-49 |
| [x] | Detect tab closure and advance turn past the disconnected player index | FR-50 |
| [x] | Notify remaining players when a participant disconnects | FR-50 |

---

## 8. Visual Polish

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Apply glassmorphic card style to all panels: semi-transparent background, backdrop blur, border | UI 5.2 |
| [x] | Add glow shadows to placed pieces on the canvas using player colours | FR-03 |
| [x] | Add hover state to canvas cells: highlight cell under cursor when it is the player's turn | NFR-06 |
| [x] | Add cursor: pointer when hovering an empty cell, cursor: default otherwise | NFR-06 |
| [x] | Add CSS transition to prediction percentage bars | FR-34 |
| [x] | Add fade-in animation to WinOverlay | UI 5.2 |
| [x] | Verify all four player colours are visually distinct at all opacity levels | FR-03 |
| [x] | Verify font rendering is consistent across Chrome, Firefox, Edge, and Safari | NFR-07 |

---

## 9. Testing and QA

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Test horizontal win detection with pieces at left edge, right edge, and middle of a line | FR-20 |
| [x] | Test vertical win detection in equivalent positions | FR-20 |
| [x] | Test both diagonal directions | FR-20 |
| [x] | Test that a blocked window (two players' pieces) is not scored | FR-28 |
| [x] | Test that prediction percentages always sum to 100 | FR-31 |
| [x] | Test that New Game preserves scores but clears the board | FR-42 |
| [x] | Test that Reset All clears both board and scores | FR-43 |
| [x] | Test multiplayer turn enforcement: confirm second player cannot move on Player 1's turn | FR-49 |
| [x] | Test that the win overlay appears immediately after a winning move | FR-23 |
| [x] | Test panning does not register as a piece placement | FR-08, FR-11 |

---

## 10. Build and Deployment

| Status | Task | Spec Reference |
|---|---|---|
| [x] | Verify production build runs correctly with npm run build | — |
| [x] | Confirm dist/ output contains all assets | — |
| [x] | Test production build locally before deployment | — |

---

## 11. Potential Future Tasks

| Priority | Task | Notes |
|---|---|---|
| High | Cross-device multiplayer via WebSocket server | Would require a backend; currently limited to same-browser tabs |
| High | Mobile touch and pinch-to-zoom support | Canvas pan and tap interactions need touch event handlers |
| Medium | AI opponent with selectable difficulty | Minimax or MCTS with depth limits per difficulty level |
| Medium | Configurable win condition | Allow players to choose 3, 4, or 5 in a row before starting |
| Low | Replay mode | Step through the move history to review the game |
| Low | Persistent scores across sessions | Store scoreboard in localStorage or IndexedDB |
| Low | Custom player names | Allow each player to enter a name before the game starts |
| Low | Sound effects | Audio feedback for piece placement, wins, and turn changes |
