import GameBoard from './components/GameBoard'
import PlayerPanel from './components/PlayerPanel'
import TurnHUD from './components/TurnHUD'
import WinOverlay from './components/WinOverlay'
import { useGameLogic } from './hooks/useGameLogic'

export default function App() {
  const {
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
  } = useGameLogic()

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
