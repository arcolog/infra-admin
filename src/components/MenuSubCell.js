import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, IconButton, Tooltip } from '@material-ui/core';
import UpIcon from '@material-ui/icons/ExpandLess';
import DownIcon from '@material-ui/icons/ExpandMore';

const iconStyles = {
	color: 'black',
	background: 'rgba(255, 255, 255, 0.5)',
	borderRadius: 5,
	margin: 0,
}

const MenuSubCell = ({
  item,
  handleEdit,
  handleMoveUp,
  handleMoveDown,
	showUp = true,
	showDown = true,
}) => (
	<Box
		bgcolor="text.secondary"
		color="primary.contrastText"
		position="relative"
		p={0.5}
		border={1}
		borderRadius="5px"
		style={{ whiteSpace: 'nowrap' }}
	>
		<Grid container justify="space-between" alignItems="center">
			<Grid item>
				<Tooltip title={`URL: ${item.url}`}>
					<div
						style={{ color: 'white', cursor: 'pointer', textTransform: 'capitalize' }}
						onClick={handleEdit}
					>
						{item.label}
					</div>
				</Tooltip>
			</Grid>
			<Grid item>
				{showUp && (
					<IconButton size="small" onClick={handleMoveUp} title="Liiguta üles">
						<UpIcon fontSize="small" style={iconStyles} />
					</IconButton>
				)}
				{showDown && (
					<IconButton size="small" onClick={handleMoveDown} title="Liiguta alla">
						<DownIcon fontSize="small" style={iconStyles} />
					</IconButton>
				)}
			</Grid>
		</Grid>
	</Box>
);

MenuSubCell.propTypes = {
	item: PropTypes.object,
	showUp: PropTypes.bool,
	showDown: PropTypes.bool,
	handleMoveUp: PropTypes.func,
	handleMoveDown: PropTypes.func,
}

export default MenuSubCell;
