import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { CHANNELS, MENU_TYPES, MENU_TYPE_DETAILS } from '../constants';
import { getChannelName } from '../utils';

const MainPage = () => {

	const StyledTableRow = withStyles((theme) => ({
		root: {
			'&:nth-of-type(even)': {
				backgroundColor: theme.palette.action.hover,
			},
		},
	}))(TableRow);

	return (
		<div>
			<p>Palun vali, millist menüüd soovid muuta</p>
			<Table size="small" stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell>Kanal</TableCell>
						{MENU_TYPES.map(type => <TableCell key={type}>{MENU_TYPE_DETAILS[type].description}</TableCell>)}
					</TableRow>
				</TableHead>
				<TableBody>
					{CHANNELS.map(channel => (
						<StyledTableRow key={channel}>
							<TableCell>{getChannelName(channel)}</TableCell>
							{MENU_TYPES.map(type => (
								<TableCell key={type}><Link to={`/${channel}/menu/${type}`}>Muuda</Link></TableCell>
							))}
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default MainPage;
