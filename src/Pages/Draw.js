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
	const [gridSize, setGridSize] = useState(20);
	const [canvas, setCanvas] = useState(emptyMatrix(14, 14));
	const [color, setColor] = useState('#ff6347');
	const verify = (row, col, canvas) => {
		return Boolean(canvas[row][col]);
	};

	const fillCell = (row, col) => {
		if (verify(row, col, canvas)) {
			const canvasCopy = JSON.parse(JSON.stringify(canvas));
			canvasCopy[row][col].color = color;
			setCanvas([...canvasCopy]);
		}
	};

	useEffect(() => {
		setCanvas(emptyMatrix(gridSize, gridSize));
	}, [gridSize]);

	useEffect(() => {}, [canvas]);

	const [dragging, setDragging] = useState(false);
	return (
		<Fragment>
			<div className='settings'>
				<input type='color' value={color} onChange={(e) => setColor(e.target.value)} />
				<input type='range' min='4' max='20' value={gridSize} onChange={(e) => setGridSize(e.target.valueAsNumber)} />
			</div>
			<div className='canvas noselect' onSelect={() => false} onMouseDown={() => setDragging(true)} onMouseUp={() => setDragging(false)}>
				{canvas.map((rowData, row) => {
					return (
						<div className='cellrow' key={row}>
							{rowData.map((cell, col) => {
								const localStyle = {
									width: 20,
									height: 20,
									background: cell.color,
									display: 'inline-flex',
								};
								return <div key={`${row}+${col}`} className='cell noselect' style={localStyle} onClick={() => fillCell(row, col)} onMouseOver={() => dragging && fillCell(row, col)} />;
							})}
						</div>
					);
				})}
			</div>
		</Fragment>
	);
};

export default Draw;

function aaa(sda, asdad) {}
// Inconsolata, Monaco, Consolas, 'Courier New', Courier
