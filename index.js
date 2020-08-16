import { h, Fragment } from "preact";
import style from "./style.scss";
console.log("---: style", style);

import { useState,useEffect } from "preact/hooks";
const emptyCell = (row, col) => ({ color: "", row, col });
const emptyMatrix = (row, col) =>
  Array(row)
    .fill()
    .map((_, r) =>
      Array(col)
        .fill()
        .map((_, c) => emptyCell(r, c))
    );

const Home = (props) => {
  const [canvas, setCanvas] = useState(emptyMatrix(8, 8));
  const [size, setSize] = useState(20);

  const verify = (row, col, canvas) => {
    return Boolean(canvas[row][col]);
  };

  const setColor = (row, col, color) => {
    //    console.log("---: setColor -> row,col,color", row,col,color);
    if (verify(row, col, canvas)) {
      const canvasCopy = JSON.parse(JSON.stringify(canvas));
      canvasCopy[row][col].color = color;
      // console.log("---: setColor -> canvasCopy", canvasCopy);
	  setCanvas([...canvasCopy]);
	  console.log("canvas update")
    }
  };

  useEffect(() => {
    console.log("---: Home -> canvas changed");
  }, [canvas]);

  return (
    <div class={style.canvas}>
      {canvas.map((rowData, row) => {
        return (
          <Fragment>
            {rowData.map((cell, col) => {
              const localStyle = {
                width: size,
                height: size,
                color: "pink",
                display: "inline-flex",
              };
              return (
                <div
                  class={style.cell}
                  style={localStyle}
                  onClick={() => setColor(row, col, "yellow")}
                />
              );
            })}
            <br />
          </Fragment>
        );
      })}
    </div>
  );
};

export default Home;

// Inconsolata, Monaco, Consolas, 'Courier New', Courier
// Fira code
// Source Code Pro
