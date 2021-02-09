import React, { useEffect, useState } from 'react';

import UploadIcon from '@material-ui/icons/Backup';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import { Table, TableHead, TableBody, TableRow, TableCell, Grid, Button } from '@material-ui/core';
import { formatDate } from '../utils';
import { fetchSheetListAsync, downloadSheetAsync } from '../api';
import LoadingBackdrop from '../components/elements/LoadingBackdrop';
import SheetUploadDialog from '../components/SheetUploadDialog';

const uploadButtonProps = { color: 'primary', size: 'small', variant: 'outlined', startIcon: <UploadIcon /> };

const SheetPage = () => {
	const [sheets, setSheets] = useState([]);
	const [showDialog, setShowDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const loadSheetsAsync = async () => {
		setIsLoading(true);
		const result = await fetchSheetListAsync();
		setIsLoading(false);
		setSheets(result.data.data);
	};

	const handleSubmitAsync = async () => {
		setShowDialog(false);
		await loadSheetsAsync();
	}

	// although API responds with blob, we can not download it directly, so use this hack
	const downloadFileAsync = async (sheet) => {
		const response = await downloadSheetAsync({ id: sheet.id });
		const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }));
		const link = document.createElement('a');
		link.download = sheet.filename;
		link.href = url;
		link.target = '_blank';
		link.click();
	}

	const renderSheetLink = (sheet) => {
		if (sheet.googleSheetId) {
			return <a href={`https://docs.google.com/spreadsheets/d/${sheet.googleSheetId}/edit`}
			   target="_blank" rel="noreferrer">{sheet.filename}</a>;
		}
		return sheet.filename;
	}

	useEffect(async () => {
		await loadSheetsAsync();
	}, []);

	if (isLoading) {
		return <LoadingBackdrop />
	}

	return (
		<div>
			<Grid container justify="space-between" alignItems="center">
				<Grid item style={{ fontSize: 13 }}>
					Andmetabelid on Exceli tabelid, mida lisatakse artiklitesse Google Sheets ID viite abil -<br />
				  front-end tõmbab selle tulemusel InfraAPIst tabeli andmed JSON formaadis.<br />
					Kui tabelil on Google Sheets ID olemas, saab alltoodud teda lingil klikkides avada Google Sheetsis.<br />
					Üles saab laadida max 5 MB suuruseid Exceli faile (.xlsx)
				</Grid>
				<Grid item>
					<Button	onClick={() => setShowDialog(true)} {...uploadButtonProps }>Lae uus fail</Button>
				</Grid>
			</Grid>
			<br />
			<Table size="small" stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell>Avalik nimetus</TableCell>
						<TableCell>Faili nimi</TableCell>
						<TableCell>Suurus</TableCell>
						<TableCell>Uuendatud</TableCell>
						<TableCell>Lae alla</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sheets.map(sheet => (
						<TableRow key={sheet.id}>
							<TableCell>{sheet.title}</TableCell>
							<TableCell>{renderSheetLink(sheet)}</TableCell>
							<TableCell>{`${Math.round(sheet.size / 1024)} KB`}</TableCell>
							<TableCell>{formatDate(sheet.updatedAt)}</TableCell>
							<TableCell><DownloadIcon style={{ cursor: 'pointer' }} onClick={() => downloadFileAsync(sheet)} /></TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<SheetUploadDialog
				handleSubmitAsync={handleSubmitAsync}
				handleClose={() => setShowDialog(false)}
				isOpened={showDialog}
			/>
		</div>
	)
}

export default SheetPage;
