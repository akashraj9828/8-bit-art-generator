import React, { Fragment, useState, useEffect, useRef } from 'react';
import './Draw.scss';
import { download } from '../Util';

const emptyMatrix = (size) =>
	Array(size)
		.fill()
		.map((_) => Array(size).fill(''));

const Draw = (props) => {
	const [gridSize, setGridSize] = useState(8);
	const [canvas, setCanvas] = useState(emptyMatrix(gridSize));
	const [color, setColor] = useState('#e91e63');
	const [pixelSize, setPixelSize] = useState(20);
	const [svg, setSvg] = useState('');
	const fillCell = (row, col, e) => {
		(async () => {
			console.log(e);
			console.log(e.detail);
			console.log(e.metaKey);
			console.log(e.target);
			console.log(e.shiftKey);
			const canvasCopy = [...canvas];
			canvasCopy[row][col] = color;
			setCanvas([...canvasCopy]);
		})();
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

	const [html, setHtml] = useState('');

	useEffect(() => {
		(async () => {
			let shadow = [];
			let svg_internal = [];
			canvas.forEach((row, rowIndex) => {
				row.forEach((cell, colIndex) => {
					if (cell) {
						shadow.push(`${colIndex * pixelSize}px ${rowIndex * pixelSize}px  ${cell}`);
						svg_internal.push(`<rect width="${pixelSize}" height="${pixelSize}" style="transform:translate(${colIndex * pixelSize}px , ${rowIndex * pixelSize}px )" fill="${cell}" />`);
					}
				});
			});

			shadow = shadow.join(',');
			let new_css = `
		#pixelart-html {
			width: ${pixelSize * gridSize}px;
			height: ${pixelSize * gridSize}px;
		}
		
		#pixelart-html:after {
			content: '';
			display: block;
			width: ${pixelSize}px;
			height: ${pixelSize}px;
			background: ${canvas[0][0] ? canvas[0][0] : 'transparent'};
			box-shadow:${shadow} ;
			
		}`;
			setCss(new_css);

			const final_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pixelSize * gridSize}" height="${pixelSize * gridSize}" viewBox="0 0 ${pixelSize * gridSize} ${pixelSize * gridSize}">
								${svg_internal.join('\n')}
							</svg>	`;

			setSvg(final_svg);
		})();
	}, [canvas, pixelSize, gridSize]);

	const svgElement = useRef(null);

	useEffect(() => {
		if (svgElement) {
			(async () => {
				svgElement.current.innerHTML = svg;
			})();
		}
	}, [svg, svgElement]);

	useEffect(() => {
		(async () => {
			const old_style = document.getElementById('live-style');
			if (old_style) {
				old_style.remove();
			}
			var style = document.createElement('style');
			style.type = 'text/css';
			style.id = 'live-style';
			style.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(style);
		})();
	}, [css]);

	const downloadHTML = async () => {
		const text = ` 
		<style>
		${css}
		</style>
		<div id='pixelart-html'></div>
		`;
		download('pixelart.html', text);
	};

	const [dragging, setDragging] = useState(false);
	return (
		<Fragment>
			<div className='settings'>
				<input type='color' value={color} onChange={(e) => setColor(e.target.value)} />
				<div className='grid-size'>
					<button className='btn action-btn mx-1 decrement' onClick={() => setGridSize((s) => s - 1)}>
						-
					</button>
					<span className='grid-size-value'>
						{gridSize} x {gridSize}
					</span>
					<button className='btn action-btn mx-1 increment' onClick={() => setGridSize((s) => s + 1)}>
						+
					</button>
				</div>
				<div className='pixel-size'>
					<button className='btn action-btn mx-1 decrement' onClick={() => setPixelSize((s) => s - 1)}>
						-
					</button>
					<span className='pixel-size-value'>{pixelSize}px</span>
					<button className='btn action-btn mx-1 increment' onClick={() => setPixelSize((s) => s + 1)}>
						+
					</button>
				</div>
			</div>

			<div className='vs'>
				<div className='art-container d-none'>
					<span className='art-header'>
						HTML{' '}
						<button className='btn action-btn mx-1 html-download' onClick={downloadHTML}>
							{' '}
							Download{' '}
						</button>
					</span>
					<div id='pixelart-html' className='no-line-height'></div>
				</div>
				<div className='art-container'>
					<span className='art-header'>YOUR CANVAS</span>
					<div className='canvas noselect no-line-height' onSelect={() => false} onMouseDown={() => setDragging(true)} onMouseUp={() => setDragging(false)}>
						{canvas.map((rowData, row) => {
							return (
								<div className='cellrow' key={row}>
									{rowData.map((cell, col) => {
										const localStyle = {
											width: pixelSize,
											height: pixelSize,
											background: cell,
										};
										return <div key={`${row}+${col}`} className='cell noselect' style={localStyle} onClick={(e) => fillCell(row, col, e)} onMouseOver={(e) => dragging && fillCell(row, col, e)} />;
									})}
								</div>
							);
						})}
					</div>
				</div>
				<div className='art-container d-none'>
					<span className='art-header'>
						SVG{' '}
						<button
							className='btn action-btn mx-1 svg-download'
							onClick={() => {
								download('pixelart.svg', svg);
							}}>
							{' '}
							Download{' '}
						</button>{' '}
					</span>
					<div id='pixelart-svg' className='no-line-height' ref={svgElement}></div>
				</div>
			</div>
			<div className='output d-none'>
				<pre className='html'>{"<div id='pixelart-html'></div>"}</pre>
				<pre className='css'>{css}</pre>
			</div>
		</Fragment>
	);
};

export default Draw;

// Inconsolata, Monaco, Consolas, 'Courier New', Courier
