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

# Build the Next.js app
RUN npm run build

### Step 2: Production Stage ###
FROM node:24-alpine AS runner

WORKDIR /app

# Install necessary production deps
RUN apk add --no-cache libc6-compat

# Only copy production deps and build output
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Optional: Set NODE_ENV explicitly
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
