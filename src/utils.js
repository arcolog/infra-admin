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

export default {
	getChannelFromPath,
	getChannelName,
}
