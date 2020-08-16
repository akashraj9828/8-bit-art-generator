import React, { Fragment } from 'react';
import './Header.scss';
import Bmc from './Bmc';
const Header = () => {
	return (
		<Fragment>
			<header>8-Bit Art Generator</header>
			<Bmc />
		</Fragment>
	);
};

export default Header;
