export const CHANNELS = {
	aripaev: 'Äripäev',
	koolitus: 'Koolitused',
	akadeemia: 'Akadeemia',
};

export const getChannels = () => Object.keys(CHANNELS);
export const channelIsValid = channel => typeof CHANNELS[channel] !== 'undefined';

export const MUI_PROPS = {
	variant: 'contained'
};

export default {
	CHANNELS,
	MUI_PROPS,
	channelIsValid,
	getChannels,
}
