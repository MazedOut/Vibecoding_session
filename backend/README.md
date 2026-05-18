# Backend — Multiplayer Sync Layer

This project uses a browser-native communication strategy for multiplayer
rather than a traditional server.

## Current Implementation

Room state is synchronised across browser tabs using the **BroadcastChannel API**.
This means:

- No server process needs to run
- All players must be on the same machine in the same browser
- Room codes are generated client-side and shared manually between tabs

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/services/roomService.js` | Low-level transport: channel creation, message senders, room code generation |
| `frontend/src/hooks/useMultiplayer.js` | React hook: host/guest state machine, game logic wiring |

## Message Protocol

| Message Type | Direction | Description |
|---|---|---|
| `JOIN_REQUEST` | Guest → Host | Guest requests a player slot |
| `JOIN_ACK` | Host → Guest | Host assigns a slot |
| `ROOM_FULL` | Host → Guest | No slots available |
| `STATE_UPDATE` | Host → All | Full authoritative state broadcast |
| `MOVE` | Guest → Host | Player submits a move |
| `GAME_START` | Host → All | Host signals game has started |
| `RESET_GAME` | Any → Host | Reset board, keep scores |
| `RESET_ALL` | Any → Host | Reset board and scores |
| `PING` / `PONG` | Any ↔ Host | Connection check |

## Future Migration Path

To upgrade to true cross-device multiplayer over the internet:

1. Replace `roomService.js` with a WebSocket transport (e.g. **Socket.io**)
2. Deploy a Node.js + Express server that mirrors the host's role
3. The `useMultiplayer.js` hook interface stays the same — only the transport changes

No React components or game logic would need to be rewritten.
