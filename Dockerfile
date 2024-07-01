ARG TAG=latest

FROM node:20 AS builder

ARG TAG=latest
ARG GIT_SHA=latest

ENV DAESITE_VERSION=${TAG}

ENV ROOT_DIR="/app"

WORKDIR ${ROOT_DIR}

COPY . .

RUN yarn build
