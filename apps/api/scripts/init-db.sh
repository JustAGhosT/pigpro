#!/usr/bin/env bash
set -euo pipefail

HOST="${PGHOST:-localhost}"
PORT="${PGPORT:-5432}"
USER="${PGUSER:-user}"
PASSWORD="${PGPASSWORD:-password}"
DATABASE="${PGDATABASE:-livestockdb}"

export PGPASSWORD="$PASSWORD"

echo "Initializing Postgres database $DATABASE on $HOST:$PORT as $USER"

# create database if not exists
psql -h "$HOST" -p "$PORT" -U "$USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='${DATABASE}'" | grep -q 1 || \
  psql -h "$HOST" -p "$PORT" -U "$USER" -d postgres -c "CREATE DATABASE ${DATABASE} WITH OWNER ${USER} TEMPLATE template1" || true

SCHEMA_SQL="
CREATE TABLE IF NOT EXISTS listings (
  id text PRIMARY KEY,
  title text NOT NULL,
  price numeric NOT NULL,
  currency text,
  image text,
  location text,
  rating numeric,
  reviews integer,
  category text,
  breed text,
  age text,
  gender text,
  is_verified boolean,
  description text,
  created_at timestamptz,
  promoted boolean DEFAULT false,
  likes integer DEFAULT 0
);
"

echo "$SCHEMA_SQL" | psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DATABASE" -v ON_ERROR_STOP=1

echo "Database initialized."
