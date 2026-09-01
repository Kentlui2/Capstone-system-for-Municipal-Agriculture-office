# Production Deployment & Hardening Checklist

Production deployment checklist for the Municipal Agriculture Office (MAO) Beneficiary Profiling & Aid Distribution System.

---

## 1. Environment Configuration (`.env`)

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Set `APP_URL=https://your-domain.gov.ph`
- [ ] Generate secure application key: `php artisan key:generate`
- [ ] Set database connection parameters (`DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)
- [ ] Configure `QUEUE_CONNECTION=database`
- [ ] Configure `CACHE_STORE=database` or `redis`
- [ ] Configure Sentry DSN if error tracking is enabled (`SENTRY_LARAVEL_DSN=...`)

---

## 2. Server & Background Process Supervisor

- [ ] **Queue Worker:** Run Laravel queue worker via Supervisor or systemd:
  ```ini
  [program:mao-worker]
  process_name=%(program_name)s_%(process_num)02d
  command=php /path/to/capstone-system/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
  autostart=true
  autorestart=true
  user=www-data
  numprocs=2
  redirect_stderr=true
  stdout_logfile=/path/to/capstone-system/storage/logs/worker.log
  ```

- [ ] **Cron Scheduler:** Add cron entry for scheduled tasks:
  ```crontab
  * * * * * cd /path/to/capstone-system && php artisan schedule:run >> /dev/null 2>&1
  ```

---

## 3. Storage & Permissions

- [ ] Run storage symlink command: `php artisan storage:link`
- [ ] Verify write permissions on `storage/` and `bootstrap/cache/`:
  ```bash
  chmod -R 775 storage bootstrap/cache
  chown -R www-data:www-data storage bootstrap/cache
  ```

---

## 4. Optimization & Caching Commands

Run optimization commands after each deployment:

```bash
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache
npm run build
```

---

## 5. Security & Verification

- [ ] Database migrations applied: `php artisan migrate --force`
- [ ] Run test suite: `vendor/bin/phpunit`
- [ ] HTTPS enabled via reverse proxy (Nginx / Apache / Caddy)
- [ ] HSTS and security headers enabled
