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
	const [color, setColor] = useState('tomato');
	const verify = (row, col, canvas) => {
		return Boolean(canvas[row][col]);
	};

	const fillCell = (row, col) => {
		if (verify(row, col, canvas)) {
			const canvasCopy = JSON.parse(JSON.stringify(canvas));
			canvasCopy[row][col].color = color;
			setCanvas([...canvasCopy]);
			console.log('canvas update');
		}
	};

	useEffect(() => {
		console.log('---: Draw -> canvas changed');
		console.log('---: Draw -> canvas', canvas);
	}, [canvas]);

	return (
		<Fragment>
			<div className='settings'>
				<input type='color' value={color} onChange={(e) => setColor(e.target.value)} />
			</div>
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
								return <div key={`${row}+${col}`} className='cell' style={localStyle} onClick={() => fillCell(row, col)} />;
							})}
							<br />
						</Fragment>
					);
				})}
			</div>
		</Fragment>
	);
};

export default Draw;

function aaa(sda, asdad) {}
// Inconsolata, Monaco, Consolas, 'Courier New', Courier
