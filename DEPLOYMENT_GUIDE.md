# Deployment Guide for jeremyeletto.com

## Quick Steps to Deploy

### 1. GitHub Pages Setup

1. Go to: https://github.com/jeremyeletto/personalsite/settings/pages
2. Under "Custom domain", enter: `jeremyeletto.com`
3. Check "Enforce HTTPS" (available after DNS propagates)
4. Click "Save"

### 2. Squarespace DNS Configuration

1. Log into Squarespace
2. Go to **Settings** → **Domains** → Select `jeremyeletto.com`
3. Click **DNS Settings**

#### Delete existing records:
- Remove any existing A records pointing to Squarespace
- Remove any existing CNAME for `www` if pointing elsewhere

#### Add GitHub Pages A Records:
Add these 4 A records:
```
Host: @
Type: A
Data: 185.199.108.153

Host: @
Type: A
Data: 185.199.109.153

Host: @
Type: A
Data: 185.199.110.153

Host: @
Type: A
Data: 185.199.111.153
```

#### Add CNAME Record:
```
Host: www
Type: CNAME
Data: jeremyeletto.github.io
```

### 3. Wait for DNS Propagation

- DNS changes can take 24-48 hours to fully propagate
- GitHub will show a checkmark when DNS is configured correctly
- You can test at: https://jeremyeletto.com

### 4. Verify

Once DNS propagates:
- Visit `https://jeremyeletto.com` - should show your site
- Visit `https://www.jeremyeletto.com` - should also work
- HTTPS should be automatically enabled

## Files Deployed

All files in the `deploy/` folder:
- index.html
- styles.css
- script.js
- questions.js
- backgroundmatch.mp4
- Untitled design.mp4
- JeremyElettoResume.pdf

## Future Updates

To update your site:
```bash
git add .
git commit -m "Your update message"
git push
```

Changes will automatically deploy to GitHub Pages (and your custom domain) within 1-2 minutes.

