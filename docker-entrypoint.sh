#!/bin/sh
set -e

echo "Ensuring uploads directory exists..."
mkdir -p /app/public/uploads

echo "Syncing database schema..."
npx prisma db push --skip-generate

echo "Seeding database..."
npx tsx prisma/seed.ts || echo "Seed skipped (may already exist)"

echo "Starting server..."
exec node server.js
