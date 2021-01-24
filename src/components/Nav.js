import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Button, Menu, MenuItem, Toolbar } from '@material-ui/core';
import { Home } from '@material-ui/icons';

import { CHANNELS, getChannels, MUI_PROPS } from '../constants';
import { getChannelFromPath } from '../utils';

const Nav = () => {
	const location = useLocation();
	const [selectedChannel, setSelectedChannel] = useState();
	const [channelsOpened, setChannelsOpened] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleMenuTriggerClick = (event) => {
		setAnchorEl(event.currentTarget);
		setChannelsOpened(true)
	};
	useEffect(() => {
		const channel = getChannelFromPath(location.pathname);
		setSelectedChannel(channel);
	}, [location.pathname]);
	return (
		<AppBar position="static">
			<Toolbar id="navBar">
  			<Link to="/home"><Home style={{ marginRight: 20 }}/></Link>

				<Button onClick={handleMenuTriggerClick} {...MUI_PROPS}>{CHANNELS[selectedChannel] || 'Vali kanal'}</Button>

				<Menu open={channelsOpened} anchorEl={anchorEl}>
					{getChannels().map(ch => (
						<MenuItem key={ch} value={ch} onClick={() => {setChannelsOpened(false);setSelectedChannel(ch);}}>
							<Link to={`/${ch}/menu`}>{CHANNELS[ch]}</Link>
						</MenuItem>
					))}
				</Menu>

			</Toolbar>
		</AppBar>
	)
}

export default Nav;
