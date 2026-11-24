# Advent — ti samo `git push` (ostalo pripremljeno)

## Što je već napravljeno lokalno

- `npm run build` (`.env.production` → `VITE_API_URL=https://mojput.onrender.com`)
- `npm run smoke:advent` na **127.0.0.1:3000** — prošao
- `node --test server/adventLeague*.test.cjs` — 77/77
- `npm run sitemap`
- `npm run dev` = Vite + API (`dev:vite` samo frontend)

## Git / API

**`main` je mergean i pushan** (`feature/christmas-theme` → `main`). Render (ako prati `main`) krene deploy sami.

```powershell
git push origin main   # već napravljeno ako vidiš 0b83416 na origin/main
```

## Odmah nakon pusha (ručno u Renderu, ~5 min)

1. [Render Dashboard](https://dashboard.render.com) → **mojput-api** → **Manual Deploy** (ili čekaj auto-deploy)
2. Kad deploy završi:

```powershell
$env:SMOKE_API_BASE="https://mojput.onrender.com"
npm run smoke:advent
```

Mora biti **✅ Smoke prošao** (meta, prizes, leaderboard).

## Frontend na mojput.com

1. Lokalno već imaš `dist/` nakon `npm run build`
2. Upload `dist/` na postojeći hosting (isti postupak kao i dosad)
3. Provjeri: `https://mojput.com/adventska-liga` — bez crvene 404 poruke na nagradama/ljestvici

## Ako Render smoke i dalje pada

- API na Renderu još nije na novom commitu → ponovi deploy
- Provjeri da je deploy log prošao bez errora na `registerAdventLeagueRoutes`