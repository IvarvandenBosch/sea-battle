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
  const [clicked, setClicked] = useState<any>()
  const previous = usePrevious<any>(clicked)
  const [lastDirection, setLastDirection] = useState()
  const [winner, setWinner] = useSharedState<string | undefined>('winner')

  useEffect(() => {
    generateBoard()
  }, [])


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
        console.log('It ran')
          let newShipField: any[] = [...shipField]
          // Should boat be vertical or horizontal
          const axis = Math.floor(Math.random() * 2) === 0 ? 'x' : 'y'
      
          let randomX = Math.floor(Math.random() * 12)
          let randomY = Math.floor(Math.random() * 12)
            
          let decrease = true
          let previousXIncrease = 1
          let previousYDecrease = 2
          let previousYIncrease = 3
          let previousXDecrease = 4

          function tryAgain() {
            let found = false;
            while (!found) {
              randomX = Math.floor(Math.random() * 12);
              randomY = Math.floor(Math.random() * 12);
              if (shipField[randomX][randomY] !== 'blue' && shipField[randomX][randomY] !== 'red') {
                found = true;
              }
            }
          }
          tryAgain()

          if (previous) {
            previousXIncrease = previous.x + 1;
            previousYDecrease = previous.y - 1;
            previousYIncrease = previous.y + 1;
            previousXDecrease = previous.x - 1;

            // should loop increase or decrease coordinates
            if (axis === "x") {
              // Check for availability on x axis
              if (
                previousXDecrease > 0 &&
                shipField[previousXDecrease][previous.y] !== "blue"
              ) {
                console.log("check if x spot is available, decrease");
                decrease = true;
              } else if (
                previousXIncrease < 12 &&
                shipField[previousXIncrease][previous.y] !== "blue"
              ) {
                console.log("check if x spot is available, increase");
                decrease = false;
              } else {
                // if none available use random spot on x axis
                tryAgain();
                if (shipField[randomX][randomY] === true) {
                  newShipField[randomX][randomY] = "red";
                  setClicked({ x: randomX, y: randomY });
                  setTurn("Player");
                  return;
                } else if (shipField[randomX][randomY] === false) {
                  newShipField[randomX][randomY] = "blue";
                }
              }
            } else {
              // Check for availability on y axis
              if (
                previousYDecrease > 0 &&
                shipField[previous.x][previousYDecrease] !== "blue"
              ) {
                console.log("check if y spot is available, decrease");
                decrease = true;
              } else if (
                previousYIncrease < 12 &&
                shipField[previous.x][previousYIncrease] !== "blue"
              ) {
                console.log("check if y spot is available, increase");
                decrease = false;
              } else {
                // if none available use random spot on y axis
                tryAgain();
                if (shipField[randomX][randomY] === true) {
                  newShipField[randomX][randomY] = "red";
                  // reset the clicked spot to a random one
                  setClicked({ x: randomX, y: randomY });
                  setTurn("Player");
                  return;
                } else if (shipField[randomX][randomY] === false) {
                  newShipField[randomX][randomY] = "blue";
                }
              }
            }
          }

          // Add a 10% chance that the computer will guess a true value
          if (Math.random() < 0.1) {
            randomX = Math.floor(Math.random() * 12);
            randomY = Math.floor(Math.random() * 12);
            // Keep generating random coordinates until we find a true value
            while (shipField[randomX][randomY] !== true) {
              randomX = Math.floor(Math.random() * 12);
              randomY = Math.floor(Math.random() * 12);
            }
            // Set the new spot to red
            newShipField[randomX][randomY] = "red";
            setClicked({ x: randomX, y: randomY });
            setTurn("Player");
            checkForWinner()
            return;
          }

          function generateRandom(key: string) {
            if (key === 'noRandom') {
              console.log('generated a random one')
              if (shipField[randomX][randomY] === true) {
                newShipField[randomX][randomY] = 'red'
                setClicked({x: randomX, y: randomY})
              } else if (shipField[randomX][randomY] === false) {
                newShipField[randomX][randomY] = 'blue'
                setClicked(undefined)
              } else if (shipField[randomX][randomY] === 'blue' || shipField[randomX][randomY] === 'red'){
                generateRandom('yesRandom')
              }
            } else if (key === 'yesRandom') {
              let counter = 0;
              do {
                randomX = Math.floor(Math.random() * 12)
                randomY = Math.floor(Math.random() * 12)
                counter += 1;
              } while (shipField[randomX][randomY] === 'blue' || shipField[randomX][randomY] === 'red');
          
              // Break out of the loop if the counter reaches a certain value
              if (counter > 2) {
                return
              }
          
              if (shipField[randomX][randomY] === true) {
                newShipField[randomX][randomY] = 'red'
                setClicked({x: randomX, y: randomY})
              } else if (shipField[randomX][randomY] === false) {
                newShipField[randomX][randomY] = 'blue'
                setClicked(undefined)
              }
            }
          }

          // function generateRandom(key: string) {
          //   if (key === 'noRandom') {
          //     console.log('generated a random one')
          //     if (shipField[randomX][randomY] === true) {
          //       newShipField[randomX][randomY] = 'red'
          //       setClicked({x: randomX, y: randomY})
          //     } else if (shipField[randomX][randomY] === false) {
          //       newShipField[randomX][randomY] = 'blue'
          //     } else if (shipField[randomX][randomY] === 'blue' || shipField[randomX][randomY] === 'red'){
          //       generateRandom('yesRandom')
          //     }
          //   } else if (key === 'yesRandom') {
          //     console.log('generated a completely random one')
          //     tryAgain()   
              
          //     if (shipField[randomX][randomY] === true) {
          //       newShipField[randomX][randomY] = 'red'
          //       setClicked({x: randomX, y: randomY})
          //     } else if (shipField[randomX][randomY] === false) {
          //       newShipField[randomX][randomY] = 'blue'
          //     } else if (shipField[randomX][randomY] === 'blue' || shipField[randomX][randomY] === 'red'){
          //       generateRandom('yesRandom')
          //     }
          //     setClicked(undefined) 
          //   }
          // }

          if (previous === undefined) {
            generateRandom('noRandom')
          } else {
            if (axis === 'x') {
              if (decrease) {
                if (previousXDecrease < 0 || shipField[previousXDecrease][previous.y] === 'blue') {
                  console.log('undefined', previousXDecrease, previous.y)
                  generateRandom('yesRandom')
                } else {
                  if (shipField[previousXDecrease][previous.y] === true) {
                    setClicked({x: previousXDecrease, y: previous.y})
                    newShipField[previousXDecrease][previous.y] = 'red'
                  } else if (shipField[previousXDecrease][previous.y] === false) {
                    newShipField[previousXDecrease][previous.y] = 'blue'
                  } 
                }
              } else {
                if (previousXIncrease > 11 || shipField[previousXIncrease][previous.y] === 'blue') {
                  console.log('undefined', previousXIncrease, previous.y)
                  generateRandom('yesRandom')
                } else {
                  if (shipField[previousXIncrease][previous.y] === true) {
                    newShipField[previousXIncrease][previous.y] = 'red'
                    setClicked({x: previousXIncrease, y: previous.y})
                  } else if (shipField[previousXIncrease][previous.y] === false) {
                    newShipField[previousXIncrease][previous.y] = 'blue'
                  }
                }
              }
            } else {
              if (decrease) {
                if (previousYDecrease < 0 || shipField[previous.x][previousYDecrease] === 'blue') {
                  console.log('undefined', previous.x, previousYDecrease)
                  generateRandom('yesRandom')
                } else {
                  if (shipField[previous.x][previousYDecrease] === true) {
                    newShipField[previous.x][previousYDecrease] = 'red'
                    setClicked({x: previous.x, y: previousYDecrease})
                  } else if (shipField[previous.x][previousYDecrease] === false) {
                    newShipField[previous.x][previousYDecrease] = 'blue'
                  }
                }
              } else {
                if (previousYIncrease > 11 || shipField[previous.x][previousYIncrease] === 'blue') {
                  console.log('undefined', previous.x, previousYIncrease)
                  generateRandom('yesRandom')
                } else {
                  if (shipField[previous.x][previousYIncrease] === true) {
                    newShipField[previous.x][previousYIncrease] = 'red'
                    setClicked({x: previous.x, y: previousYIncrease})
                  } else if (shipField[previous.x][previousYIncrease] === false){
                    newShipField[previous.x][previousYIncrease] = 'blue'
                  } 
                }
              }
            }

          }
        setTurn('Player')
        checkForWinner()
        return
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
