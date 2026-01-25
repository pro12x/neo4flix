# ========================================
# Stage 1: Build Angular application
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install for compatibility)
RUN npm install --silent --legacy-peer-deps

# Copy application source
COPY . .

# Build Angular in production mode (production is default in angular.json)
RUN npm run build

# ========================================
# Stage 2: Serve with Nginx
# ========================================
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

# Copy built Angular app
# Angular outputs to dist/neo4flix-ui/browser (check angular.json outputPath)
COPY --from=builder /app/dist/neo4flix-ui/browser /usr/share/nginx/html

# Copy entrypoint script for runtime env injection
COPY docker/entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
