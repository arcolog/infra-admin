import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Chip, Toolbar } from '@material-ui/core';
import { Home } from '@material-ui/icons';
import routes from '../routes';
import { CHANNELS, MENU_TYPES, MENU_TYPE_DETAILS } from '../constants';
import { getChannelName } from '../utils';
import { fetchSitesAsync } from '../api';

const Nav = () => {
	const location = useLocation();
	const [sites, setSites] = useState([]);
	const [selectedPage, setSelectedPage] = useState();
	const [selectedRoute, setSelectedRoute] = useState();
	const [selectedChannelName, setSelectedChannelName] = useState();
	const [selectedChannel, setSelectedChannel] = useState();
	const [selectedType, setSelectedType] = useState();

	const initFromPathAsync = async() => {
		// eslint-disable-next-line no-unused-vars
		const [ , page, channel, type ] = location.pathname.split('/');
		const currentMainRoute = `/${page}`;
		const matchingRoute = routes.find(route => route.path.indexOf(currentMainRoute) === 0);
		setSelectedPage(matchingRoute ? matchingRoute.label : 'Infra admin');
		if (page === 'menu' || page === 'links') {
			setSelectedChannel(channel && CHANNELS.indexOf(channel) > -1 ? channel : undefined);
			if (!sites.length) {
				const result = await fetchSitesAsync();
				setSites(result.data.data);
			}
			const site = sites.find(s => s.channel === channel);
			if (channel && site) {
				setSelectedChannelName(site.label);
			}
			setSelectedType(type && MENU_TYPES.indexOf(type) > -1 ? type : undefined);
		} else {
			setSelectedRoute(currentMainRoute);
			setSelectedChannel(undefined);
		}
	}

	useEffect(initFromPathAsync, []);
	useEffect(initFromPathAsync, [location.pathname]);

	return (
		<AppBar position="static">
			<Toolbar id="navBar">
  			<Link to="/home"><Home style={{ marginRight: 20, border: '2px solid #fff', padding: '5px', borderRadius: '20px' }}/></Link>

				<h3>
					<b>{selectedRoute ? <Link to={selectedRoute}>{selectedPage}</Link> : selectedPage}</b>
					{selectedChannel && <Chip label={selectedChannelName || getChannelName(selectedChannel)} style={{ marginLeft: 10 }} />}
					{selectedType && <Chip label={MENU_TYPE_DETAILS[selectedType].title} style={{ marginLeft: 10 }} />}
				</h3>
			</Toolbar>
		</AppBar>
	)
}

export default Nav;
