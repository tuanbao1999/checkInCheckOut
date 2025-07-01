# 🚀 Deployment Guide

## Environment Configuration

### 1. Local Development
Create a `.env` file in the root directory:
```bash
VITE_API_BASE_URL=http://localhost:8080
```

### 2. Production Deployment

#### Option A: Using Docker
Update the `docker-compose.yml` file:
```yaml
environment:
  - NODE_ENV=production
  - VITE_API_BASE_URL=https://your-production-api.com
```

#### Option B: Using Environment Variables
Set the environment variable before building:
```bash
# Linux/Mac
export VITE_API_BASE_URL=https://your-production-api.com
npm run build

# Windows
set VITE_API_BASE_URL=https://your-production-api.com
npm run build
```

#### Option C: Using .env file for production
Create a `.env.production` file:
```bash
VITE_API_BASE_URL=https://your-production-api.com
```

### 3. Different Environments

#### Development
```bash
VITE_API_BASE_URL=http://localhost:8080
```

#### Staging
```bash
VITE_API_BASE_URL=https://staging-api.yourcompany.com
```

#### Production
```bash
VITE_API_BASE_URL=https://api.yourcompany.com
```

## API Configuration

The application uses the following API endpoints:
- **Login**: `${VITE_API_BASE_URL}/api/admin/get-token`
- **Check-in/Check-out**: `${VITE_API_BASE_URL}/api/admin/MobileAddCheckInOut`

## Build and Deploy

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **For Docker deployment**:
   ```bash
   docker-compose up -d
   ```

## Troubleshooting

### API Connection Issues
- Verify the `VITE_API_BASE_URL` is correct
- Check if the API server is running
- Ensure CORS is properly configured on the backend

### Build Issues
- Make sure all environment variables are set
- Check that the `.env` file is in the root directory
- Verify the API URL is accessible from the build environment 