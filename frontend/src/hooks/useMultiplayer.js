/**
 * useMultiplayer — BroadcastChannel-based multiplayer for same-browser tabs.
 *
 * One tab is the HOST. It owns the authoritative game state and re-broadcasts
 * it every time something changes. All other tabs are GUESTS — they listen and
 * mirror the state locally. Guests send "action" messages; the host applies
 * them and re-broadcasts the new full state.
 *
 * This means guests NEVER lag behind: they always receive the complete state
 * object (not just diffs), so there is no risk of getting out of sync.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  checkWin,
  getWinningCells,
  calcPredictions,
  PLAYERS,
} from './useGameLogic'

// ─── helpers ────────────────────────────────────────────────────────────────

function key(x, y) { return `${x},${y}` }

function makeRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

function channelName(code) { return `4pttt-room-${code}` }

// ─── initial state factory ───────────────────────────────────────────────────

function initialState() {
  return {
    board: {},
    currentPlayer: 0,
    winner: null,
    scores: [0, 0, 0, 0],
    predictions: [25, 25, 25, 25],
    moveHistory: [],
    gameOver: false,
    lastMove: null,
    playerSlots: [null, null, null, null], // null | tabId
  }
}

// ─── hook ────────────────────────────────────────────────────────────────────

export function useMultiplayer() {
  const tabId = useRef(Math.random().toString(36).slice(2)).current

  const [roomCode, setRoomCode]       = useState(null)
  const [mySlot, setMySlot]           = useState(null)   // 0-3 | null
  const [isHost, setIsHost]           = useState(false)
  const [phase, setPhase]             = useState('idle') // idle | lobby | playing
  const [error, setError]             = useState(null)
  const [connected, setConnected]     = useState(false)
  const [playersReady, setPlayersReady] = useState(0)

  // Full mirrored game state
  const [gameState, setGameState] = useState(initialState())

  const channelRef = useRef(null)
  const stateRef   = useRef(initialState()) // host's authoritative copy

  // ── broadcast helpers (host-only) ──────────────────────────────────────────

  const broadcast = useCallback((msg) => {
    channelRef.current?.postMessage(msg)
  }, [])

  const broadcastState = useCallback((state) => {
    broadcast({ type: 'STATE_UPDATE', state })
    stateRef.current = state
    setGameState({ ...state })
  }, [broadcast])

  // ── apply a move on the host ───────────────────────────────────────────────

  const hostApplyMove = useCallback((x, y, actorSlot) => {
    const s = stateRef.current
    if (s.gameOver) return
    if (s.currentPlayer !== actorSlot) return  // wrong turn
    const k = key(x, y)
    if (s.board[k] !== undefined) return

    const newBoard = { ...s.board, [k]: actorSlot }
    const won = checkWin(newBoard, x, y, actorSlot)
    const winCells = won ? getWinningCells(newBoard, x, y, actorSlot) : []

    let nextScores = s.scores
    let nextWinner = null
    let nextGameOver = false
    let nextPlayer = s.currentPlayer
    let nextPreds = s.predictions

    if (won) {
      nextScores = s.scores.map((sc, i) => i === actorSlot ? sc + 1 : sc)
      nextWinner = { playerId: actorSlot, cells: winCells }
      nextGameOver = true
      nextPreds = nextScores.map((_, i) => i === actorSlot ? 100 : 0)
    } else {
      nextPlayer = (s.currentPlayer + 1) % PLAYERS.length
      nextPreds = calcPredictions(newBoard, s.scores)
    }

    const newState = {
      ...s,
      board: newBoard,
      currentPlayer: nextPlayer,
      winner: nextWinner,
      scores: nextScores,
      predictions: nextPreds,
      moveHistory: [...s.moveHistory, { x, y, player: actorSlot }],
      gameOver: nextGameOver,
      lastMove: { x, y },
    }

    broadcastState(newState)
  }, [broadcastState])

  // ── host: handle new player joining ───────────────────────────────────────

  const hostHandleJoin = useCallback((senderTabId) => {
    const s = stateRef.current
    const freeSlot = s.playerSlots.findIndex(t => t === null)
    if (freeSlot === -1) {
      // Room full — tell that tab
      broadcast({ type: 'ROOM_FULL', targetTab: senderTabId })
      return
    }
    const newSlots = [...s.playerSlots]
    newSlots[freeSlot] = senderTabId
    const ready = newSlots.filter(Boolean).length

    const newState = { ...s, playerSlots: newSlots }
    stateRef.current = newState
    setGameState({ ...newState })

    broadcast({
      type: 'JOIN_ACK',
      slot: freeSlot,
      targetTab: senderTabId,
      playerSlots: newSlots,
    })
    broadcast({ type: 'STATE_UPDATE', state: newState })
    setPlayersReady(ready)
  }, [broadcast])

  // ── host: handle reset ─────────────────────────────────────────────────────

  const hostReset = useCallback((keepScores = false) => {
    const s = stateRef.current
    const base = initialState()
    const newState = {
      ...base,
      scores: keepScores ? s.scores : [0, 0, 0, 0],
      playerSlots: s.playerSlots,
    }
    broadcastState(newState)
  }, [broadcastState])

  // ── create room (become host) ──────────────────────────────────────────────

  const createRoom = useCallback(() => {
    const code = makeRoomCode()
    const ch   = new BroadcastChannel(channelName(code))
    channelRef.current = ch
    setRoomCode(code)
    setIsHost(true)
    setMySlot(0)
    setPhase('lobby')
    setConnected(true)
    setError(null)

    // Claim slot 0 for host
    const init = initialState()
    init.playerSlots[0] = tabId
    stateRef.current = init
    setGameState({ ...init })
    setPlayersReady(1)

    ch.onmessage = (ev) => {
      const msg = ev.data
      switch (msg.type) {
        case 'JOIN_REQUEST':
          hostHandleJoin(msg.tabId)
          break
        case 'MOVE':
          hostApplyMove(msg.x, msg.y, msg.slot)
          break
        case 'RESET_GAME':
          hostReset(true)
          break
        case 'RESET_ALL':
          hostReset(false)
          break
        case 'PING':
          ch.postMessage({ type: 'PONG', targetTab: msg.tabId })
          break
        default:
          break
      }
    }
  }, [tabId, hostHandleJoin, hostApplyMove, hostReset])

  // ── join room (become guest) ───────────────────────────────────────────────

  const joinRoom = useCallback((code) => {
    const upperCode = code.trim().toUpperCase()
    if (!upperCode) { setError('Enter a room code'); return }

    const ch = new BroadcastChannel(channelName(upperCode))
    channelRef.current = ch
    setRoomCode(upperCode)
    setIsHost(false)
    setPhase('joining')
    setError(null)

    let ackTimeout = setTimeout(() => {
      setError('No host found for that room code.')
      setPhase('idle')
      ch.close()
      channelRef.current = null
    }, 3000)

    ch.onmessage = (ev) => {
      const msg = ev.data

      // Only process messages targeted at us when targetTab is specified
      if (msg.targetTab && msg.targetTab !== tabId) return

      switch (msg.type) {
        case 'JOIN_ACK':
          clearTimeout(ackTimeout)
          setMySlot(msg.slot)
          setConnected(true)
          setPhase('lobby')
          break

        case 'ROOM_FULL':
          clearTimeout(ackTimeout)
          setError('Room is full (4 players).')
          setPhase('idle')
          ch.close()
          channelRef.current = null
          break

        case 'STATE_UPDATE': {
          const s = msg.state
          stateRef.current = s
          setGameState({ ...s })
          const ready = s.playerSlots.filter(Boolean).length
          setPlayersReady(ready)
          // Once all 4 joined or at least we are in, move to playing if game started
          if (msg.state.moveHistory.length > 0) setPhase('playing')
          else if (msg.state.playerSlots.some(Boolean)) setPhase('lobby')
          break
        }

        case 'PONG':
          break

        default:
          break
      }
    }

    // Send join request
    ch.postMessage({ type: 'JOIN_REQUEST', tabId })
  }, [tabId])

  // ── guest: send a move ────────────────────────────────────────────────────

  const sendMove = useCallback((x, y) => {
    if (!channelRef.current) return
    if (isHost) {
      hostApplyMove(x, y, mySlot)
    } else {
      channelRef.current.postMessage({ type: 'MOVE', x, y, slot: mySlot })
    }
  }, [isHost, mySlot, hostApplyMove])

  // ── start game (host: can start once all 4 joined, or force start) ────────

  const startGame = useCallback(() => {
    if (!isHost) return
    const s = stateRef.current
    const newState = { ...s, phase: 'playing' }
    broadcastState(newState)
    setPhase('playing')
    broadcast({ type: 'GAME_START' })
  }, [isHost, broadcastState, broadcast])

  // ── guest also transitions to 'playing' on GAME_START ─────────────────────

  useEffect(() => {
    const ch = channelRef.current
    if (!ch || isHost) return
    const orig = ch.onmessage
    ch.onmessage = (ev) => {
      if (ev.data.type === 'GAME_START') setPhase('playing')
      if (orig) orig(ev)
    }
  }, [isHost])

  // ── reset actions (routed through host) ───────────────────────────────────

  const resetGame = useCallback(() => {
    if (isHost) { hostReset(true) }
    else { channelRef.current?.postMessage({ type: 'RESET_GAME' }) }
  }, [isHost, hostReset])

  const resetAll = useCallback(() => {
    if (isHost) { hostReset(false) }
    else { channelRef.current?.postMessage({ type: 'RESET_ALL' }) }
  }, [isHost, hostReset])

  // ── cleanup ───────────────────────────────────────────────────────────────

  const leaveRoom = useCallback(() => {
    channelRef.current?.close()
    channelRef.current = null
    setRoomCode(null)
    setMySlot(null)
    setIsHost(false)
    setPhase('idle')
    setConnected(false)
    setGameState(initialState())
    stateRef.current = initialState()
    setPlayersReady(0)
    setError(null)
  }, [])

  // ── derived ───────────────────────────────────────────────────────────────

  const isMyTurn = mySlot !== null && gameState.currentPlayer === mySlot

  return {
    // room
    roomCode,
    mySlot,
    isHost,
    phase,
    error,
    connected,
    playersReady,
    isMyTurn,
    // game state (mirrors authoritative state)
    ...gameState,
    // actions
    createRoom,
    joinRoom,
    sendMove,
    startGame,
    resetGame,
    resetAll,
    leaveRoom,
  }
}
