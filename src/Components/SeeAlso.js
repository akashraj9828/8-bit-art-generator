import React from 'react';
import './SeeAlso.scss';
const SeeAlso = () => {
	const extra_projects = [['SVG TEXT ANIMATION GENERATOR', 'https://akashraj9828.github.io/svg-text-animation-generator/']];

	return (
		<div className='see-also'>
			{extra_projects.map(([name, link], i) => {
				return (
					<span className='projects mx-1' key={i}>
						Also see (<a href={link}>{name}</a>)
					</span>
				);
			})}
		</div>
	);
};

export default SeeAlso;
