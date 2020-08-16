import React from 'react';
import Git from './Git';
import './Footer.scss';
import SeeAlso from './SeeAlso';
function Footer() {
	return (
		<footer>
			<Git />
			<SeeAlso />
			<span className='footer-text'>
				With{' '}
				<span className='heart' aria-label='love'>
					❤
				</span>{' '}
				by <a href='https://akashraj.tech'>Akash Raj</a>
			</span>
		</footer>
	);
}

export default Footer;
