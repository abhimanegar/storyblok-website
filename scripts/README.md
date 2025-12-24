# Storyblok Management API Scripts

This directory contains scripts to interact with the Storyblok Management API to:
1. Create Content Type components
2. Create stories
3. Upload image assets

## Prerequisites

1. **Management API Token**: You need a Management API token from your Storyblok space.
   - Go to: **Settings > Access Tokens** in your Storyblok space
   - Create a new token with **Management API** permissions
   - Add it to your `.env` file as `STORYBLOK_MANAGEMENT_API_TOKEN`

2. **Environment Variables**: Make sure your `.env` file contains:
   ```env
   STORYBLOK_SPACE_ID=289379687375858
   STORYBLOK_MANAGEMENT_API_TOKEN=your_management_token_here
   ```

## Available Scripts

### 1. Create Component (`create-component.js`)

Creates a Content Type component named `blog_post` in your Storyblok space.

```bash
node scripts/create-component.js
```

**What it creates:**
- Component name: `blog_post`
- Component type: Content Type (is_root: true)
- Fields: title, slug, excerpt, content (richtext), featured_image, author, publish_date

### 2. Create Story (`create-story.js`)

Creates a story using the `blog_post` component.

```bash
node scripts/create-story.js
```

**What it creates:**
- Story name: "My First Blog Post"
- Story slug: "my-first-blog-post"
- Status: Draft (set `publish: 1` in the script to publish immediately)

### 3. Upload Image (`upload-image.js`)

Uploads an image asset to your Storyblok space.

```bash
node scripts/upload-image.js <path-to-image>
```

**Example:**
```bash
node scripts/upload-image.js ../3_7b9ac9.jpg
```

**Returns:**
- Asset filename (use this in your stories)
- Asset ID
- Asset URL

### 4. Complete Setup (`setup-storyblok.js`)

Runs all three tasks in sequence:
1. Creates the component
2. Uploads an image (if provided)
3. Creates a story

```bash
# Without image upload
node scripts/setup-storyblok.js

# With image upload
node scripts/setup-storyblok.js ../3_7b9ac9.jpg
```

## Usage Examples

### Complete Setup (Recommended)

Run everything at once:

```bash
node scripts/setup-storyblok.js ../3_7b9ac9.jpg
```

### Step-by-Step

If you prefer to run tasks individually:

```bash
# Step 1: Create component
node scripts/create-component.js

# Step 2: Upload image
node scripts/upload-image.js ../3_7b9ac9.jpg

# Step 3: Create story
node scripts/create-story.js
```

## Troubleshooting

### Error: "STORYBLOK_MANAGEMENT_API_TOKEN is required"

Make sure you've:
1. Created a Management API token in Storyblok
2. Added it to your `.env` file as `STORYBLOK_MANAGEMENT_API_TOKEN`

### Error: "Component already exists"

The component was already created. You can:
- Skip this step and proceed to creating stories
- Or delete the component from Storyblok and run again

### Error: "FormData is not defined"

This script requires Node.js 18+ which has native FormData support. Upgrade Node.js or install the `form-data` package.

### Error: "Image file not found"

Make sure the image path is correct. Use absolute paths or paths relative to the project root.

## Next Steps

After running these scripts:

1. **View your content in Storyblok:**
   - Go to: https://app.storyblok.com/#/spaces/289379687375858/stories
   - You should see "My First Blog Post"

2. **View in your React app:**
   - Make sure your `.env` has the Preview Access Token
   - Run `npm run dev`
   - Visit: http://localhost:5173/my-first-blog-post

3. **Edit content:**
   - Use the Storyblok Visual Editor to edit your story
   - Changes will appear in real-time if Visual Editor is connected

## API Reference

These scripts use the Storyblok Management API:
- [Components API](https://www.storyblok.com/docs/api/management#core-resources/components)
- [Stories API](https://www.storyblok.com/docs/api/management#core-resources/stories)
- [Assets API](https://www.storyblok.com/docs/api/management#core-resources/assets)

