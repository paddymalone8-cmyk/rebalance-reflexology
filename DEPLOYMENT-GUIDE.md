# Rebalance Reflexology — Complete Deployment Guide

**No experience needed.** This guide walks you through every click, every page, every field. Budget about 2–3 hours, and take breaks whenever you like — nothing will be lost.

**What you'll have at the end:** A live booking website at `your-name.vercel.app` (or your own custom domain), with payment processing, email confirmations, and an admin dashboard.

**Cost:** Free to set up. Stripe charges 1.4% + 20p per card payment (UK rates). Database and hosting are free on the plans we'll use.

---

## What You'll Need Before Starting

- A computer with a web browser (Chrome, Firefox, Safari — any is fine)
- An email address
- About 2–3 hours of time
- The project file I gave you (`rebalance-reflexology.tar.gz`)

---

## PART 1: Create Your Accounts (30 minutes)

You need three free accounts. Create them all first, then we'll connect them.

### 1A. Create a GitHub Account

GitHub stores your website's code. Vercel reads it from there.

1. Go to **https://github.com**
2. Click **Sign up**
3. Enter your email, create a password, pick a username
4. Complete the verification (they'll email you a code)
5. When asked about preferences, you can skip everything — just click through to your dashboard

### 1B. Create a Vercel Account

Vercel hosts and runs your website for free.

1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub** (this links the two accounts)
4. Authorise Vercel to access your GitHub — click **Authorize Vercel**
5. You'll land on the Vercel dashboard. Leave this tab open.

### 1C. Create a Neon Database Account

Neon gives you a free PostgreSQL database (this is where bookings, services, etc. are stored).

1. Go to **https://neon.tech**
2. Click **Sign Up** or **Get Started Free**
3. You can sign up with your GitHub account (easiest) or email
4. Once logged in, click **Create a project** (or it might create one automatically)
5. Give it a name like `rebalance-reflexology`
6. Choose the region closest to you — **EU West (London)** is ideal for Scotland
7. Click **Create Project**
8. You'll see a **Connection string** that looks something like:
   ```
   postgresql://neondb_owner:abc123xyz@ep-cool-name-12345.eu-west-2.aws.neon.tech/neondb?sslmode=require
   ```
9. **Copy this entire string** and paste it somewhere safe (a notes app, a text file). You'll need it later. This is your `DATABASE_URL`.

### 1D. Create a Stripe Account

Stripe processes card payments from your clients.

1. Go to **https://stripe.com**
2. Click **Start now** and create an account
3. You'll need to verify your email
4. Once logged in, you'll be in **Test mode** (there's a toggle at the top saying "Test mode" with an orange bar). **Stay in test mode for now** — we'll switch to live after testing.

#### Get your Stripe keys:

5. In the Stripe dashboard, click **Developers** (top right area)
6. Click **API keys**
7. You'll see two keys:
   - **Publishable key** — starts with `pk_test_...` — copy this somewhere safe
   - **Secret key** — click **Reveal test key** to see it — starts with `sk_test_...` — copy this somewhere safe

**Keep these keys private.** Never share the secret key publicly.

---

## PART 2: Upload Your Code to GitHub (15 minutes)

We need to get your project code into GitHub so Vercel can use it.

### Option A: Using GitHub's Web Interface (Easiest)

1. Go to **https://github.com**
2. Click the **+** icon (top right) → **New repository**
3. Name it `rebalance-reflexology`
4. Keep it **Private** (select the Private radio button)
5. **Don't** tick any of the checkboxes (no README, no .gitignore, no license)
6. Click **Create repository**

Now we need to upload the files. The easiest way:

7. First, extract the `.tar.gz` file I gave you:
   - **Windows:** Use 7-Zip (free download from https://7-zip.org) — right-click the file → 7-Zip → Extract Here
   - **Mac:** Just double-click the `.tar.gz` file — it extracts automatically

8. Back on GitHub, on your empty repository page, click **uploading an existing file** (it's a link in the instructions shown)

9. **Drag and drop** the entire contents of the `rebalance-reflexology` folder onto the upload area.
   - ⚠️ **Important:** Drag the *contents* (all the files and folders inside), not the folder itself
   - You should see files like `package.json`, `README.md`, `next.config.js`, and folders like `src/`, `prisma/`, `public/`

10. Scroll down, type a message like "Initial upload" and click **Commit changes**

11. If some folders didn't upload (GitHub's web upload can be fiddly with nested folders), you may need to repeat for subfolders. **An easier alternative is Option B below.**

### Option B: Using GitHub Desktop (More Reliable)

1. Download **GitHub Desktop** from https://desktop.github.com
2. Install it and sign in with your GitHub account
3. Click **File** → **New Repository**
4. Name: `rebalance-reflexology`
5. Choose a local path (e.g., your Desktop)
6. Click **Create Repository**
7. Open the folder it created in your file explorer
8. Extract the `.tar.gz` file and copy all the contents into this folder
9. Go back to GitHub Desktop — it should show all the new files
10. Type "Initial commit" in the Summary field at the bottom left
11. Click **Commit to main**
12. Click **Publish repository** (top bar)
13. Untick "Keep this code private" if you want it private, then click **Publish Repository**

---

## PART 3: Set Up the Database (10 minutes)

1. Go back to your **Neon dashboard** (https://console.neon.tech)
2. Click on your project
3. Click **SQL Editor** in the left sidebar
4. We need to create the database tables. Copy this entire block and paste it into the SQL editor, then click **Run**:

```sql
-- Create enums
CREATE TYPE "Role" AS ENUM ('ADMIN');
CREATE TYPE "ExceptionType" AS ENUM ('BLOCKED', 'CUSTOM');
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- Users table
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Services table
CREATE TABLE "services" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "depositPrice" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- Availability rules table
CREATE TABLE "availability_rules" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "availability_rules_pkey" PRIMARY KEY ("id")
);

-- Availability exceptions table
CREATE TABLE "availability_exceptions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "date" DATE NOT NULL,
    "type" "ExceptionType" NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "availability_exceptions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "availability_exceptions_date_type_key" ON "availability_exceptions"("date", "type");

-- Appointments table
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "serviceId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "stripeSessionId" TEXT,
    "stripePaymentId" TEXT,
    "amountPaid" INTEGER,
    "bufferMin" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "appointments_date_status_idx" ON "appointments"("date", "status");
CREATE INDEX "appointments_clientEmail_idx" ON "appointments"("clientEmail");
CREATE UNIQUE INDEX "appointments_stripeSessionId_key" ON "appointments"("stripeSessionId");

-- Site content table
CREATE TABLE "site_content" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "site_content_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "site_content_key_key" ON "site_content"("key");
```

5. You should see "Query executed successfully". Now let's add your initial data. Paste and run this:

```sql
-- Create admin user (password is 'admin123!' — CHANGE THIS LATER)
-- This is the bcrypt hash for 'admin123!'
INSERT INTO "users" ("email", "password", "name", "role") VALUES
('admin@rebalancereflexology.com', '$2b$12$FjDS36EKWWALi5j.zPOrVOcM/QtlPtopnFvXzAcRB6idML92r1H4W', 'Admin', 'ADMIN');

-- Create services (prices in pence)
INSERT INTO "services" ("id", "name", "description", "durationMin", "price", "sortOrder") VALUES
('reflexology-60', 'Reflexology — 60 Minutes', 'A full reflexology session working on pressure points across the feet to promote deep relaxation, improve circulation, and support the body''s natural healing processes.', 60, 4500, 1),
('reflexology-90', 'Reflexology — 90 Minutes', 'An extended session allowing for a more thorough treatment. Ideal for those with specific concerns or anyone seeking a deeper level of relaxation and restoration.', 90, 6000, 2),
('indian-head-45', 'Indian Head Massage — 45 Minutes', 'Gentle massage focusing on the head, neck, and shoulders to relieve tension, ease headaches, and promote a sense of calm and wellbeing.', 45, 3500, 3),
('combined-90', 'Reflexology & Indian Head Massage — 90 Minutes', 'The ultimate combination treatment. Begin with a full reflexology session followed by a soothing Indian head massage for total mind-body relaxation.', 90, 7000, 4);

-- Default availability (Tuesday 6-9pm, Saturday 10am-2pm)
INSERT INTO "availability_rules" ("dayOfWeek", "startTime", "endTime") VALUES
(2, '18:00', '21:00'),
(6, '10:00', '14:00');

-- Site content
INSERT INTO "site_content" ("key", "value") VALUES
('hero_tagline', 'Find your balance. Restore your wellbeing.'),
('hero_subtitle', 'Professional reflexology treatments in Northern Ireland. Gentle, natural healing for body and mind.'),
('about_text', 'Reflexology is a complementary therapy based on the principle that areas on the feet correspond to different organs and systems of the body. By applying gentle pressure to these reflex points, reflexology can help reduce stress, improve circulation, and encourage the body''s natural healing processes.

At Rebalance Reflexology, each session is tailored to your individual needs. Whether you''re seeking relief from tension, support during a difficult time, or simply a moment of deep relaxation, you''re in caring and experienced hands.'),
('buffer_minutes', '15');
```

6. You should see "4 rows inserted" (or similar) for each section. Your database is ready!

---

## PART 4: Deploy to Vercel (20 minutes)

This is where it all comes together.

### 4A. Import the Project

1. Go to **https://vercel.com/dashboard**
2. Click **Add New...** → **Project**
3. You should see your `rebalance-reflexology` repository listed. Click **Import**.
4. On the configuration screen:
   - **Framework Preset** should auto-detect as **Next.js** — if not, select it
   - Leave the root directory as is

### 4B. Add Environment Variables

Before clicking Deploy, you need to add your secret keys. Scroll down to **Environment Variables** and add each of these one by one:

Click the **Name** field, type the name, click the **Value** field, paste the value. Click **Add** after each one.

| Name | Value |
|------|-------|
| `DATABASE_URL` | The Neon connection string you saved earlier (the long `postgresql://...` one) |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (`sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (`pk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Leave blank for now — we'll add this in the next step |
| `AUTH_SECRET` | Type any random long string, like `my-super-secret-key-change-this-to-something-random-2024` (the longer and more random, the better) |
| `NEXT_PUBLIC_APP_URL` | Leave blank for now — we'll update after first deploy |
| `ADMIN_EMAIL` | `admin@rebalancereflexology.com` (or whatever email you used in the SQL) |
| `ADMIN_PASSWORD` | `admin123!` (or whatever you set) |

### 4C. Deploy

1. Click **Deploy**
2. Wait 2–3 minutes while Vercel builds your site
3. If the build succeeds, you'll see a celebration screen with a preview of your site!
4. Your site URL will be something like `rebalance-reflexology.vercel.app`

**If the build fails:** Don't panic. Click on the build log to see the error. Common issues:
- Missing environment variable → go to Settings → Environment Variables and check them
- Typo in DATABASE_URL → make sure you copied the full string from Neon

### 4D. Update the App URL

1. Copy your new site URL (e.g., `https://rebalance-reflexology.vercel.app`)
2. In Vercel, go to your project → **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_APP_URL` and click the three dots → **Edit**
4. Set the value to your site URL (include the `https://`)
5. Click **Save**
6. Go to **Deployments** tab → click the three dots on the latest deployment → **Redeploy**

---

## PART 5: Set Up Stripe Webhooks (10 minutes)

Webhooks tell your site when a payment has been completed.

1. Go to **https://dashboard.stripe.com/webhooks** (make sure you're in **Test mode**)
2. Click **Add endpoint**
3. In **Endpoint URL**, enter: `https://YOUR-SITE-URL.vercel.app/api/stripe/webhook`
   (Replace `YOUR-SITE-URL` with your actual Vercel URL)
4. Click **Select events** → search for and select:
   - `checkout.session.completed`
   - `checkout.session.expired`
5. Click **Add events**, then **Add endpoint**
6. On the webhook page, you'll see a **Signing secret** — it starts with `whsec_...`
7. Click to reveal it and copy it

Now add it to Vercel:

8. Go to your Vercel project → **Settings** → **Environment Variables**
9. Find `STRIPE_WEBHOOK_SECRET` → Edit → paste the `whsec_...` value → Save
10. **Redeploy** the site (Deployments → three dots → Redeploy)

---

## PART 6: Test Everything (15 minutes)

### Test the Public Site

1. Visit your site URL — you should see the homepage with your logo
2. Click **Book Now** or navigate to `/booking`
3. Select a service
4. Pick a date (Tuesday or Saturday should show as available)
5. Pick a time slot
6. Fill in test details (use a fake name and your real email)
7. Click **Proceed to Payment**
8. On the Stripe checkout page, use this **test card**:
   - Card number: `4242 4242 4242 4242`
   - Expiry: any future date (e.g., `12/26`)
   - CVC: any 3 digits (e.g., `123`)
9. Click **Pay**
10. You should be redirected to the success page

### Test the Admin Dashboard

1. Go to `your-site-url.vercel.app/admin/login`
2. Sign in with:
   - Email: `admin@rebalancereflexology.com`
   - Password: `admin123!`
3. You should see the admin dashboard with your test booking
4. Try the different tabs: Availability, Blocked Dates, Content

---

## PART 7: Go Live (15 minutes)

Once you're happy everything works in test mode:

### 7A. Activate Stripe

1. In Stripe dashboard, click **Activate payments** (or similar)
2. You'll need to provide:
   - Your business details (name, address)
   - Bank account for payouts
   - Identity verification
3. This can take a few hours to be approved
4. Once approved, toggle from **Test mode** to **Live mode**
5. Go to **Developers** → **API keys** in live mode
6. Copy the new live **publishable key** (`pk_live_...`) and **secret key** (`sk_live_...`)

### 7B. Update Vercel with Live Keys

1. In Vercel → Settings → Environment Variables
2. Update `STRIPE_SECRET_KEY` with your live secret key
3. Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` with your live publishable key
4. **Create a new webhook** in Stripe (live mode) with the same URL and events
5. Update `STRIPE_WEBHOOK_SECRET` with the new live webhook signing secret
6. Redeploy

### 7C. Change Your Admin Password

⚠️ **Important!** The default password is not secure.

1. Go to your Neon dashboard → SQL Editor
2. Run this (replace `YOUR_NEW_PASSWORD_HASH` — see below):

To generate a new password hash, you can use this website: https://bcrypt-generator.com
- Type your desired password
- Click Generate
- Copy the hash (starts with `$2a$...` or `$2b$...`)

Then run:
```sql
UPDATE "users" SET "password" = 'YOUR_HASH_HERE' WHERE "email" = 'admin@rebalancereflexology.com';
```

### 7D. Custom Domain (Optional)

If you own a domain like `rebalancereflexology.com`:

1. In Vercel → Settings → Domains
2. Add your domain
3. Vercel will give you DNS records to add at your domain registrar
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain
5. Update the Stripe webhook URL to use your custom domain
6. Redeploy

---

## PART 8: Email Notifications (Optional)

To send booking confirmation emails, you need SMTP credentials. The easiest free option:

### Using Gmail

1. Go to https://myaccount.google.com/apppasswords
   (You need 2-Factor Authentication enabled on your Google account)
2. Create a new app password — name it "Rebalance Website"
3. Copy the 16-character password Google gives you

4. In Vercel → Settings → Environment Variables, add:
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USER` = your Gmail address
   - `SMTP_PASS` = the app password from step 3
   - `EMAIL_FROM` = `"Rebalance Reflexology" <your-email@gmail.com>`

5. Redeploy

---

## Quick Reference: Your Important URLs

| What | URL |
|------|-----|
| Your website | `https://your-site.vercel.app` |
| Booking page | `https://your-site.vercel.app/booking` |
| Admin login | `https://your-site.vercel.app/admin/login` |
| Admin dashboard | `https://your-site.vercel.app/admin/dashboard` |
| Vercel dashboard | `https://vercel.com/dashboard` |
| Neon database | `https://console.neon.tech` |
| Stripe dashboard | `https://dashboard.stripe.com` |

---

## Troubleshooting

**"Build failed" on Vercel**
→ Check Environment Variables are all set correctly. The DATABASE_URL is the most common issue — make sure you copied the full string from Neon including `?sslmode=require` at the end.

**Can't log in to admin**
→ Make sure you ran the SQL to create the admin user. The default password is `admin123!` with email `admin@rebalancereflexology.com`.

**No dates showing as available**
→ Log in to the admin dashboard and check the Availability tab. The defaults are Tuesday 6–9pm and Saturday 10am–2pm. Add more availability as needed.

**Payment not confirming the booking**
→ Check that the Stripe webhook is set up correctly. In Stripe → Webhooks, check for failed deliveries. The webhook URL must exactly match your site URL + `/api/stripe/webhook`.

**Emails not sending**
→ Double-check SMTP settings. Gmail app passwords require 2FA to be enabled. If you skip this step, bookings will still work — emails just won't send (the booking still appears in the admin dashboard).

---

## Day-to-Day Usage

Once live, your typical workflow will be:

1. **Clients** visit your site → book and pay online
2. **You** log in to `/admin/login` to see bookings
3. **To change your hours:** Admin → Availability tab → add/remove rules
4. **To block a holiday:** Admin → Blocked Dates → add the date
5. **To cancel a booking:** Admin → Bookings → click Cancel on the appointment

That's it! The system handles the rest — calendar availability, payment processing, and confirmation emails all happen automatically.
