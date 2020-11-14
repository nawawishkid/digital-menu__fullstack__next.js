FROM node

WORKDIR /usr/src/app

COPY package.json .

RUN yarn install

EXPOSE 3000

COPY . .

CMD yarn run migrate:up && yarn run build && yarn run start