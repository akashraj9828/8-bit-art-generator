import React, { Fragment, useState, useEffect } from 'react';
import './Draw.scss';

const emptyMatrix = (size) =>
	Array(size)
		.fill()
		.map((_) => Array(size).fill(''));

const Draw = (props) => {
	const [gridSize, setGridSize] = useState(8);
	const [canvas, setCanvas] = useState(emptyMatrix(gridSize));
	const [color, setColor] = useState('#e91e63');
	const [pixelSize, setPixelSize] = useState(20);

	const fillCell = (row, col) => {
		const canvasCopy = [...canvas];
		canvasCopy[row][col] = color;
		setCanvas([...canvasCopy]);
	};

	useEffect(() => {
		setCanvas(emptyMatrix(gridSize));
	}, [gridSize]);

	useEffect(() => {}, [canvas]);

	const [css, setCss] = useState(`#pixelart {
		width: 240px;
		height: 240px;
	}
	`);

	useEffect(() => {
		let shadow = [];

		canvas.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				if (cell) {
					shadow.push(`${colIndex * pixelSize}px ${rowIndex * pixelSize}px ${cell}`);
				}
			});
		});

		shadow = shadow.join(',') + ';';
		let new_css = `
		#pixelart {
			width: ${pixelSize * gridSize}px;
			height: ${pixelSize * gridSize}px;
		}
		
		#pixelart:after {
			content: '';
			display: block;
			width: 24px;
			height: 24px;
			background: ${canvas[0][0] ? canvas[0][0] : 'transparent'};
			box-shadow:${shadow} ;
			
		}`;
		setCss(new_css);
	}, [canvas]);

	useEffect(() => {
		const old_style = document.getElementById('live-style');
		if (old_style) {
			old_style.remove();
		}
		var style = document.createElement('style');
		style.type = 'text/css';
		style.id = 'live-style';
		style.innerHTML = css;
		document.getElementsByTagName('head')[0].appendChild(style);
	}, [css]);

	const [dragging, setDragging] = useState(false);
	return (
		<Fragment>
			<div className='settings'>
				<input type='color' value={color} onChange={(e) => setColor(e.target.value)} />
				<input type='range' min='4' max='20' value={gridSize} onChange={(e) => setGridSize(e.target.valueAsNumber)} />
			</div>

			<div className='vs'>
				<div className='canvas noselect' onSelect={() => false} onMouseDown={() => setDragging(true)} onMouseUp={() => setDragging(false)}>
					{canvas.map((rowData, row) => {
						return (
							<div className='cellrow' key={row}>
								{rowData.map((cell, col) => {
									const localStyle = {
										width: pixelSize,
										height: pixelSize,
										background: cell,
										display: 'inline-flex',
									};
									return <div key={`${row}+${col}`} className='cell noselect' style={localStyle} onClick={() => fillCell(row, col)} onMouseOver={() => dragging && fillCell(row, col)} />;
								})}
							</div>
						);
					})}
				</div>
				<div className='real'>
					<div id='pixelart'></div>
				</div>
			</div>
			<div className='output'>
				<pre className='html'>{"<div id='pixelart'></div>"}</pre>
				<pre className='css'>{css}</pre>
			</div>
		</Fragment>
	);
};

export default Draw;

function aaa(sda, asdad) {}
// Inconsolata, Monaco, Consolas, 'Courier New', Courier
