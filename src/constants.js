export const CHANNELS = [
	'ajalugu', 'akadeemia',	'aripaev', 'bestmarketing',	'bestmarketingeng', 'bestsales',
	'dv', 'ehitus',	'finants', 'foundme',	'it', 'kaubandus', 'kinnisvara', 'konverents',
	'koolitus', 'logistika', 'meditsiin', 'metsamajandus', 'natgeo', 'palgauudised',
	'personal', 'pollumajandus', 'raamatupidaja', 'sekretar', 'teadus', 'tervis', 'toostus'
];

const MENU_TYPE_TOP = 'top'; // legacy 'menu'
const MENU_TYPE_MIDDLE = 'middle'; // legacy 'header'
const MENU_TYPE_MAIN = 'main'; // legacy 'subMenu'

// NB! Menu types are used in DB as predefined values
export const MENU_TYPES = [
	MENU_TYPE_TOP,
	MENU_TYPE_MIDDLE,
	MENU_TYPE_MAIN,
];

export const MENU_TYPE_DETAILS = {
	[MENU_TYPE_TOP]: {
		description: 'Ülamenüü (logo kohal)',
	},
	[MENU_TYPE_MIDDLE]: {
		description: 'Väike menüü (otsingu kõrval)',
	},
	[MENU_TYPE_MAIN]: {
		description: 'Peamenüü (logo all)',
	}
};

export const MUI_PROPS = {
	variant: 'contained'
};

export default {
	CHANNELS,
	MENU_TYPES,
	MENU_TYPE_DETAILS,
	MUI_PROPS,
}
