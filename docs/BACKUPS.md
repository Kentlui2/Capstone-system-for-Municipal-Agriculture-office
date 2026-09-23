# Database Backup & Restore Guide

Production database: **Render PostgreSQL** (Free tier)

---

## Render Auto-Backups (Free Tier Limitation)

> ⚠️ The Render free tier does **not** include automatic daily backups.
> You must perform manual backups regularly (recommended: weekly at minimum).

---

## Manual Backup (pg_dump via External URL)

### Prerequisites
- Install [pgAdmin 4](https://www.pgadmin.org/) or `psql` / `pg_dump` locally.
- Get your **External Database URL** from Render:
  - Render Dashboard → PostgreSQL database → **Connect** tab → **External Database URL**
  - It looks like: `postgres://user:password@dpg-xxxx.render.com:5432/dbname`

### Create a Backup

Using `pg_dump` from the command line (replace with your actual External URL):

```bash
pg_dump "postgres://user:password@dpg-xxxx.render.com:5432/dbname" \
  --no-acl --no-owner \
  -f backup_$(date +%Y-%m-%d).sql
```

This creates a timestamped `.sql` file (e.g. `backup_2026-09-23.sql`) in your current directory.

### Restore from Backup

```bash
psql "postgres://user:password@dpg-xxxx.render.com:5432/dbname" \
  -f backup_2026-09-23.sql
```

> ⚠️ Restoring will **overwrite** existing data. Only do this to recover from a critical failure.

---

## Recommended Backup Schedule

| Frequency | Method |
|-----------|--------|
| Weekly | Manual `pg_dump` → save to Google Drive or external storage |
| Before every major deployment | Manual `pg_dump` snapshot |
| Monthly | Download and archive locally |

---

## Backing Up Uploaded Files (Storage)

> ℹ️ Render's free tier uses **ephemeral storage** — files uploaded to `storage/app/public` are lost on each redeploy.
>
> If your app stores profile photos or uploaded documents, configure an S3-compatible object storage (e.g., **Cloudflare R2** — free tier) and set:
>
> ```
> FILESYSTEM_DISK=s3
> AWS_ACCESS_KEY_ID=...
> AWS_SECRET_ACCESS_KEY=...
> AWS_DEFAULT_REGION=auto
> AWS_BUCKET=your-bucket-name
> AWS_ENDPOINT=https://your-r2-endpoint
> ```

---

## Contacts

For questions about the database or backups, contact the system administrator at the Municipal Agriculture Office of Sta. Cruz, Davao del Sur.
