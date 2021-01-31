import React, { useEffect, useState  } from 'react';
import { Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddBox';

import { fetchMenuListOfTypeAsync, postMenuItemAsync, postMenuOrderAsync, deleteMenuItemAsync } from '../api/index';
import MenuItemDialog from '../components/MenuItemDialog';
import DraggableList from '../components/elements/DraggableList';

const MAX_COLUMNS = 6;
const MAX_ROWS = 10;
const addButtonProps = { size: 'small', variant: 'outlined', startIcon: <AddIcon /> };

const MenuPage = ({ channel, match }) => {
	const { type } = match.params;
	const NEW_ITEM = { id: undefined, label: '', url: '', menuItemId: null, subItems: [], channel, type };
	const [data, setData] = useState([]);
	const [activeItem, setActiveItem] = useState(NEW_ITEM);
	const [showDialog, setShowDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [renderKey, setRenderKey] = useState(type);

	const fetchListAsync = async () => {
		setIsLoading(true);
		const result = await fetchMenuListOfTypeAsync({ channel, type });
		setIsLoading(false);
		if (result.status === 200) {
			setData(result.data.data || []);
			setRenderKey((new Date()).toTimeString());
		}
	};

	useEffect(() => {
		fetchListAsync();
	}, [channel]);

	const saveItemAsync = async () => {
		setError('');
		try {
			setIsLoading(true);
			const result = await postMenuItemAsync(activeItem);
			setIsLoading(false);
			if (result.status < 400) {
				await fetchListAsync();
				setShowDialog(false);
			}
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	}

	const deleteItemAsync = async () => {
		setError('');
		try {
			setIsLoading(true);
			const result = await deleteMenuItemAsync(activeItem);
			setIsLoading(false);
			if (result.status < 400) {
				await fetchListAsync();
				setShowDialog(false);
				setActiveItem(NEW_ITEM);
			}
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	}

	const handleDragEndAsync = async ({ items }) => {
		await postMenuOrderAsync({ channel, data: items });
		await fetchListAsync();
	}

	const openDialog = (item = NEW_ITEM) => {
		setActiveItem(item);
		setShowDialog(true);
	}

	const ParentItemComponent = ({ item }) => (
		<div
			onClick={() => openDialog(item)}
	    style={{ cursor: 'pointer', width: 100, padding: 4, background: '#35b', color: '#fff' }}
		>
			{item.label}
		</div>
	);

	const SubItemComponent = ({ item }) => (
		<div style={{ cursor: 'pointer', padding: 4 }} onClick={() => openDialog(item)}>{item.label}</div>
	);

	return (
		<div>
			<Grid container justify="space-between" alignItems="center">
				<Grid item>Menüüosa muutmiseks klõpsa sellel, liigutamiseks lohista hiire nuppu all hoides.</Grid>
				{data.length < MAX_COLUMNS && (
					<Grid item>
						<Button	onClick={() => openDialog({ ...NEW_ITEM, priority: data.length })}
					         {...addButtonProps } color="primary">Lisa veerg</Button>
					</Grid>
				)}
			</Grid>
			<br />
			<Grid container justify="space-between" wrap="nowrap">
				<DraggableList {...{ type, items: data, ItemComponent: ParentItemComponent,
					renderKey, handleDragEndAsync, width: '100%', isVertical: false, isCompact: true, showDragIcon: false }} />
			</Grid>
			<Grid container justify="flex-start" wrap="nowrap">
				{data.map(parentItem => (
					<Grid item key={parentItem.id} style={{ width: 110 }}>
						<DraggableList {...{ type, parentItem, items: parentItem.subItems, ItemComponent: SubItemComponent,
							renderKey, handleDragEndAsync, width: '108px', isVertical: true, isCompact: true, showDragIcon: false }} />
						{(parentItem.id && parentItem.subItems.length < MAX_ROWS) && (
							<Button {...addButtonProps} style={{ marginTop: 2, marginLeft: 20 }} onClick={() => openDialog({
								...NEW_ITEM, menuItemId: parentItem.id, priority: parentItem.subItems.length
							})} title={`Lisa ${parentItem.label}`}>Lisa</Button>
						)}
					</Grid>
				))}
			</Grid>
			<MenuItemDialog
				item={activeItem}
				error={error}
				handleSubmitAsync={saveItemAsync}
				handleDeleteAsync={deleteItemAsync}
				handleClose={() => {setActiveItem(NEW_ITEM);setShowDialog(false);}}
				handleChange={(field, value) => setActiveItem(prevState => ({ ...prevState, [field]: value }))}
				isOpened={showDialog}
				isLoading={isLoading}
			/>
		</div>
	)
};

export default MenuPage;
