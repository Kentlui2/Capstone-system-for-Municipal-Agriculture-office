#!/usr/bin/env bash
set -e

# Clear configuration caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (force for production)
php artisan migrate --force

# Link storage (ignore if it already exists)
php artisan storage:link || true

# Start supervisord to manage nginx and php-fpm
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
