FROM node:20-alpine

WORKDIR /app

# Install system dependencies needed for some npm packages
RUN apk add --no-cache git

# Copy package files and install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactdev -u 1001

# Change ownership of app directory
RUN chown -R reactdev:nodejs /app
USER reactdev

# Expose ports for Vite dev server and Vitest UI
EXPOSE 5173
EXPOSE 51999

# Default command for development
CMD ["npm", "run", "dev"]
