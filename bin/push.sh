#!/bin/bash

set -e  # Dừng script nếu có lệnh nào đó bị lỗi

echo "Step 1: Đang tải biến môi trường từ file .env..."
export $(grep -v '^#' .env | xargs)

DOCKER_IMAGE_NAME="desitnow-be"
DOCKER_TAG="latest"
TAR_FILE="$DOCKER_IMAGE_NAME-$DOCKER_TAG.tar"

echo "Step 2: Kiểm tra xem Docker image có tồn tại..."
IMAGE_ID=$(docker images -q $DOCKER_IMAGE_NAME:$DOCKER_TAG)

if [ -n "$IMAGE_ID" ]; then
    echo "Step 3: Đang xóa Docker image đã tồn tại..."
    docker rmi $DOCKER_IMAGE_NAME:$DOCKER_TAG
else
    echo "Step 3: Docker image $DOCKER_IMAGE_NAME:$DOCKER_TAG không tồn tại, không cần xóa."
fi

echo "Step 4: Đang build Docker image mới..."
docker build --platform linux/amd64 -f Dockerfile.prod -t $DOCKER_IMAGE_NAME:$DOCKER_TAG .

echo "Step 5: Đang tạo file tar từ Docker image..."
docker save -o bin/$TAR_FILE $DOCKER_IMAGE_NAME:$DOCKER_TAG

echo "Step 6: Kiểm tra và xóa file tar cũ trên server nếu tồn tại..."
ssh des <<EOF
if [ -f ~/des-it-now/$TAR_FILE ]; then
  echo "File tar đã tồn tại trên server, xóa file cũ..."
  rm ~/des-it-now/$TAR_FILE
fi
EOF

echo "Step 7: Đang copy file tar mới lên server..."
scp bin/$TAR_FILE des:~/des-it-now/

echo "Step 8: Đang load Docker image từ file tar trên server và deploy..."
ssh des <<EOF
cd ~/des-it-now

echo "Loading Docker image từ file tar..."
docker load -i $TAR_FILE

echo "Dừng và xóa các container hiện tại..."
docker compose down

echo "Xóa các image không còn sử dụng (dangling)..."
docker rmi \$(docker images -q --filter "dangling=true")

echo "Khởi động lại dịch vụ với Docker Compose..."
docker compose up -d
EOF

echo "Step 9: Hoàn tất việc deploy."
