import { CHANNELS } from './constants';

export const getChannelFromPath = path => {
	const parts = path.split('/');
	const channel = parts[1];
	if (CHANNELS.indexOf(channel) > -1) {
		return channel;
	}
	return null;
}

export const capitalize = (string) => {
	if (typeof string !== 'string') return '';
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export const getChannelName = channel => {
	let channelName = capitalize(channel);
	const isEnglish = channel.slice(-3) === 'eng';
	if (isEnglish) {
		channelName = channelName.slice(0, channel.length - 3);
		return `${channelName} (eng)`;
	}
	return channelName;
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
	getChannelName,
	moveArrayItem,
}
