// lib/db/schema.js
// Al Broker — Drizzle ORM schema
// Tables: users, sessions, personal_profiles, house_profiles, saved_listings

import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// USERS
// Managed by Better Auth — do not modify column names or Better Auth will break.
// Better Auth writes to this table automatically on signup/login.
// ---------------------------------------------------------------------------

export const users = pgTable("users", {
  id:            text("id").primaryKey(),
  name:          text("name").notNull(),
  email:         text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image:         text("image"),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
  updatedAt:     timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// SESSIONS
// Also required by Better Auth.
// ---------------------------------------------------------------------------

export const sessions = pgTable("sessions", {
  id:        text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token:     text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// ACCOUNTS
// Required by Better Auth for OAuth / credential linking.
// ---------------------------------------------------------------------------

export const accounts = pgTable("accounts", {
  id:                   text("id").primaryKey(),
  accountId:            text("account_id").notNull(),
  providerId:           text("provider_id").notNull(),
  userId:               text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken:          text("access_token"),
  refreshToken:         text("refresh_token"),
  idToken:              text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt:timestamp("refresh_token_expires_at"),
  scope:                text("scope"),
  password:             text("password"),
  createdAt:            timestamp("created_at").notNull().defaultNow(),
  updatedAt:            timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// VERIFICATIONS
// Required by Better Auth for magic links / email verification.
// ---------------------------------------------------------------------------

export const verifications = pgTable("verifications", {
  id:         text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value:      text("value").notNull(),
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at").notNull().defaultNow(),
  updatedAt:  timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// PERSONAL PROFILES
// One row per user. Seeded from the onboarding quiz, updated over time.
// Tracks buyer readiness across four dimensions + computed overall score.
// ---------------------------------------------------------------------------

export const personalProfiles = pgTable("personal_profiles", {
  id:     serial("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),

  // Four readiness dimensions (0–100 each)
  financialReadiness: integer("financial_readiness").default(0),
  processKnowledge:   integer("process_knowledge").default(0),
  emotionalReadiness: integer("emotional_readiness").default(0),
  marketKnowledge:    integer("market_knowledge").default(0),

  // Computed overall score (weighted average — calculated before write)
  overallReadinessScore: integer("overall_readiness_score").default(0),

  // Life stage & context
  lifeStage: text("life_stage"),  // 'first-timer' | 'confidence-delayed' | 'relocating' | 'downsizing'
  timeline:  text("timeline"),    // 'browsing' | '3-6mo' | 'now'
  targetMoveDate: text("target_move_date"),

  // Household context
  householdSize:    integer("household_size"),
  hasChildren:      boolean("has_children"),
  schoolImportance: text("school_importance"),  // 'low' | 'medium' | 'high'

  // Raw quiz answers stored as JSON for future re-scoring
  quizAnswers: jsonb("quiz_answers"),

  // Metadata
  profileCompleteness: integer("profile_completeness").default(0),  // 0–100
  lastUpdated:         timestamp("last_updated").notNull().defaultNow(),
  createdAt:           timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// HOUSE PROFILES
// One row per user. Grows with every listing interaction.
// Stores explicit preferences, behavioral signals, and AI-inferred patterns.
// ---------------------------------------------------------------------------

export const houseProfiles = pgTable("house_profiles", {
  id:     serial("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),

  // Explicit preferences (buyer stated directly)
  budgetMin:       integer("budget_min"),
  budgetMax:       integer("budget_max"),
  budgetCeiling:   integer("budget_ceiling"),
  bedroomsMin:     integer("bedrooms_min"),
  bedroomsPreferred: integer("bedrooms_preferred"),
  bathroomsMin:    real("bathrooms_min"),
  propertyTypes:   jsonb("property_types"),   // ['single-family', 'condo', 'townhouse']
  locations:       jsonb("locations"),        // [{ city, zip, neighborhood, priority }]
  mustHaves:       jsonb("must_haves"),       // ['garage', 'yard', 'school-district']
  dealBreakers:    jsonb("deal_breakers"),    // ['HOA', 'busy-street']

  // Behavioral signals (extracted from listing interactions, aggregated)
  observedPriceMin:    integer("observed_price_min"),
  observedPriceMax:    integer("observed_price_max"),
  observedPriceMedian: integer("observed_price_median"),
  stylePreferences:    jsonb("style_preferences"),  // { traditional: 0, modern: 2, ranch: 5 }
  amenitySignals:      jsonb("amenity_signals"),     // { pool: 1, garage: 3, fireplace: -1 }
  locationClusters:    jsonb("location_clusters"),   // [{ zip, count, avgPrice }]
  schoolSignals:       jsonb("school_signals"),      // [{ district, count }]

  // AI-inferred patterns (updated after 5+ saves)
  inferredStyleMatch:       text("inferred_style_match"),
  inferredPriceComfort:     integer("inferred_price_comfort"),
  inferredLocationPriority: text("inferred_location_priority"),
  inferredSchoolImportance: text("inferred_school_importance"),  // 'low' | 'medium' | 'high'

  // Metadata
  profileCompleteness: integer("profile_completeness").default(0),
  lastUpdated:         timestamp("last_updated").notNull().defaultNow(),
  createdAt:           timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// SAVED LISTINGS
// One row per save event. The raw signal log that feeds the house profile.
// Each save extracts property fields and stores them here for aggregation.
// ---------------------------------------------------------------------------

export const savedListings = pgTable("saved_listings", {
  id:     serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),

  // Property identity
  zpid:    text("zpid").notNull(),     // Zillow property ID — unique per property
  address: text("address"),
  city:    text("city"),
  state:   text("state"),
  zip:     text("zip"),

  // Key signals extracted at save time (feed the house profile aggregation)
  price:       integer("price"),
  bedrooms:    integer("bedrooms"),
  bathrooms:   real("bathrooms"),
  sqft:        integer("sqft"),
  homeType:    text("home_type"),       // 'single-family' | 'condo' | 'townhouse' etc.
  yearBuilt:   integer("year_built"),
  zestimate:   integer("zestimate"),
  latitude:    real("latitude"),
  longitude:   real("longitude"),
  imgSrc:      text("img_src"),
  listingStatus: text("listing_status"), // 'For_Sale' | 'Sold' etc.
  daysOnMarket:  integer("days_on_market"),

  // Raw full listing JSON (so we never lose data if we add new signals later)
  rawListing: jsonb("raw_listing"),

  // "What appeals to you?" modal response
  appealAnswers: jsonb("appeal_answers"),  // { reasons: [], notes: '' }

  // Source of the listing (search, import, autocomplete)
  source: text("source").default("search"),  // 'search' | 'zillow-import' | 'redfin-import'

  savedAt: timestamp("saved_at").notNull().defaultNow(),
});
