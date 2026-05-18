/**
 * roomService.js — Low-level BroadcastChannel transport for same-browser multiplayer.
 *
 * This module owns everything that touches the network/sync layer:
 *   - Room code generation
 *   - BroadcastChannel creation and teardown
 *   - Message send helpers
 *
 * Higher-level game logic lives in src/hooks/useMultiplayer.js which imports from here.
 *
 * ## How it works
 * One tab is the HOST. It owns authoritative game state and re-broadcasts it on every
 * change. All other tabs are GUESTS — they mirror state locally and send action messages
 * to the host. Because guests always receive the full state object (not diffs) they can
 * never get out of sync.
 *
 * ## Future migration path
 * To upgrade to true cross-device multiplayer, replace the BroadcastChannel calls here
 * with a WebSocket transport (e.g. Socket.io). The useMultiplayer hook interface stays
 * the same — only this file changes.
 */

// ─── Room code helpers ────────────────────────────────────────────────────────

/**
 * Generate a random 6-character uppercase room code.
 * @returns {string}  e.g. "A3Z9KQ"
 */
export function makeRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

/**
 * Derive the BroadcastChannel name from a room code.
 * @param {string} code
 * @returns {string}
 */
export function channelName(code) {
  return `4pttt-room-${code}`
}

// ─── Channel factory ──────────────────────────────────────────────────────────

/**
 * Open a BroadcastChannel for the given room code.
 * Caller is responsible for closing it via closeChannel().
 *
 * @param {string} code  Room code (will be upper-cased)
 * @returns {BroadcastChannel}
 */
export function openChannel(code) {
  return new BroadcastChannel(channelName(code.trim().toUpperCase()))
}

/**
 * Close and nullify a BroadcastChannel reference.
 * Safe to call with a null/undefined channel.
 *
 * @param {BroadcastChannel|null} channel
 */
export function closeChannel(channel) {
  channel?.close()
}

// ─── Message senders ──────────────────────────────────────────────────────────

/**
 * Broadcast a full state update to all tabs in the room.
 * Only the HOST should call this.
 *
 * @param {BroadcastChannel} channel
 * @param {object} state  Authoritative game state snapshot
 */
export function broadcastState(channel, state) {
  channel.postMessage({ type: 'STATE_UPDATE', state })
}

/**
 * Send a join request from a guest tab to the host.
 *
 * @param {BroadcastChannel} channel
 * @param {string} tabId  Unique identifier for the sending tab
 */
export function sendJoinRequest(channel, tabId) {
  channel.postMessage({ type: 'JOIN_REQUEST', tabId })
}

/**
 * Send a move action from a guest tab to the host.
 *
 * @param {BroadcastChannel} channel
 * @param {number} x
 * @param {number} y
 * @param {number} slot  Player slot (0-3) of the sender
 */
export function sendMove(channel, x, y, slot) {
  channel.postMessage({ type: 'MOVE', x, y, slot })
}

/**
 * Broadcast a game-start signal from the host.
 *
 * @param {BroadcastChannel} channel
 */
export function broadcastGameStart(channel) {
  channel.postMessage({ type: 'GAME_START' })
}

/**
 * Send a reset-round request (keeps scores).
 *
 * @param {BroadcastChannel} channel
 */
export function sendResetGame(channel) {
  channel.postMessage({ type: 'RESET_GAME' })
}

/**
 * Send a full reset request (clears scores).
 *
 * @param {BroadcastChannel} channel
 */
export function sendResetAll(channel) {
  channel.postMessage({ type: 'RESET_ALL' })
}

/**
 * Send a ping from a tab (used for connection checks).
 *
 * @param {BroadcastChannel} channel
 * @param {string} tabId
 */
export function sendPing(channel, tabId) {
  channel.postMessage({ type: 'PING', tabId })
}
