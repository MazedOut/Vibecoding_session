# Specifications — Four-Player Tic-Tac-Toe

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for the Four-Player Tic-Tac-Toe application. It describes what the system must do, how it must behave, and the constraints it must operate within. It serves as the authoritative reference for implementation decisions and acceptance testing.

### 1.2 Intended Audience

- Developer implementing the application
- Reviewer or marker evaluating the project
- Any future contributor extending the codebase

### 1.3 System Summary

The application is a browser-based strategy game that supports four simultaneous players on an infinite grid. Players take turns placing symbols and the first to achieve four consecutive symbols in any direction wins the round. The system includes a live win-prediction engine, a move history log, a persistent scoreboard, and a room-based multiplayer mode for same-browser tab sessions.

---

## 2. Overall Description

### 2.1 Product Perspective

The application is a standalone single-page application (SPA) with no backend server requirement for local play. Multiplayer functionality uses a lightweight in-browser coordination layer to synchronise state across tabs without requiring an external server. All game logic runs client-side.

### 2.2 Assumptions and Dependencies

- Players are using a modern desktop browser (Chrome, Firefox, Edge, or Safari — latest two major versions)
- Node.js v18 or later is available for local development
- No internet connection is required for local play
- Multiplayer is limited to tabs within the same browser instance on the same machine

---

## 3. Functional Requirements

### 3.1 Player System

| ID | Requirement |
|---|---|
| FR-01 | The game supports exactly four players per session |
| FR-02 | Each player is assigned a unique symbol: X, O, triangle, circle |
| FR-03 | Each player symbol has a distinct colour and glow effect for visual differentiation |
| FR-04 | Turn order is fixed and cycles: Player 1, Player 2, Player 3, Player 4, then repeats |
| FR-05 | The current player's identity is always visible in the top-centre HUD |
| FR-06 | The HUD displays the current move number alongside the active player |

### 3.2 Infinite Board

| ID | Requirement |
|---|---|
| FR-07 | The board has no fixed boundaries in any direction |
| FR-08 | Players can pan the board freely by clicking and dragging |
| FR-09 | The board is rendered using the Canvas API |
| FR-10 | Only cells within the current viewport are rendered at any time |
| FR-11 | A mouse click on any empty cell is converted to a grid coordinate and registers a move |
| FR-12 | Grid lines extend visually as the board is panned |
| FR-13 | The viewport position persists during a round until the player pans it |

### 3.3 Piece Placement

| ID | Requirement |
|---|---|
| FR-14 | On their turn, a player clicks any empty cell to place their piece |
| FR-15 | Occupied cells cannot be overwritten under any circumstance |
| FR-16 | A player cannot place a piece when it is not their turn |
| FR-17 | After a valid placement, the turn advances to the next player automatically |
| FR-18 | Piece placement is visually confirmed immediately on the canvas |

### 3.4 Win Detection

| ID | Requirement |
|---|---|
| FR-19 | A player wins by placing four of their pieces consecutively in a line |
| FR-20 | Win detection checks all four directions after every move: horizontal, vertical, diagonal top-left to bottom-right, diagonal top-right to bottom-left |
| FR-21 | Detection runs only from the most recently placed piece, scanning outward in each direction |
| FR-22 | The four winning cells are visually highlighted on the canvas immediately |
| FR-23 | A win overlay is displayed showing the winning player's name and symbol |
| FR-24 | No further moves are accepted after a win is detected until a new game begins |
| FR-25 | The winning player's score in the scoreboard is incremented by one |

### 3.5 Win Prediction

| ID | Requirement |
|---|---|
| FR-26 | After every move, a win-prediction percentage is calculated for each of the four players |
| FR-27 | The algorithm scans every window of four consecutive cells in all four directions across the full set of played cells plus their neighbourhood |
| FR-28 | Any window containing pieces from more than one player is classified as blocked and excluded from scoring |
| FR-29 | For each unblocked window belonging to a player, the square of the number of that player's pieces in the window is added to that player's score |
| FR-30 | Players who have won previous rounds in the session receive a configurable bonus added to their raw score |
| FR-31 | All four raw scores are normalised so that the sum equals exactly 100% |
| FR-32 | When all raw scores are zero (empty board), each player is shown 25% |
| FR-33 | Prediction percentages are displayed as a labelled bar for each player in the side panel |
| FR-34 | The bars update in real time after each move with no perceptible delay |

### 3.6 Move History

| ID | Requirement |
|---|---|
| FR-35 | Every move is appended to a move history log |
| FR-36 | Each log entry includes the player symbol, the player colour indicator, and the grid coordinates of the placed piece |
| FR-37 | The log is displayed in a scrollable panel in the sidebar |
| FR-38 | The log scrolls automatically to the most recent entry after each move |
| FR-39 | The log is cleared when New Game or Reset All is triggered |

### 3.7 Scoreboard

| ID | Requirement |
|---|---|
| FR-40 | Each player's total win count is tracked and displayed |
| FR-41 | Scores persist across New Game cycles within the same browser session |
| FR-42 | New Game resets the board and move history but does not alter scores |
| FR-43 | Reset All clears both the board and all player scores |

### 3.8 Multiplayer — Room System

| ID | Requirement |
|---|---|
| FR-44 | A player can choose to create a new room from the start screen |
| FR-45 | On room creation, a unique room code is generated and displayed |
| FR-46 | Other players can open the application in a separate browser tab and enter the room code to join |
| FR-47 | Up to four players can occupy a single room |
| FR-48 | All moves are synchronised across all tabs in the room in real time |
| FR-49 | Turn order is enforced — a player's click is rejected if it is not their turn |
| FR-50 | If a player's tab is closed, the remaining players are notified and the turn advances past the disconnected player |
| FR-51 | The room code is visible to all players throughout the game for late joiners |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement |
|---|---|
| NFR-01 | Canvas rendering must maintain smooth panning with no visible frame drops on boards of up to 10,000 placed pieces |
| NFR-02 | Win detection must complete within one frame (16ms) of a piece being placed |
| NFR-03 | Win prediction recalculation must complete within 100ms after each move |

### 4.2 Usability

| ID | Requirement |
|---|---|
| NFR-04 | The current player's turn must be unambiguous at all times |
| NFR-05 | Player symbols and colours must remain distinguishable at all zoom levels |
| NFR-06 | All interactive controls must have clear visual affordance (hover states, cursor changes) |

### 4.3 Compatibility

| ID | Requirement |
|---|---|
| NFR-07 | The application must run correctly on Chrome, Firefox, Edge, and Safari (latest two major versions each) |
| NFR-08 | No browser extensions or plugins should be required |
| NFR-09 | The application must function without an internet connection in local mode |

### 4.4 Maintainability

| ID | Requirement |
|---|---|
| NFR-10 | Game logic must be isolated in the useGameLogic hook, separate from rendering and UI concerns |
| NFR-11 | Each UI element must be a separate, self-contained React component |
| NFR-12 | All theme values (colours, fonts, spacing) must be defined as CSS variables in index.css |

---

## 5. User Interface Requirements

### 5.1 Layout

- The canvas occupies the full browser window and serves as the game board
- A sidebar on the right contains player panels, prediction bars, and move history
- The top-centre HUD floats above the canvas and shows the current player and move count
- The win overlay appears as a full-screen modal when a win is detected

### 5.2 Theme

- Background: dark — near-black with subtle depth
- Primary accent: teal
- Secondary accent: purple
- Panels: glassmorphic — semi-transparent with backdrop blur and border highlight
- Player 1 (X): distinct colour with glow
- Player 2 (O): distinct colour with glow
- Player 3 (triangle): distinct colour with glow
- Player 4 (circle): distinct colour with glow
- Font: Syne for headings and UI labels, JetBrains Mono for coordinates and log entries

### 5.3 Controls

| Control | Behaviour |
|---|---|
| Canvas click | Place piece on the clicked cell if it is the player's turn and the cell is empty |
| Canvas drag | Pan the viewport |
| New Game button | Clear the board and move history, keep scores, return to Player 1's turn |
| Reset All button | Clear the board, move history, and all scores |
| Create Room button | Generate a room code and enter multiplayer mode as the host |
| Join Room input | Accept a room code and connect to the matching session |

---

## 6. Data Model

### 6.1 Board State

The board is represented as a JavaScript Map keyed by a string of the form `"x,y"` where x and y are integer grid coordinates. Each value is the player index (0–3) of the piece occupying that cell.

### 6.2 Game State

| Field | Type | Description |
|---|---|---|
| board | Map | All placed pieces keyed by coordinate string |
| currentPlayer | number | Index of the player whose turn it is (0–3) |
| moveCount | number | Total number of moves made in the current round |
| winner | number or null | Index of the winning player, or null if no winner yet |
| winningCells | array | List of coordinate strings forming the winning line |
| scores | array | Win count for each of the four players |
| history | array | Ordered list of move log entries |
| predictions | array | Current win-prediction percentage for each player |

---

## 7. Constraints

- The application must be implemented as a React SPA using Vite
- No server-side rendering or backend API is permitted for local play mode
- All game logic must be deterministic and produce the same output for the same sequence of moves
- The Canvas API must be used for board rendering — no third-party canvas libraries
