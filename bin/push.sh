#!/bin/bash

export $(grep -v '^#' .env | xargs)

DOCKER_IMAGE_NAME="$DOCKER_USERNAME/desitnow-fe"
DOCKER_TAG="latest"

echo "Đang đăng nhập vào Docker Hub..."
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"

echo "Đang build Docker image..."
docker build --platform linux/amd64 -f Dockerfile.prod -t $DOCKER_IMAGE_NAME:$DOCKER_TAG .

echo "Đang push Docker image lên Docker Hub..."
docker push $DOCKER_IMAGE_NAME:$DOCKER_TAG

echo "Hoàn tất việc build và push Docker image."

echo "Deploy: ------------------- :"

ssh des <<EOF
cd ~/des-it-now
sh pull.sh
EOF

echo "Hoàn tất việc deploy."
