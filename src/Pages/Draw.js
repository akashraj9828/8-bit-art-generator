import React, { Fragment, useState, useEffect } from 'react';
import './Draw.scss';

const emptyCell = (row, col) => ({ color: '', row, col });
const emptyMatrix = (row, col) =>
	Array(row)
		.fill()
		.map((_, r) =>
			Array(col)
				.fill()
				.map((_, c) => emptyCell(r, c))
		);

const Draw = (props) => {
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
			console.log('canvas update');
		}
	};

	useEffect(() => {
		console.log('---: Draw -> canvas changed');
		console.log('---: Draw -> canvas', canvas);
	}, [canvas]);

	return (
		<div className='canvas'>
			{canvas.map((rowData, row) => {
				return (
					<Fragment key={row}>
						{rowData.map((cell, col) => {
							const localStyle = {
								width: size,
								height: size,
								background: cell.color,
								display: 'inline-flex',
							};
							return <div key={`${row}+${col}`} className='cell' style={localStyle} onClick={() => setColor(row, col, 'yellow')} />;
						})}
						<br />
					</Fragment>
				);
			})}
		</div>
	);
};

export default Draw;

function aaa(sda, asdad) {}
// Inconsolata, Monaco, Consolas, 'Courier New', Courier
