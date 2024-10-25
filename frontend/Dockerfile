FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
RUN npm install typescript --global

COPY . .

RUN yarn run check
RUN yarn run build
RUN rm -rf src/ static/

USER node:node
ENV NODE_ENV=production

CMD ["node", "build"]