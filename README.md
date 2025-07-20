# 🧱 Fullstack Starter Monorepo

A batteries-included fullstack monorepo template for rapidly launching full-featured web and mobile apps. Designed for scalable team development or high-velocity solo prototyping.

---

## 🧠 Purpose

Provide a canonical starter with opinionated best practices, full-stack authentication, clean code boundaries, and dev tools already wired up. Built for Laravel, React, FastAPI, and containerized workflows.

---

## 🧰 Tech Stack

### 🖥 Backend

- **Laravel** 12 (PHP 8.3)
- **Sanctum** for API token auth (SPA and mobile)
- **Fortify** for auth scaffolding (registration, login, password reset, etc.)
- **FastAPI** (Python 3.11) for AI microservices
- **Pydantic AI Agents** with Laravel job orchestration

### 🌐 Web Frontend

- **React** + **TypeScript**
- **Vite** (fast dev bundling) + **SWC** (next-gen transpilation)
- **Tailwind CSS**
- **JWT Auth** via Laravel Sanctum

### 📱 Mobile Frontend

- **Expo React Native** (TypeScript, shared packages WIP)

### ⚙️ Infra & Tooling

- **Docker Compose** for full container orchestration
- **Redis** for queue, cache, session
- **MailHog** for email capture in dev
- **SQLite3** (dev), **PostgreSQL** or **MySQL** (prod)
- **pnpm/Yarn Workspaces** for monorepo structure

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/fullstack-start.git
cd fullstack-start
