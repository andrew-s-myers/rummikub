FROM mcr.microsoft.com/playwright:v1.54.1-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Playwright configuration and tests
COPY playwright.config.ts ./
COPY playwright/ ./playwright/

# Create output directories
RUN mkdir -p playwright/test-results playwright/html-report

# Set up environment
ENV CI=true
ENV PLAYWRIGHT_HTML_REPORT=playwright/html-report

# Default command
CMD ["npx", "playwright", "test"]