dev:
	docker compose up -d back-end front-end-web

test-phpunit:
	docker compose exec back-end php artisan test

test-vitest:
	docker compose run --rm --service-ports vitest

reset-db:
	docker compose exec back-end php artisan migrate:fresh --seed

key:
	docker compose exec back-end php artisan key:generate

setup:
	docker compose exec back-end composer install --no-scripts
	docker compose exec back-end cp .env.example .env
	docker compose exec back-end touch database/database.sqlite
	make key
	make reset-db
