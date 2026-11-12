# SUP Shop Moldova — Frontend

React single-page app of an online store for stand up paddle boards and water sports gear.

**Live:** https://supshop-md.site · **Backend and full project description:** [sup-shop-backend](https://github.com/denis-buimistr/sup-shop-backend)

![Home page](https://raw.githubusercontent.com/denis-buimistr/sup-shop-backend/main/docs/screenshots/home.png)

## Tech stack

React 19, Vite 8, React Router 7, Tailwind CSS 4, axios, i18next, lucide-react · Vitest, Testing Library · oxlint · Nginx in Docker

## Features

- Home page with a slider, category tiles and product rows from the API
- Catalog with filters, sorting and pagination kept in the URL, so a filtered page can be shared as a link
- Product page, cart, multi-step checkout, profile with order history, wishlist for guests and accounts
- Admin panel: orders, products with photo upload and reordering, categories, brands, users, RO/RU translations
- Three languages in the URL: English without a prefix, `/ro/...` and `/ru/...`
- Admin pages are loaded on demand (`React.lazy`), so shoppers do not download their code

## Project structure

```
src/
  api/          axios client: base URL, JWT and Accept-Language headers, sign out on 401
  context/      shared state: auth, cart, wishlist, toasts
  components/   reusable parts: header, product card, search, home page sections
  pages/        pages, admin pages in pages/admin
  i18n/         i18next setup, Link / Navigate / useNavigate that keep the language prefix
  locales/      texts in en / ro / ru
  hooks/, utils/, data/
nginx/          Nginx config: SPA routing, /api proxy to the backend, caching of assets
```

## Languages

The language is part of the URL. The route `/:lang?` reads it, switches i18next and sends `Accept-Language` with every API request, so the backend answers with translated content and error messages. The app's own `Link`, `Navigate` and `useNavigate` add the prefix automatically.

## Run locally

Needs Node.js 22 and the backend running on http://localhost:8080 (see the backend README).

```bash
npm ci
npm run dev        # http://localhost:5173, API from .env.development
```

| Command | What it does |
|---|---|
| `npm run dev` | dev server with hot reload |
| `npm test` | Vitest + Testing Library |
| `npm run lint` | oxlint |
| `npm run build` | production build into `dist/` |

## Docker and deployment

The [`Dockerfile`](Dockerfile) builds the app with Node and serves the result with Nginx. In production the API is on the same domain under `/api` (`.env.production`), so the browser does not need CORS.

Jenkins runs lint, tests and the image build for every branch. After a merge to `main` it pushes the image to GitHub Container Registry and redeploys the frontend container on AWS EC2. Details are in the backend README.
