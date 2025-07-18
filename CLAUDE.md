# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fullstack monorepo with Laravel backend, React frontend, and Docker containerization. The project uses Laravel Sanctum for API authentication and includes comprehensive tooling for development and testing.

## Development Commands

### Setup & Installation
```bash
# Initial setup (run once)
make setup

# Start development environment (all services)
make dev
# OR: docker compose up -d

# Reset database with fresh migrations and seeds
make reset-db

# Generate new application key
make key
```

### Docker Commands
```bash
# Start all services
docker compose up -d

# Start specific services
docker compose up -d back-end front-end-web

# View logs
docker compose logs -f
docker compose logs back-end front-end-web

# Stop services
docker compose down

# Rebuild containers
docker compose build
docker compose up -d --build
```

### Testing
```bash
# Run Laravel/PHP tests
make test-phpunit
# OR: docker compose exec back-end php artisan test

# Run React/TypeScript tests with Vitest
make test-vitest
# OR: docker compose run --rm --service-ports vitest

# Run individual test files
docker compose exec back-end php artisan test --filter=ExampleTest
cd front-end-web && npm run test Button.test.tsx
```

### Frontend Development
```bash
# Build frontend
cd front-end-web && npm run build

# Lint frontend code
cd front-end-web && npm run lint

# Run frontend tests in watch mode
cd front-end-web && npm run test:watch
```

### Backend Development
```bash
# Run Laravel artisan commands
docker compose exec back-end php artisan <command>

# Install PHP dependencies
docker compose exec back-end composer install

# Run database migrations
docker compose exec back-end php artisan migrate

# Access Laravel Pint (code formatting)
docker compose exec back-end ./vendor/bin/pint
```

## Architecture

### Backend Structure
- **Framework**: Laravel 12 with PHP 8.3
- **Authentication**: Laravel Sanctum for API token-based auth
- **Database**: SQLite for development, configured for PostgreSQL/MySQL in production
- **Location**: `back-end/` directory
- **Key Files**:
  - `routes/api.php` - API routes with Sanctum middleware
  - `app/Http/Controllers/AuthController.php` - Authentication endpoints
  - `config/sanctum.php` - Sanctum configuration with stateful domains
  - `database/migrations/` - Database schema definitions

### Frontend Structure
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest with React Testing Library
- **Location**: `front-end-web/` directory
- **Key Files**:
  - `src/context/AuthContext.tsx` - Authentication state management with axios interceptors
  - `src/components/` - Reusable UI components
  - `vite.config.ts` - Vite configuration for development
  - `vitest.config.ts` - Test configuration with jsdom environment

### Docker Setup
- **Development**: Multi-container setup with back-end, front-end-web, and vitest services
- **Ports**: Backend on 8000, Frontend on 5173, Vitest UI on 51999
- **Volumes**: Source code mounted for live reloading
- **Services**: Redis and FastAPI microservices available but commented out

### Authentication Flow
- **Registration/Login**: JWT tokens via Laravel Sanctum
- **Storage**: Tokens stored in localStorage
- **API Requests**: Automatic token attachment via axios interceptors
- **Middleware**: Protected routes use `auth:sanctum` middleware
- **Frontend**: AuthContext provides user state and authentication methods

### Testing Strategy
- **Backend**: PHPUnit tests in `back-end/tests/` (Feature and Unit)
- **Frontend**: Vitest tests in `front-end-web/src/components/__tests__/`
- **E2E**: Cypress tests in `cypress/e2e/`
- **Test Data**: SQLite in-memory database for backend tests

## Important Notes

- All development commands should be run through Docker containers
- The project uses SQLite for development but is configured for production databases
- Frontend uses Vite's fast HMR for development
- Authentication tokens are managed automatically by axios interceptors
- Two-factor authentication tables are already migrated but not implemented in controllers
- FastAPI microservice structure is prepared but not active