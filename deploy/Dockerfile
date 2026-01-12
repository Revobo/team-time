# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the React app and compile server
RUN npm run build && npm run build:server

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy built React app
COPY --from=builder /app/website/dist ./website/dist

# Copy compiled server
COPY --from=builder /app/dist/server ./dist/server

# Copy drizzle migrations
COPY --from=builder /app/drizzle ./drizzle

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "dist/server/index.js"]
