# Hướng dẫn Deploy lên Vercel

## Vấn đề đã được giải quyết

Vấn đề route `/3dvista-embed/halong-tour` không hoạt động trên Vercel nhưng chạy được trên localhost đã được giải quyết bằng cách:

### 1. Cấu hình `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 2. File `public/_redirects`
```
/*    /index.html   200
```

### 3. Cấu hình Vite (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/',
  // ... other config
})
```

### 4. Sửa lại cấu trúc routing trong `App.tsx`
- Đặt public routes trước protected routes
- Sử dụng conditional rendering thay vì conditional routing

## Các bước deploy

1. **Commit và push code lên GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment routing issues"
   git push origin main
   ```

2. **Deploy trên Vercel**
   - Vào Vercel Dashboard
   - Import project từ GitHub
   - Vercel sẽ tự động detect Vite framework
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Kiểm tra deployment**
   - Sau khi deploy thành công, test các routes:
     - `https://your-domain.vercel.app/3dvista-embed/halong-tour`
     - `https://your-domain.vercel.app/marzipano-embed/halong-tour`

## Lưu ý quan trọng

- Đảm bảo tất cả dependencies đã được cài đặt
- Vercel sẽ tự động detect Vite framework từ `package.json`
- Client-side routing sẽ hoạt động nhờ cấu hình `rewrites` trong `vercel.json`
- Nếu vẫn gặp vấn đề, có thể cần clear cache và redeploy 