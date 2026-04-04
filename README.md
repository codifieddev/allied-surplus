# NestCraft Next.js Conversion

This project was converted from a Vite + React + TypeScript app to a Next.js App Router project.

## Run locally

```bash
npm install
npm run dev
```

## Routes

- /
- /shop
- /category/[id]
- /product/[id]
- /about
- /services
- /blog
- /faq
- /contact
- /cart
- /checkout

## Seeding Allied Surplus Data

- Ensure `.env` contains `MONGODB_URI` and `TENANT_DB_NAME="kalp_tenant_surplus"` (already included in the repo).
- Run `npm run seed:allied` to populate the tenant database with Allied-style categories, products, and variants.

## Storefront APIs

- `GET /api/store/products?limit=12` (public, returns active products sorted by creation date).
- `GET /api/store/categories` (public, returns the saved categories).

These endpoints power the public home page and the refreshed admin storefront lists.
