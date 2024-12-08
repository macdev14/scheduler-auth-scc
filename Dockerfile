
FROM node:23

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3021

CMD ["npm", "start"]