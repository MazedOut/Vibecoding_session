import { useState } from 'react'
import { PLAYERS } from '../hooks/useGameLogic'

function WinBar({ predictions }) {
  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: 8,
      }}>
        Win Prediction
      </div>
      {/* Stacked bar */}
      <div style={{
        display: 'flex',
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        gap: 1,
        marginBottom: 8,
      }}>
        {PLAYERS.map((p, i) => (
          <div
            key={p.id}
            style={{
              flex: predictions[i],
              background: p.color,
              transition: 'flex 0.6s cubic-bezier(0.34,1.1,0.64,1)',
              minWidth: predictions[i] > 0 ? 2 : 0,
            }}
          />
        ))}
      </div>
      {/* Percentages */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {PLAYERS.map((p, i) => (
          <div key={p.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: p.color,
              boxShadow: `0 0 6px ${p.glow}`,
              flexShrink: 0,
            }} />
            <span style={{ color: p.color }}>{predictions[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlayerCard({ player, isActive, score, prediction, isWinner }) {
  return (
    <div style={{
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      background: isActive
        ? `linear-gradient(135deg, ${player.glow.replace('0.5)', '0.08)')} 0%, transparent 100%)`
        : 'transparent',
      transition: 'background 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {isActive && (
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: 3,
          background: player.color,
          boxShadow: `0 0 12px ${player.glow}`,
          borderRadius: '0 2px 2px 0',
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Symbol */}
        <div style={{
          width: 36, height: 36,
          borderRadius: 8,
          border: `1.5px solid ${isActive ? player.color : 'rgba(124,58,237,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isActive ? `${player.glow.replace('0.5)', '0.12)')}` : 'transparent',
          transition: 'all 0.3s',
          flexShrink: 0,
          boxShadow: isActive ? `0 0 16px ${player.glow}` : 'none',
        }}>
          <span style={{
            fontSize: 16,
            color: player.color,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            textShadow: isActive ? `0 0 8px ${player.glow}` : 'none',
          }}>
            {player.symbol}
          </span>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: isActive ? player.color : 'var(--text-secondary)',
            transition: 'color 0.3s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {player.name}
            {isWinner && (
              <span style={{
                fontSize: 9,
                background: player.color,
                color: '#000',
                padding: '1px 5px',
                borderRadius: 3,
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}>WIN</span>
            )}
            {isActive && !isWinner && (
              <span style={{
                fontSize: 9,
                border: `1px solid ${player.color}`,
                color: player.color,
                padding: '1px 5px',
                borderRadius: 3,
                letterSpacing: '0.08em',
              }}>TURN</span>
            )}
          </div>
          {/* Prediction mini bar */}
          <div style={{
            marginTop: 5,
            height: 3,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${prediction}%`,
              background: player.color,
              borderRadius: 2,
              transition: 'width 0.6s cubic-bezier(0.34,1.1,0.64,1)',
              boxShadow: `0 0 8px ${player.glow}`,
            }} />
          </div>
        </div>

        {/* Score */}
        <div style={{
          fontSize: 20,
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: score > 0 ? player.color : 'var(--text-muted)',
          textShadow: score > 0 ? `0 0 16px ${player.glow}` : 'none',
          minWidth: 24,
          textAlign: 'right',
        }}>
          {score}
        </div>
      </div>
    </div>
  )
}

function MoveHistory({ history }) {
  const recent = [...history].reverse().slice(0, 12)
  return (
    <div style={{
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      maxHeight: 140,
      overflowY: 'auto',
    }}>
      <div style={{
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: 8,
      }}>
        Move Log
      </div>
      {recent.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          No moves yet
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {recent.map((m, i) => {
          const p = PLAYERS[m.player]
          const moveNum = history.length - i
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontFamily: 'var(--font-mono)',
              opacity: i === 0 ? 1 : 0.5 - i * 0.03,
            }}>
              <span style={{ color: 'var(--text-muted)', minWidth: 18, textAlign: 'right' }}>
                {moveNum}.
              </span>
              <span style={{ color: p.color, width: 14, textAlign: 'center' }}>{p.symbol}</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                ({m.x}, {m.y})
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function PlayerPanel({
  currentPlayer,
  winner,
  scores,
  predictions,
  moveHistory,
  gameOver,
  onReset,
  onResetAll,
  onHome,
  roomCode,
  mySlot,
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      position: 'fixed',
      top: 12,
      right: 12,
      width: 220,
      background: 'var(--bg-panel)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)',
      overflow: 'hidden',
      zIndex: 100,
      animation: 'float-in 0.4s ease-out',
    }}>
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setCollapsed(c => !c)}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
            4P Tic-Tac-Toe
            {roomCode && (
              <span style={{
                marginLeft: 6,
                fontSize: 9,
                background: 'rgba(124,58,237,0.25)',
                border: '1px solid rgba(124,58,237,0.4)',
                color: 'var(--purple-light)',
                padding: '1px 5px',
                borderRadius: 3,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}>{roomCode}</span>
            )}
          </div>
          <div style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            marginTop: 1,
          }}>
            {gameOver
              ? `${PLAYERS[winner.playerId].name} wins!`
              : `${PLAYERS[currentPlayer].name}'s turn`
            }
          </div>
        </div>
        <div style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          transition: 'transform 0.2s',
          transform: collapsed ? 'rotate(180deg)' : 'none',
        }}>▼</div>
      </div>

      {!collapsed && (
        <>
          <WinBar predictions={predictions} />

          {PLAYERS.map(p => (
            <PlayerCard
              key={p.id}
              player={p}
              isActive={!gameOver && p.id === currentPlayer}
              score={scores[p.id]}
              prediction={predictions[p.id]}
              isWinner={gameOver && winner?.playerId === p.id}
            />
          ))}

          <MoveHistory history={moveHistory} />

          {/* Buttons */}
          <div style={{ padding: '10px 16px', display: 'flex', gap: 8 }}>
            <button
              onClick={onReset}
              style={{
                flex: 1,
                padding: '7px 0',
                background: 'transparent',
                border: '1px solid var(--border-bright)',
                borderRadius: 7,
                color: 'var(--teal)',
                fontSize: 11,
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(0,201,167,0.1)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >
              New Game
            </button>
            <button
              onClick={onResetAll}
              style={{
                flex: 1,
                padding: '7px 0',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 7,
                color: 'var(--text-secondary)',
                fontSize: 11,
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(124,58,237,0.1)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >
              Reset All
            </button>
          </div>

          {/* Home button */}
          {onHome && (
            <div style={{ padding: '0 16px 10px' }}>
              <button
                id="btn-go-home"
                onClick={onHome}
                style={{
                  width: '100%',
                  padding: '6px 0',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 7,
                  color: 'var(--text-muted)',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.target.style.color = '#f472b6'; e.target.style.borderColor = 'rgba(244,114,182,0.25)' }}
                onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'rgba(255,255,255,0.07)' }}
              >
                ← Home
              </button>
            </div>
          )}

          {/* Help */}
          <div style={{
            padding: '0 16px 12px',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}>
            Drag to pan · Click to place · 4-in-a-row wins
          </div>
        </>
      )}
    </div>
  )
}
