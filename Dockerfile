FROM node:alpine

WORKDIR /bin/drone-env
COPY package*.json ./
RUN npm ci --only=production

COPY src src

ENTRYPOINT [ "node", "/bin/drone-env" ]