# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Set NODE_ENV to production for optimization
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install dependencies with clean slate
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build with increased memory limit
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
