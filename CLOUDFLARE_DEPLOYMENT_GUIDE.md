# 🚀 GitHub & Cloudflare Deployment Guide

This guide will help you deploy your IP Geolocation API to GitHub and then to Cloudflare Workers.

## 📋 Prerequisites

- Git installed on your computer
- GitHub account
- Cloudflare account (free tier is sufficient)
- Node.js 20+ installed

---

## 📦 Step 1: Prepare for GitHub

### 1.1 Initialize Git Repository (if not done)

```bash
git init
```

### 1.2 Configure Git

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 1.3 Add and Commit Files

```bash
# Add all files
git add .

# Commit with message
git commit -m "Initial commit: IP Geolocation API with 128+ endpoints"
```

---

## 🌐 Step 2: Push to GitHub

### 2.1 Create New Repository on GitHub

1. Go to https://github.com/new
2. Name your repository (e.g., `ip-geolocation-api`)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### 2.2 Link and Push to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Your code is now on GitHub! 🎉

---

## ☁️ Step 3: Deploy to Cloudflare Workers

### 3.1 Install Wrangler (Already Done)

```bash
npx wrangler --version
# Should show version 4.x.x
```

### 3.2 Login to Cloudflare

```bash
npx wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 3.3 Deploy Your Worker

```bash
npm run deploy
```

Or manually:

```bash
npx wrangler deploy
```

### 3.4 Your API is Live! 🌍

After deployment, you'll see output like:

```
✅ Published ip-geolocation-api
   https://ip-geolocation-api.YOUR_SUBDOMAIN.workers.dev
```

Your API is now running globally on Cloudflare's edge network!

---

## 🔧 Step 4: Configure Cloudflare (Optional)

### 4.1 Add Custom Domain

1. Go to Cloudflare Dashboard → **Workers & Pages**
2. Click on your worker (`ip-geolocation-api`)
3. Go to **Settings** → **Triggers**
4. Click **Add Custom Domain**
5. Enter your domain (e.g., `api.yourdomain.com`)

### 4.2 Add KV Namespace for Caching (Optional)

If you want to enable caching to improve performance:

```bash
# Create KV namespace
npx wrangler kv:namespace create CACHE

# Copy the returned namespace ID
```

Then update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-namespace-id-here"  # Paste the ID from above
```

Deploy again:

```bash
npm run deploy
```

---

## 🧪 Step 5: Test Your Deployed API

### Test Health Check

```bash
curl https://ip-geolocation-api.YOUR_SUBDOMAIN.workers.dev/health
```

### Test IP Lookup

```bash
curl "https://ip-geolocation-api.YOUR_SUBDOMAIN.workers.dev/?ip=8.8.8.8"
```

### Test VPN Detection

```bash
curl "https://ip-geolocation-api.YOUR_SUBDOMAIN.workers.dev/vpn-detect?ip=1.1.1.1"
```

### View API Status

```bash
curl https://ip-geolocation-api.YOUR_SUBDOMAIN.workers.dev/status
```

---

## 🔄 Step 6: Update & Redeploy

Whenever you make changes:

```bash
# Make your changes to the code

# Test locally first
npm run dev

# Commit to GitHub
git add .
git commit -m "Description of changes"
git push

# Deploy to Cloudflare
npm run deploy
```

---

## 🐛 Troubleshooting

### Error: "KV namespace 'preview_id' is not valid"

**Solution:**
```bash
# Clear wrangler cache
rm -rf .wrangler .config/.wrangler

# Redeploy
npm run deploy
```

### Error: "Worker name mismatch"

**Solution:** Update `wrangler.toml`:
```toml
name = "your-preferred-worker-name"
```

### Error: "Module not found"

**Solution:**
```bash
# Reinstall dependencies
npm install

# Deploy again
npm run deploy
```

### Slow API Responses

**Solution:** Enable KV caching (see Step 4.2)

---

## 📊 Monitoring Your API

### View Live Logs

```bash
npm run tail
```

Or:

```bash
npx wrangler tail
```

### Check Analytics

1. Go to Cloudflare Dashboard → **Workers & Pages**
2. Click on your worker
3. View **Analytics** tab for:
   - Requests per minute
   - Success/error rates
   - CPU usage
   - Latency

---

## 💰 Pricing & Limits

### Free Tier (Default)
- **100,000 requests/day**
- **10ms CPU time** per request
- Perfect for development and moderate production use

### Paid Plan ($5/month)
- **10M requests/month**
- **Additional:** $0.50 per million requests
- Better for high-traffic production apps

---

## 🔐 Security Best Practices

### 1. Protect Sensitive Endpoints (Optional)

Add API key authentication if needed:

```bash
# Add secret to Cloudflare
npx wrangler secret put API_KEY
```

### 2. Rate Limiting

Cloudflare automatically provides DDoS protection, but you can add custom rate limiting in your code.

### 3. CORS Configuration

Already configured in `src/index.js` to allow all origins. Modify if you need stricter security:

```javascript
app.use('*', cors({
  origin: 'https://yourdomain.com',  // Restrict to specific domain
  allowMethods: ['GET', 'POST'],
}));
```

---

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Docs](https://docs.github.com/)

---

## ✅ Quick Reference Commands

```bash
# Local testing
npm run dev

# Deploy to Cloudflare
npm run deploy

# View live logs
npm run tail

# Update dependencies
npm install

# Commit to GitHub
git add . && git commit -m "Update" && git push

# Clear cache
rm -rf .wrangler .config/.wrangler
```

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Logged into Cloudflare with `npx wrangler login`
- [ ] Deployed with `npm run deploy`
- [ ] API tested and working
- [ ] (Optional) Custom domain configured
- [ ] (Optional) KV caching enabled

---

**Your IP Geolocation API is now live on Cloudflare's global edge network! 🌍**

For questions or issues, check the troubleshooting section above.
