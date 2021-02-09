import { CHANNELS } from './constants';

export const getChannelFromPath = path => {
	const parts = path.split('/');
	const channel = parts[2];
	if (CHANNELS.indexOf(channel) > -1) {
		return channel;
	}
	return null;
}

export const capitalize = (string) => {
	if (typeof string !== 'string') return '';
	return string.charAt(0).toUpperCase() + string.slice(1)
}

// TODO: implement fancier formatting with 'date-fns' or smth
export const formatDate = (date) => {
	if (date.length >= 19) {
		return date.slice(0, 16).replace('T', ' '); // date and time
	}
	return date.slice(0, 11); // only date
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

export const getFileExtension = filename => filename.split('.').pop();

export default {
	formatDate,
	getChannelFromPath,
	getChannelName,
	getFileExtension,
}
