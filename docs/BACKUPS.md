# Automated Database Backups & Recovery Guide

This document covers backup strategy, configuration, and restoration procedures for the MAO Beneficiary Profiling & Aid Distribution System.

---

## 1. Overview & Retention Strategy

- **Backup Schedule:** Daily at `02:00` system time via Laravel scheduler (`routes/console.php`).
- **Backup Target:** Database dumps (MySQL / PostgreSQL) + uploaded beneficiary photos (`storage/app/public/photos`).
- **Retention Policy:**
  - Daily backups kept for 14 days
  - Weekly backups kept for 8 weeks
  - Monthly backups kept for 12 months

---

## 2. Package Configuration (`spatie/laravel-backup`)

To configure `spatie/laravel-backup` with S3 or local storage:

```bash
composer require spatie/laravel-backup
php artisan vendor:publish --provider="Spatie\Backup\BackupServiceProvider"
```

In `.env`:
```ini
BACKUP_DISK=s3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=mao-capstone-backups
```

In `routes/console.php`:
```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('backup:run')->daily()->at('02:00');
Schedule::command('backup:clean')->daily()->at('03:00');
```

---

## 3. Manual Backup Command

To run an immediate manual backup (e.g. before major system updates):

```bash
php artisan backup:run
```

To backup database only:
```bash
php artisan backup:run --only-db
```

---

## 4. Disaster Recovery & Restoration Checklist

1. **Database Restore:**
   ```bash
   # MySQL
   mysql -u username -p database_name < backup_dump.sql

   # PostgreSQL
   pg_restore -U username -d database_name backup_dump.psql
   ```

2. **Storage Restore:**
   Extract and place photos directory in `storage/app/public/photos`.

3. **Re-link Storage:**
   ```bash
   php artisan storage:link
   ```

4. **Verify Application Status:**
   ```bash
   php artisan migrate:status
   php artisan test
   ```
