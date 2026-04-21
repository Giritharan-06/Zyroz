# Zyroz - Digital Marketing Agency Dashboard

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Lead Management**: Real-time lead tracking and scoring.
- **Campaign Command Center**: Comprehensive management of cross-platform advertising campaigns.
- **Digital Asset Vault**: Multi-format asset ingestion (Local & URL) with automatic metadata detection.
- **Real-time Analytics**: Live metrics via Socket.io integration.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

This project uses Neon PostgreSQL. To initialize the database schema and seed initial data, run:

```bash
npm run db:sync
```

Ensure your `.env.local` contains the `DATABASE_URL` provided.
