/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react';
import './Draw.scss';
import { download } from '../Util';
import { heart15x15 } from '../Data';
import { useCopy } from '../CustomHooks';

const emptyMatrix = (size) =>
	Array(size)
		.fill()
		.map((_) => Array(size).fill(''));

const Draw = (props) => {
	const [gridSize, setGridSize] = useState(13);
	const [canvas, setCanvas] = useState(emptyMatrix(gridSize));
	const [color, setColor] = useState('#62fb60');
	const [colorHistory, setColorHistory] = useState([]);
	const [pixelSize, setPixelSize] = useState(20);
	const [dragging, setDragging] = useState(false);
	const svgElement = useRef(null);
	const [svg, setSvg] = useState('');
	const [css, setCss] = useState(`#pixelart {
		width: 240px;
		height: 240px;
	}
	`);
	const [copiedSVG, copySVG] = useCopy(svg);
	const [copiedCSS, copyCSS] = useCopy(`
	<style>
	${css}
	</style>
	<div id='pixelart-css'></div>
	`);
	// on gridSizeChange Reset Canvas
	useEffect(() => {
		let new_grid = emptyMatrix(gridSize);
		let old_grid = canvas;
		old_grid.forEach((row, rowIndex) => {
			if (gridSize > rowIndex) {
				row.forEach((cell, colIndex) => {
					if (gridSize > colIndex) {
						new_grid[rowIndex][colIndex] = old_grid[rowIndex][colIndex];
					}
				});
			}
		});
		setCanvas(new_grid);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gridSize]);

	// on init set heart art as default
	useEffect(() => {
		const default_canvas = heart15x15();
		setCanvas(default_canvas);
	}, []);

	// main logic to update canvas and create svg,html,css
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
				#pixelart-css {
					width: ${pixelSize * gridSize}px;
					height: ${pixelSize * gridSize}px;
				}
				
				#pixelart-css:after {
					content: '';
					display: block;
					width: ${pixelSize}px;
					height: ${pixelSize}px;
					background: ${canvas[0][0] ? canvas[0][0] : 'transparent'};
					box-shadow:${shadow} ;
					
				}`;
			setCss(new_css);

			const final_svg = [`<svg xmlns="http://www.w3.org/2000/svg" width="${pixelSize * gridSize}" height="${pixelSize * gridSize}" viewBox="0 0 ${pixelSize * gridSize} ${pixelSize * gridSize}">`, svg_internal.join(''), `</svg>`].join('');

			setSvg(final_svg);
		})();
	}, [canvas, pixelSize, gridSize]);

	// update svg
	useEffect(() => {
		if (svgElement) {
			(async () => {
				svgElement.current.innerHTML = svg;
			})();
		}
	}, [svg, svgElement]);

	// update html,css into the page
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

	const updateColor = (selected_color) => {
		setColor(selected_color);
		let colorHistoryCopy = [...colorHistory];
		if (!colorHistoryCopy.includes(selected_color)) {
			colorHistoryCopy.unshift(selected_color);
			colorHistoryCopy.splice(6);
		}
		setColorHistory(colorHistoryCopy);
	};

	const fillCell = (row, col, e) => {
		if (e.ctrlKey) {
			canvas[row][col] && setColor(canvas[row][col]);
			return;
		}
		(async () => {
			const canvasCopy = [...canvas];
			canvasCopy[row][col] = color;
			if (e.shiftKey) canvasCopy[row][col] = '';
			setCanvas([...canvasCopy]);
		})();
	};

	const handleHover = (row, col, e) => {
		if (e.ctrlKey) {
			canvas[row][col] && setColor(canvas[row][col]);
			return;
		}
		dragging && fillCell(row, col, e);
	};

	const downloadCSS = async () => {
		const text = ` 
		<style>
		${css}
		</style>
		<div id='pixelart-css'></div>
		`;
		download('pixelart.html', text);
	};

	const canvasDom = useMemo(() => {
		return canvas.map((rowData, row) => {
			return (
				<div className='cellrow' key={row}>
					{rowData.map((cell, col) => {
						const localStyle = {
							width: pixelSize,
							height: pixelSize,
							background: cell,
						};
						return <div key={`${row}+${col}`} className='cell' style={localStyle} onClick={(e) => fillCell(row, col, e)} onMouseOver={(e) => handleHover(row, col, e)} />;
					})}
				</div>
			);
		});
	}, [canvas, pixelSize, dragging]);

	const downloadCanvas = () => {
		let str = JSON.stringify(canvas);
		download('canvas.json', str);
	};

	return (
		<Fragment>
			<div className='draw-container'>
				<div className='settings noselect'>
					<div className='grid-size'>
						<button className='btn action-btn mx-1 btn-square decrement' onClick={() => setGridSize((s) => (s > 1 ? s - 1 : s))}>
							-
						</button>
						<span className='grid-size-value'>
							{gridSize} x {gridSize}
						</span>
						<button className='btn action-btn mx-1 btn-square increment' onClick={() => setGridSize((s) => s + 1)}>
							+
						</button>
					</div>
					<div className='pixel-size'>
						<button className='btn action-btn mx-1 btn-square decrement' onClick={() => setPixelSize((s) => (s > 5 ? s - 1 : s))}>
							-
						</button>
						<span className='pixel-size-value'>{pixelSize}px</span>
						<button className='btn action-btn mx-1 btn-square increment' onClick={() => setPixelSize((s) => s + 1)}>
							+
						</button>
					</div>
					<div className='extra'>
						<button className='btn action-btn mx-1 reset-btn' onClick={() => setCanvas(emptyMatrix(gridSize))}>
							Reset
						</button>
					</div>
					<br />
				</div>
				<div className='color center'>
					<span className='small text-muted my-05 text-center'>
						(Hold 'Shift' key and drag to Erase) <br /> (Hold 'Ctrl' and hover over a cell to copy it's color){' '}
					</span>
					<div className='colors'>
						{colorHistory.map((e, i) => (
							<span key={i} className='color-history circle' style={{ background: e }} onClick={() => updateColor(e)}></span>
						))}
						<input type='color' value={color} onChange={(e) => updateColor(e.target.value)} />
					</div>
				</div>
				<div className='vs noselect'>
					<div className='art-container'>
						<span className='art-header'>CSS</span>
						<div id='pixelart-css' className='no-line-height'></div>
						<div className='btn-container'>
							<button className='btn action-btn my-1 css-download' onClick={downloadCSS}>
								Download
							</button>
							<button
								className='btn action-btn my-1 css-copy'
								onClick={() => {
									copyCSS();
								}}>
								{copiedCSS ? 'Copied CSS! ' : 'Copy CSS'}
							</button>
						</div>
					</div>
					<div className='art-container'>
						<span className='art-header' onDoubleClick={downloadCanvas}>
							YOUR CANVAS
						</span>
						<div id='pixelart-canvas' className='canvas no-line-height' onSelect={() => false} onMouseDown={() => setDragging(true)} onMouseUp={() => setDragging(false)}>
							{canvasDom}
						</div>
					</div>
					<div className='art-container'>
						<span className='art-header'>SVG</span>
						<div id='pixelart-svg' className='no-line-height' ref={svgElement}></div>
						<div className='btn-container'>
							<button
								className='btn action-btn my-1 svg-download'
								onClick={() => {
									download('pixelart.svg', svg);
								}}>
								Download
							</button>
							<button
								className='btn action-btn my-1 svg-copy'
								onClick={() => {
									copySVG();
								}}>
								{copiedSVG ? 'Copied SVG! ' : 'Copy SVG'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Draw;

// Inconsolata, Monaco, Consolas, 'Courier New', Courier
