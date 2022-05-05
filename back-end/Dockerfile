FROM node:16
RUN mkdir -p /home/app
WORKDIR /home/app
COPY . /home/app
RUN npm i 
CMD ["node", "server.js"]