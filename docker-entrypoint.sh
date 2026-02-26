#!/bin/sh
set -e

echo "Ensuring uploads directory exists..."
mkdir -p /app/public/uploads

echo "Running Prisma migrations..."
npx prisma db push --skip-generate

echo "Seeding database..."
npx tsx prisma/seed.ts || echo "Seed skipped (may already exist)"

echo "Starting server..."
exec node server.js
