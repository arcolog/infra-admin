import React from 'react';
import PropTypes from 'prop-types';
import MuiAlert from '@material-ui/lab/Alert';

// https://material-ui.com/components/snackbars/
const ErrorPage = ({ message = 'Lehel tekkis viga', type = 'error' }) => {
	// TODO: log it?
	return (
		<MuiAlert elevation={6}  variant="filled" severity={type}>{message}</MuiAlert>
	)
}

ErrorPage.propTypes = {
	message: PropTypes.string,
	type: PropTypes.oneOf(['error', 'info', 'warning', 'success'])
}

export default ErrorPage;
