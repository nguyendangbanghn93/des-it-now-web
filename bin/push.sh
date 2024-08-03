#!/bin/bash

export $(grep -v '^#' .env | xargs)

DOCKER_IMAGE_NAME="desitnow-fe"
DOCKER_TAG="latest"
TAR_FILE="$DOCKER_IMAGE_NAME-$DOCKER_TAG.tar"

echo "Đang build Docker image..."
docker build --platform linux/amd64 -f Dockerfile.prod -t $DOCKER_IMAGE_NAME:$DOCKER_TAG .

echo "Đang tạo file tar từ Docker image..."
docker save -o $TAR_FILE $DOCKER_IMAGE_NAME:$DOCKER_TAG

echo "Đang copy file tar lên server..."

# Xóa file cũ nếu tồn tại trên server
ssh des <<EOF
if [ -f ~/des-it-now/$TAR_FILE ]; then
  echo "File tar đã tồn tại, xóa file cũ..."
  rm ~/des-it-now/$TAR_FILE
fi
EOF

# Copy file mới lên server
scp $TAR_FILE des:~/des-it-now/

echo "Đang load Docker image từ file tar trên server và deploy..."
ssh des <<EOF
cd ~/des-it-now

# Load Docker image từ file tar
docker load -i $TAR_FILE

# Dừng và xóa các container hiện tại
docker compose down

# Xóa các image không còn sử dụng (các image dangling)
docker rmi \$(docker images -q --filter "dangling=true")

# Khởi động lại dịch vụ
docker compose up -d
EOF

echo "Hoàn tất việc deploy."
