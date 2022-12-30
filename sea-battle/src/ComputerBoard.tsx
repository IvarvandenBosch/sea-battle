import { useEffect, useState } from 'react'
import './App.css'
import useSharedState from 'react-use-shared-state';

export default function ComputerBoard() {
  const shipAmount = 4
  const [shipField, setShipField] = useState(Array.from({ length: 12 }, () => new Array(12).fill(false)))
  const [boats, setBoats] = useState<Array<any> | undefined>()
  const [playing, setPlaying] = useSharedState('playing', false)
  const [winner, setWinner] = useSharedState<string | undefined>('winner', undefined)
  const [discoverdBoatsAmount, setDiscorveredBoatsAmount] = useState(0)
  const [turn, setTurn] = useSharedState('turn')

  useEffect(() => {
    generateBoard()
    getBoats()
  }, [playing])  

  function checkForWinner() {
    const res = shipField.flat().every(row => row !== true)

    if (res) {
        setTimeout(() => {
            setWinner('Player')
        }, 200);
    }

  }

  function generateBoard() {
    let boatsArray: any[] = []
    for (let i = 0; i < shipAmount; i++) {
      let length = Math.floor(Math.random() * (4 - 2 + 1) + 2)
      const axis = Math.floor(Math.random() * 2) === 0 ? 'x' : 'y'

      const random = Math.floor(Math.random() * 12)

      let boat: object[] = []

      let random2 = Math.floor(Math.random() * 12)

      let decrease = true

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
    getBoats()
  }

  
  function getBoats() {
    let boatsArray: any[] = []
    let newField = [...shipField]

    // @ts-ignore
    const hasDuplicates = (boatsArray: any) => new Set(boatsArray.map(({x, y}) => JSON.stringify([x, y]))).size < boatsArray.length;
    
    boats?.forEach(boat => {
      boat.boat.forEach((originalObject: { x: number; y: number }) => {
        newField[originalObject.x][originalObject.y] = true
        boatsArray = [...boatsArray, originalObject] 
      })
    })
    if (hasDuplicates(boatsArray)) {
      location.reload()
    }
    setShipField(newField)
    // console.log(boatsArray)
  }

  function handleClick(columnIdx: number, rowIdx:number) {
    if (playing) {
        let newField = [...shipField]
        if (shipField[columnIdx][rowIdx] === true) {
            // console.log('Hit!')
            newField[columnIdx][rowIdx] = 'red'
        } else if (shipField[columnIdx][rowIdx] === false && shipField[columnIdx][rowIdx] !== 'red') {
        console.log('miss')
        newField[columnIdx][rowIdx] = 'miss'
        }
        setShipField([...newField])
        if (shipField[columnIdx][rowIdx] === 'red') {
            checkForWinner()
        } 
        if (shipField[columnIdx][rowIdx] === 'red') {
            return
        } else {
            setTurn('Comp')
        }
    }
}

return (
    <div className="App">
      <div className='field'>
        {shipField.map((column: Array<boolean | string>, columnIdx: number) => {
          return (
            <div className={`col ${!playing && 'inactive'}`}>
              {
                column.map((row: boolean | string, rowIdx: number) => {
                  return (
                    <div className='row' onClick={() => handleClick(columnIdx, rowIdx)} style={{backgroundColor: row === 'red' ? 'red' : row === 'miss' ? '#000' : '#fff', pointerEvents: row === `miss` ? 'none' : 'auto'}}>
                    </div>
                  )
                })
              }
            </div>
          )
        })}
        {!playing && <button onClick={() => setPlaying(true)}>Play</button>}
      </div>
    </div>
  )
}

