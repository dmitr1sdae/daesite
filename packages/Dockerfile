ARG TAG=latest

FROM daesite/proto:${TAG} AS builder

ARG TAG=latest
ARG GIT_SHA=latest

ENV DAESITE_VERSION=${TAG}

ENV ROOT_DIR="/app"

WORKDIR ${ROOT_DIR}/packages

COPY . .
