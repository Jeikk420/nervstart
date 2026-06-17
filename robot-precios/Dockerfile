FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del sistema para Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-dejavu \
    tini

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY . .

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "server.js"]
