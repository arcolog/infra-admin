import React, { useEffect, useState  } from 'react';
import { Button, Grid, Table, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddBox';

import { fetchMenuListAsync, saveMenuItemAsync, saveMenuOrderAsync, deleteMenuItemAsync } from '../api/index';
import { moveArrayItem } from '../utils';
import MenuItemDialog from '../components/MenuItemDialog';
import MenuParentCell from '../components/MenuParentCell';
import MenuSubCell from '../components/MenuSubCell';

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

	const fetchListAsync = async () => {
		setIsLoading(true);
		const result = await fetchMenuListAsync({ channel, type });
		setIsLoading(false);
		if (result.status === 200) {
			setData(result.data.data || []);
		}
	};

	useEffect(() => {
		fetchListAsync();
	}, [channel]);

	const saveItemAsync = async () => {
		setError('');
		try {
			setIsLoading(true);
			const result = await saveMenuItemAsync(activeItem);
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

	const moveItem = async (item, step) => {
		setError('');
		let changed = [];
		if (item.menuItemId) {
			const changedData = data.map(parentItem => {
				if (item.menuItemId === parentItem.id) {
					changed = moveArrayItem(parentItem.subItems, item, step);
					parentItem.subItems = changed;
				}
				return parentItem;
			});
			setData(changedData);
		} else {
			changed = moveArrayItem(data, item, step);
			setData(changed);
		}
		// save changed items
		if (changed.length) {
			const result = await saveMenuOrderAsync({ data: changed, channel });
			if (result.status === 200) {
				console.log('order saved', result.data);
			}
		}
	}

	const openDialog = (item = NEW_ITEM) => {
		setActiveItem(item);
		setShowDialog(true);
	}

	const renderAddNewParentButton = () => (
		data.length < MAX_COLUMNS
			?	<Button	onClick={() => openDialog({ ...NEW_ITEM, priority: data.length })}
				{...addButtonProps } color="primary">Lisa veerg</Button>
			: null);

	const renderAddNewSubItemButton = (parentItem) => (
		(parentItem.id && parentItem.subItems.length < MAX_ROWS)
			? <Button {...addButtonProps} style={{ marginTop: 2 }} onClick={() => openDialog({
					...NEW_ITEM, menuItemId: parentItem.id, priority: parentItem.subItems.length
				})}>Lisa</Button>
			: null);

	return (
		<div>
			<Grid container justify="space-between" alignItems="center">
				<Grid item>Klõpsa menüüosal, mida soovid muuta</Grid>
				<Grid item>{renderAddNewParentButton()}</Grid>
			</Grid>
			<br />
			<Table padding="none">
				<TableHead>
					<TableRow style={{ background: '#fafafa' }}>
						{data.map((parentItem, key) => (
							<TableCell key={parentItem.id} style={{ paddingRight: 5, border: 0 }}>
								<MenuParentCell
									item={parentItem}
									showLeft={key > 0}
									showRight={key < data.length - 1}
									handleEdit={() => openDialog(parentItem)}
									handleMoveLeft={() => moveItem(parentItem, -1)}
									handleMoveRight={() => moveItem(parentItem, 1)}
								/>
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						{data.map(parentItem => (
							<TableCell key={parentItem.id} style={{ paddingRight: 5, border: 0, verticalAlign: 'top' }}>
								{parentItem.subItems.map((item, key) => (
									<MenuSubCell
										key={item.id}
										item={item}
										showUp={key > 0}
										showDown={key < parentItem.subItems.length - 1}
										handleEdit={() => openDialog(item)}
										handleMoveUp={() => moveItem(item, -1)}
										handleMoveDown={() => moveItem(item, 1)}
									/>
								))}
								{renderAddNewSubItemButton(parentItem)}
							</TableCell>
						))}
					</TableRow>
				</TableBody>
			</Table>
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
