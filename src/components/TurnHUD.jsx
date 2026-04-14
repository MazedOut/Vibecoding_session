import { PLAYERS } from '../hooks/useGameLogic'

export default function TurnHUD({ currentPlayer, gameOver, moveCount }) {
  if (gameOver) return null
  const p = PLAYERS[currentPlayer]

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--bg-panel)',
      border: `1px solid ${p.color}`,
      borderRadius: 40,
      padding: '8px 18px 8px 12px',
      backdropFilter: 'blur(16px)',
      boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${p.glow.replace('0.5)', '0.15)')}`,
      transition: 'border-color 0.35s ease',
    }}
    key={currentPlayer}
    >
      {/* Pulsing ring */}
      <div style={{ position: 'relative', width: 28, height: 28, flexShrink: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: `2px solid ${p.color}`,
          animation: 'pulse-ring 2s ease-in-out infinite',
          opacity: 0.5,
        }} />
        <div style={{
          position: 'absolute', inset: 4,
          borderRadius: '50%',
          background: p.glow.replace('0.5)', '0.2)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 12,
            color: p.color,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            textShadow: `0 0 8px ${p.glow}`,
          }}>{p.symbol}</span>
        </div>
      </div>

      <div>
        <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: p.color,
          lineHeight: 1.2,
        }}>
          {p.name}
        </div>
        <div style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.2,
        }}>
          Move #{moveCount + 1}
        </div>
      </div>
    </div>
  )
}
