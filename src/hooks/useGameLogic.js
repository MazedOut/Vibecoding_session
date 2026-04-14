import { useState, useCallback, useRef } from 'react'

export const PLAYERS = [
  { id: 0, symbol: 'X',  name: 'Player 1', color: 'var(--p0)', glow: 'var(--p0-glow)' },
  { id: 1, symbol: 'O',  name: 'Player 2', color: 'var(--p1)', glow: 'var(--p1-glow)' },
  { id: 2, symbol: '▽', name: 'Player 3', color: 'var(--p2)', glow: 'var(--p2-glow)' },
  { id: 3, symbol: '●',  name: 'Player 4', color: 'var(--p3)', glow: 'var(--p3-glow)' },
]

export const WIN_LENGTH = 4
const DIRECTIONS = [[1,0],[0,1],[1,1],[1,-1]]

function key(x, y) { return `${x},${y}` }

function checkWin(board, x, y, playerId) {
  for (const [dx, dy] of DIRECTIONS) {
    let count = 1
    for (let i = 1; i < WIN_LENGTH; i++) {
      if (board[key(x + dx*i, y + dy*i)] === playerId) count++
      else break
    }
    for (let i = 1; i < WIN_LENGTH; i++) {
      if (board[key(x - dx*i, y - dy*i)] === playerId) count++
      else break
    }
    if (count >= WIN_LENGTH) return true
  }
  return false
}

function getWinningCells(board, x, y, playerId) {
  for (const [dx, dy] of DIRECTIONS) {
    const cells = [[x, y]]
    for (let i = 1; i < WIN_LENGTH; i++) {
      if (board[key(x + dx*i, y + dy*i)] === playerId) cells.push([x + dx*i, y + dy*i])
      else break
    }
    for (let i = 1; i < WIN_LENGTH; i++) {
      if (board[key(x - dx*i, y - dy*i)] === playerId) cells.push([x - dx*i, y - dy*i])
      else break
    }
    if (cells.length >= WIN_LENGTH) return cells
  }
  return []
}

/**
 * Compute win-probability-style prediction for each player.
 * Heuristic: score every possible window of WIN_LENGTH in any direction
 * that a player could still win (no opponent blocking).
 * Weight: 1^1, 2^2, 3^3, ... pieces in window.
 */
function calcPredictions(board, scores) {
  const rawScores = [0, 0, 0, 0]
  const keys = Object.keys(board)

  if (keys.length === 0) return [25, 25, 25, 25]

  // Scan each occupied cell and project windows
  const scanned = new Set()

  for (const k of keys) {
    const [cx, cy] = k.split(',').map(Number)
    const pid = board[k]

    for (const [dx, dy] of DIRECTIONS) {
      // Walk backward to find window start
      for (let start = -(WIN_LENGTH - 1); start <= 0; start++) {
        const wx = cx + dx * start
        const wy = cy + dy * start
        const wk = `${wx},${wy},${dx},${dy}`
        if (scanned.has(wk)) continue
        scanned.add(wk)

        // Count pieces in this window per player
        const counts = [0, 0, 0, 0]
        let blocked = false
        let hasContent = false

        for (let i = 0; i < WIN_LENGTH; i++) {
          const cell = board[key(wx + dx*i, wy + dy*i)]
          if (cell !== undefined) {
            counts[cell]++
            hasContent = true
          }
        }

        if (!hasContent) continue

        // Window is "pure" for a player if only 1 player has pieces there
        const nonZero = counts.filter(c => c > 0)
        if (nonZero.length === 1) {
          const winner = counts.indexOf(nonZero[0])
          rawScores[winner] += Math.pow(nonZero[0], 2)
        }
      }
    }
  }

  // Add win-score bonus
  const total_raw = rawScores.reduce((a, b) => a + b, 0) || 1
  const winBonus = scores.map(s => s * 50)
  const combined = rawScores.map((r, i) => r + winBonus[i])
  const total = combined.reduce((a, b) => a + b, 0)

  if (total === 0) return [25, 25, 25, 25]

  // Normalize to sum 100, ensure each is at least 1
  let pcts = combined.map(v => Math.max(1, Math.round(v / total * 100)))
  // Adjust to sum exactly 100
  let diff = pcts.reduce((a, b) => a + b, 0) - 100
  while (diff !== 0) {
    const idx = diff > 0
      ? pcts.indexOf(Math.max(...pcts))
      : pcts.indexOf(Math.min(...pcts))
    pcts[idx] -= Math.sign(diff)
    diff -= Math.sign(diff)
  }

  return pcts
}

export function useGameLogic() {
  const [board, setBoard] = useState({})           // {`x,y`: playerId}
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [winner, setWinner] = useState(null)        // { playerId, cells }
  const [scores, setScores] = useState([0, 0, 0, 0])
  const [predictions, setPredictions] = useState([25, 25, 25, 25])
  const [moveHistory, setMoveHistory] = useState([]) // [{x,y,player}]
  const [gameOver, setGameOver] = useState(false)
  const [lastMove, setLastMove] = useState(null)

  const placepiece = useCallback((x, y) => {
    if (gameOver) return false
    const k = key(x, y)
    if (board[k] !== undefined) return false

    const newBoard = { ...board, [k]: currentPlayer }
    const won = checkWin(newBoard, x, y, currentPlayer)
    const winCells = won ? getWinningCells(newBoard, x, y, currentPlayer) : []

    setBoard(newBoard)
    setLastMove({ x, y })
    setMoveHistory(h => [...h, { x, y, player: currentPlayer }])

    if (won) {
      const newScores = scores.map((s, i) => i === currentPlayer ? s + 1 : s)
      setScores(newScores)
      setWinner({ playerId: currentPlayer, cells: winCells })
      setGameOver(true)
      setPredictions(newScores.map((s, i) => (i === currentPlayer ? 100 : 0)))
    } else {
      const nextPlayer = (currentPlayer + 1) % PLAYERS.length
      setCurrentPlayer(nextPlayer)
      const preds = calcPredictions(newBoard, scores)
      setPredictions(preds)
    }

    return true
  }, [board, currentPlayer, gameOver, scores])

  const resetGame = useCallback(() => {
    setBoard({})
    setCurrentPlayer(0)
    setWinner(null)
    setGameOver(false)
    setPredictions([25, 25, 25, 25])
    setMoveHistory([])
    setLastMove(null)
  }, [])

  const resetAll = useCallback(() => {
    resetGame()
    setScores([0, 0, 0, 0])
  }, [resetGame])

  return {
    board,
    currentPlayer,
    winner,
    scores,
    predictions,
    moveHistory,
    gameOver,
    lastMove,
    placepiece,
    resetGame,
    resetAll,
  }
}
