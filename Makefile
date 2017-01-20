DOCKER_REPO ?= docker-stage.foxcommerce.com:5000
DOCKER_TAG ?= tpg-storefront
DOCKER_BRANCH ?= master
BRANCH_NAME_ESCAPED = $(shell git name-rev --name-only HEAD | sed 's/[^a-zA-Z0-9]/-/g')

dev d:
	source .env && yarn dev

setup: clean
	yarn --pure-lockfile

build: setup
	test -f .env && export eval `cat .env` || true && NODE_ENV=production ./node_modules/.bin/gulp build

docker:
	docker build -t $(DOCKER_TAG) .

docker-push:
	docker tag $(DOCKER_TAG) $(DOCKER_REPO)/$(DOCKER_TAG):$(DOCKER_BRANCH)
	docker push $(DOCKER_REPO)/$(DOCKER_TAG):$(DOCKER_BRANCH)

clean:
	rm -rf ./node_modules

test: setup
	yarn test

deploy-now:
	now ./hello-now
	cd hello-now && ../node_modules/.bin/babel-node now-realias.js $(BRANCH_NAME_ESCAPED).now.sh


.PHONY: dev d setup build docker docker-push clean test deploy-now
