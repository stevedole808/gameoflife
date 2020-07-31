import React, {useState, useCallback, useRef, useEffect} from 'react';
import produce from 'immer'
import './App.css';
import { Button, Container, ButtonGroup } from '@material-ui/core';

const numColumns = 40

const numRows = 25

const operations = [
  [0,1],
  [0,-1],
  [1,-1],
  [-1,1],
  [1,1],
  [-1,-1],
  [1,0],
  [-1,0]
]

const clearGrid = () => {
  const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numColumns), () => 0));
    }
    return rows;
}

function App() {
  const [grid, setGrid] = useState(() => {
    return clearGrid()
  });

  const[gen, setGen] = useState(0);

  useEffect(() => {
    if(running){
      setGen(gen +1)
      setTimeout(runSimulation, 1000)
    }
  },[grid])

  const [running, setRunning] = useState(false);

  const runningRef = useRef();
  
  runningRef.current = running

  const [colors] = useState(["#FFA07A", "#FA8072", "#F08080", "#B22222", "#FF0000", "#FF4500"]);

  const changeBackground = () => {
    const type = colors
    if (type.length <= 0){
      return
    }
    else if (type.length > 0){
      const random = type[Math.floor(Math.random() * type.length)];
      return random
    }
    else {
      return "red"
    }
  }

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for ( let j = 0; j < numColumns; j++) {
            let neighbors = 0;
              operations.forEach(([x, y]) => {
                const newI = i + x;
                const newJ = j + y;
                if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
                  neighbors += g[newI][newJ]
                }
              })

              if(neighbors < 2 || neighbors > 3) {
                gridCopy[i][j]  = 0
              } else if (g[i][j] === 0 && neighbors === 3) {
                gridCopy[i][j] = 1;
              } else gridCopy[i][j] = gridCopy[i][j];        
          }
        }        
      });
    });
    if(runningRef.current) {
        setTimeout(runSimulation, 1000);
    }
  }, [])
  
  const preset1 = () => {
    if(!running) {
      const gridCopy = produce(grid, grid2 => {
        grid2[4][2] = 1
        grid2[5][3] = 1
        grid2[6][3] = 1
        grid2[3][3] = 1
        grid2[4][4] = 1
        grid2[4][3] = 1
        grid2[5][1] = 1
        grid2[5][5] = 1
        grid2[7][3] = 1
        grid2[8][3] = 1
      })
      setGrid(gridCopy)
    }
  }

  const preset2 = () => {
    if(!running) {
      const gridCopy = produce(grid, grid2 => {
        grid2[11][11] = 1
        grid2[12][11] = 1
        grid2[13][11] = 1
        grid2[13][10] = 1
        grid2[12][9] = 1
      })
      setGrid(gridCopy)
    }
  }

  const preset3 = () => {
    if(!running) {
      const gridCopy = produce(grid, grid2 => {
        grid2[8][12] = 1
        grid2[8][14] = 1
        grid2[9][10] = 1
        grid2[9][16] = 1
        grid2[10][11] = 1
        grid2[10][15] = 1
        grid2[11][12] = 1
        grid2[11][13] = 1
        grid2[11][14] = 1
      })
      setGrid(gridCopy)
    }
  }

  return (
    <>
      <h1
      style={{
        display: 'flex',
        justifyContent: 'center', 
      }}
      >
          Conways Game Of Life
      </h1>
      <h3
      style={{
        display: 'flex',
        justifyContent: 'center', 
      }}
      >Learn The Rules!</h3>
      <div>
        <ul>
          <li
          style={{
            display: 'flex',
            justifyContent: 'center', 
          }}>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
          <li 
          style={{
            display: 'flex',
            justifyContent: 'center', 
          }}>Any live cell with two or three live neighbours lives on to the next generation.</li>
          <li
          style={{
            display: 'flex',
            justifyContent: 'center', 
          }}>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
          <li
          style={{
            display: 'flex',
            justifyContent: 'center', 
          }}>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
        </ul>
      </div>
      <Container
      style={{
        display: 'flex',
        textAlign: 'center',
        AlignItems: 'center',
        justifyContent: 'center', 
      }}
      >
      <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numColumns}, 20px)`,
            AlignItems: 'center',
            justifyContent: 'center',   
            backgroundColor: 'black',
            border: '1px solid red'
          }}
        >
        {grid.map((rows, i) => 
          rows.map((col, k) => (
            <div 
              key={`${i}-${k}`}
              onClick={() => {
                if (!running){
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  })
                  setGrid(newGrid)
                }}
                }
              style={{
                width: 20,
                height: 20, 
                backgroundColor: grid[i][k] ? changeBackground() : undefined, 
                border: 'solid 1px red',
              }} 
            />
          ))
        )}
        </div>
    </Container>
    <h2
    style={{
      display: 'flex',
      justifyContent: 'center', 
    }}
    > 
    Generation: {gen} 
    </h2>
    <div>
    <ButtonGroup 
      variant="contained" 
      color="primary" 
      aria-label="contained primary button group" 
      margin='40px'
      style={{
        display: 'flex',
        justifyContent: 'center', 
      }}
    >
        <Button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
              setGen(0)
          } else {
            setGen(gen)
          }
        }
            }
        >
          {running ? "Stop" : "Start"}
        </Button>
        <Button 
        onClick={() => {
          setGrid(clearGrid());
          setGen(0)
          if (running) {
            alert("Stop the program before clearing!")
          }
        }}>
          Clear
        </Button>
        <Button 
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numColumns), () => Math.random() > .8 ? 1 : 0));
            }
            setGrid(rows)
            }}
        >
          Random
        </Button>
        <Button>
          <h4>Choose A Preset:</h4>
          {<button onClick={preset1}>Arrow</button>}
          {<button onClick={preset2}>Slider</button>}
          {<button onClick={preset3}>Smile</button>}
        </Button>
      </ButtonGroup>
    </div>
  </>
  )
}

export default App;

