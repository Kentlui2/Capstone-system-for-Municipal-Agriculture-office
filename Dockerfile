# Start from PHP 8.3 FPM base
FROM php:8.3-fpm

# Install dependencies required for Laravel, PostgreSQL, DomPDF, Excel, Nginx, Supervisord
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    nginx \
    supervisor \
    && docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js v20 and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Set permissions for storage and bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# VAPID Public Key build arg (required for vite build in production)
ARG VITE_VAPID_PUBLIC_KEY
ENV VITE_VAPID_PUBLIC_KEY=${VITE_VAPID_PUBLIC_KEY}

# Install Node dependencies and build assets
RUN npm install --legacy-peer-deps
RUN npm run build

# Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Supervisord config
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Setup script (entrypoint)
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose port 80 for Nginx
EXPOSE 80

# Start setup script which eventually starts supervisor
CMD ["/usr/local/bin/start.sh"]
