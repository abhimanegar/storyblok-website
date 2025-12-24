/**
 * Script to check what component names are used in your Storyblok stories
 * This helps you identify which components need to be registered in main.jsx
 * 
 * Usage: node scripts/check-story-components.js
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID || '289379687375858';
const DELIVERY_TOKEN = process.env.STORYBLOK_DELIVERY_API_TOKEN;
const REGION = process.env.STORYBLOK_REGION || 'eu';

if (!DELIVERY_TOKEN) {
	console.error('❌ Error: STORYBLOK_DELIVERY_API_TOKEN is required in .env file');
	process.exit(1);
}

const API_BASE_URL = `https://api.storyblok.com/v2/cdn`;

/**
 * Get story by slug
 */
async function getStory(slug) {
	try {
		const url = `${API_BASE_URL}/stories/${slug}?version=draft&token=${DELIVERY_TOKEN}`;
		console.log(`📡 Fetching: ${slug}...`);
		
		const response = await fetch(url);
		const data = await response.json();

		if (!response.ok) {
			console.error('❌ Error:', data);
			return null;
		}

		return data.story;
	} catch (error) {
		console.error('❌ Failed to fetch story:', error.message);
		return null;
	}
}

/**
 * Extract all component names from a story (recursively)
 */
function extractComponents(content, components = new Set()) {
	if (!content) return components;

	// Add the current component name
	if (content.component) {
		components.add(content.component);
	}

	// Check nested components in body array
	if (Array.isArray(content.body)) {
		content.body.forEach((blok) => {
			extractComponents(blok, components);
		});
	}

	// Check other fields that might contain nested components
	Object.values(content).forEach((value) => {
		if (Array.isArray(value)) {
			value.forEach((item) => {
				if (item && typeof item === 'object' && item.component) {
					extractComponents(item, components);
				}
			});
		} else if (value && typeof value === 'object' && value.component) {
			extractComponents(value, components);
		}
	});

	return components;
}

/**
 * Main function
 */
async function main() {
	const slug = process.argv[2] || 'mysore/mysore-history';
	
	console.log('🔍 Checking component names in your Storyblok story...\n');
	
	const story = await getStory(slug);
	
	if (!story) {
		console.error('❌ Could not fetch story. Check your slug and token.');
		process.exit(1);
	}

	console.log('✅ Story found!');
	console.log(`   Name: ${story.name}`);
	console.log(`   Slug: ${story.slug}`);
	console.log(`   Full slug: ${story.full_slug}`);
	console.log(`\n📋 Component Analysis:\n`);

	const components = extractComponents(story.content);
	
	if (components.size === 0) {
		console.log('⚠️  No components found in story content.');
	} else {
		console.log('Found the following component names:');
		components.forEach((componentName) => {
			console.log(`   - "${componentName}"`);
		});
		
		console.log(`\n💡 To fix the error, add these to main.jsx components mapping:`);
		console.log(`\n   components: {`);
		components.forEach((componentName) => {
			console.log(`     "${componentName}": YourComponent,`);
		});
		console.log(`   }`);
	}

	console.log(`\n📄 Full story content structure:`);
	console.log(JSON.stringify(story.content, null, 2));
}

main();

