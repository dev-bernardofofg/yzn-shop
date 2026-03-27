# YznStore — Frontend

E-commerce storefront built with Next.js 16, React 19, and TypeScript. Integrates with a REST API via auto-generated hooks (Kubb + React Query).

## Features

**Storefront**
- Product catalog with search and category filters
- Product detail page with reviews
- Shopping cart with local persistence
- Checkout with coupon support (percentage and fixed discount)
- Payment gateway redirect and success confirmation
- Order history and order details

**Auth**
- Register, login, logout
- Forgot/reset password and email verification
- Role-based access control (admin vs. customer)
- Auto-logout on expired token

**Admin Panel**
- Product management (create, edit, deactivate)
- Order management with status updates
- Coupon management (usage limits, expiration)
- User management

## Tech Stack

| Category | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Data fetching | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| API codegen | Kubb (OpenAPI → types + hooks) |
| HTTP client | Axios |
| Animations | Framer Motion |
| Icons | Lucide React |
| Input masks | iMask / react-imask |

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (see `NEXT_PUBLIC_API_URL` below)

### Setup

```bash
# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env

# Start dev server (runs on port 3001)
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3000` |

### Regenerating API code

The `/generated` directory contains types, Axios clients, and React Query hooks auto-generated from the backend's OpenAPI spec. To regenerate:

```bash
npm run generate
```

> Requires the backend to be running at `NEXT_PUBLIC_API_URL`.

## Project Structure

```
app/                   # Next.js App Router pages
  (auth)/              # Login, register, password reset
  admin/               # Admin panel (products, orders, coupons, users)
  orders/              # Order history and detail
  products/            # Product catalog and detail
  checkout/            # Checkout page
components/
  admin/               # Admin-specific components
  form/                # Form inputs (with CPF and currency masks)
  ui/                  # Base UI primitives
contexts/              # AuthContext, CartContext
generated/             # Auto-generated API code (do not edit manually)
lib/                   # Utilities and helpers
proxy.ts               # Next.js middleware (route protection)
```

## Routes

| Route | Access |
|---|---|
| `/` | Public |
| `/products`, `/products/[id]` | Public |
| `/login`, `/register`, `/forgot-password` | Public (redirects if logged in) |
| `/checkout`, `/orders`, `/orders/[id]` | Authenticated |
| `/admin/*` | Admin only |
