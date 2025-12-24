/**
 * Script to create a Content Type component in Storyblok
 * Usage: node scripts/create-component.js
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID || '289379687375858';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_API_TOKEN;

if (!MANAGEMENT_TOKEN) {
	console.error('❌ Error: STORYBLOK_MANAGEMENT_API_TOKEN is required in .env file');
	console.error('   Get your Management API token from: Settings > Access Tokens > Management API');
	process.exit(1);
}

const API_BASE_URL = 'https://mapi.storyblok.com/v1';

/**
 * Create a Content Type component
 */
async function createComponent() {
	const componentData = {
		component: {
			name: 'blog_post',
			display_name: 'Blog Post',
			is_root: true, // This makes it a Content Type
			is_nestable: false,
			schema: {
				title: {
					type: 'text',
					display_name: 'Title',
					required: true,
				},
				slug: {
					type: 'text',
					display_name: 'Slug',
					required: true,
				},
				excerpt: {
					type: 'textarea',
					display_name: 'Excerpt',
				},
				content: {
					type: 'richtext',
					display_name: 'Content',
				},
				featured_image: {
					type: 'asset',
					display_name: 'Featured Image',
					filetypes: ['images'],
				},
				author: {
					type: 'text',
					display_name: 'Author',
				},
				publish_date: {
					type: 'date',
					display_name: 'Publish Date',
				},
			},
		},
	};

	try {
		console.log('📝 Creating Content Type component: blog_post...');
		
		const response = await fetch(
			`${API_BASE_URL}/spaces/${SPACE_ID}/components`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(componentData),
			}
		);

		const data = await response.json();

		if (!response.ok) {
			if (data.error) {
				console.error('❌ Error creating component:', data.error);
			} else {
				console.error('❌ Error creating component:', response.statusText);
				console.error('Response:', JSON.stringify(data, null, 2));
			}
			process.exit(1);
		}

		console.log('✅ Component created successfully!');
		console.log('   Component name:', data.component?.name);
		console.log('   Component ID:', data.component?.id);
		console.log('\n📋 Next steps:');
		console.log('   1. Create a story using: node scripts/create-story.js');
		console.log('   2. Upload images using: node scripts/upload-image.js <image-path>');
		
		return data.component;
	} catch (error) {
		console.error('❌ Failed to create component:', error.message);
		process.exit(1);
	}
}

createComponent();

