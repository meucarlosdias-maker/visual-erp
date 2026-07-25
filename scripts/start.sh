#!/bin/sh

set -e

echo "Applying database migrations..."
pnpm db:migrate

echo "Starting application..."
pnpm start
