import axios from 'axios';
import { INFRA_API_URL, INFRA_API_KEY } from '../env';

export const fetchMenuListOfTypeAsync = async ({ channel, type }) =>
	await axios.get(`${INFRA_API_URL}/admin/menu/list/${type}`,	{
		headers: { 'X-Channel-Id': channel, 'X-Api-Key': INFRA_API_KEY }
	});

export const fetchMenuListAsync = async ({ channel }) =>
	await axios.get(`${INFRA_API_URL}/admin/menu/list`,	{
		headers: { 'X-Channel-Id': channel, 'X-Api-Key': INFRA_API_KEY }
	});

export const postMenuItemAsync = async (item) =>
	await axios.post(`${INFRA_API_URL}/admin/menu/save`, item, {
		headers: { 'X-Channel-Id': item.channel, 'X-Api-Key': INFRA_API_KEY },
	});

export const postMenuOrderAsync = async ({ channel, data }) =>
	await axios.post(`${INFRA_API_URL}/admin/menu/saveOrder`, { data }, {
		headers: { 'X-Channel-Id': channel, 'X-Api-Key': INFRA_API_KEY },
	});

export const deleteMenuItemAsync = async (item) =>
	await axios.delete(`${INFRA_API_URL}/admin/menu/delete/${item.id}`, {
		headers: { 'X-Channel-Id': item.channel, 'X-Api-Key': INFRA_API_KEY }
	});

export const fetchMenuStatsAsync = async() =>
	await axios.get(`${INFRA_API_URL}/admin/stats/menus`, {
	headers: { 'X-Api-Key': INFRA_API_KEY }
});

export const fetchSitesAsync = async() =>
	await axios.get(`${INFRA_API_URL}/admin/site/all`, {
		headers: { 'X-Api-Key': INFRA_API_KEY }
});

export const fetchSiteAsync = async(site) =>
	await axios.get(`${INFRA_API_URL}/admin/site`, {
		headers: { 'X-Channel-Id': site.channel, 'X-Api-Key': INFRA_API_KEY }
	});

export const postSiteAsync = async (site) =>
	await axios.post(`${INFRA_API_URL}/admin/site/save`, { ...site}, {
		headers: { 'X-Channel-Id': site.channel, 'X-Api-Key': INFRA_API_KEY }
	});

export default {
	fetchMenuListAsync,
	fetchMenuListOfTypeAsync,
	fetchSitesAsync,
	fetchSiteAsync,
	postMenuItemAsync,
	postMenuOrderAsync,
	postSiteAsync,
	deleteMenuItemAsync,
	fetchMenuStatsAsync,
}
