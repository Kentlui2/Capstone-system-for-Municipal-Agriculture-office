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

# Seed commodities only if the table is empty
COMMODITY_COUNT=$(php artisan tinker --execute="echo \App\Models\Commodity::count();" 2>/dev/null | tail -1 | tr -d '[:space:]')
if [ "$COMMODITY_COUNT" = "0" ] || [ -z "$COMMODITY_COUNT" ]; then
    echo "Seeding commodities..."
    php artisan db:seed --class=CommoditySeeder --force
fi

# Create admin user only if no admin exists yet
ADMIN_EXISTS=$(php artisan tinker --execute="echo \App\Models\User::where('role','admin')->count();" 2>/dev/null | tail -1 | tr -d '[:space:]')
if [ "$ADMIN_EXISTS" = "0" ] || [ -z "$ADMIN_EXISTS" ]; then
    echo "Creating initial admin user..."
    php artisan tinker --execute="
\App\Models\User::create([
    'name' => env('ADMIN_NAME', 'Admin MAO'),
    'email' => env('ADMIN_EMAIL', 'admin@stacruz.gov.ph'),
    'password' => bcrypt(env('ADMIN_PASSWORD', 'ChangeMe123!')),
    'role' => 'admin',
    'status' => 'approved',
]);
echo 'Admin created.';
"
fi

# Start supervisord to manage nginx and php-fpm
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
