FROM node:16
RUN npm install -g npm@8.5.2
RUN npm install -g nodemon
WORKDIR /usr/wtf
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 1111
EXPOSE 1111
RUN npm run build
CMD [ "nodemon", "./build/server.js" ]