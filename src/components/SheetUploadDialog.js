import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input, TextField } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import { CircularProgress } from '@material-ui/core';
import { uploadSheetAsync } from '../api';
import { getFileExtension } from '../utils';

const SheetUploadDialog = ({
	isOpened,
	handleSubmitAsync,
	handleClose,
}) => {
	const [isUploading, setIsUploading] = useState(false);
	const [isUploaded, setIsUploaded] = useState(false);
	const [errors, setErrors] = useState({});
	const [uploadError, setUploadError] = useState();
	const [selectedFile, setSelectedFile] = useState();
	const [isFileSelected, setIsFileSelected] = useState(false);
	const [data, setData] = useState({ title: '', googleSheetId: '' });
	const [progress, setProgress] = useState(0);

	const handleFileSelect = (event) => {
		setProgress(0);
		setUploadError(undefined);
		setSelectedFile(event.target.files[0]);
		setIsFileSelected(true);
		const err = validateExtension(event.target.files[0].name);
		setErrors(prevState => ({ ...prevState, file: err }));
	};

	const handleChange = (field, value) => {
		setData(prevState => ({ ...prevState, [field]: value }));
	}

	const fields = [
		{	name: 'title', label: 'Nimetus', helperText: 'Vähemalt 3 tähte',
			validate: val => val.length < 3 ? 'Nimetus on liiga lühike' : undefined },
		{	name: 'googleSheetId', label: 'Google Sheet ID', helperText: 'Osa välisest lingist',
			validate: val => (val && val.length < 45) ? 'Id on liiga lühike' : undefined },
	];

	const validateExtension = (filename) => {
		const ext = getFileExtension(filename);
		if (ext === 'xls') {
			return 'Vananenud XLS-failid pole toetatud!';
		}
		return ext && ext === 'xlsx' ? undefined : 'See pole Exceli fail!';
	}

	const onUploadProgress = event => {
		setProgress(Math.round(100 * event.loaded / event.total));
	}

	const onClose = () => {
		setIsUploading(false);
		setIsFileSelected(false);
		setProgress(0);
		handleClose();
	}

	const validate = () => {
		const updatedErrors = {};
		for (const field of fields) {
			updatedErrors[field.name] = field.validate(data[field.name] || '');
		}
		updatedErrors.file = validateExtension(selectedFile ? selectedFile.name : '');
	  setErrors(updatedErrors);
		return updatedErrors;
	}

	const onSubmit = async (e) => {
		e.preventDefault();
		const updatedErrors = validate();
    const hasErrors = Object.values(updatedErrors).find(err => !!err);
		if (!hasErrors) {
			setIsUploading(true); // TODO: implement upload progress bar
			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append('title', data.title);
			formData.append('googleSheetId', data.googleSheetId || '');
			const result = await uploadSheetAsync({ formData, onUploadProgress });
			console.log('upload result', result);
			setIsUploading(false);
			if (result?.data?.message) {
				setIsUploaded(true);
				setIsFileSelected(false);
				await handleSubmitAsync();
			}
			if (result?.error) {
				setUploadError(result.error);
			}
		}
	}

	return (
		<Dialog	open={isOpened}	onClose={onClose}>
			<DialogTitle style={{ cursor: 'move' }} id="menu-item-dialog">
				Lae fail üles
				{isUploading && <CircularProgress size={16} style={{ margin: '0 10px' }} />}
				{progress > 0 && ` ${progress}%`}
			</DialogTitle>
			<form onSubmit={onSubmit} encType="multipart/form-data">
				<DialogContent style={{ minWidth: 350 }}>
					<DialogContentText>
						{fields.map(field => (
							<Box mb={2} key={field.name}>
								<TextField
									key={field.name}
									name={field.name}
									label={field.label}
									defaultValue={''}
									onChange={e => handleChange(field.name, e.target.value)}
									helperText={errors[field.name] || field.helperText}
									error={!!errors[field.name]}
									inputProps={{ autoComplete: 'off' }}
									variant="outlined"
									size="small"
									style={{ width: '100%' }}
								/>
							</Box>
						))}
						<Box>
							<Input type="file" name="file" onChange={handleFileSelect} />
							{isFileSelected && !errors.file && (
								<div>{selectedFile.name}, {Math.round(selectedFile.size / 1024)} KB</div>
							)}
							{errors.file && (
								<div style={{ color: 'red', size: 10 }}>{errors.file}</div>
							)}
						</Box>
						{isUploaded && <p>Fail laeti üles!</p>}
						{uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="default" variant="outlined" startIcon={<CancelIcon />}>Tühista</Button>
					<Button color="primary" variant="outlined"
					        startIcon={<SaveIcon />} disabled={!isFileSelected || isUploading}
					        component={props => <button {...props} type="submit"/>}>Salvesta</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

SheetUploadDialog.propTypes = {
	isOpened: PropTypes.bool,
	isLoading: PropTypes.bool,
	handleSubmitAsync: PropTypes.func,
	handleClose: PropTypes.func,
};

export default SheetUploadDialog;
