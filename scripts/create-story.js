/**
 * Script to create a story in Storyblok using the blog_post component
 * Usage: node scripts/create-story.js
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
 * Create a story using the blog_post component
 */
async function createStory() {
	const storyData = {
		story: {
			name: 'My First Blog Post',
			slug: 'my-first-blog-post',
			content: {
				component: 'blog_post',
				title: 'Welcome to My Blog',
				slug: 'my-first-blog-post',
				excerpt: 'This is my first blog post created via the Storyblok Management API.',
				content: {
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'This is the content of my first blog post. I can add rich text formatting, images, and more using Storyblok\'s rich text editor.',
								},
							],
						},
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'You can edit this content in the Storyblok Visual Editor or via the Management API.',
								},
							],
						},
					],
				},
				author: 'John Doe',
				publish_date: new Date().toISOString().split('T')[0], // Today's date
				// featured_image will be set after uploading an image
			},
		},
		publish: 0, // Set to 1 to publish immediately, 0 to save as draft
	};

	try {
		console.log('📝 Creating story: My First Blog Post...');
		
		const response = await fetch(
			`${API_BASE_URL}/spaces/${SPACE_ID}/stories`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(storyData),
			}
		);

		const data = await response.json();

		if (!response.ok) {
			if (data.error) {
				console.error('❌ Error creating story:', data.error);
			} else {
				console.error('❌ Error creating story:', response.statusText);
				console.error('Response:', JSON.stringify(data, null, 2));
			}
			process.exit(1);
		}

		console.log('✅ Story created successfully!');
		console.log('   Story name:', data.story?.name);
		console.log('   Story slug:', data.story?.slug);
		console.log('   Story ID:', data.story?.id);
		console.log('   Story UUID:', data.story?.uuid);
		console.log('\n📋 View your story:');
		console.log(`   https://app.storyblok.com/#/spaces/${SPACE_ID}/stories/${data.story?.id}`);
		
		return data.story;
	} catch (error) {
		console.error('❌ Failed to create story:', error.message);
		process.exit(1);
	}
}

createStory();

