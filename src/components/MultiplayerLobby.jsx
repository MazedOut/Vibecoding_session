import { useState, useEffect } from 'react'
import { PLAYERS } from '../hooks/useGameLogic'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      id="btn-copy-code"
      onClick={copy}
      style={{
        padding: '6px 14px',
        background: copied ? 'rgba(0,201,167,0.2)' : 'rgba(124,58,237,0.15)',
        border: `1px solid ${copied ? 'rgba(0,201,167,0.5)' : 'var(--border)'}`,
        borderRadius: 7,
        color: copied ? 'var(--teal)' : 'var(--text-secondary)',
        fontSize: 12,
        fontFamily: 'var(--font-mono)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {copied ? '✓ Copied!' : '⎘ Copy'}
    </button>
  )
}

function SlotRow({ slot, player, tabId, mySlot, isOccupied }) {
  const isMe = slot === mySlot
  const color = player.color
  const glow = player.glow

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 16px',
      borderRadius: 10,
      background: isOccupied
        ? `linear-gradient(135deg, ${glow.replace('0.5)', '0.08)')} 0%, transparent 100%)`
        : 'rgba(255,255,255,0.02)',
      border: `1px solid ${isOccupied ? glow.replace('0.5)', '0.25)') : 'rgba(255,255,255,0.05)'}`,
      transition: 'all 0.3s',
    }}>
      {/* Symbol badge */}
      <div style={{
        width: 36, height: 36,
        borderRadius: 8,
        border: `1.5px solid ${isOccupied ? color : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isOccupied ? glow.replace('0.5)', '0.12)') : 'transparent',
        flexShrink: 0,
        transition: 'all 0.3s',
        boxShadow: isOccupied ? `0 0 16px ${glow}` : 'none',
      }}>
        <span style={{
          fontSize: 16,
          color: isOccupied ? color : 'rgba(255,255,255,0.15)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          textShadow: isOccupied ? `0 0 8px ${glow}` : 'none',
        }}>
          {player.symbol}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: isOccupied ? color : 'var(--text-muted)',
        }}>
          {player.name}
          {isMe && (
            <span style={{
              marginLeft: 8,
              fontSize: 9,
              background: color,
              color: '#000',
              padding: '1px 6px',
              borderRadius: 3,
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}>YOU</span>
          )}
        </div>
        <div style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          marginTop: 2,
        }}>
          {isOccupied ? 'Connected' : 'Waiting...'}
        </div>
      </div>

      {/* Status dot */}
      <div style={{
        width: 8, height: 8,
        borderRadius: '50%',
        background: isOccupied ? color : 'rgba(255,255,255,0.1)',
        boxShadow: isOccupied ? `0 0 8px ${glow}` : 'none',
        flexShrink: 0,
        transition: 'all 0.3s',
        animation: isOccupied ? 'glow-pulse-green 2s ease-in-out infinite' : 'none',
      }} />
    </div>
  )
}

export default function MultiplayerLobby({
  roomCode,
  mySlot,
  isHost,
  playersReady,
  playerSlots,
  onStart,
  onLeave,
  phase,
}) {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 500)
    return () => clearInterval(t)
  }, [])

  const canStart = isHost && playersReady >= 2

  return (
    <>
      <style>{`
        @keyframes glow-pulse-green {
          0%,100% { box-shadow: 0 0 4px currentColor; opacity: 1; }
          50%      { box-shadow: 0 0 14px currentColor; opacity: 0.7; }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.12) 0%, transparent 60%), var(--bg-deep)',
        zIndex: 200,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 400,
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          animation: 'float-in 0.4s cubic-bezier(0.34,1.2,0.64,1)',
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              {isHost ? '👑 Host · Waiting for players' : '🎮 Joined'}
            </div>
            <h2 style={{
              fontSize: 26,
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--teal), var(--purple-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}>
              Room Lobby
            </h2>
          </div>

          {/* Room code card */}
          <div style={{
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '18px 20px',
          }}>
            <div style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 10,
            }}>
              Room Code — Share with friends
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                flex: 1,
                fontSize: 28,
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--teal)',
                letterSpacing: '0.22em',
                textShadow: '0 0 20px rgba(0,201,167,0.4)',
              }}>
                {roomCode}
              </div>
              <CopyButton text={roomCode} />
            </div>
          </div>

          {/* Player slots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 2,
            }}>
              Players ({playersReady}/4)
            </div>
            {PLAYERS.map((p, i) => (
              <SlotRow
                key={p.id}
                slot={i}
                player={p}
                mySlot={mySlot}
                isOccupied={!!playerSlots?.[i]}
              />
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {isHost && (
              <button
                id="btn-start-game"
                onClick={onStart}
                disabled={!canStart}
                style={{
                  padding: '14px 0',
                  background: canStart
                    ? 'linear-gradient(135deg, var(--teal) 0%, var(--purple-light) 100%)'
                    : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  borderRadius: 12,
                  color: canStart ? '#000' : 'var(--text-muted)',
                  fontSize: 15,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  cursor: canStart ? 'pointer' : 'not-allowed',
                  transition: 'transform 0.15s, box-shadow 0.2s',
                  boxShadow: canStart ? '0 4px 24px rgba(0,201,167,0.3)' : 'none',
                }}
                onMouseEnter={e => canStart && (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                {canStart
                  ? `Start Game (${playersReady} players)`
                  : `Waiting for players${dots}`}
              </button>
            )}

            {!isHost && (
              <div style={{
                padding: '14px 0',
                textAlign: 'center',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                Waiting for host to start{dots}
              </div>
            )}

            <button
              id="btn-leave-room"
              onClick={onLeave}
              style={{
                padding: '10px 0',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 10,
                color: 'var(--text-muted)',
                fontSize: 12,
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f472b6'; e.currentTarget.style.borderColor = 'rgba(244,114,182,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              ← Leave Room
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
