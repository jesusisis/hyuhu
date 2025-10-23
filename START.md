# 🚀 Quick Start Guide

## How to Run Your IP Geolocation API

### Option 1: Run Locally (Development)

Start the Wrangler development server:

```bash
npx wrangler dev --port 5000
```

Your API will be available at: **http://localhost:5000**

### Option 2: Deploy to Cloudflare (Production)

Deploy to Cloudflare's global edge network:

```bash
npx wrangler login
npx wrangler deploy
```

Your API will be live at: **https://ip-geolocation-api.your-subdomain.workers.dev**

---

## Test Your API

### 1. Main IP Lookup
```bash
curl http://localhost:5000/?ip=8.8.8.8
```

### 2. VPN Detection
```bash
curl http://localhost:5000/vpn-detect?ip=1.1.1.1
```

### 3. Status Check
```bash
curl http://localhost:5000/status
```

### 4. Weather Data
```bash
curl http://localhost:5000/weather?ip=8.8.8.8
```

---

## Update Replit Workflow (Optional)

To run the Cloudflare Workers server automatically in Replit:

1. Open `.replit` or configuration settings
2. Update the run command to:
   ```bash
   npx wrangler dev --port 5000
   ```

---

## Next Steps

- **📖 Full API Documentation**: See [README.md](README.md)
- **🚀 Deployment Guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **🌍 128+ Endpoints**: All endpoints listed in README.md

---

## Need Help?

- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/
- **Hono Framework**: https://hono.dev/

---

**Your API is ready! Run `npx wrangler dev --port 5000` to start.** 🎉
