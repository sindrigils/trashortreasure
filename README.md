# Trash or Treasure 🍬

A live candy voting dashboard for interactive events. Participants submit their candy preferences via a form, and the results are displayed in real-time with awards for the most loved, most hated candies, and more!

## Features

- **Real-time Dashboard**: Auto-refreshes every 10 seconds
- **Four Awards**: Most Loved Candy, Most Hated Candy, Spiciest Take, Purest Heart
- **Smart Candy Normalization**: Groups variants like "M&Ms" and "M&M's" automatically
- **Multiple Winners**: Handles ties gracefully
- **Likes vs Hates Chart**: Visual breakdown of all candies

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Hosting**: Vercel

## Setup

### 1. Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run this SQL in the SQL Editor:

```sql
create table if not exists votes (
  id bigserial primary key,
  created_at timestamptz default now(),
  voter_name text not null,
  brought_candy text not null,
  hate_vote text not null,
  love_vote text not null
);

alter table votes enable row level security;
```

3. Copy your Project URL and API keys from Settings > API

### 2. Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Fill in your values:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
INGEST_SHARED_SECRET=any_random_string_you_want
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Install and Run

```bash
npm install
npm run dev
```

Visit:
- Homepage: http://localhost:3000
- Results Dashboard: http://localhost:3000/results

### 4. Deploy to Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy!

## API Endpoints

### POST /api/ingest

Ingest a new vote.

**Headers:**
```
x-ingest-secret: your_secret
```

**Body:**
```json
{
  "name": "Sindri",
  "brought_candy": "Black Licorice",
  "hate_vote": "Snickers",
  "love_vote": "KitKat"
}
```

**Response:**
```json
{ "ok": true }
```

### GET /api/stats

Get aggregated statistics and awards.

**Response:**
```json
{
  "awards": {
    "most_loved": [{ "candy": "KitKat", "likes": 7, "hates": 2, "net": 5 }],
    "most_hated": [{ "candy": "Candy Corn", "likes": 1, "hates": 8, "net": -7 }],
    "spiciest_take": [{ "name": "Alex", "hate_vote": "KitKat", "spicy_score": 7 }],
    "purest_heart": [{ "name": "María", "love_vote": "Candy Corn", "pure_score": 8 }]
  },
  "perCandy": [...],
  "perPerson": [...]
}
```

## Workflow Integration

Configure your form tool (Make.com, Zapier, etc.) to POST to:

```
https://your-app.vercel.app/api/ingest
```

With header:
```
x-ingest-secret: your_secret
```

And map the form fields to:
- `name` → voter's name
- `brought_candy` → candy they brought
- `hate_vote` → candy they hated most
- `love_vote` → candy they loved most

## How Awards Work

- **Most Loved Candy**: Candy with the highest number of love votes
- **Most Hated Candy**: Candy with the highest number of hate votes
- **Spiciest Take**: Person who hated a candy that many others loved
- **Purest Heart**: Person who loved a candy that many others hated

## Candy Normalization

The app automatically groups candy name variants:
- "M&M's" and "M&Ms" → grouped as "mms"
- "Kit Kat" and "KitKat" → grouped as "kitkat"

The most common spelling is displayed in the results.

## License

MIT - Feel free to use for your own events!
