FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
RUN npm install typescript --global

COPY . .

COPY .env.sample .env
RUN yarn run check
RUN yarn run build
RUN rm -rf src/ static/

USER node:node
ENV NODE_ENV=production

CMD ["node", "build"]