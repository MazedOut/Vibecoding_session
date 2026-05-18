# Project Plan — Four-Player Tic-Tac-Toe

## 1. Project Overview

This project is a browser-based, turn-based strategy game for up to four players built on an infinite, pannable canvas. It extends the classic Tic-Tac-Toe concept by increasing the player count to four, removing the fixed 3x3 grid constraint, and requiring four consecutive pieces in a row to win rather than three. Players can compete locally on a single machine or online through a room-based multiplayer system that synchronises game state across separate browser tabs in real time.

The primary goal is to deliver a polished, production-quality game with a strong visual identity, correct game logic, and a meaningful data display layer — win prediction, move history, and a scoreboard — that adds strategic depth beyond simple piece placement.

---

## 2. Objectives

### Primary Objectives

- Implement a complete, bug-free turn-based game loop for four players
- Render an infinite, pannable board using the Canvas API with smooth performance
- Detect wins in all four directions (horizontal, vertical, and both diagonals) instantly after each move
- Display live win-prediction percentages that update after every move using a heuristic scoring algorithm
- Persist scores across multiple rounds within the same session

### Secondary Objectives

- Build a room-based multiplayer system where players can create or join sessions from separate browser tabs
- Enforce turn order in multiplayer so no player can act out of sequence
- Log all moves with grid coordinates in a scrollable history panel
- Deliver a cohesive dark glassmorphic UI with clear player differentiation via colour and symbol

---

## 3. Scope

### In Scope

- Single-page React application running entirely in the browser
- Four-player local play on one machine
- Room-based multiplayer across separate browser tabs on the same machine
- Infinite canvas with free panning in all directions
- Win detection for four-in-a-row in all directions
- Win-prediction heuristic updated live after every move
- Move history log for the current round
- Persistent scoreboard across rounds until Reset All is triggered
- Win overlay and New Game / Reset All controls
- Glassmorphic dark theme with teal and purple accents

### Out of Scope

- Cross-device multiplayer over a network or the internet
- Persistent user accounts or login
- AI opponents
- Mobile or touch screen support
- Save and resume across browser sessions
- Configurable win conditions such as 3-in-a-row or 5-in-a-row modes

---

## 4. Milestones

| # | Milestone | Description | Status |
|---|---|---|---|
| 1 | Project scaffolding | Vite and React 18 setup, folder structure, CSS variables, fonts | Done |
| 2 | Infinite canvas | Canvas rendering, viewport math, pan interaction, cell coordinate mapping | Done |
| 3 | Core game logic | Turn management, piece placement, state in useGameLogic hook | Done |
| 4 | Win detection | Four-in-a-row check in all directions, winning cells highlighted | Done |
| 5 | Win prediction | Heuristic algorithm, score normalisation, live percentage bars | Done |
| 6 | Move history and scoreboard | Scrollable log, persistent scores, New Game and Reset All | Done |
| 7 | UI components | TurnHUD, PlayerPanel, WinOverlay, button controls | Done |
| 8 | Room-based multiplayer | Room creation, room join, real-time tab sync, turn enforcement | Done |
| 9 | Polish and QA | Animations, glow effects, edge case testing, final visual pass | Done |

---

## 5. Timeline

| Week | Focus | Key Deliverables |
|---|---|---|
| Week 1 | Foundation | Project setup, infinite canvas rendering, basic piece placement |
| Week 2 | Game logic | Turn management, win detection, game state hook |
| Week 3 | Data layer | Win prediction algorithm, move history, scoreboard |
| Week 4 | Multiplayer | Room system, tab synchronisation, turn enforcement |
| Week 5 | UI and polish | All UI components, theme, animations, final QA pass |

---

## 6. Tech Stack

| Technology | Role | Version |
|---|---|---|
| React | UI component architecture and state management | 18 |
| Vite | Development server, hot module replacement, production bundler | 5 |
| Canvas API | Grid and piece rendering on the infinite board | Browser native |
| CSS Variables | Centralised theming — colours, glows, typography | — |
| Google Fonts | Syne for UI headings, JetBrains Mono for coordinates and log | — |

---

## 7. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Canvas performance degrades on very large boards | Medium | Medium | Only render cells visible in the current viewport |
| Win detection misses edge cases at diagonal boundaries | Medium | High | Test all four directions with known winning and non-winning board states |
| Tab sync falls out of sync under rapid inputs | Low | High | Queue moves and broadcast authoritative state to all tabs |
| Prediction percentages mislead on nearly empty boards | Medium | Low | Distribute equally when insufficient data is available |

---

## 8. Success Criteria

- All four players can complete a full round without bugs or incorrect turn ordering
- Win detection correctly identifies all four-in-a-row cases in every direction with no false positives
- Win prediction percentages sum to 100% at all times
- Players in separate tabs see identical board state within one second of any move
- The UI is visually consistent and performs smoothly on a modern desktop browser
