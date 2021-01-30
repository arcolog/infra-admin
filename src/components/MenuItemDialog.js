import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import LoopIcon from '@material-ui/icons/Loop';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import { LIST_TYPE_SOCIAL } from '../constants';

const MenuItemDialog = ({
  item,
	isOpened,
	isLoading,
	handleSubmitAsync,
	handleDeleteAsync,
	handleClose,
	handleChange,
	error,
}) => {
	const [errors, setErrors] = React.useState({});
	const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);
	const fields = [
		{	name: 'label', label: 'Nimetus', helperText: 'Vähemalt 3 tähte', validate: val => val.length < 3 ? 'Nimetus on liiga lühike' : undefined },
		{	name: 'url', label: 'URL', helperText: 'Lokaalne (/..) või väline (https://...) link', validate: val => !val ? 'URL puudub' : undefined },
	]
	const modalLabel = item.id ? 'Muuda kirjet' : 'Lisa kirje';
	const showDelete = item.id && (
		!!item.menuItemId || // is subitem
		!item.subItems.length // is parent without subitems
	);

	const onSubmit = async (e) => {
		e.preventDefault();
		const updatedErrors = {};
		for (const field of fields) {
			updatedErrors[field.name] = field.validate(item[field.name]);
		}
		setErrors(updatedErrors);
		const hasErrors = Object.values(errors).find(err => !!err);
		if (!hasErrors) {
			await handleSubmitAsync();
		}
	}

	return (
		<Dialog	open={isOpened}	onClose={() => {setDeleteConfirmVisible(false);handleClose()}}>
			<DialogTitle style={{ cursor: 'move' }} id="menu-item-dialog">
				{modalLabel}
				{isLoading && <LoopIcon />}
			</DialogTitle>
			<form onSubmit={onSubmit}>
				<DialogContent style={{ minWidth: 350 }}>
					<DialogContentText>
						{fields.map(field => (
							<Box mb={2} key={field.name}>
								<TextField
									key={field.name}
									name={field.name}
									label={field.label}
									defaultValue={item[field.name]}
									onChange={e => handleChange(field.name, e.target.value)}
									helperText={errors[field.name] || field.helperText}
									error={!!errors[field.name]}
									inputProps={{ autocomplete: 'off' }}
									variant="outlined"
								  size="small"
									style={{ width: '100%' }}
									disabled={item.type === LIST_TYPE_SOCIAL && field.name === 'label'}
								/>
							</Box>
						))}
					  {error && <p style={{ color: 'red' }}>{error}</p>}
					</DialogContentText>
				</DialogContent>
				{deleteConfirmVisible ? (
					<DialogActions>
						<p style={{ color: 'red' }}>Kas oled kindel,<br />et kustutame?</p>
						<Button onClick={() => setDeleteConfirmVisible(false)} color="secondary" variant="outlined">Tühista</Button>
						<Button onClick={handleDeleteAsync} color="primary" variant="outlined">OK</Button>
					</DialogActions>
				) : (
					<DialogActions>
						{showDelete && <Button onClick={() => setDeleteConfirmVisible(true)} color="secondary" variant="outlined" startIcon={<DeleteIcon />}>Kustuta</Button>}
						<Button onClick={handleClose} color="default" variant="outlined" startIcon={<CancelIcon />}>Tühista</Button>
						<Button color="primary" variant="outlined"
						        startIcon={<SaveIcon />}
						        component={props => <button {...props} type="submit"/>}>Salvesta</Button>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
};

MenuItemDialog.propTypes = {
	item: PropTypes.shape({
		id: PropTypes.number,
		menuItemId: PropTypes.number,
		label: PropTypes.string,
		url: PropTypes.string,
		subItems: PropTypes.array,
	}),
	error: PropTypes.string,
	isOpened: PropTypes.bool,
	isLoading: PropTypes.bool,
	handleSubmitAsync: PropTypes.func,
	handleDeleteAsync: PropTypes.func,
	handleClose: PropTypes.func,
	handleOpen: PropTypes.func,
};

export default MenuItemDialog;
