# my1es.com

A personal blog built on an infinite canvas using the [tldraw SDK](https://tldraw.dev).

Visitors can pan and zoom freely. Only I can edit.

**Live site:** [my1es.com](https://my1es.com)

---

## How it works

The entire blog is a single tldraw infinite canvas. Text, images, drawings — everything lives on one zoomable surface instead of a list of posts.

- **Viewing** — anyone can visit and explore the canvas
- **Editing** — password-protected edit mode, only accessible to me
- **Saving** — one-click save pushes the canvas snapshot to `public/canvas.json` in this repo via the GitHub API, triggering a redeploy
- **Images** — uploaded to [Cloudinary](https://cloudinary.com) on drop, stored as permanent public URLs in the snapshot so they load on any device

---

## Stack

- **Vite + React**
- **tldraw SDK** — infinite canvas
- **GitHub Pages** — static hosting, auto-deploys on push
- **GitHub API** — canvas snapshot saved as `public/canvas.json`
- **Cloudinary** — image hosting

---

## Setup

```bash
npm install
cp .env.example .env
# Fill in your keys in .env
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `VITE_TLDRAW_LICENSE_KEY` | tldraw hobby license key from [tldraw.dev/pricing](https://tldraw.dev/pricing) |
| `VITE_GITHUB_TOKEN` | Fine-grained GitHub token with `contents: write` on this repo |
| `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |

All three are stored as GitHub Actions secrets and injected at build time.

---

## Deployment

Pushes to `main` auto-deploy via GitHub Actions to GitHub Pages. The workflow is in `.github/workflows/deploy.yml`.

To publish canvas changes:
1. Log in on the live site
2. Edit the canvas
3. Hit **save** — this commits `public/canvas.json` directly to the repo and triggers a redeploy (~1 min)

---

## Build log

This project was built live with Claude. Full conversation here:
[https://claude.ai/share/4dde3d07-384c-459e-bba4-5280e3f25742](https://claude.ai/share/4dde3d07-384c-459e-bba4-5280e3f25742)
