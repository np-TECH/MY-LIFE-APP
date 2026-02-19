# Njabulo OS (v1)

Premium dark-mode personal operating system (Monday x Notion x Monarch vibe).

## What you get
- **Today**: daily checklist + activity counts + notes
- **Pipeline**: chase list CRM + follow-ups + stage tracking
- **Planner**: weekly scorecard + life anchors
- **Dashboard**: KPI cards + charts

## Free hosting plan
- **Supabase** (free): database + auth
- **Vercel** (free): hosting, gives you a public link

## Setup (10–15 mins)
1) Create a Supabase project (free) and enable **Email** auth.
2) Run SQL in `supabase/schema.sql` (Supabase → SQL Editor).
3) Copy keys:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

4) Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

5) Install + run:
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy (free link)
1) Push this folder to GitHub
2) Vercel → “New Project” → import repo
3) Add the same env vars in Vercel → Project Settings → Environment Variables
4) Deploy
You’ll get a free link like `https://your-project.vercel.app`

## Notes
- RLS is enabled: each logged-in user sees only their own data
- For the weekly trend chart: update the Planner page at least once per week
