import axios from 'axios';
import { INFRA_API_URL } from '../env';

export const fetchMenuListAsync = async ({ channel, type }) =>
	await axios.get(`${INFRA_API_URL}/menu/list/${type}`,	{
		headers: { 'X-Channel-Id': channel }
	});

export const saveMenuItemAsync = async (item) =>
	await axios.post(`${INFRA_API_URL}/menu/save`, item, {
		headers: { 'X-Channel-Id': item.channel },
	});

export const saveMenuOrderAsync = async ({ channel, data }) =>
	await axios.post(`${INFRA_API_URL}/menu/saveOrder`, { data }, {
		headers: { 'X-Channel-Id': channel },
	});

export const deleteMenuItemAsync = async (item) =>
	await axios.delete(`${INFRA_API_URL}/menu/delete/${item.id}`, {
		headers: { 'X-Channel-Id': item.channel }
	});

export const fetchMenuStatsAsync = async() =>
	await axios.get(`${INFRA_API_URL}/stats/menus`);

export default {
	fetchMenuListAsync,
	saveMenuItemAsync,
	saveMenuOrderAsync,
	deleteMenuItemAsync,
	fetchMenuStatsAsync,
}
