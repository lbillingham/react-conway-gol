import React, { useState } from 'react';
import { produce } from 'immer';

const numRows = 25;
const numCols = 25;
const cellSize = 20;
const borderStyle = "solid 1px black";
const aliveColor = 'pink';
const deadColor = undefined;

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
  return (
    <>
      <button onClick={() => { setRunning(!running) }}>{running ? 'Stop' : 'Start'}</button>
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
