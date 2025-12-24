/**
 * Script to upload an image asset to Storyblok
 * Usage: node scripts/upload-image.js <path-to-image>
 * Example: node scripts/upload-image.js ../3_7b9ac9.jpg
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
	process.exit(1);
}

const API_BASE_URL = 'https://mapi.storyblok.com/v1';

/**
 * Upload an image to Storyblok
 */
async function uploadImage(imagePath) {
	if (!imagePath) {
		console.error('❌ Error: Image path is required');
		console.error('   Usage: node scripts/upload-image.js <path-to-image>');
		console.error('   Example: node scripts/upload-image.js ../3_7b9ac9.jpg');
		process.exit(1);
	}

	// Resolve the image path
	const resolvedPath = resolve(imagePath);
	
	if (!existsSync(resolvedPath)) {
		console.error(`❌ Error: Image file not found: ${resolvedPath}`);
		process.exit(1);
	}

	try {
		console.log(`📤 Uploading image: ${resolvedPath}...`);
		
		// Read the image file
		const imageBuffer = readFileSync(resolvedPath);
		const filename = resolvedPath.split('/').pop();
		
		// Create FormData for multipart upload
		const formData = new FormData();
		const blob = new Blob([imageBuffer]);
		formData.append('file', blob, filename);

		const response = await fetch(
			`${API_BASE_URL}/spaces/${SPACE_ID}/assets`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
					// Don't set Content-Type, let fetch set it with boundary
				},
				body: formData,
			}
		);

		const data = await response.json();

		if (!response.ok) {
			if (data.error) {
				console.error('❌ Error uploading image:', data.error);
			} else {
				console.error('❌ Error uploading image:', response.statusText);
				console.error('Response:', JSON.stringify(data, null, 2));
			}
			process.exit(1);
		}

		console.log('✅ Image uploaded successfully!');
		console.log('   Filename:', data.filename);
		console.log('   Asset ID:', data.id);
		if (data.pretty_url) {
			console.log('   URL:', data.pretty_url);
		}
		console.log('\n📋 Use this filename in your stories:');
		console.log(`   ${data.filename}`);
		console.log('\n💡 To use this image in a story, update the story content with:');
		console.log(`   featured_image: "${data.filename}"`);
		
		return data;
	} catch (error) {
		console.error('❌ Failed to upload image:', error.message);
		if (error.message.includes('FormData')) {
			console.error('\n💡 Note: This script requires Node.js 18+ with native FormData support.');
			console.error('   Alternatively, install form-data package: npm install form-data');
		}
		process.exit(1);
	}
}

// Get image path from command line arguments
const imagePath = process.argv[2];
uploadImage(imagePath);

