import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Chip, Toolbar } from '@material-ui/core';
import { Home } from '@material-ui/icons';
import { CHANNELS, MENU_TYPES, MENU_TYPE_DETAILS } from '../constants';
import { getChannelName } from '../utils';
import { fetchSitesAsync } from '../api';

const DEFAULT_TYPE = MENU_TYPES[0];

const Nav = () => {
	const location = useLocation();
	const [sites, setSites] = useState([]);
	const [selectedChannelName, setSelectedChannelName] = useState();
	const [selectedChannel, setSelectedChannel] = useState();
	const [selectedType, setSelectedType] = useState(DEFAULT_TYPE);

	const initFromPathAsync = async() => {
		// eslint-disable-next-line no-unused-vars
		const [ foo, channel, menu, type ] = location.pathname.split('/');
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
	}

	useEffect(initFromPathAsync, []);
	useEffect(initFromPathAsync, [location.pathname]);

	return (
		<AppBar position="static">
			<Toolbar id="navBar">
  			<Link to="/home"><Home style={{ marginRight: 20 }}/></Link>

				<h3>
					{selectedChannel && <Chip label={selectedChannelName || getChannelName(selectedChannel)} style={{ marginRight: 5 }} />}
					{selectedType && <Chip label={MENU_TYPE_DETAILS[selectedType].title} />}
				</h3>
			</Toolbar>
		</AppBar>
	)
}

export default Nav;
