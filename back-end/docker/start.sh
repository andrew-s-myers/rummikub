#!/bin/bash
set -e

# Start PHP-FPM in the background
php-fpm --daemonize

# Run Laravel setup commands
php artisan key:generate --force
php artisan migrate --force
# Skip caching to avoid Sanctum middleware conflicts
# php artisan config:cache
# php artisan route:cache
php artisan view:cache

# Start nginx in the foreground
nginx -g "daemon off;"