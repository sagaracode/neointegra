# 🔧 Deployment Troubleshooting - Coolify

## ✅ Latest Fix Applied

**Commit:** `0b33d5e` - "Fix: Use npm install instead of npm ci for build"  
**Date:** 26 Jan 2026  
**File:** `frontend/Dockerfile`

### What Changed:
```dockerfile
# Changed from:
RUN npm ci --only=production  ❌

# To:
RUN npm install  ✅
```

**Why:** 
- `npm ci` only installs production dependencies
- `npm install` installs ALL dependencies including devDependencies
- **Vite is a devDependency** and needed for build process!

---

## 🚀 Steps to Deploy in Coolify

### 1. Trigger New Deployment

**Option A: Automatic (if webhook enabled)**
- Coolify will auto-detect the new push
- Wait 30-60 seconds for auto-deploy

**Option B: Manual Redeploy**
1. Go to Coolify Dashboard
2. Select your frontend application
3. Click **"Force Redeploy"** or **"Redeploy"** button
4. This ensures fresh pull from GitHub

### 2. Clear Build Cache (if still failing)

In Coolify application settings:
1. Go to **Danger Zone** or **Advanced**
2. Click **"Clear Build Cache"**
3. Then click **"Deploy"**

This forces Docker to rebuild from scratch without cache.

---

## 📊 Expected Successful Build Log

You should see:
```
✓ [build 4/6] RUN npm install
✓ added 300+ packages
✓ [build 6/6] RUN npm run build
✓ vite v5.4.21 building for production...
✓ transforming...
✓ ✓ 142 modules transformed.
✓ rendering chunks...
✓ dist/index.html
✓ dist/assets/...
✓ ✓ built in 15.2s
✓ [stage-1 3/3] COPY --from=build /app/dist /usr/share/nginx/html
✓ Deployment successful!
```

---

## ❌ If Error Persists

### Error: "vite: not found"

**Cause:** Coolify might be using cached old Dockerfile

**Solutions:**

#### Solution 1: Force Pull Latest Code
In Coolify, check that it's pulling latest commit:
- Should show commit: `0b33d5e`
- Not old commit: `08e4626` or `87e4e7d`

#### Solution 2: Verify Base Directory
Make sure Base Directory is set to: `/frontend`

#### Solution 3: Manual Docker Build Test
Test locally first:
```bash
cd D:\WEBSITES\frontend
docker build -t test-frontend .
```

If local build succeeds, the issue is in Coolify config.

#### Solution 4: Alternative Dockerfile (Nuclear Option)
If nothing works, try simpler Dockerfile:

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔍 Debug Checklist

- [ ] Latest commit `0b33d5e` is pushed to GitHub
- [ ] Coolify is pulling from correct branch (`main`)
- [ ] Base Directory is `/frontend`
- [ ] Build Pack is set to **Dockerfile**
- [ ] Dockerfile exists in `/frontend/Dockerfile`
- [ ] nginx.conf exists in `/frontend/nginx.conf`
- [ ] Clear build cache in Coolify
- [ ] Force redeploy (not just restart)

---

## 📝 Coolify Configuration

Double-check these settings:

| Setting | Value |
|---------|-------|
| Repository | `https://github.com/sagaracode/neointegra` |
| Branch | `main` |
| Build Pack | `Dockerfile` |
| Base Directory | `/frontend` |
| Dockerfile Location | `Dockerfile` (relative to base dir) |
| Port | `80` |
| Publish Directory | (empty - nginx serves from container) |

---

## 💡 Alternative: Use Docker Compose

If Dockerfile continues to fail, you can use docker-compose.yml:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=${BACKEND_URL}/api
```

---

## 🆘 Last Resort

If deployment still fails after all attempts:

1. **Delete the application in Coolify**
2. **Create new application** from scratch
3. Make sure to:
   - Select **Dockerfile** build pack (not Nixpacks!)
   - Set Base Directory: `/frontend`
   - Double-check all settings

---

## 📞 Get Build Logs

To debug, check these logs in Coolify:
1. **Build Logs** - Shows Docker build process
2. **Deployment Logs** - Shows deployment status
3. **Application Logs** - Shows runtime logs (after successful deploy)

Look for:
- ❌ `vite: not found` - Dependencies issue
- ❌ `cannot find module` - Build failed
- ❌ `COPY failed` - Missing files
- ✅ `built in Xs` - Build succeeded!

---

**Current Status:** Dockerfile fixed, commit pushed (`0b33d5e`), ready for redeploy! 🚀
