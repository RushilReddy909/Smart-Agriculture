# Stage 1: Build frontend
FROM node:18 AS builder

WORKDIR /app

# Install root dependencies (server)
COPY package.json package-lock.json* ./
RUN npm install

# Install client dependencies & build
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Stage 2: Final production server
FROM node:18

WORKDIR /app

# Copy server files
COPY server ./server
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy built frontend from builder stage
COPY --from=builder /app/client/dist ./client/dist

ENV NODE_ENV=production

EXPOSE 5000
CMD ["node", "server/server.js"]
