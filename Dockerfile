FROM node:14.15.2

# Copy package.json first and run npm install.
# This is to avoid re-creating the base layer for each image build.
COPY ./package.json /opt/survey/backend/code/package.json

WORKDIR /opt/survey/backend/code

ENV NODE_ENV=development

# Run basic apt-get update / install commands and npm install.
RUN apt-get update && \
    npm install

RUN npm install pm2 -g

# Copy code from codebase into docker
COPY . /opt/survey/backend/code

EXPOSE 3000

CMD ["pm2-runtime", "./bin/www","--name","survey"]