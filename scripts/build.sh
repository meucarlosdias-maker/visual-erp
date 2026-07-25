#!/bin/sh

set -e

echo "Installing dependencies..."
pnpm install

echo "Generating Prisma client..."
pnpm db:generate

echo "Building application..."
pnpm build

echo "Build complete"
