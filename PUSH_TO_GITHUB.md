# Push to GitHub - Quick Guide

Your code is ready to push! Follow these steps:

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `storyblok-website` (or any name you prefer)
3. Description: "Storyblok React website"
4. Choose: **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## Step 2: Push Your Code

After creating the repository, run these commands:

```bash
cd /Users/abhilashmanegar/Desktop/storyblok/storyblok

# Add the remote (replace 'storyblok-website' with your repo name if different)
git remote add origin https://github.com/abhimanegar/storyblok-website.git

# Push to GitHub
git push -u origin main
```

If you used a different repository name, update the URL:
```bash
git remote add origin https://github.com/abhimanegar/YOUR-REPO-NAME.git
```

## Alternative: If Repository Already Exists

If you already created the repository, GitHub will show you commands. Use:

```bash
git remote add origin https://github.com/abhimanegar/storyblok-website.git
git branch -M main
git push -u origin main
```

## What's Already Done ✅

- ✅ Git repository initialized
- ✅ All files committed
- ✅ Branch set to `main`
- ✅ Ready to push!

## Troubleshooting

### Authentication Required

If GitHub asks for authentication:
- Use a Personal Access Token instead of password
- Or use GitHub Desktop app
- Or set up SSH keys

### Repository Name Already Exists

If the name is taken, use a different name:
```bash
git remote add origin https://github.com/abhimanegar/storyblok-mysore-website.git
```

### Push Fails

Make sure:
1. Repository exists on GitHub
2. You have write access
3. Remote URL is correct

---

## Quick Command Reference

```bash
# Check current status
git status

# Check remote
git remote -v

# Push to GitHub
git push -u origin main
```

