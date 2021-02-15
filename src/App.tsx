import React, { useCallback, useRef, useState } from 'react';
import { produce } from 'immer';

const numRows = 25;
const numCols = 25;
const cellSize = 20;
const borderStyle = "solid 1px black";
const aliveColor = 'pink';
const deadColor = undefined;
const timeStep = 250; // ms

const neighbourOffsets = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
];

const filledGrid = (fillVal?: boolean) => {
  const filling = fillVal ? fillVal : false;
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => filling));
  }
  return rows;
}

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return filledGrid();
  });
  const [running, setRunning] = useState(false)
  const runningRef = useRef(running);
  runningRef.current = running;


  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((currentGrid) => {
      return produce(currentGrid, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbours = 0;
            neighbourOffsets.forEach(([dx, dy]) => {
              const newI = i + dx;
              const newK = k + dy;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbours += currentGrid[newI][newK] ? 1 : 0;
              }
            }
            )
            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][k] = false;
            } else if (currentGrid[i][k] === false && neighbours === 3) {
              gridCopy[i][k] = true;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, timeStep)
  }, [])
  return (
    <>
      <button onClick={() => {
        setRunning(!running);
        if (!running) {
          runningRef.current = true;
          runSimulation();
        }
      }}>{running ? 'Stop' : 'Start'}</button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = !grid[i][k]
                });
                setGrid(newGrid);
              }}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: grid[i][k] ? aliveColor : deadColor,
                border: borderStyle
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default App;
