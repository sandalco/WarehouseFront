# 1. Build mərhələsi
FROM node:18-alpine AS builder

WORKDIR /app

# Package.json və lock faylları
COPY package*.json ./

# Lazımi paketləri quraşdır
RUN npm install

# 👉 ENV faylını kopyala (əgər var)
COPY .env.production .env.production

# Layihə fayllarını kopyala
COPY . .

# Build zamanı env-lərdən istifadə üçün
ENV NODE_ENV=production

# 👉 Next.js build
RUN npm run build

# 2. Run mərhələsi
FROM node:18-alpine AS runner

WORKDIR /app

# Faylları kopyala
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# 👉 ENV faylını da kopyala, əgər SSR zamanı istifadə olunacaqsa
COPY --from=builder /app/.env.production ./.env.production

# ENV dəyişənini set et
ENV NODE_ENV=production

# Port
EXPOSE 3000

CMD ["npm", "start"]
