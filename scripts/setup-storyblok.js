/**
 * Complete setup script that performs all three tasks:
 * 1. Creates a Content Type component
 * 2. Creates a story using that component
 * 3. Uploads an image (if provided)
 * 
 * Usage: 
 *   node scripts/setup-storyblok.js
 *   node scripts/setup-storyblok.js <path-to-image>
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID || '289379687375858';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_API_TOKEN;

if (!MANAGEMENT_TOKEN) {
	console.error('❌ Error: STORYBLOK_MANAGEMENT_API_TOKEN is required in .env file');
	console.error('   Get your Management API token from: Settings > Access Tokens > Management API');
	console.error('   Add it to your .env file as: STORYBLOK_MANAGEMENT_API_TOKEN=your_token');
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
			is_root: true,
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
		console.log('📝 Step 1/3: Creating Content Type component: blog_post...');
		
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
			if (data.error?.message?.includes('already exists')) {
				console.log('⚠️  Component already exists, skipping creation...');
				return { component: { name: 'blog_post' } };
			}
			throw new Error(data.error?.message || JSON.stringify(data));
		}

		console.log('✅ Component created successfully!');
		return data.component;
	} catch (error) {
		console.error('❌ Failed to create component:', error.message);
		throw error;
	}
}

/**
 * Upload an image to Storyblok
 */
async function uploadImage(imagePath) {
	const resolvedPath = resolve(imagePath);
	
	if (!existsSync(resolvedPath)) {
		throw new Error(`Image file not found: ${resolvedPath}`);
	}

	console.log(`📤 Step 2/3: Uploading image: ${resolvedPath}...`);
	
	const imageBuffer = readFileSync(resolvedPath);
	const filename = resolvedPath.split('/').pop();
	
	const formData = new FormData();
	const blob = new Blob([imageBuffer]);
	formData.append('file', blob, filename);

	const response = await fetch(
		`${API_BASE_URL}/spaces/${SPACE_ID}/assets`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
			},
			body: formData,
		}
	);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error?.message || JSON.stringify(data));
	}

	console.log('✅ Image uploaded successfully!');
	console.log(`   Filename: ${data.filename}`);
	return data.filename;
}

/**
 * Create a story using the blog_post component
 */
async function createStory(imageFilename = null) {
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
					],
				},
				author: 'John Doe',
				publish_date: new Date().toISOString().split('T')[0],
			},
		},
		publish: 0,
	};

	// Add featured image if provided
	if (imageFilename) {
		storyData.story.content.featured_image = imageFilename;
	}

	try {
		console.log('📝 Step 3/3: Creating story: My First Blog Post...');
		
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
			throw new Error(data.error?.message || JSON.stringify(data));
		}

		console.log('✅ Story created successfully!');
		console.log(`\n🎉 Setup complete! View your story:`);
		console.log(`   https://app.storyblok.com/#/spaces/${SPACE_ID}/stories/${data.story?.id}`);
		
		return data.story;
	} catch (error) {
		console.error('❌ Failed to create story:', error.message);
		throw error;
	}
}

/**
 * Main execution
 */
async function main() {
	const imagePath = process.argv[2];
	let imageFilename = null;

	try {
		// Step 1: Create component
		await createComponent();

		// Step 2: Upload image if provided
		if (imagePath) {
			imageFilename = await uploadImage(imagePath);
		} else {
			console.log('📤 Step 2/3: Skipping image upload (no image path provided)');
			console.log('   Tip: Provide an image path to upload: node scripts/setup-storyblok.js <image-path>');
		}

		// Step 3: Create story
		await createStory(imageFilename);

		console.log('\n✨ All tasks completed successfully!');
	} catch (error) {
		console.error('\n❌ Setup failed:', error.message);
		process.exit(1);
	}
}

main();

