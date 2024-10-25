FROM node:20-alpine

WORKDIR /app/backend

COPY package.json yarn.lock ./
RUN yarn install
RUN npm install typescript --global

COPY . .

CMD ["yarn", "start"]
