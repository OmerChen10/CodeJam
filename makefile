.PHONY: all build-env-base-image build-frontend up

all: build-env-base-image build-frontend up

build-env-base-image: backend/codejam-server/assets/dockerfile
	@echo "Building base image..."
	cd backend/codejam-server/assets && docker build . -t env-base

build-frontend: frontend/src/pages
	@echo "Building Frontend..."
	cd frontend && npm run build

up:
	@echo "Starting Docker Compose..."
	docker-compose up --build