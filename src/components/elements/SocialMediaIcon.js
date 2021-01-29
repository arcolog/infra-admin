import React from 'react';
import PropTypes from 'prop-types';
import { Facebook, Instagram, LinkedIn, Twitter, RssFeed, Email } from '@material-ui/icons';

const icons = {
	facebook: Facebook,
	instagram: Instagram,
	linkedin: LinkedIn,
	twitter: Twitter,
	rss: RssFeed,
	mail: Email,
};

const SocialMediaIcon = ({ type, size = 'large', color = 'inherit' }) => {
	if (icons[type]) {
		const Icon = icons[type];
		return <Icon fontSize={size} color={color} />;
	}
	console.warn('Social media icon not found for type:', type);
	return null;
}

SocialMediaIcon.propTypes = {
	type: PropTypes.oneOf(Object.keys(icons)).isRequired,
	size: PropTypes.oneOf(['inherit', 'default', 'small', 'large']),
	color: PropTypes.oneOf(['inherit', 'primary', 'secondary', 'action', 'error', 'disabled']),
}

export default SocialMediaIcon;
