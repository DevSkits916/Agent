https://agent1-g5ri.onrender.com/export


# Agent Plan Studio

A mobile-first React + TypeScript studio for configuring and exporting multi-platform social media agent plans. The UI captures goals, guardrails, and cadence expectations, then generates orchestrated channel blueprints, prompt guidance, and JSON exports for safe hand-off.

## Features

- 📱 **Mobile-first Vite + React UI** styled with Tailwind CSS
- 🧠 **Zustand state** with local storage persistence for plan libraries
- ✅ **Zod + react-hook-form** validation pipeline for structured plan capture
- ⚙️ **Agent plan generator** that merges channel defaults with brand cues
- 📝 **Prompt Composer** to translate plans into AI collaboration prompts
- 🔄 **JSON import/export** workflows (no posting integrations included)
- 📦 **PWA ready** via `vite-plugin-pwa`
- 🧪 **Vitest + Testing Library** coverage for core logic
- 🚫 **Binary gatekeeping** with a reusable scan in Husky + CI
- ☁️ Deployable to **Vercel** or **Render static sites** out of the box

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to explore the studio.

### Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – create production build in `dist/`
- `npm run preview` – preview the production build
- `npm run test` – run Vitest test suite
- `npm run lint` – run ESLint across the repo
- `npm run check:binaries` – ensure no forbidden binaries or oversized files exist

### Testing

```bash
npm run test
```

## Deploy on Vercel

1. `gh repo create YOUR_ORG/agent-plan-ui --public && git push -u origin main`
2. Import the repository in the [Vercel dashboard](https://vercel.com/dashboard)
3. Configure build command `npm ci && npm run build` and output directory `dist`
4. Deploy – no environment variables are required

The included `vercel.json` file enables SPA rewrites and sets Vite as the framework.

## Deploy on Render

1. Create a new **Static Site** in Render and connect this repository
2. Set the build command to `npm ci && npm run build`
3. Set the publish directory to `dist`
4. Enable automatic deploys on push (optional)

`render.yaml` mirrors these settings and ensures SPA routing via rewrites.

## Repository guardrails

- `.gitattributes` forces LF endings and marks binary extensions as non-text
- `.gitignore` excludes build, cache, and environment-specific folders
- `scripts/scan-binaries.mjs` rejects non-SVG binaries or files > 500 KB
- Husky pre-commit hook (installed via `npm install` and `npm run prepare`) runs the binary scan before commits
- GitHub Actions CI replicates the guard: install → binary scan → build → test → publish artifact

## PWA

The app registers a service worker via `vite-plugin-pwa` and includes a minimal manifest with SVG-only icons, keeping the repository binary-free.

## Accessibility & UX considerations

- Focus states and keyboard-friendly buttons for channel selection
- High contrast dark theme with subtle gradients
- Mobile-first responsive layout with condensed navigation on small screens

## License

MIT
