import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';

const backdropStyle = {
	zIndex: 100,
	color: '#fff',
	width: '100vw',
	height: 'calc(100vh - 64px)',
	background: 'rgba(100, 140, 180, 0.5)',
	position: 'fixed',
	left: 0,
	top: '64px',
	textAlign: 'center',
};

const LoadingBackdrop = ({
	color = 'primary',
	size = 100,
	thickness = 2,
}) => (
	<div style={backdropStyle}>
		<CircularProgress disableShrink {...{ color, size, thickness }} style={{ marginTop: 100 }} />
	</div>
);

LoadingBackdrop.propTypes = {
	color: PropTypes.oneOf(['primary', 'secondary', 'inherit']),
	size: PropTypes.number,
	thickness: PropTypes.number,
}

export default LoadingBackdrop;
