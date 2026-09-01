# Municipal Agriculture Office (MAO) Beneficiary Profiling & Aid Distribution System

A comprehensive web application designed for the Municipal Agriculture Office (MAO) to manage agricultural beneficiary profiles, track sector classifications (farmer, fisherfolk, raiser), monitor commodity production, record distributed agricultural aid, and prevent duplicate distributions.

---

## Key Features

- **Beneficiary Profiling & Sector Management:** Multi-sector profile creation for Farmers, Fisherfolk, and Livestock/Poultry Raisers with sector-specific field tracking.
- **Aid Distribution Tracking & Duplicate Protection:** Records distribution of seeds, fertilizer, equipment, cash incentives, and livelihood aid; flags duplicate distributions and program over-allocations.
- **Real-Time Analytics & Barangay Coverage:** Visual analytics dashboard tracking aid coverage per barangay, program utilization rates, commodity distribution breakdowns, and monthly distribution trends.
- **Offline Sync & PWA Support:** Service worker and indexed DB queue support for offline field encoding with automated background sync.
- **Data Export & Reporting:** PDF profile summary generation, bulk Excel/PDF report exports with async background queue processing.
- **Performance Optimized:** Database indexing, query aggregation (zero N+1 queries), and cached analytics.

---

## Technology Stack

- **Backend:** Laravel 11 / PHP 8.3
- **Frontend:** React + Inertia.js + Tailwind CSS
- **Database:** MySQL / PostgreSQL (SQLite supported for local testing)
- **Asset Bundling:** Vite + PWA Plugin

---

## Local Development Setup

```bash
# Install PHP dependencies
composer install

# Environment setup
copy .env.example .env
php artisan key:generate

# Database migration & seed
php artisan migrate --force

# Install JS dependencies & start dev server
npm install
npm run dev
```

Run test suite:
```bash
vendor/bin/phpunit
```

---

## Deployment & Operation Guides

- [Production Deployment & Hardening Checklist](docs/PRODUCTION_CHECKLIST.md)
- [Automated Database Backups & Recovery Guide](docs/BACKUPS.md)

---

## License

This project is developed for the Municipal Agriculture Office.
