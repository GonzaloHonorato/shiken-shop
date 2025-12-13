# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./

RUN npm install

COPY src ./src
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY src/data ./dist/data

EXPOSE 3000
CMD ["node", "dist/main.js"]