# Jaskaran Singh — Portfolio + Blog

One Next.js app, two surfaces:

- **`/`** — a minimal, dark personal portfolio.
- **`/blog`** — a simple, communal blog: anyone can sign up, write, attach images, and post into a live stream. Readers can comment and message Jaz directly.

## Highlights

- **Frictionless auth** — email + password, **no email verification**. A 30-day session keeps you logged in (auto-login on return).
- **A nicer take on passwords** — generate a memorable word passphrase (`amber-otter-maple-74`) in one tap, or build an **emoji passcode** (`🌙🚀🎧🔥`). Both are bcrypt-hashed like any password.
- **Dead-simple composer** — type, add photos, post. Posts stream newest-first.
- **Comments + messaging** — logged-in users comment on posts; anyone can message Jaz via the contact form, landing in an owner-only inbox.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- Prisma 6 · PostgreSQL (Neon on Vercel)
- Vercel Blob for image uploads
- `jose` (JWT sessions) · `bcryptjs`

## Local development

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL + AUTH_SECRET
npm run db:push        # create tables
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Signs session JWTs (`openssl rand -base64 32`) |
| `OWNER_EMAIL` | The account that owns the site (author badge + inbox) |
| `BLOB_READ_WRITE_TOKEN` | Auto-set by Vercel Blob; needed for image uploads |

## Making it yours

- **Profile photo** → drop a square image at `public/profile.jpg`.
- **Portfolio content** → everything lives in [`lib/profile.ts`](lib/profile.ts).
- **Owner inbox** → sign up with `OWNER_EMAIL` to claim the owner account, then visit `/messages`.
