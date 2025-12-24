import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './index.css';
import App from './App.jsx';
import { storyblokInit, apiPlugin } from '@storyblok/react';

import Mysore from './storyblok/Mysore';
import Teaser from './storyblok/Teaser';
import Feature from './storyblok/Feature';
import Grid from './storyblok/Grid';

// Validate access token
const accessToken = import.meta.env.STORYBLOK_DELIVERY_API_TOKEN;
if (!accessToken || accessToken === 'your_preview_token_here' || accessToken.includes('your_')) {
	console.error(
		'❌ Storyblok Access Token Error:\n' +
		'   Please add your Preview Access Token to the .env file.\n' +
		'   Get your token from: Settings > Access Tokens in your Storyblok space\n' +
		'   Update .env file: STORYBLOK_DELIVERY_API_TOKEN=your_actual_token_here'
	);
}

storyblokInit({
	accessToken: accessToken,
	apiOptions: {
		/** Set the correct region for your space. Learn more: https://www.storyblok.com/docs/packages/storyblok-js */
		region: import.meta.env.STORYBLOK_REGION || 'eu',
		/** The following code is only required when creating a Storyblok space directly via the Blueprints feature. */
		endpoint: import.meta.env.STORYBLOK_API_BASE_URL
			? `${new URL(import.meta.env.STORYBLOK_API_BASE_URL).origin}/v2`
			: undefined,
	},
	use: [apiPlugin],
	components: {
		mysore: Mysore,
	},
});
const router = createBrowserRouter([
	{
		path: '/*',
		Component: App,
	},
]);
const root = document.getElementById('root');

createRoot(root).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
