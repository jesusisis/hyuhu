# 🚀 Cloudflare Workers Deployment Guide

This guide will help you deploy your IP Geolocation API to Cloudflare Workers.

---

## Prerequisites

- Node.js 18+ installed
- A Cloudflare account (free tier works fine)
- Wrangler CLI (installed via `npm install`)

---

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `hono` - Fast web framework for Cloudflare Workers
- `wrangler` - Cloudflare's CLI tool

---

## Step 2: Login to Cloudflare

```bash
npx wrangler login
```

This will open your browser to authenticate with Cloudflare.

---

## Step 3: Create KV Namespace (Optional but Recommended)

KV (Key-Value) storage is used for caching IP lookup results.

```bash
npx wrangler kv:namespace create CACHE
```

You'll get output like:
```
{ binding = "CACHE", id = "abc123def456" }
```

Copy the `id` and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "abc123def456"  # Replace with your ID
```

---

## Step 4: Test Locally

```bash
npm run dev
```

Your API will be available at: `http://localhost:8787`

Test it:
```bash
curl http://localhost:8787/?ip=8.8.8.8
curl http://localhost:8787/vpn-detect?ip=1.1.1.1
curl http://localhost:8787/status
```

---

## Step 5: Deploy to Production

```bash
npm run deploy
```

This will:
1. Build your Worker
2. Upload it to Cloudflare
3. Deploy it to Cloudflare's global edge network

You'll get a URL like:
```
https://ip-geolocation-api.your-subdomain.workers.dev
```

---

## Step 6: Test Production

```bash
curl https://ip-geolocation-api.your-subdomain.workers.dev/?ip=8.8.8.8
```

---

## Adding a Custom Domain

1. Go to Cloudflare Dashboard
2. Navigate to **Workers & Pages**
3. Click on your `ip-geolocation-api` worker
4. Click the **Triggers** tab
5. Click **Add Custom Domain**
6. Enter your domain (e.g., `api.yourdomain.com`)
7. Click **Add Custom Domain**

Cloudflare will automatically configure DNS and SSL!

---

## Configuration

### Environment Variables

Edit `wrangler.toml`:

```toml
[vars]
API_VERSION = "2.0.0"
ENABLE_CACHING = "true"
```

### Resource Limits

```toml
[limits]
cpu_ms = 50  # Max CPU time per request
```

---

## Monitoring

### View Logs

```bash
npm run tail
```

This shows real-time logs from your Worker.

### Check Analytics

Go to Cloudflare Dashboard → Workers & Pages → Your Worker → Metrics

---

## Costs

### Free Tier
- **100,000 requests/day** - FREE
- **10ms CPU time** per request
- **1 GB KV storage** - FREE
- **1,000 KV reads/day** - FREE
- **1,000 KV writes/day** - FREE

### Paid Plan ($5/month)
- **10 million requests/month**
- **Additional requests:** $0.50 per million
- **Unlimited KV operations**

---

## Troubleshooting

### Error: "Cannot find module 'hono'"

```bash
npm install
```

### Error: "KV namespace not found"

Make sure you created the KV namespace and updated `wrangler.toml`:

```bash
npx wrangler kv:namespace create CACHE
```

Then update the `id` in `wrangler.toml`.

### Error: "Authentication required"

```bash
npx wrangler login
```

### Slow API responses

Enable caching in `wrangler.toml`:

```toml
[vars]
ENABLE_CACHING = "true"
```

---

## Performance Tips

1. **Enable KV Caching** - Reduces external API calls
2. **Use Custom Domain** - Better for production
3. **Monitor CPU Time** - Keep under 10ms for free tier
4. **Use Batch Endpoints** - Process multiple IPs efficiently

---

## Security Best Practices

1. **Rate Limiting** - Implement with Durable Objects
2. **API Keys** - Add authentication for production
3. **CORS** - Configure allowed origins
4. **Input Validation** - Always validate IP addresses

---

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Hono Framework Docs](https://hono.dev/)

---

**You're all set! Your API is now running on Cloudflare's global edge network! 🎉**
