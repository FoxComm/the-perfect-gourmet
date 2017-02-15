DOCKER_REPO ?= docker-stage.foxcommerce.com:5000
DOCKER_IMAGE ?= tpg-storefront
DOCKER_TAG ?= master
BRANCH_NAME_ESCAPED = $(shell git name-rev --name-only HEAD | sed 's/[^a-zA-Z0-9]/-/g')
PROJECT_PREFIX = tpg
NOW_ALIAS = $(PROJECT_PREFIX)-$(BRANCH_NAME_ESCAPED)

dev d:
	source .env && yarn dev

setup: clean
	yarn --pure-lockfile

build:
	test -f .env && export eval `cat .env` || true && NODE_ENV=production ./node_modules/.bin/gulp build

docker:
	docker build -t $(DOCKER_IMAGE) .

docker-push:
	docker tag $(DOCKER_IMAGE) $(DOCKER_REPO)/$(DOCKER_IMAGE):$(DOCKER_TAG)
	docker push $(DOCKER_REPO)/$(DOCKER_IMAGE):$(DOCKER_TAG)

clean:
	rm -rf ./node_modules

test: 
	yarn test

now-deploy:
	now ./hello-now -e API_URL=https://httpbin.org/ -e LOG_STREAM=$(NOW_ALIAS)
	cd hello-now && ../node_modules/.bin/babel-node now-realias.js $(NOW_ALIAS).now.sh

now-logs:
	now-logs $(NOW_ALIAS)

.PHONY: dev d setup build docker docker-push clean test deploy-now
