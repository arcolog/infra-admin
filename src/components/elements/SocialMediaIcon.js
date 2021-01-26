import React from 'react';
import { Facebook, Instagram, LinkedIn, Twitter, RssFeed, Email } from '@material-ui/icons';

const icons = {
	facebook: Facebook,
	instagram: Instagram,
	linkedin: LinkedIn,
	twitter: Twitter,
	rss: RssFeed,
	mail: Email,
};

const SocialMediaIcon = ({ type, size = 'large' }) => {
	if (icons[type]) {
		const Icon = icons[type];
		return <Icon size={size} />;
	}
	console.warn('Social media icon not found for type:', type);
	return null;
}

export default SocialMediaIcon;
