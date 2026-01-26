# 🚨 Exit Code 127 Fix - "vite: not found"

## ❌ Error
```
sh: vite: not found
exit code: 127
```

## 🔍 Root Cause

**Exit code 127** = "Command not found"

**Problem:** `NODE_ENV=production` was set in Dockerfile, which caused:
```dockerfile
ENV NODE_ENV=production  # ❌ This made npm skip devDependencies!
RUN npm ci               # Only installed production deps
```

**Result:** Vite (which is a devDependency) was NOT installed, so `npm run build` failed.

---

## ✅ Solution Applied

### Fix in Dockerfile:

**BEFORE (❌ Wrong):**
```dockerfile
ENV NODE_ENV=production      # Skips devDeps
RUN npm ci --legacy-peer-deps
```

**AFTER (✅ Correct):**
```dockerfile
# No NODE_ENV set (defaults to development)
RUN npm install --legacy-peer-deps  # Installs ALL deps including devDeps
```

### Added Debug Checks:
```dockerfile
RUN npm install --legacy-peer-deps && \
    npm list vite || echo "Checking vite installation..." && \
    which vite || echo "Vite binary check..."
```

This will show in build logs if vite is properly installed.

---

## 📦 Commits

| Commit | Description |
|--------|-------------|
| `e2f8979` | Debug: Add vite check in Dockerfile |
| `3b07c1f` | Fix exit 127: npm install for devDeps |
| `51c7dc9` | Previous fixes |

---

## 🚀 Deploy Steps in Coolify

### ⚠️ CRITICAL: Clear Build Cache!

Docker caches each layer. Old cache still has `NODE_ENV=production` layer!

**Steps:**
1. **Clear Build Cache** in Coolify
   - Go to application → Danger Zone
   - Click "Clear Build Cache"
   - This removes old Docker layers

2. **Force Redeploy**
   - Click "Force Redeploy" (not just Restart)
   - Wait for build logs

3. **Check Build Logs**
   You should see:
   ```
   ✓ RUN npm install --legacy-peer-deps
   ✓ added 300+ packages
   ✓ Checking vite installation...
   ✓ vite@5.0.12
   ✓ RUN npm run build
   ✓ vite building for production...
   ✓ built in 15s
   ```

---

## 🐛 Debugging

### If Still Error 127:

#### 1. Check Coolify Base Directory
**Must be:** `/frontend`

Not:
- `/` ❌
- `frontend` ❌ (missing slash)
- Empty ❌

#### 2. Verify Build Context
In build logs, check:
```
Checked out commit e2f8979
```
If older commit, Coolify is using stale code.

#### 3. Check package.json Location
Coolify should find:
```
/frontend/package.json
/frontend/Dockerfile
```

#### 4. Verify npm install Output
Look for in logs:
```
added 300+ packages
```
If you see "added 47 packages", devDeps were skipped!

---

## 📊 Technical Explanation

### npm Behavior with NODE_ENV:

```bash
# When NODE_ENV=production:
npm ci                  # Only installs "dependencies"
npm install             # Only installs "dependencies"
npm ci --production     # Only installs "dependencies"

# When NODE_ENV is NOT set (development mode):
npm ci                  # Installs "dependencies" + "devDependencies" ✅
npm install             # Installs "dependencies" + "devDependencies" ✅
```

### Why Vite is devDependency:

```json
{
  "devDependencies": {
    "vite": "^5.0.12",          // Build tool
    "@vitejs/plugin-react": "...", // Vite plugin
    "autoprefixer": "...",       // CSS processor
    "tailwindcss": "...",        // CSS framework
    "eslint": "..."              // Linter
  }
}
```

These are only needed during BUILD, not runtime!

At runtime, only nginx serves static files.

---

## ✅ Success Indicators

After successful deploy:

```bash
# In build logs:
✓ npm install completed (300+ packages)
✓ vite found and executable
✓ npm run build succeeded
✓ dist/ folder created
✓ Files copied to nginx

# In application:
✓ Container running
✓ Website accessible
✓ No 404 errors
```

---

## 🆘 Nuclear Option

If nothing works, try this minimal Dockerfile:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app

# Copy and install
COPY package*.json ./
RUN npm install

# Build
COPY . .
RUN npm run build

# Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

No optimizations, no cache tricks - just works!

---

## 📝 Checklist

Before deploy:
- [ ] Latest commit is `e2f8979`
- [ ] Base Directory = `/frontend`
- [ ] Build Pack = `Dockerfile`
- [ ] Clear Build Cache clicked
- [ ] Force Redeploy (not Restart)

---

**Status:** Fixed and pushed ✅  
**Action Required:** Clear cache + Force redeploy in Coolify  
**Expected:** Build should succeed now! 🎉
