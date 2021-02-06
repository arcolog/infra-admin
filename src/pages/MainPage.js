import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { CHANNELS, MENU_TYPES, MENU_TYPE_DETAILS } from '../constants';
import { fetchMenuStatsAsync } from '../api';
import LoadingBackdrop from '../components/elements/LoadingBackdrop';

const MainPage = () => {
	const [isLoading, setIsLoading] = React.useState(true);
	const [stats, setStats] = React.useState({});
	const StyledTableRow = withStyles((theme) => ({
		root: {
			'&:nth-of-type(even)': {
				backgroundColor: theme.palette.action.hover,
			},
		},
	}))(TableRow);

	React.useEffect(async () => {
		const data = (await fetchMenuStatsAsync()).data.data;
		setStats(data);
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return <LoadingBackdrop />
	}

	return (
		<div>
			<Link to="/sheet">Andmetabelid leiad siit »</Link>
			<hr />
			<p>Palun vali, millist menüüd soovid muuta</p>
			<Table size="small" stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell>Kanal</TableCell>
						{MENU_TYPES.map(type => (
							<TableCell key={type}>
								<b>{MENU_TYPE_DETAILS[type].title}</b><br />
								{MENU_TYPE_DETAILS[type].description}
							</TableCell>
						))}
						<TableCell>Lingid ja infra</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{CHANNELS.map(channel => (
						<StyledTableRow key={channel}>
							<TableCell>{stats[channel].name}</TableCell>
							{MENU_TYPES.map(type => {
								const total = stats[channel] ? stats[channel][type] : 0;
								return (
									<TableCell key={type}>
										<Link to={`/menu/${channel}/${type}`}>{total ? 'Muuda' : 'Lisa'}</Link>
										{total ? ` (${stats[channel][type]})` : ''}
									</TableCell>
								)
							})}
							<TableCell><Link to={`/links/${channel}`}>Muuda</Link></TableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default MainPage;
