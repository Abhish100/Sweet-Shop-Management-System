# Migration from SQLite to PostgreSQL for Vercel

## Why Migrate?

Vercel uses serverless functions which are stateless. SQLite requires a file system which doesn't work in serverless environments. PostgreSQL is required for Vercel deployment.

## Migration Steps

### Step 1: Get PostgreSQL Database

Choose one:
- **Vercel Postgres** (easiest, integrated)
- **Supabase** (free tier: https://supabase.com)
- **Railway** (https://railway.app)
- **Neon** (https://neon.tech)

### Step 2: Update Prisma Schema

Replace `backend/prisma/schema.prisma` with `backend/prisma/schema.postgres.prisma`:

```bash
cd backend
cp prisma/schema.postgres.prisma prisma/schema.prisma
```

Or manually change:
```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 3: Update DATABASE_URL

Get your PostgreSQL connection string. Format:
```
postgresql://user:password@host:port/database?sslmode=require
```

### Step 4: Run Migrations

```bash
cd backend
npx prisma migrate dev --name migrate_to_postgres
npx prisma generate
```

### Step 5: Seed Database (Optional)

```bash
npm run seed
```

### Step 6: Test Locally

Update your `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

Then test:
```bash
npm run dev
```

## Production Deployment

1. Set `DATABASE_URL` in Vercel environment variables
2. Deploy backend
3. Run migrations on production:
   ```bash
   npx prisma migrate deploy
   ```

## Important Notes

- **SSL Required**: Add `?sslmode=require` to connection string
- **Connection Pooling**: Consider using connection pooling for serverless
- **Migrations**: Run `prisma migrate deploy` in production (not `migrate dev`)

