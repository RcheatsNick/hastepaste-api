FROM node:lts-alpine

WORKDIR /app

RUN apk add git

COPY . .

RUN git fetch
RUN git pull

RUN yarn
RUN yarn build

ENV NODE_ENV=production
ENV PORT=8080

CMD [ "yarn", "start" ]
