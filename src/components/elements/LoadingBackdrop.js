import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';

const LoadingBackdrop = ({
	open= true,
	handleClose = () => {},
	color = 'primary',
	size = 40,
	thickness = 4,
}) => (
	<Backdrop open={open} onClick={handleClose}>
		<CircularProgress disableShrink {...{ color, size, thickness }} />
	</Backdrop>
);

export default LoadingBackdrop;
