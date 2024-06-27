GIT_SHA = $(shell git rev-parse --verify HEAD)
IMAGES_TAG = ${shell git describe --exact-match 2> /dev/null || echo "latest"}

IMAGE_DIRS = $(wildcard services/*)

.PHONY: all ${IMAGE_DIRS} proto packages lint

all: ${IMAGE_DIRS} proto packages

${IMAGE_DIRS}: proto packages
	$(eval IMAGE_NAME := $(word 2,$(subst /, ,$@)))
	docker build -t daesite/${IMAGE_NAME}:${IMAGES_TAG} -t daesite/${IMAGE_NAME}:latest --build-arg TAG=${IMAGES_TAG} -- $@

proto:
	docker build -t daesite/proto:${IMAGES_TAG} -t daesite/proto:latest --build-arg TAG=${IMAGES_TAG} --build-arg GIT_SHA=${GIT_SHA} $@

packages:
	docker build -t daesite/base:${IMAGES_TAG} -t daesite/base:latest --build-arg TAG=${IMAGES_TAG} --build-arg GIT_SHA=${GIT_SHA} $@

lint:
	cargo fmt --all -- --check

lint-fix:
	cargo fmt --all --