FROM node:13.2.0

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY dist dist

EXPOSE 3000

CMD [ "node", "dist/server.js" ]
