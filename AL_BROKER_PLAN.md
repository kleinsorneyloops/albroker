# Al Broker — Active Development Plan
*Last updated: April 2026*
*Founders: Abigail Klein · Amy Garner*

---

## Current State

**Stack:** Next.js 16 App Router, JavaScript, Tailwind 4, Netlify hosting, Neon serverless Postgres, Gemini AI (server-side via Netlify functions), Better Auth (installed, not yet wired)

**Deployment:** `albroker.netlify.app` — auto-deploys from `main` branch on GitHub (`kleinsorneyloops/albroker`)

**Local dev:** `npm run dev` → `http://localhost:3000`. Note: Netlify functions (`/api/*`) do NOT run locally — API calls only work on the live deployment.

**Active branch:** `main`

---

## What's Done

### Infrastructure
- [x] Neon serverless Postgres connected via `NETLIFY_DATABASE_URL`
- [x] Seven DB tables: `users`, `sessions`, `accounts`, `verifications`, `personal_profiles`, `house_profiles`, `saved_listings`
- [x] `profile.mjs` and `saved-homes.mjs` migrated from Blob to Neon
- [x] `netlify.toml` correctly configured with `[functions]` section and `node_bundler = "esbuild"`
- [x] Better Auth installed (not yet wired to auth flow)
- [x] Local dev environment: Node v24, Git, VS Code, Claude Desktop filesystem MCP

### Brand & UI
- [x] Brand system documented in `BRAND_ASSETS.md`
- [x] Logo marks (face only + wordmark, light + dark) in `/public/images/brand/`
- [x] Header uses wordmark SVG (`logo-wordmark-light.svg`)
- [x] Homepage redesign: Robo-Realtor copy, on-brand SVG icon system, consistent card system
- [x] `globals.css` CSS variable token system established

### Core Features
- [x] Passphrase-based identity (no email/password)
- [x] 5-screen onboarding flow: passphrase → preferences → live listing demo → Gemini pattern analysis → done
- [x] Dual-range budget slider in onboarding
- [x] Anonymous save tracking (localStorage) with progress bar on listings page
- [x] Anonymous onboard modal fires at 5 saves → passphrase → Gemini pattern analysis
- [x] Profile-driven listings page (`deriveSearchParams` wired to location, budget, bedrooms)
- [x] `ProfileBanner` for authenticated users on listings page
- [x] Gemini pattern analysis (`/api/analyse-pattern`) — server-side, no API key exposure
- [x] Gemini learn content (`/api/learn`) — personalised to buyer profile
- [x] RealtyAPI listings integration (`search/byaddress`)
- [x] Saved homes (save/unsave, persisted to Neon for auth users)

### Profile System
- [x] Profile page rebuilt — editable house profile (budget, location, beds, property type, must-haves, deal-breakers)
- [x] Passphrase displayed on profile page with copy, email, and share link buttons
- [x] Passphrase recovery input (when not in localStorage for current browser)
- [x] `albroker_passphrase` saved to localStorage on onboarding and sign-in
- [x] Shareable read-only profile URL: `/profile/share/[passphrase]`
- [x] Onboarding redirects to `/profile` (not `/listings`) after completion
- [x] Returning user sign-in redirects to `/profile`

### Bug Fixes (April 2026)
- [x] Location "undefined" bug — `deriveSearchParams` now uses `c.name` only (no `c.state` concatenation)
- [x] Budget filter removed from onboarding demo screen (taste calibration, not budget filtering)
- [x] City mismatch detection in onboarding demo — triggers retry UI if results are from wrong area

### AI Architecture
- [x] **Pattern analysis:** Gemini 2.5 Flash via `/api/analyse-pattern` (Netlify function)
- [x] **Learn content:** Gemini 2.5 Flash via `/api/learn` (Netlify function)
- [x] All AI calls are server-side — no API keys in browser

---

## Three-Layer Profile Architecture

The profile has three distinct layers with different purposes, data types, and enrichment mechanisms.

### Layer 1 — By the Numbers
Explicit, structured preferences that map directly to API search parameters. The Zillow-equivalent filter set. Visible and fully editable by the user.

**Current fields:** budget min/max, bedrooms min, location, property type, must-haves, deal-breakers

**Expanded fields (next sprint):** neighborhood character (urban/suburban/rural), lot size preference, year built range, HOA tolerance, commute location (for distance-based filtering), school district importance, sqft range

**Maps to:** RealtyAPI `search/byaddress` params directly

### Layer 2 — About Me *(planned)*
Lifestyle and context metadata. Not house-specific features but factors shaping what a good home looks like for this person. Semi-structured, enriched via AI conversation.

**Examples:** commute requirements, proximity to outdoors/trails/parks, noise tolerance, walkability vs. drivability preference, household dynamics, pet ownership, entertaining style, work-from-home needs

**Enrichment:** AI conversation with a specific extraction goal — "Tell me about your daily routine" → structured signals written to `about_me` JSONB column

### Layer 3 — My Dream House *(planned)*
Descriptive, narrative, aspirational. Freeform text + AI-extracted signals. Most useful for agent context and AI listing reasoning — can't be mapped directly to API params but captures the *spirit* of what someone wants.

**Enrichment:** Single open-ended prompt → stored as narrative + parsed for cross-reference signals against Layer 1 (e.g. mentions "garage" without having checked it as a must-have)

---

## What's Next (Sprint Priorities)

### Current Sprint — Layer 1 Expansion + Search Wiring

**Goal:** Layer 1 should feel complete and actually drive the listings search fully. Two parts:

#### Part A — Expand Layer 1 fields
Add preference questions that aren't standard Zillow filters but improve matching quality:

| Field | UI | Maps to API |
|---|---|---|
| Neighborhood character | 3-way toggle: Urban / Suburban / Rural | `keywords` param |
| Commute address | Text input (optional) | Future: distance filter |
| Lot size preference | Pills: No preference / Small yard / Large yard / Acreage | `lotSize` param |
| Year built preference | Pills: Any / Modern (2000+) / Established (1980–2000) / Historic (pre-1980) | `yearBuilt` param |
| HOA tolerance | Pills: No HOA / Low (<$200) / OK with any | `hasHOA` param |
| Square footage range | Min/max inputs | `sqft` param |
| School district | Toggle: Important / Not important | Future: signal only |

These live on the profile page as a new "Search preferences" section below the existing fields.

#### Part B — Wire Layer 1 fully into `deriveSearchParams`
Currently only location, budget, and bedrooms drive the search. Must-haves, property type, and new fields need to be mapped:

```js
// Must-haves → keywords param
mustHaves: ['fireplace', 'garage'] → keywords: 'fireplace, garage'

// Property types → homeType param
propertyTypes: ['Houses', 'Townhomes'] → homeType: 'Houses,Townhomes'

// HOA tolerance → hasHOA param
hoaTolerance: 'none' → hasHOA: false

// Sqft → sqft param
sqftMin: 1200, sqftMax: 2500 → sqft: 'min:1200, max:2500'

// Year built → yearBuilt param
yearBuiltPref: 'modern' → yearBuilt: 'min:2000'

// Lot size → lotSize param
lotPref: 'large' → lotSize: 'min:10000'
```

#### Part C — Neon schema update
New fields need to be stored. Options:
1. Add columns to `house_profiles` table (cleaner long-term)
2. Store in existing `inferred_summary` JSONB (faster to ship)

Recommendation: use JSONB for now (`layer1_extended` key), add columns in a later migration when schema is stable.

### Next Up
- [ ] Layer 2 (About Me) — AI conversation enrichment, `about_me` JSONB column
- [ ] Layer 3 (Dream House) — narrative input + signal extraction
- [ ] Listing evaluation micro-interaction (post-save "what caught your eye?") — deferred until listing detail view is improved
- [ ] `normalizeProperty` fix — `resoFacts` fields for House Profile scoring
- [ ] Profile-driven listing scoring (`scoreListingAgainstProfile` 0–100)
- [ ] `listing_snapshots` table — new listing flagging
- [ ] Better Auth fully wired

### Phase 2
- [ ] Scheduled background refresh (Netlify cron, 2x/day)
- [ ] `listing_cache` table + cache layer (reduce RealtyAPI usage)
- [ ] Financial projections and investor materials
- [ ] Agent marketplace (agent SaaS subscriptions)

### Phase 3+
- [ ] Brokerage white-label
- [ ] Seller-side features
- [ ] Affiliate/partner integrations (mortgage, inspection, title)

---

## Key Architecture Decisions (locked)

- **Three-layer profile:** Layer 1 (By the numbers, API-mapped) + Layer 2 (About me, lifestyle context) + Layer 3 (Dream house, narrative) — each enriched differently, all feed listing matching
- **Dual-profile architecture:** Personal Profile (readiness) + House Profile (preferences) → combined Readiness Score
- **Profile-driven search:** Listings page auto-searches from profile — manual search is refinement, not starting point
- **AI enrichment over forms:** Layers 2 and 3 built through conversation, not form fills
- **Buyer-only MVP:** No seller features in Phase 1 or 2
- **Individual agents first:** Lower friction GTM than brokerages; brokerage white-label is Phase 2 enterprise upsell
- **Robo-Realtor:** Consistent term throughout UI and marketing copy

---

## RealtyAPI Notes

**Base URL:** `https://zillow.realtyapi.io` · **Auth:** `x-realtyapi-key` · **Plan:** Free (250 req/mo)

**Preferred endpoints:**
- Search: `GET /search/byaddress` (`location`, `listingStatus`, `bed_min/max`, `listPriceRange`, `homeType`, `sqft`, `yearBuilt`, `lotSize`, `keywords`, `hasHOA`, `page`)
- Property detail: `GET /property?zpid=` (preferred over `search/byurl` which is unreliable)
- Autocomplete: `GET /autocomplete?query=`

**Image fields:** `desktopWebHdpImageLink` (hero), `originalPhotos` (multi-res arrays), `neighborhoodMapThumb` (thumbnails) — all on Zillow CDN, no auth required.

**Rate limit strategy:** Cache results in Neon for 24 hours once >2-3 active buyers. Scheduled function + Neon cache is right architecture from ~5 users onward.

---

## Monthly Cost Formula (Colorado)

```
loan = price × 0.80
monthly_rate = 0.06168 / 12
n = 360
P&I = loan × (monthly_rate × (1 + monthly_rate)^n) / ((1 + monthly_rate)^n - 1)
Total = P&I + HOA + (price × 0.0051 / 12) + $125 insurance
```

---

## Development Workflow

**Committing:**
```bash
git add -A
git commit -m "Description of changes"
git push origin main
```
Netlify auto-deploys on push to main (~1-2 min).

**Environment variables:** Live in Netlify dashboard AND in local `.env.local` (not committed).
Variables: `GEMINI_API_KEY`, `NETLIFY_DATABASE_URL`, `NETLIFY_DATABASE_URL_UNPOOLED`, `REAPI_API_KEY`

**Clearing session for fresh test:** Run `localStorage.clear()` in browser console.

---

## File Structure (key files)

```
/app
  page.jsx                         ← Homepage
  layout.jsx                       ← Root layout, header/footer
  /listings/page.jsx               ← Profile-driven listings page
  /onboard/page.jsx                ← Onboarding entry point
  /profile/page.jsx                ← Profile (3-layer, editable)
  /profile/share/[passphrase]/     ← Read-only shareable profile view
  /learn/page.jsx                  ← Learn/education section

/components
  header.jsx
  footer.jsx
  /onboard/onboard-flow.jsx        ← 5-screen onboarding flow

/lib
  passphrase.js                    ← Passphrase generation and hashing
  reapi.js                         ← RealtyAPI client
  deriveSearchParams.js            ← House Profile → RealtyAPI query mapping

/netlify/functions
  listings.mjs                     ← RealtyAPI listings proxy
  property.mjs                     ← RealtyAPI property detail proxy
  profile.mjs                      ← Profile CRUD (Neon)
  saved-homes.mjs                  ← Saved listings CRUD (Neon)
  analyse-pattern.mjs              ← Gemini pattern analysis
  learn.mjs                        ← Gemini learn content

/public/images/brand               ← Canonical logo files
BRAND_ASSETS.md                    ← Brand documentation
AL_BROKER_PLAN.md                  ← This file
```

---

*Al Broker · Internal · Confidential · April 2026*
