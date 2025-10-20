# ---------------------------
# Stage 1: Build
# ---------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Build-time args
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG DATABASE_URL
# ARG GOOGLE_CLIENT_ID
# ARG GOOGLE_CLIENT_SECRET
# ARG FACEBOOK_CLIENT_ID
# ARG FACEBOOK_CLIENT_SECRET

# Make sure they're also available during build
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV DATABASE_URL=$DATABASE_URL
# ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
# ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
# ENV FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID
# ENV FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRET

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy everything else
COPY . .

# 👇 build with the env now visible
RUN BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET DATABASE_URL=$DATABASE_URL npm run build

# ---------------------------
# Stage 2: Production
# ---------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]