# Rebalance Reflexology — Booking Website

A production-ready full-stack reflexology booking website built with Next.js 14, TypeScript, Tailwind CSS, Prisma, Stripe, and PostgreSQL.

## Features

### Public Website
- Calming, wellness-themed homepage with hero, about, services, and contact sections
- Mobile-first responsive design with smooth animations
- Brand-consistent colour palette (teal, sage, sand) matching the logo

### Booking System
- Step-by-step booking flow: Service → Date → Time → Details → Payment
- Calendar showing only available dates
- Double-booking prevention (checked at slot display AND at payment creation)
- Stripe Checkout integration for secure payments
- Optional deposit-based payments
- 15-minute configurable buffer between appointments
- Booking confirmation emails via SMTP

### Admin Dashboard (`/admin/dashboard`)
- Secure email/password login with JWT auth (bcrypt-hashed passwords)
- **Bookings**: View all appointments, filter by status, confirm/cancel/complete
- **Availability**: Set weekly recurring hours (e.g. Tuesday 6–9pm)
- **Blocked Dates**: Block holidays or set custom hours for specific dates
- **Services**: View and manage treatment offerings
- **Content**: Edit homepage text (tagline, about section) — simple CMS

### Security
- Server-side input validation with Zod on all API routes
- Prisma ORM (parameterised queries — no SQL injection)
- JWT-based auth with httpOnly secure cookies
- Rate limiting on login (5/15min) and booking (10/min) endpoints
- Stripe webhook signature verification
- Security headers (X-Frame-Options, CSP-ready, X-Content-Type-Options)
- Protected admin routes via middleware

## Tech Stack

| Layer        | Technology                    |
|-------------|-------------------------------|
| Framework   | Next.js 14 (App Router)       |
| Language    | TypeScript                    |
| Styling     | Tailwind CSS                  |
| Database    | PostgreSQL                    |
| ORM         | Prisma                        |
| Payments    | Stripe Checkout               |
| Auth        | Custom JWT (jose + bcryptjs)  |
| Email       | Nodemailer (SMTP)             |
| Validation  | Zod                           |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles + Tailwind
│   ├── booking/
│   │   ├── page.tsx                # Booking flow
│   │   ├── success/page.tsx        # Payment success
│   │   └── cancelled/page.tsx      # Payment cancelled
│   ├── admin/
│   │   ├── login/page.tsx          # Admin login
│   │   └── dashboard/page.tsx      # Admin dashboard
│   └── api/
│       ├── auth/login/             # POST — admin login
│       ├── auth/logout/            # POST — admin logout
│       ├── auth/me/                # GET — check session
│       ├── services/               # GET — public services list
│       ├── content/                # GET — public CMS content
│       ├── bookings/slots/         # GET — available dates/times
│       ├── stripe/create-session/  # POST — create Stripe checkout
│       ├── stripe/webhook/         # POST — Stripe webhook handler
│       └── admin/
│           ├── availability/       # GET/POST/DELETE — weekly rules
│           ├── exceptions/         # GET/POST/DELETE — date overrides
│           ├── bookings/           # GET/PATCH — manage appointments
│           ├── services/           # GET/POST/PUT/DELETE — manage services
│           └── content/            # GET/PUT — edit site content
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── stripe.ts                   # Stripe client
│   ├── auth.ts                     # JWT auth utilities
│   ├── email.ts                    # Email sending
│   ├── availability.ts             # Slot calculation logic
│   ├── rate-limit.ts               # In-memory rate limiter
│   └── validations.ts              # Zod schemas
├── components/
│   ├── layout/Header.tsx
│   ├── layout/Footer.tsx
│   └── ui/Hero.tsx, About.tsx, Services.tsx, Testimonials.tsx
├── middleware.ts                    # Admin route protection
prisma/
├── schema.prisma                   # Database schema
└── seed.ts                         # Seed data
```

## Database Models

- **User** — Admin accounts (email, bcrypt password hash)
- **Service** — Treatments (name, duration, price, optional deposit)
- **AvailabilityRule** — Weekly recurring hours (day + time range)
- **AvailabilityException** — Date-specific overrides (blocked or custom hours)
- **Appointment** — Bookings (client info, date/time, status, Stripe IDs)
- **SiteContent** — Simple key-value CMS

## Setup & Run Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account (test mode)

### 1. Clone and install

```bash
git clone <repo-url>
cd rebalance-reflexology
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:
- `DATABASE_URL` — PostgreSQL connection string
- `STRIPE_SECRET_KEY` — from Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` — from `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from Stripe dashboard
- `AUTH_SECRET` — random string (`openssl rand -base64 32`)
- SMTP settings for email (or leave blank to skip emails)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — for the seed admin account

### 3. Set up database

```bash
npx prisma db push
npm run db:seed
```

### 4. Set up Stripe webhook listener (development)

```bash
# In a separate terminal:
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret to your `.env`.

### 5. Run

```bash
npm run dev
```

Visit:
- **Homepage**: http://localhost:3000
- **Booking**: http://localhost:3000/booking
- **Admin**: http://localhost:3000/admin/login

## Deploy to Vercel

### 1. Push to GitHub

### 2. Connect to Vercel
- Import the repo
- Set all environment variables in Vercel project settings
- Ensure `DATABASE_URL` points to a hosted PostgreSQL (e.g. Supabase, Neon, Railway)

### 3. Set up Stripe webhook
- In Stripe dashboard → Webhooks → Add endpoint
- URL: `https://your-domain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `checkout.session.expired`
- Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel

### 4. Run database migration
```bash
npx prisma db push
npm run db:seed
```

### 5. Deploy
Vercel will auto-deploy on push. The `postinstall` script runs `prisma generate` automatically.

## Booking Flow

1. Client selects a treatment
2. Calendar shows dates with available slots
3. Client picks a time slot
4. Client enters name, email, phone, notes
5. Reviews booking summary
6. Redirects to Stripe Checkout
7. On payment success → Stripe webhook fires → appointment confirmed → email sent
8. On payment cancel/expiry → appointment auto-cancelled

## Customisation

- **Colours**: Edit `tailwind.config.ts` — brand, sand, sage palettes
- **Services**: Edit via admin dashboard or `prisma/seed.ts`
- **Availability**: Set via admin dashboard
- **Content**: Edit homepage text via admin Content tab
- **Buffer time**: Change `buffer_minutes` in SiteContent or default in availability logic
