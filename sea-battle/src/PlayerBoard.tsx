import { useEffect, useState } from 'react'
import './App.css'
import useSharedState from 'react-use-shared-state'
import usePrevious from './hooks/usePrevious'

export default function PlayerBoard() {
  const shipAmount = 4
  const [shipField, setShipField] = useState(Array.from({ length: 12 }, () => new Array(12).fill(false)))
  const [boats, setBoats] = useState<Array<any> | undefined>()
  const [playing, setPlaying] = useSharedState('playing')
  const [turn, setTurn] = useSharedState('turn', 'Player')
  const [winner, setWinner] = useSharedState<string | undefined>('winner')

  useEffect(() => {
    generateBoard()
  }, [])

  type previousT = {
    x: number,
    y: number
  }

  useEffect(() => {
    getBoats()
  }, [playing])

  function generateBoard() {
    let boatsArray: any[] = []
    for (let i = 0; i < shipAmount; i++) {
      let length = Math.floor(Math.random() * (4 - 2 + 1) + 2)

      // Should boat be vertical or horizontal
      const axis = Math.floor(Math.random() * 2) === 0 ? 'x' : 'y'

      const random = Math.floor(Math.random() * 12)
      
      let boat: object[] = []
      let random2 = Math.floor(Math.random() * 12)
    
      // should loop increase or decrease coordinates
      let decrease = true

      // determine if decrease var should be true or false
      if (random2 - length < 0) {
        decrease = false
      } else {
        decrease = true
      }

    if (axis === 'x') {
      for (let i = 0; i < length; i++) {
        boat = [...boat, {x: random ,y: random2}]
        if (decrease) {
          random2 = random2 - 1
        } else {
          random2 = random2 + 1
        }
      }
    } else {
      for (let i = 0; i < length; i++) {
        boat = [...boat, {x:  random2, y: random}]
        if (decrease) {
          random2 = random2 - 1
        } else {
          random2 = random2 + 1
        }
      }
    }
    boatsArray = [...boatsArray,
      {
        length: length,
        boat: boat
      }
    ]
    }
    setBoats(boatsArray)
  }

  
  function getBoats() {
    let newField = [...shipField]
    let boatsArray: any[] = []

    // @ts-ignore
    const hasDuplicates = (boatsArray: any) => new Set(boatsArray.map(({x, y}) => JSON.stringify([x, y]))).size < boatsArray.length;
    
    boats?.forEach(boat => {
      boat.boat.forEach((originalObject: { x: number; y: number }) => {
        newField[originalObject.x][originalObject.y] = true
        boatsArray = [...boatsArray, originalObject] 
      })
    })
    if (hasDuplicates(boatsArray)) {
      location.reload();
    }
    setShipField(newField)
  }

  function checkForWinner() {
    const res = shipField.flat().every(row => row !== true)

    if (res) {
        setTimeout(() => {
            setWinner('Comp')
        }, 200);
    }

  }
  
    useEffect(() => {
      if (turn === 'Comp') {
          let newShipField: any[] = [...shipField]
          // Should boat be vertical or horizontal
          const axis = Math.floor(Math.random() * 2) === 0 ? 'x' : 'y'
      
          const randomX = Math.floor(Math.random() * 12)
          let randomY = Math.floor(Math.random() * 12)
        
          // should loop increase or decrease coordinates
          let decrease = Math.floor(Math.random() * 2)
      
        if (axis === 'x') {
            if (shipField[randomX][randomY] === true) {
              newShipField[randomX][randomY] = 'red'
            } else if (shipField[randomX][randomY] === false) {
              newShipField[randomX][randomY] = 'blue'
            }
        } else {
            if (shipField[randomX][randomY] === true) {
              newShipField[randomX][randomY] = 'red'
            } else if (shipField[randomX][randomY] === false) {
              newShipField[randomX][randomY] = 'blue'
            }
        }
        setTurn('Player')
        if (shipField[randomX][randomY] === 'red') {
            
        }
        checkForWinner()
        }
    }, [turn])


  return (
    <div className="App">
      <div className='field'>
        {shipField.map((column: Array<boolean>, columnIdx: number) => {
          return (
            <div className='col'>
              {
                column.map((row: boolean | string, rowIdx: number) => {
                  return (
                    <div className='row' style={{backgroundColor: row === true ? '#333' : row === 'red'  ? 'red' : row === 'blue' ? 'blue' : winner === 'Player' && row === 'redw' ? 'green' : '#000'}}>
                    </div>
                  )
                })
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}