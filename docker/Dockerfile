# stage one build
FROM node:14-alpine

EXPOSE 3001
ENV NODE_ENV=production

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm install typescript -g

USER node

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY ./package.json .
RUN npm install --production=false

COPY . .

RUN npm run build

RUN npm prune --production

RUN npm run copy

CMD [ "npm", "start" ]