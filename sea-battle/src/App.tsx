import PlayerBoard from "./PlayerBoard"
import ComputerBoard from "./ComputerBoard"
import { useState } from "react"
import useSharedState from "react-use-shared-state"

function App() {
  const [winner, setWinner] = useSharedState('winner')
  return (
    <>
    {winner && <>
      <div className="cover">
        <h1 className="win">{winner === 'Player' ? 'You won!' : 'You lost'}</h1>
        <button onClick={() => setWinner(undefined)}>Play Again</button>
      </div>
    </>
    }
    <main>
      <section> 
        <h2>Your fleet</h2>
        <PlayerBoard />
      </section>
      <section>
        <h2>Opponent's fleet</h2>
        <ComputerBoard />
      </section>
    </main>
    </>
  )
}

export default App