# stage one build
FROM node:lts-alpine

EXPOSE 3001
ENV NODE_ENV=production

RUN apk add --no-cache python make g++
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
# RUN chmod ugo+rwx .
RUN npm run build

RUN npm run copy

CMD [ "npm", "start" ]