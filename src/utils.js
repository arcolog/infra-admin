import { channelIsValid } from './constants';

export const getChannelFromPath = path => {
	const parts = path.split('/');
	const channel = parts[1];
	if (channelIsValid(channel)) {
		return channel;
	}
	return null;
}

/**
 * @param data
 * @param currentItem
 * @param step (-1 backward, 1 forward)
 * @return array
 */
export const moveArrayItem = (data, currentItem, step) => {
	const results = Object.values(data);
	const currentPos = parseInt(Object.keys(results).find(key => data[key].id === currentItem.id));
	const targetPos = currentPos + step;
	if (currentPos === targetPos || targetPos < 0 || targetPos > data.length) {
		return data;
	}
	// move current item to new position
	results.splice(currentPos, 1);
	results.splice(targetPos, 0, currentItem);

	//update priority parameter for each item
	const changed = [];
	for (const [key, value] of Object.entries(results)) {
		changed.push({ ...value, priority: key });
	}
	return changed;
}

export default {
	getChannelFromPath,
	moveArrayItem,
}
