# Hướng dẫn Deploy lên Docker

## Yêu cầu
- Docker đã được cài đặt trên máy
- Docker Compose đã được cài đặt

## Cách deploy

### 1. Build và chạy với Docker Compose (Khuyến nghị)

```bash
# Build và chạy ứng dụng
docker-compose up --build

# Chạy ở background
docker-compose up -d --build

# Dừng ứng dụng
docker-compose down
```

### 2. Build và chạy với Docker trực tiếp

```bash
# Build image
docker build -t checkin-checkout-system .

# Chạy container
docker run -p 3000:80 checkin-checkout-system

# Chạy ở background
docker run -d -p 3000:80 --name checkin-checkout-app checkin-checkout-system
```

## Truy cập ứng dụng

Sau khi deploy thành công, ứng dụng sẽ có thể truy cập tại:
- http://localhost:3000

## Các lệnh hữu ích

```bash
# Xem logs
docker-compose logs -f

# Xem logs của container cụ thể
docker logs checkin-checkout-system

# Dừng và xóa container
docker-compose down

# Xóa image
docker rmi checkin-checkout-system

# Xem danh sách container đang chạy
docker ps

# Xem danh sách images
docker images
```

## Cấu trúc file Docker

- `Dockerfile`: Cấu hình build và chạy ứng dụng
- `.dockerignore`: Loại trừ file không cần thiết
- `nginx.conf`: Cấu hình web server
- `docker-compose.yml`: Cấu hình để chạy với Docker Compose

## Troubleshooting

### Nếu gặp lỗi port đã được sử dụng
Thay đổi port trong `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Thay đổi từ 3000 thành 8080
```

### Nếu gặp lỗi build
```bash
# Xóa cache và build lại
docker-compose build --no-cache
``` 