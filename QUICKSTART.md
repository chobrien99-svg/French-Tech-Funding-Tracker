# Quick Start Guide 🚀

## What You Have

A complete, production-ready website featuring:
- **686+ French tech companies** that raised funding in 2025
- **€5.7B+ total funding** tracked across 373 disclosed rounds
- **Interactive search and filtering** by company, investor, city, round, size
- **Modern, responsive design** inspired by the CES French Startups site
- **Ready for GitHub + Vercel** deployment in minutes

## Preview Locally RIGHT NOW

### Option 1: Just Open the File (Easiest!)
1. Double-click `index.html`
2. It opens in your browser
3. ✅ Fully functional!

### Option 2: Run a Local Server (Recommended)
```bash
# Navigate to this folder, then:
python3 -m http.server 8000

# Or if you have Node.js:
npx serve
```
Then visit: **http://localhost:8000**

## Deploy to Production (5-10 Minutes)

### Step 1: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name: `french-tech-funding-2025`
3. Make it **Public**
4. Click "Create repository"

### Step 2: Upload Files
```bash
cd /path/to/this/folder
git init
git add .
git commit -m "Initial commit: French Tech Funding 2025"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/french-tech-funding-2025.git
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `french-tech-funding-2025` repo
4. Click "Deploy"
5. ✅ **Done!** Your site is live in ~60 seconds

**Your URL:** `https://french-tech-funding-2025.vercel.app`

### Step 4: Custom Domain (Optional)
To use `funding.frenchtechjournal.com`:
1. In Vercel: Settings → Domains → Add `funding.frenchtechjournal.com`
2. In your DNS: Add CNAME record: `funding` → `cname.vercel-dns.com`
3. Wait 5-60 minutes for propagation

## What's Included

```
french-tech-funding-2025/
├── index.html              # Main website (32KB)
├── funding-data.json       # All 686 companies (431KB)
├── README.md               # Project documentation
├── DEPLOYMENT.md           # Detailed deployment guide
├── QUICKSTART.md          # This file
├── vercel.json            # Vercel configuration
├── package.json           # Project metadata
└── .gitignore             # Git ignore rules
```

## Key Features

✅ **686 companies** from all 2025 French Tech Funding Wire newsletters  
✅ **€5.7B funding** tracked (373 companies with disclosed amounts)  
✅ **219 cities** represented across France  
✅ **Advanced search** - Company name, investor, city, keywords  
✅ **Smart filters** - Month, round type, city, funding size  
✅ **Live statistics** - Auto-update based on your filters  
✅ **Multiple sorts** - Date, amount, or company name  
✅ **Mobile responsive** - Perfect on phones, tablets, desktops  
✅ **Fast loading** - Optimized, <1s load time  
✅ **Modern design** - Professional, clean interface  

## Tech Stack

- **Frontend**: Vanilla JavaScript (no frameworks!)
- **Styling**: CSS3 with modern features
- **Data**: Static JSON (fast loading)
- **Deployment**: Vercel (free hosting)
- **Version Control**: Git + GitHub

## Updating the Database

When you have new funding data:
1. Update `funding-data.json`
2. Commit and push to GitHub
3. Vercel auto-deploys in ~30 seconds
4. ✅ Live site updated!

## Support & Documentation

- **DEPLOYMENT.md** - Comprehensive deployment guide
- **README.md** - Project overview and features
- **Issues?** Check Vercel docs or GitHub issues

## Next Steps

1. ✅ Preview locally (open index.html)
2. ✅ Push to GitHub
3. ✅ Deploy to Vercel
4. ✅ Share with the world!

Optional enhancements:
- Add Google Analytics
- Enable Vercel Analytics (free)
- Add newsletter signup form
- Create CSV export feature
- Add social sharing buttons

---

**Made with ❤️ by The French Tech Journal**

Questions? Contact: [The French Tech Journal](https://www.frenchtechjournal.com)
