# French Tech Funding 2025 - Complete Database

A comprehensive, interactive database of 686+ French tech companies that raised funding in 2025, compiled from The French Tech Journal's weekly French Tech Funding Wire newsletters.

🌐 **Live Site:** [Coming soon]

## Features

- **686+ Companies**: Complete funding data for the entire year 2025
- **€5.7B+ Total Funding**: Tracked across 373 disclosed rounds
- **Advanced Filters**: Search by company, investor, city, round type, month, and funding size
- **Interactive UI**: Modern, responsive design inspired by the CES French Startups database
- **Real-time Stats**: Dynamic statistics updated based on your filters
- **Multiple Sort Options**: Sort by date, amount, or company name

## Data Source

All data is compiled from The French Tech Journal's [French Tech Funding Wire](https://www.frenchtechjournal.com) newsletter, published weekly throughout 2025.

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Deployment**: Vercel
- **Data**: JSON (from CSV compiled from newsletter data)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/french-tech-funding-2025.git
cd french-tech-funding-2025
```

2. Serve locally:
```bash
python3 -m http.server 8000
```

3. Open http://localhost:8000 in your browser

## Deployment to Vercel

This project is configured for one-click deployment to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/[your-username]/french-tech-funding-2025)

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

## Data Structure

Each company entry includes:
- Company name
- Description
- Website URL
- Headquarters city
- Round type (Seed, Series A, etc.)
- Amount raised (when disclosed)
- Investors
- Founders
- News article link
- Month of announcement

## Contributing

Found an error or want to add missing information? Please open an issue or submit a pull request.

## Credits

- **Data Compilation**: [The French Tech Journal](https://www.frenchtechjournal.com)
- **Design**: Inspired by the [CES French Startups database](https://ces.frenchtechjournal.com)
- **Created by**: Chris O'Brien

## License

Data: © 2025 The French Tech Journal  
Code: MIT License

## Connect

- 🌐 Website: [frenchtechjournal.com](https://www.frenchtechjournal.com)
- 🐦 Twitter: [@frenchtechjrnl](https://twitter.com/frenchtechjrnl)
- 📧 Email: contact@frenchtechjournal.com

---

*This database is maintained as a public resource for the French tech ecosystem. All data is publicly available through The French Tech Journal's newsletter.*
