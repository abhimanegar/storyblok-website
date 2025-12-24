# Deploy to Netlify - Step by Step Guide

This guide will help you deploy your Storyblok React website to Netlify.

## Prerequisites

- A Netlify account (sign up at https://app.netlify.com)
- Your Storyblok access token ready
- Git repository (optional, but recommended)

---

## Method 1: Deploy via Netlify Dashboard (Easiest)

### Step 1: Prepare Your Code

1. Make sure your code is in a Git repository (GitHub, GitLab, or Bitbucket)
   - If not using Git, you can drag and drop (see Method 2)

### Step 2: Build Your Site Locally (Test First)

```bash
npm run build
```

This creates a `dist` folder. Test it works:
```bash
npm run preview
```

### Step 3: Deploy to Netlify

1. **Go to Netlify**: https://app.netlify.com
2. **Click "Add new site"** → **"Import an existing project"**
3. **Connect to Git**:
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify to access your repositories
   - Select your repository
4. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - These should auto-detect from `netlify.toml`, but verify them

### Step 4: Add Environment Variables

**IMPORTANT**: You must add your Storyblok tokens to Netlify!

1. In Netlify, go to your site
2. Click **Site settings** → **Environment variables**
3. Click **Add variable** and add these:

```
STORYBLOK_SPACE_ID = 289379687375858
STORYBLOK_DELIVERY_API_TOKEN = your_preview_token_here
STORYBLOK_REGION = eu
```

4. Click **Save**

### Step 5: Deploy

1. Click **Deploy site**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your site will be live at: `https://your-site-name.netlify.app`

---

## Method 2: Deploy via Drag & Drop (No Git Required)

### Step 1: Build Your Site

```bash
npm run build
```

This creates a `dist` folder with your built website.

### Step 2: Deploy

1. Go to https://app.netlify.com
2. Drag and drop the `dist` folder onto the Netlify dashboard
3. Your site will deploy automatically

**Note**: With this method, you'll need to:
- Manually set environment variables in Netlify dashboard
- Redeploy manually when you make changes

---

## Method 3: Deploy via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

This opens your browser to authorize the CLI.

### Step 3: Initialize Your Site

```bash
netlify init
```

Follow the prompts:
- Create & configure a new site
- Choose your team
- Build command: `npm run build`
- Directory to deploy: `dist`

### Step 4: Set Environment Variables

```bash
netlify env:set STORYBLOK_SPACE_ID 289379687375858
netlify env:set STORYBLOK_DELIVERY_API_TOKEN your_preview_token_here
netlify env:set STORYBLOK_REGION eu
```

### Step 5: Deploy

```bash
netlify deploy --prod
```

---

## Important: Environment Variables

Your `.env` file is NOT deployed to Netlify. You MUST set environment variables in Netlify:

1. Go to: **Site settings** → **Environment variables**
2. Add these variables:

| Variable Name | Value |
|--------------|-------|
| `STORYBLOK_SPACE_ID` | `289379687375858` |
| `STORYBLOK_DELIVERY_API_TOKEN` | Your Preview Access Token |
| `STORYBLOK_REGION` | `eu` |

**Where to get your token:**
- Go to Storyblok: https://app.storyblok.com/#/spaces/289379687375858
- Settings → Access Tokens
- Copy your **Preview** token

---

## Update Visual Editor URL (After Deployment)

Once deployed, update Storyblok to point to your live site:

1. Go to Storyblok: https://app.storyblok.com/#/spaces/289379687375858
2. **Settings** → **Visual Editor**
3. Change the default environment to your Netlify URL:
   - Example: `https://your-site-name.netlify.app`
4. **Save**

Now you can use Visual Editor with your live site!

---

## Automatic Deployments

If you connected via Git, Netlify will automatically:
- Deploy when you push to your main branch
- Rebuild when you make changes
- Show preview deployments for pull requests

---

## Troubleshooting

### Build Fails

1. Check build logs in Netlify dashboard
2. Make sure all dependencies are in `package.json`
3. Verify build command: `npm run build`

### Site Shows "Page Not Found"

- Check that `netlify.toml` has the redirect rule:
  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

### Environment Variables Not Working

1. Make sure variables are set in Netlify (not just `.env` file)
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### Content Not Loading

1. Verify `STORYBLOK_DELIVERY_API_TOKEN` is set correctly
2. Check token is the **Preview** token (not Public)
3. Verify `STORYBLOK_REGION` matches your space region

---

## Your Netlify Configuration

Your `netlify.toml` is already configured:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This handles:
- Building your React app
- Routing all paths to `index.html` (for React Router)
- Publishing the `dist` folder

---

## Next Steps

1. ✅ Deploy to Netlify
2. ✅ Set environment variables
3. ✅ Update Visual Editor URL
4. ✅ Test your live site
5. 🎉 Share your website!

---

## Need Help?

- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://www.netlify.com/support
- Storyblok Docs: https://www.storyblok.com/docs

