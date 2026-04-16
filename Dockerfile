FROM node:20 AS base

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# ======================
# DESARROLLO
# ======================
FROM base AS development

CMD ["npm", "run", "develop"]

# ======================
# BUILD (para prod)
# ======================
FROM base AS build

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

# ======================
# PRODUCCIÓN
# ======================
FROM node:20 AS production

WORKDIR /app

COPY --from=build /app ./

ENV NODE_ENV=production

EXPOSE 1337

CMD ["npm", "run", "start"]