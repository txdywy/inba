# inba

NBA live hub for GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

## Test and build

```bash
npm test
npm run typecheck
npm run build
npm run test:e2e
```

## Data refresh

The published snapshot lives at `public/data/latest.json`.

To refresh it locally:

```bash
npm run refresh:data
```

GitHub Actions runs the same refresh step on push, schedule, and manual dispatch, then builds and deploys the static site to GitHub Pages.
