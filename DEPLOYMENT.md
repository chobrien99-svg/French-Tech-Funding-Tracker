# Deployment Guide

This guide will walk you through deploying the French Tech Funding 2025 database to GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- Git installed on your computer
- Basic command line knowledge

## Step 1: Set Up GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `french-tech-funding-2025`
4. Description: "Complete interactive database of 686+ French tech companies that raised funding in 2025"
5. Make it **Public**
6. **Do NOT** initialize with README (we already have one)
7. Click "Create repository"

### Option B: Using GitHub CLI

```bash
gh repo create french-tech-funding-2025 --public --description "Complete interactive database of 686+ French tech companies that raised funding in 2025"
```

## Step 2: Upload Your Files to GitHub

1. **Download all the project files** from Claude to your computer:
   - `index.html`
   - `funding-data.json`
   - `README.md`
   - `vercel.json`
   - `.gitignore`
   - `package.json`

2. **Initialize Git repository and push**:

```bash
# Navigate to your project folder
cd /path/to/your/project

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: French Tech Funding 2025 database"

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/french-tech-funding-2025.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Find your `french-tech-funding-2025` repository
5. Click "Import"
6. **Project Settings:**
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: (leave empty)
7. Click "Deploy"
8. Wait 30-60 seconds for deployment to complete
9. You'll get a URL like: `https://french-tech-funding-2025.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project directory
cd /path/to/your/project

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? french-tech-funding-2025
# - In which directory? ./
# - Want to override settings? N

# For production deployment
vercel --prod
```

## Step 4: Configure Custom Domain (Optional)

### If you want to use: funding.frenchtechjournal.com

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Click "Add"
   - Enter: `funding.frenchtechjournal.com`
   - Click "Add"

2. **In your DNS provider (for frenchtechjournal.com):**
   - Add a CNAME record:
     - Name/Host: `funding`
     - Value/Points to: `cname.vercel-dns.com`
     - TTL: 3600 (or Auto)

3. **Wait for DNS propagation** (can take 5 minutes to 48 hours, usually ~1 hour)

4. **Verify in Vercel:**
   - The domain should show as "Valid Configuration" in Vercel
   - Vercel will automatically provision an SSL certificate

## Step 5: Verify Deployment

1. Visit your deployment URL
2. Check that:
   - ✅ Page loads correctly
   - ✅ All 686 companies appear
   - ✅ Search works
   - ✅ Filters work
   - ✅ Statistics are correct
   - ✅ Company cards link to websites
   - ✅ Mobile responsive design works

## Updating the Site

When you need to update the data or make changes:

```bash
# Make your changes to the files

# Commit changes
git add .
git commit -m "Update: [describe your changes]"

# Push to GitHub
git push origin main
```

Vercel will automatically:
- Detect the push to GitHub
- Rebuild the site
- Deploy the updates
- Usually takes 30-60 seconds

## Troubleshooting

### Build fails on Vercel
- Check the build logs in Vercel dashboard
- Ensure all files are committed to GitHub
- Verify `vercel.json` is properly formatted

### Data not loading
- Open browser console (F12)
- Check for errors
- Verify `funding-data.json` is accessible
- Check file encoding is UTF-8

### Custom domain not working
- Verify DNS records are correct
- Wait up to 48 hours for DNS propagation
- Use [dnschecker.org](https://dnschecker.org) to verify propagation
- Check Vercel domain settings for any errors

## Performance Optimization

The site is already optimized, but you can further improve:

1. **Enable Vercel Analytics:**
   - Go to project settings → Analytics
   - Turn on Web Analytics (free)

2. **Add Vercel Speed Insights:**
   - Go to project settings → Speed Insights
   - Enable it (free)

3. **Monitor:**
   - Check PageSpeed Insights: https://pagespeed.web.dev/
   - Should score 90+ on all metrics

## Support

If you run into issues:

1. Check Vercel's [documentation](https://vercel.com/docs)
2. Check GitHub's [documentation](https://docs.github.com)
3. Open an issue in your repository
4. Contact The French Tech Journal team

## Next Steps

Consider adding:
- Analytics tracking (Google Analytics, Plausible, etc.)
- Social media meta tags
- Newsletter signup form
- Download as CSV/Excel feature
- Share individual company cards
- Sector-specific filters

---

**Success Indicators:**
- ✅ Repository on GitHub
- ✅ Site live on Vercel
- ✅ Custom domain configured (optional)
- ✅ Automatic deployments working
- ✅ All features functional

Congratulations! Your French Tech Funding 2025 database is now live! 🎉
