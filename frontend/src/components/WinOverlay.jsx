import { PLAYERS } from '../hooks/useGameLogic'

export default function WinOverlay({ winner, scores, onReset, onResetAll }) {
  if (!winner) return null
  const p = PLAYERS[winner.playerId]

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5,5,16,0.7)',
      backdropFilter: 'blur(4px)',
      animation: 'float-in 0.3s ease-out',
    }}>
      <div style={{
        background: 'var(--bg-panel)',
        border: `1px solid ${p.color}`,
        borderRadius: 20,
        padding: '40px 48px',
        textAlign: 'center',
        boxShadow: `0 0 60px ${p.glow}, 0 0 120px ${p.glow.replace('0.5)', '0.15)')}`,
        maxWidth: 360,
        width: '90vw',
        animation: 'float-in 0.4s cubic-bezier(0.34,1.3,0.64,1)',
      }}>
        {/* Symbol */}
        <div style={{
          fontSize: 64,
          color: p.color,
          textShadow: `0 0 24px ${p.glow}, 0 0 48px ${p.glow}`,
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          marginBottom: 16,
          animation: 'drop-in 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {p.symbol}
        </div>

        <div style={{
          fontSize: 28,
          fontWeight: 800,
          color: p.color,
          letterSpacing: '-0.02em',
          marginBottom: 6,
        }}>
          {p.name} Wins!
        </div>

        <div style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 24,
          fontFamily: 'var(--font-mono)',
        }}>
          4 in a row! 🎯
        </div>

        {/* Scores */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 28,
          padding: '12px 0',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}>
          {PLAYERS.map(pl => (
            <div key={pl.id} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 20,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: pl.id === winner.playerId ? pl.color : 'var(--text-muted)',
                textShadow: pl.id === winner.playerId ? `0 0 12px ${pl.glow}` : 'none',
              }}>
                {scores[pl.id]}
              </div>
              <div style={{
                fontSize: 16,
                color: pl.color,
                fontFamily: 'var(--font-mono)',
              }}>
                {pl.symbol}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onReset}
            style={{
              flex: 1,
              padding: '12px 0',
              background: p.color,
              border: 'none',
              borderRadius: 10,
              color: '#000',
              fontSize: 13,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 4px 20px ${p.glow}`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = `0 6px 28px ${p.glow}` }}
            onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = `0 4px 20px ${p.glow}` }}
          >
            Play Again
          </button>
          <button
            onClick={onResetAll}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text-secondary)',
              fontSize: 13,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  )
}
