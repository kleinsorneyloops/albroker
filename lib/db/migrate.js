// lib/db/migrate.js
// Run this once to push the schema to your Neon database.
//
// Usage:
//   node lib/db/migrate.js
//
// Make sure DATABASE_URL is set in your environment before running:
//   export NETLIFY_DATABASE_URL="postgresql://..."

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

const sql = neon(process.env.NETLIFY_DATABASE_URL);
const db = drizzle(sql, { schema });

console.log("Running migration...");

// drizzle-kit push is the recommended way to sync schema.
// This file is a manual fallback using raw SQL — useful for Netlify environments
// where you can't run drizzle-kit from the command line.

const createTables = `

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at TIMESTAMPTZ,
  refresh_token_expires_at TIMESTAMPTZ,
  scope TEXT,
  password TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verifications (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personal_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  financial_readiness INTEGER DEFAULT 0,
  process_knowledge INTEGER DEFAULT 0,
  emotional_readiness INTEGER DEFAULT 0,
  market_knowledge INTEGER DEFAULT 0,
  overall_readiness_score INTEGER DEFAULT 0,
  life_stage TEXT,
  timeline TEXT,
  target_move_date TEXT,
  household_size INTEGER,
  has_children BOOLEAN,
  school_importance TEXT,
  quiz_answers JSONB,
  profile_completeness INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS house_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  budget_min INTEGER,
  budget_max INTEGER,
  budget_ceiling INTEGER,
  bedrooms_min INTEGER,
  bedrooms_preferred INTEGER,
  bathrooms_min REAL,
  property_types JSONB,
  locations JSONB,
  must_haves JSONB,
  deal_breakers JSONB,
  observed_price_min INTEGER,
  observed_price_max INTEGER,
  observed_price_median INTEGER,
  style_preferences JSONB,
  amenity_signals JSONB,
  location_clusters JSONB,
  school_signals JSONB,
  inferred_style_match TEXT,
  inferred_price_comfort INTEGER,
  inferred_location_priority TEXT,
  inferred_school_importance TEXT,
  profile_completeness INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_listings (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  zpid TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  price INTEGER,
  bedrooms INTEGER,
  bathrooms REAL,
  sqft INTEGER,
  home_type TEXT,
  year_built INTEGER,
  zestimate INTEGER,
  latitude REAL,
  longitude REAL,
  img_src TEXT,
  listing_status TEXT,
  days_on_market INTEGER,
  raw_listing JSONB,
  appeal_answers JSONB,
  source TEXT DEFAULT 'search',
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

`;

try {
  await sql(createTables);
  console.log("✅ All tables created successfully.");
} catch (err) {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
}
