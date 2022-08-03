FROM node:alpine3.16
WORKDIR /app
COPY package.json .
RUN npm install
RUN adduser -D dummy
USER dummy
COPY . .
EXPOSE ${PORT}

CMD ["node","server.js"]
