import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { PLAYERS, WIN_LENGTH } from '../hooks/useGameLogic'

const CELL = 64
const DOT_EVERY = 5  // draw accent dot every N cells

function PlayerSymbol({ symbol, color, glow, size = 28, animated = false }) {
  return (
    <span style={{
      fontSize: size,
      color,
      textShadow: `0 0 12px ${glow}, 0 0 24px ${glow}`,
      display: 'inline-block',
      animation: animated ? 'drop-in 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
      lineHeight: 1,
      fontFamily: symbol === '▽' || symbol === '●' ? 'inherit' : 'var(--font-mono)',
      fontWeight: 700,
    }}>
      {symbol}
    </span>
  )
}

export default function GameBoard({
  board,
  currentPlayer,
  winner,
  lastMove,
  gameOver,
  onPlace,
  ghostDisabled = false,
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  // Camera position (world coords of viewport center)
  const [camera, setCamera] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  // Drag state
  const drag = useRef({ active: false, startX: 0, startY: 0, camX: 0, camY: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [hoverCell, setHoverCell] = useState(null)

  // Recently animated cells
  const [animatedCells, setAnimatedCells] = useState(new Set())

  const player = PLAYERS[currentPlayer]

  // Track window resize
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Animate last placed piece
  useEffect(() => {
    if (!lastMove) return
    const k = `${lastMove.x},${lastMove.y}`
    setAnimatedCells(s => new Set([...s, k]))
    const t = setTimeout(() => {
      setAnimatedCells(s => { const n = new Set(s); n.delete(k); return n })
    }, 400)
    return () => clearTimeout(t)
  }, [lastMove])

  // Screen → world coords
  const screenToWorld = useCallback((sx, sy) => {
    const cx = (sx - size.w / 2) / CELL + camera.x
    const cy = (sy - size.h / 2) / CELL + camera.y
    return { x: Math.floor(cx + 0.5), y: Math.floor(cy + 0.5) }
  }, [camera, size])

  // World → screen coords (top-left of cell)
  const worldToScreen = useCallback((wx, wy) => {
    const sx = (wx - camera.x) * CELL + size.w / 2 - CELL / 2
    const sy = (wy - camera.y) * CELL + size.h / 2 - CELL / 2
    return { sx, sy }
  }, [camera, size])

  // Draw the grid on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = size.w
    canvas.height = size.h
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size.w, size.h)

    // Cell range visible on screen
    const startX = Math.floor(camera.x - size.w / (2 * CELL)) - 1
    const endX   = Math.ceil(camera.x  + size.w / (2 * CELL)) + 1
    const startY = Math.floor(camera.y - size.h / (2 * CELL)) - 1
    const endY   = Math.ceil(camera.y  + size.h / (2 * CELL)) + 1

    // Grid lines
    ctx.strokeStyle = 'rgba(124,58,237,0.10)'
    ctx.lineWidth = 1

    for (let wx = startX; wx <= endX; wx++) {
      const { sx } = worldToScreen(wx, 0)
      ctx.beginPath()
      ctx.moveTo(sx + CELL / 2, 0)
      ctx.lineTo(sx + CELL / 2, size.h)
      ctx.stroke()
    }
    for (let wy = startY; wy <= endY; wy++) {
      const { sy } = worldToScreen(0, wy)
      ctx.beginPath()
      ctx.moveTo(0, sy + CELL / 2)
      ctx.lineTo(size.w, sy + CELL / 2)
      ctx.stroke()
    }

    // Axis cross at 0,0
    const origin = worldToScreen(0, 0)
    ctx.strokeStyle = 'rgba(0,201,167,0.25)'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 8])
    ctx.beginPath()
    ctx.moveTo(origin.sx + CELL / 2, 0)
    ctx.lineTo(origin.sx + CELL / 2, size.h)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, origin.sy + CELL / 2)
    ctx.lineTo(size.w, origin.sy + CELL / 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Intersection dots every DOT_EVERY cells
    ctx.fillStyle = 'rgba(124,58,237,0.25)'
    for (let wx = startX; wx <= endX; wx++) {
      for (let wy = startY; wy <= endY; wy++) {
        if (wx % DOT_EVERY === 0 && wy % DOT_EVERY === 0) {
          const { sx, sy } = worldToScreen(wx, wy)
          ctx.beginPath()
          ctx.arc(sx + CELL / 2, sy + CELL / 2, 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Coordinate labels every 5 cells
    ctx.fillStyle = 'rgba(124,58,237,0.3)'
    ctx.font = '10px JetBrains Mono, monospace'
    ctx.textAlign = 'center'
    for (let wx = startX; wx <= endX; wx += 5) {
      for (let wy = startY; wy <= endY; wy += 5) {
        if (wx === 0 && wy === 0) continue
        const { sx, sy } = worldToScreen(wx, wy)
        if (wy === Math.round(camera.y)) {
          ctx.fillText(wx, sx + CELL / 2, sy + CELL / 2 - 4)
        }
      }
    }

    // Win line highlight
    if (winner && winner.cells.length > 0) {
      const cells = winner.cells
      const winColor = PLAYERS[winner.playerId].color.replace('var(', '').replace(')', '')
      const resolvedColor = getComputedStyle(document.documentElement)
        .getPropertyValue(winColor.startsWith('--') ? winColor : '--p0').trim()

      ctx.strokeStyle = resolvedColor || '#00c9a7'
      ctx.lineWidth = 3
      ctx.shadowColor = resolvedColor || '#00c9a7'
      ctx.shadowBlur = 16
      ctx.setLineDash([8, 4])

      const first = cells[0]
      const last = cells[cells.length - 1]
      const { sx: x1, sy: y1 } = worldToScreen(first[0], first[1])
      const { sx: x2, sy: y2 } = worldToScreen(last[0], last[1])

      ctx.beginPath()
      ctx.moveTo(x1 + CELL / 2, y1 + CELL / 2)
      ctx.lineTo(x2 + CELL / 2, y2 + CELL / 2)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.shadowBlur = 0
    }

  }, [board, camera, size, winner, worldToScreen])

  // Pointer events
  const onPointerDown = useCallback((e) => {
    if (e.button !== 0) return
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, camX: camera.x, camY: camera.y }
    setIsDragging(false)
  }, [camera])

  const onPointerMove = useCallback((e) => {
    if (drag.current.active) {
      const dx = e.clientX - drag.current.startX
      const dy = e.clientY - drag.current.startY
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setIsDragging(true)
      setCamera({
        x: drag.current.camX - dx / CELL,
        y: drag.current.camY - dy / CELL,
      })
    } else {
      const cell = screenToWorld(e.clientX, e.clientY)
      setHoverCell(cell)
    }
  }, [screenToWorld])

  const onPointerUp = useCallback((e) => {
    if (!drag.current.active) return
    const wasDragging = isDragging
    drag.current.active = false
    if (!wasDragging && !gameOver) {
      const cell = screenToWorld(e.clientX, e.clientY)
      onPlace(cell.x, cell.y)
    }
    setIsDragging(false)
  }, [isDragging, gameOver, screenToWorld, onPlace])

  const onPointerLeave = useCallback(() => {
    drag.current.active = false
    setHoverCell(null)
    setIsDragging(false)
  }, [])

  const onWheel = useCallback((e) => {
    e.preventDefault()
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // Render pieces as DOM elements (easier to animate than canvas)
  const visiblePieces = useMemo(() => {
    const pieces = []
    const startX = Math.floor(camera.x - size.w / (2 * CELL)) - 2
    const endX   = Math.ceil(camera.x  + size.w / (2 * CELL)) + 2
    const startY = Math.floor(camera.y - size.h / (2 * CELL)) - 2
    const endY   = Math.ceil(camera.y  + size.h / (2 * CELL)) + 2

    for (let wx = startX; wx <= endX; wx++) {
      for (let wy = startY; wy <= endY; wy++) {
        const k = `${wx},${wy}`
        const pid = board[k]
        if (pid !== undefined) {
          const { sx, sy } = worldToScreen(wx, wy)
          const isWinCell = winner?.cells?.some(([cx, cy]) => cx === wx && cy === wy)
          const isAnim = animatedCells.has(k)
          pieces.push({ wx, wy, sx, sy, pid, isWinCell, isAnim, k })
        }
      }
    }

    return pieces
  }, [board, camera, size, winner, worldToScreen, animatedCells])

  // Ghost cell (hover preview)
  const ghostCell = useMemo(() => {
    if (!hoverCell || gameOver || isDragging || ghostDisabled) return null
    const k = `${hoverCell.x},${hoverCell.y}`
    if (board[k] !== undefined) return null
    const { sx, sy } = worldToScreen(hoverCell.x, hoverCell.y)
    return { sx, sy, player: PLAYERS[currentPlayer] }
  }, [hoverCell, gameOver, isDragging, ghostDisabled, board, worldToScreen, currentPlayer])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : gameOver ? 'default' : 'crosshair',
        background: 'radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(0,201,167,0.06) 0%, transparent 60%), var(--bg-deep)',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      {/* Grid canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Pieces layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {visiblePieces.map(({ sx, sy, pid, isWinCell, isAnim, k }) => {
          const p = PLAYERS[pid]
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: sx,
                top: sy,
                width: CELL,
                height: CELL,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                background: isWinCell
                  ? `radial-gradient(circle, ${p.glow} 0%, transparent 70%)`
                  : 'transparent',
                animation: isWinCell ? 'win-flash 1s ease-in-out infinite' : 'none',
              }}
            >
              <PlayerSymbol
                symbol={p.symbol}
                color={p.color}
                glow={p.glow}
                size={isWinCell ? 32 : 28}
                animated={isAnim}
              />
            </div>
          )
        })}

        {/* Ghost preview */}
        {ghostCell && (
          <div
            style={{
              position: 'absolute',
              left: ghostCell.sx,
              top: ghostCell.sy,
              width: CELL,
              height: CELL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              border: `1.5px dashed ${ghostCell.player.color}`,
              opacity: 0.45,
              pointerEvents: 'none',
            }}
          >
            <PlayerSymbol
              symbol={ghostCell.player.symbol}
              color={ghostCell.player.color}
              glow={ghostCell.player.glow}
              size={26}
            />
          </div>
        )}
      </div>

      {/* Coordinate HUD */}
      {hoverCell && (
        <div style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(10,10,30,0.85)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '4px 14px',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          pointerEvents: 'none',
          backdropFilter: 'blur(8px)',
        }}>
          {hoverCell.x}, {hoverCell.y}
        </div>
      )}
    </div>
  )
}
