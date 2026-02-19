### Step 1: Build Stage ###
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache libc6-compat

# Install dependencies separately to optimize caching
COPY package.json package-lock.json ./

# macOS npm can leave the lock file out of sync for optional platform-specific
# packages (e.g. @rollup/rollup-win32-arm64-msvc) in two ways:
#   1. A packages entry exists but has no version field (stub placeholder).
#   2. A packages entry is absent entirely but still referenced in another
#      package's optionalDependencies (npm never wrote it for this platform).
# Both cases cause `npm ci` to fail on Linux. Remove them before installing.
RUN node -e "\
  const fs = require('fs');\
  const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));\
  let removed = 0, cleaned = 0;\
  for (const [key, pkg] of Object.entries(lock.packages)) {\
    if (pkg.optional && !pkg.version) { delete lock.packages[key]; removed++; }\
  }\
  for (const pkg of Object.values(lock.packages)) {\
    if (!pkg.optionalDependencies) continue;\
    for (const dep of Object.keys(pkg.optionalDependencies)) {\
      if (!lock.packages['node_modules/' + dep]) {\
        delete pkg.optionalDependencies[dep]; cleaned++;\
      }\
    }\
  }\
  fs.writeFileSync('package-lock.json', JSON.stringify(lock, null, 2));\
  if (removed) console.log('Removed ' + removed + ' version-less optional entries.');\
  if (cleaned) console.log('Cleaned ' + cleaned + ' dangling optionalDependencies refs.');\
"

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
