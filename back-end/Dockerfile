FROM node:16
ARG DB_CONNECT
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG PASSPORT_SECRET
ARG SOCKET_ORIGIN
ARG SERVER_URI
ENV DB_CONNECT=${DB_CONNECT} 
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV PASSPORT_SECRET=${PASSPORT_SECRET}
ENV SOCKET_ORIGIN=${SOCKET_ORIGIN}
ENV SERVER_URI=${SERVER_URI}
RUN mkdir -p /home/app
WORKDIR /home/app
COPY . /home/app
RUN npm i 
CMD ["node", "server.js"]