FROM node:8.4

RUN mkdir /src
RUN chown -R node:node /src
WORKDIR /src

USER node

ADD src/package.json /src

RUN npm install

ADD src /src

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]
