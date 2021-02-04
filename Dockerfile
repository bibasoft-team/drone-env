FROM bibasoft/node-aws

WORKDIR /bin/
COPY package*.json ./
RUN npm ci --only=production

COPY src src

ENTRYPOINT [ "node", "/bin/" ]