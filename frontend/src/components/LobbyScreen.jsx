import { useState, useRef, useEffect } from 'react'
import { PLAYERS } from '../hooks/useGameLogic'

// ── animated floating symbols background ─────────────────────────────────────

function FloatingSymbols() {
  const symbols = PLAYERS.map(p => p.symbol)
  const items = Array.from({ length: 16 }, (_, i) => ({
    sym: symbols[i % symbols.length],
    color: PLAYERS[i % 4].color,
    glow: PLAYERS[i % 4].glow,
    left: `${5 + (i * 6.1) % 90}%`,
    delay: `${(i * 0.47) % 4}s`,
    dur: `${7 + (i * 1.1) % 6}s`,
    size: 14 + (i % 3) * 6,
    opacity: 0.06 + (i % 5) * 0.025,
  }))

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: it.left,
            bottom: '-60px',
            fontSize: it.size,
            color: it.color,
            opacity: it.opacity,
            textShadow: `0 0 20px ${it.glow}`,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            animation: `float-up ${it.dur} ${it.delay} linear infinite`,
          }}
        >
          {it.sym}
        </div>
      ))}
    </div>
  )
}

// ── room join input ───────────────────────────────────────────────────────────

function CodeInput({ onJoin, error }) {
  const [code, setCode] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          ref={inputRef}
          id="room-code-input"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase().slice(0, 6))}
          onKeyDown={e => e.key === 'Enter' && onJoin(code)}
          placeholder="ROOM CODE"
          maxLength={6}
          spellCheck={false}
          style={{
            flex: 1,
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: 18,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.2em',
            textAlign: 'center',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'var(--purple)'
            e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.2)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(124,58,237,0.25)'
            e.target.style.boxShadow = 'none'
          }}
        />
        <button
          id="btn-join-room"
          onClick={() => onJoin(code)}
          style={{
            padding: '12px 20px',
            background: 'var(--purple)',
            border: 'none',
            borderRadius: 10,
            color: '#fff',
            fontSize: 14,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 0.15s, background 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.target.style.background = '#9f67ff'; e.target.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.target.style.background = 'var(--purple)'; e.target.style.transform = '' }}
        >
          Join →
        </button>
      </div>
      {error && (
        <div style={{
          fontSize: 12,
          color: '#f472b6',
          fontFamily: 'var(--font-mono)',
          textAlign: 'center',
          padding: '6px 12px',
          background: 'rgba(244,114,182,0.08)',
          borderRadius: 6,
          border: '1px solid rgba(244,114,182,0.2)',
        }}>
          ⚠ {error}
        </div>
      )}
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────

export default function LobbyScreen({ onPlayLocal, onCreateRoom, onJoinRoom, mpError }) {
  const [mpOpen, setMpOpen] = useState(false)

  return (
    <>
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0) rotate(0deg); opacity: inherit; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes title-glow {
          0%,100% { text-shadow: 0 0 40px rgba(0,201,167,0.4), 0 0 80px rgba(124,58,237,0.3); }
          50%      { text-shadow: 0 0 80px rgba(0,201,167,0.7), 0 0 120px rgba(124,58,237,0.5); }
        }
        @keyframes badge-bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .lobby-btn {
          width: 100%;
          padding: 18px 28px;
          border-radius: 14px;
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          letter-spacing: 0.02em;
        }
        .lobby-btn:hover { transform: translateY(-2px); }
        .lobby-btn-local {
          background: linear-gradient(135deg, rgba(0,201,167,0.15) 0%, rgba(0,201,167,0.05) 100%);
          border: 1.5px solid rgba(0,201,167,0.4);
          color: var(--teal);
          box-shadow: 0 4px 24px rgba(0,201,167,0.1);
        }
        .lobby-btn-local:hover { box-shadow: 0 8px 32px rgba(0,201,167,0.25); border-color: var(--teal); }
        .lobby-btn-mp {
          background: linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 100%);
          border: 1.5px solid rgba(124,58,237,0.45);
          color: var(--purple-light);
          box-shadow: 0 4px 24px rgba(124,58,237,0.12);
        }
        .lobby-btn-mp:hover { box-shadow: 0 8px 32px rgba(124,58,237,0.3); border-color: var(--purple-light); }
      `}</style>

      <FloatingSymbols />

      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        background: 'radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(0,201,167,0.08) 0%, transparent 55%), var(--bg-deep)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          animation: 'float-in 0.5s cubic-bezier(0.34,1.2,0.64,1)',
        }}>

          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            {/* Player symbols row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
              {PLAYERS.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    width: 44, height: 44,
                    borderRadius: 10,
                    border: `1.5px solid ${p.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: p.glow.replace('0.5)', '0.1)'),
                    boxShadow: `0 0 20px ${p.glow.replace('0.5)', '0.3)')}`,
                    animation: `badge-bounce ${1.2 + i * 0.2}s ease-in-out infinite`,
                  }}
                >
                  <span style={{
                    fontSize: 18,
                    color: p.color,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    textShadow: `0 0 10px ${p.glow}`,
                  }}>{p.symbol}</span>
                </div>
              ))}
            </div>

            <h1 style={{
              fontSize: 36,
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--teal) 0%, var(--purple-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              marginBottom: 8,
              animation: 'title-glow 3s ease-in-out infinite',
            }}>
              4P Tic-Tac-Toe
            </h1>
            <p style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
            }}>
              4-in-a-row · infinite board
            </p>
          </div>

          {/* Mode buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Local */}
            <button
              id="btn-play-local"
              className="lobby-btn lobby-btn-local"
              onClick={onPlayLocal}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🖥️</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Local Game</div>
                  <div style={{ fontSize: 11, opacity: 0.65, fontFamily: 'var(--font-mono)', marginTop: 1 }}>
                    All 4 players on this tab
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 18, opacity: 0.6 }}>→</span>
            </button>

            {/* Multiplayer */}
            <button
              id="btn-multiplayer"
              className="lobby-btn lobby-btn-mp"
              onClick={() => setMpOpen(o => !o)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🌐</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Multiplayer</div>
                  <div style={{ fontSize: 11, opacity: 0.65, fontFamily: 'var(--font-mono)', marginTop: 1 }}>
                    Up to 4 players · same browser
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 14, opacity: 0.6, transition: 'transform 0.2s', transform: mpOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
            </button>

            {/* Multiplayer sub-panel */}
            {mpOpen && (
              <div style={{
                background: 'rgba(124,58,237,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                animation: 'float-in 0.25s ease-out',
              }}>
                {/* Create room */}
                <button
                  id="btn-create-room"
                  onClick={onCreateRoom}
                  style={{
                    padding: '13px 20px',
                    background: 'linear-gradient(135deg, rgba(0,201,167,0.2), rgba(0,201,167,0.05))',
                    border: '1px solid rgba(0,201,167,0.35)',
                    borderRadius: 10,
                    color: 'var(--teal)',
                    fontSize: 14,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,201,167,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                >
                  <span>🔑</span> Create a Room
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>OR JOIN</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>

                {/* Join with code */}
                <CodeInput onJoin={onJoinRoom} error={mpError} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            fontSize: 11,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.7,
          }}>
            Drag to pan · Click to place · 4-in-a-row wins
          </div>
        </div>
      </div>
    </>
  )
}
