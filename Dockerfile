FROM node:20.18 AS base

RUN npm i -g npm

FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json package-lock.json ./  

RUN npm install

FROM base AS build

WORKDIR /usr/src/app

COPY . . 
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN npm run build
RUN npm prune --prod

FROM node:20-alpine3.21 AS deploy

USER 1000

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

ENV CLOUDFLARE_ACCOUNT_ID="#"
ENV CLOUDFLARE_ACCESS_KEY_ID="#"
ENV CLOUDFLARE_SECRET_ACCESS_KEY_ID="#"
ENV CLOUDFLARE_BUCKET="upload-server"
ENV CLOUDFLARE_PUBLIC_URL="https://pub-2ae9e107e261418f82801b31d4911eb1.r2.dev"
ENV DATABASE_URL=postgresql://docker:docker@localhost:5432/upload

EXPOSE 3333

CMD ["npm", "run", "start"]
