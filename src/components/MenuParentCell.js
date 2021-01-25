import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, IconButton } from '@material-ui/core';
import LeftIcon from '@material-ui/icons/NavigateBeforeRounded';
import RightIcon from '@material-ui/icons/NavigateNextRounded';

const iconStyles = {
	color: 'black',
	background: 'rgba(255, 255, 255, 0.5)',
	borderRadius: 5,
	margin: 0,
}

const MenuParentCell = ({
	item,
	handleEdit,
	handleMoveLeft,
	handleMoveRight,
	showLeft = true,
	showRight = true,
}) => (
	<Box
		bgcolor="primary.main"
		color="primary.contrastText"
		position="relative"
		p={0.5}
		border={1}
		borderRadius="5px"
		style={{ whiteSpace: 'nowrap' }}
	>
		<Grid container justify="space-between" alignItems="center">
			<Grid item>
				<div
					style={{ color: 'white', cursor: 'pointer', textTransform: 'uppercase' }}
					title={`URL: ${item.url}`}
					onClick={handleEdit}
				>
					{item.title}
				</div>
			</Grid>
			<Grid item>
				{showLeft && (
					<IconButton size="small" onClick={handleMoveLeft} title="Liiguta vasakule">
						<LeftIcon fontSize="small" style={iconStyles} />
					</IconButton>
				)}
				{showRight && (
					<IconButton size="small" onClick={handleMoveRight} title="Liiguta paremale">
						<RightIcon fontSize="small" style={iconStyles} />
					</IconButton>
				)}
			</Grid>
		</Grid>
	</Box>
);

MenuParentCell.propTypes = {
	item: PropTypes.object,
	showLeft: PropTypes.bool,
	showRight: PropTypes.bool,
	handleMoveLeft: PropTypes.func,
	handleMoveRight: PropTypes.func,
}

export default MenuParentCell;
