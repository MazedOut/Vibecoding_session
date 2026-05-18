import { useState, useCallback } from 'react'
import GameBoard from './components/GameBoard'
import PlayerPanel from './components/PlayerPanel'
import TurnHUD from './components/TurnHUD'
import WinOverlay from './components/WinOverlay'
import LobbyScreen from './components/LobbyScreen'
import MultiplayerLobby from './components/MultiplayerLobby'
import { useGameLogic } from './hooks/useGameLogic'
import { useMultiplayer } from './hooks/useMultiplayer'

// ─── top-level screen router ─────────────────────────────────────────────────

export default function App() {
  // 'home' | 'local' | 'mp'
  const [screen, setScreen] = useState('home')

  const local  = useGameLogic()
  const mp     = useMultiplayer()

  // ── helpers ──────────────────────────────────────────────────────────────

  const goHome = useCallback(() => {
    mp.leaveRoom()
    setScreen('home')
  }, [mp])

  const startLocal = useCallback(() => {
    local.resetAll()
    setScreen('local')
  }, [local])

  const createRoom = useCallback(() => {
    mp.createRoom()
    setScreen('mp')
  }, [mp])

  const joinRoom = useCallback((code) => {
    mp.joinRoom(code)
    setScreen('mp')
  }, [mp])

  // ── decide what to render ────────────────────────────────────────────────

  // ── HOME ─────────────────────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <LobbyScreen
        onPlayLocal={startLocal}
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
        mpError={null}
      />
    )
  }

  // ── LOCAL ─────────────────────────────────────────────────────────────────
  if (screen === 'local') {
    const {
      board, currentPlayer, winner, scores, predictions,
      moveHistory, gameOver, lastMove, placepiece, resetGame, resetAll,
    } = local

    return (
      <>
        <GameBoard
          board={board}
          currentPlayer={currentPlayer}
          winner={winner}
          lastMove={lastMove}
          gameOver={gameOver}
          onPlace={placepiece}
        />
        <TurnHUD
          currentPlayer={currentPlayer}
          gameOver={gameOver}
          moveCount={moveHistory.length}
          roomCode={null}
          mySlot={null}
          isMyTurn={true}
        />
        <PlayerPanel
          currentPlayer={currentPlayer}
          winner={winner}
          scores={scores}
          predictions={predictions}
          moveHistory={moveHistory}
          gameOver={gameOver}
          onReset={resetGame}
          onResetAll={resetAll}
          onHome={goHome}
          roomCode={null}
          mySlot={null}
        />
        {gameOver && winner && (
          <WinOverlay
            winner={winner}
            scores={scores}
            onReset={resetGame}
            onResetAll={resetAll}
          />
        )}
      </>
    )
  }

  // ── MULTIPLAYER ───────────────────────────────────────────────────────────
  if (screen === 'mp') {
    const {
      board, currentPlayer, winner, scores, predictions,
      moveHistory, gameOver, lastMove,
      roomCode, mySlot, isHost, phase, error,
      playersReady, isMyTurn, playerSlots,
      sendMove, startGame, resetGame, resetAll, leaveRoom,
    } = mp

    // Waiting room (lobby phase)
    if (phase === 'idle' || phase === 'joining' || phase === 'lobby') {
      return (
        <MultiplayerLobby
          roomCode={roomCode || '…'}
          mySlot={mySlot}
          isHost={isHost}
          playersReady={playersReady}
          playerSlots={playerSlots}
          phase={phase}
          onStart={startGame}
          onLeave={goHome}
        />
      )
    }

    // Playing
    // In multiplayer, only allow placing if it's my turn
    const handlePlace = (x, y) => {
      if (!isMyTurn) return
      sendMove(x, y)
    }

    return (
      <>
        <GameBoard
          board={board}
          currentPlayer={currentPlayer}
          winner={winner}
          lastMove={lastMove}
          gameOver={gameOver}
          onPlace={handlePlace}
          // Dim ghost cell if it's not your turn
          ghostDisabled={!isMyTurn}
        />
        <TurnHUD
          currentPlayer={currentPlayer}
          gameOver={gameOver}
          moveCount={moveHistory.length}
          roomCode={roomCode}
          mySlot={mySlot}
          isMyTurn={isMyTurn}
        />
        <PlayerPanel
          currentPlayer={currentPlayer}
          winner={winner}
          scores={scores}
          predictions={predictions}
          moveHistory={moveHistory}
          gameOver={gameOver}
          onReset={resetGame}
          onResetAll={resetAll}
          onHome={goHome}
          roomCode={roomCode}
          mySlot={mySlot}
        />
        {gameOver && winner && (
          <WinOverlay
            winner={winner}
            scores={scores}
            onReset={resetGame}
            onResetAll={resetAll}
          />
        )}
      </>
    )
  }

  return null
}
