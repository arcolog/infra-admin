import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import LoopIcon from '@material-ui/icons/Loop';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Paper } from '@material-ui/core';

const DraggableDialog = ({
	children,
	id = 'draggable-dialog',
	isOpened = false,
	isLoading = false, // will be set to true when saving or deleting is in progress
	handleSubmit = () => {},
	handleDelete = () => {},
	handleClose = () => {},
	modalLabel = '',
	submitLabel = 'Salvesta',
	cancelLabel = 'Tühista',
	deleteLabel = 'Kustuta',
	deleteConfirm = 'Kas oled kindel, et kustutame?',
	showDelete,
	error,
}) => {
	const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);

	const PaperComponent = (props) => (
		<Draggable handle={`#${id}`} cancel={'[class*="MuiDialogContent-root"]'}>
			<Paper {...props} />
		</Draggable>
	);

	return (
		<Dialog
			open={isOpened}
			onClose={() => {setDeleteConfirmVisible(false);handleClose()}}
			PaperComponent={PaperComponent}
			aria-labelledby={id}
		>
			<DialogTitle style={{ cursor: 'move' }} id={id}>
				{modalLabel}
				{isLoading && <LoopIcon />}
			</DialogTitle>
			<DialogContent style={{ minWidth: 370 }}>
				<DialogContentText>
					{children}
					{error && <p style={{ color: 'red' }}>{error}</p>}
				</DialogContentText>
			</DialogContent>
				{deleteConfirmVisible ? (
					<DialogActions>
						<p>{deleteConfirm}</p>
						<Button onClick={() => setDeleteConfirmVisible(false)} color="secondary" variant="outlined">{cancelLabel}</Button>
						<Button onClick={handleDelete} color="primary" variant="outlined">OK</Button>
					</DialogActions>
				) : (
					<DialogActions>
						{showDelete && <Button onClick={() => setDeleteConfirmVisible(true)} color="secondary" variant="outlined" startIcon={<DeleteIcon />}>{deleteLabel}</Button>}
						<Button onClick={handleClose} color="default" variant="outlined" startIcon={<CancelIcon />}>{cancelLabel}</Button>
						<Button onClick={handleSubmit} color="primary" variant="outlined" startIcon={<SaveIcon />}>{submitLabel}</Button>
					</DialogActions>
				)}
		</Dialog>
	);
}

DraggableDialog.propTypes = {
	id: PropTypes.string,
	isOpened: PropTypes.bool,
	isLoading: PropTypes.bool,
	error: PropTypes.string,
	handleSubmit: PropTypes.func,
	handleCancel: PropTypes.func,
	handleOpen: PropTypes.func,
	modalLabel: PropTypes.string,
	submitLabel: PropTypes.string,
	cancelLabel: PropTypes.string,
	showDelete: PropTypes.bool,
}

export default DraggableDialog;
