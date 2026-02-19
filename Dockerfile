### Step 1: Build Stage ###
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache libc6-compat

# Install dependencies separately to optimize caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js app (produces .next/standalone)
RUN npm run build

### Step 2: Production Stage ###
FROM node:24-alpine AS runner

WORKDIR /app

# Install necessary production deps
RUN apk add --no-cache libc6-compat

# Copy standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Optional: Set NODE_ENV explicitly
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
