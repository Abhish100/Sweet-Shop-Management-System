# Sweet Shop Management System - Frontend

This is a React + TypeScript single-page application for the Sweet Shop Management System.

Features:
- Register/Login with JWT
- Dashboard listing sweets with search/filters
- Purchase flow
- Admin panels for CRUD on sweets

Run locally:

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Configuration:
- Set `VITE_API_BASE` to point to your backend REST API (defaults to `http://localhost:4000`).

Notes:
- Uses Tailwind for styling.
- API integrations are defined in `src/services`.
