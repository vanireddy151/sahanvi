# Sahanvi Next.js Migration

This folder now contains a Next.js + React + MongoDB Atlas version of the site.

## Run

```powershell
cd Q:\Sahanvi\Frontend
npm.cmd install --cache .\.npm-cache
npm.cmd run dev
```

Then open:

```text
http://localhost:3000
```

## Database

MongoDB Atlas is configured in `.env.local`:

```text
MONGODB_URI=mongodb+srv://...
```

## Routes

- `/` home page
- `/[type]` collection pages, for example `/Kanjivaram%20Silks`
- `/about`
- `/signup`
- `/login`
- `/admin`
- `/privacy-policy`
- `/terms-conditions`
- `/return-exchange-policy`

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/sarees`
- `POST /api/sarees`
- `GET /api/inquiries`
- `POST /api/inquiries`

## Notes

The old static HTML files are still present for reference while the Next.js app is adopted.
