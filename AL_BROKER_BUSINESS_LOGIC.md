# Al Broker — Canonical Business Logic
*Source of truth for all product, development, and planning decisions.*
*Last updated: April 2026 · Founders: Abigail Klein · Amy Garner*

---

## 1. What Al Broker Is

Al Broker is an AI-powered homebuyer education and agent marketplace platform. It transforms unprepared, confidence-delayed buyers into informed, motivated leads — then connects them to a curated network of agents who compete on transparency and verified performance.

**The one-sentence version:**
> Al Broker prepares buyers before they meet an agent, then connects them to the right agent — giving agents the best-qualified leads in the market.

**What it is not:**
- Not a listing portal (Zillow, Redfin)
- Not a finance education tool (NerdWallet, Bankrate)
- Not an agent CRM or post-purchase tool (Homebot)
- Not a seller platform (Phase 1 is buyers only)

---

## 2. The Two Buyer Segments

| Segment | Profile |
|---|---|
| **The First-Timer** | Ages 28–42. Stable income, intent to buy, no prior purchase experience. Qualified but needs a trusted guide through an unfamiliar process. |
| **The Confidence-Delayed Buyer** | Ages 30–50. Financially qualified today. Has been researching for months without acting — held back by knowledge gaps and decision anxiety, not affordability. |

Both segments engage with Al Broker **before** they have an agent. The platform serves buyers who are solo — not yet in any agent relationship.

---

## 3. The Eight-Step User Journey

This is the definitive sequence. All product, development, and planning must be consistent with this flow.

### Step 1 — Sign Up
Buyer discovers Al Broker and creates a free account using a passphrase (no email/password required at MVP). No agent involved. Entirely self-directed.

**Current status:** ✅ Built — passphrase-based identity, onboarding flow wired to Neon.

---

### Step 2 — Basic Preferences (Price-Hidden)
Buyer enters initial preferences: location, bedrooms, property type, must-haves. **Price is intentionally not shown or entered at this stage.** The goal is to prevent cost anchoring — the buyer evaluates homes on fit and feel, not sticker price.

This is a taste calibration exercise, not a search. The results shown here are illustrative, not a filtered search.

**Current status:** ✅ Partially built — onboarding flow captures location, beds, property type. Budget slider exists but is intentionally excluded from the demo screen. Price-hidden behavior is in place for the onboarding demo.

**Planned:** Richer preference capture including neighborhood character, lot size, HOA tolerance, year built, sqft range.

---

### Step 3 — Initial Listing Reactions
Buyer sees a set of properties based on Step 2 preferences. They indicate which homes they like based on photos and relevant data. Price is still not shown at this stage.

The listing card should show enough to form a genuine opinion: multiple photos, key facts (beds/baths/sqft/year built), neighborhood character, school ratings, and AI-extracted highlight tags. Walk score requires a separate API call and is shown for saved listings only.

**Current status:** ⚠️ Partially built — single photo and minimal data. Multi-photo and richer card display is planned work.

**Planned:** Listing card v2 with photo gallery, neighborhood data, school ratings, Zillow `homeInsights` tags.

---

### Step 4 — Profile Built from Reactions
Every listing interaction is stored and used to enrich the buyer's House Profile. Saves, views, and likes all generate behavioral signals. After 5+ interactions, an AI inference pass produces a plain-language summary of what the buyer actually wants.

**What gets stored per save:**
- `zpid`, address, price, beds, baths, sqft, homeType, yearBuilt
- `resoFacts` fields: `hasFireplace`, `hasGarage`, `hasCooling`, `hasView`, `monthlyHoaFee`
- Location (ZIP) for cluster analysis
- Timestamp and interaction type (save / like / dislike)

**Where it lives:** `saved_listings` table in Neon. Behavioral signals aggregated into `house_profiles.inferred_summary` JSONB.

**Current status:** ✅ Save/unsave wired to Neon. ⚠️ `normalizeProperty` missing `resoFacts` fields — identified gap, fix pending.

---

### Step 5 — Daily Al Broker Match Suggestions
Once a buyer has an active profile, Al Broker runs a daily search and surfaces new listings that match their profile. This goes beyond explicit criteria — if a property is missing a stated must-have but scores strongly on everything else, it may still be surfaced with a note explaining why.

The match logic evolves in two phases:
- **Phase 1 (simple):** Profile-to-API query mapping. Results ranked by `scoreListingAgainstProfile()`.
- **Phase 2 (smarter):** Score recalibration based on like/dislike history from Step 6. AI learns which features matter most to this specific buyer.

**Rate limit strategy:** Cache results in Neon for 24 hours. Scheduled Netlify function (2x/day) handles refresh once >2–3 active buyers exist. Page-load fetch is acceptable for MVP.

**Current status:** ⚠️ Profile-to-query mapping partially wired (`deriveSearchParams`). Scoring function designed in `LISTINGS_AGENT_CONCEPT.md` but not yet built. Scheduled refresh not yet built.

**Planned:** `scoreListingAgainstProfile()` in `/lib/scoreListing.js`, `listing_snapshots` table, scheduled refresh function, "New" badge for listings not in previous snapshot.

---

### Step 6 — Feedback Loop: Like, Dislike, and Why
When Al surfaces a match, the buyer reviews it and responds: like or dislike, plus a brief structured reason. This is the core learning mechanism.

**Feedback options (planned):**
- 👍 Like
- 👎 Dislike
  - Reasons (structured, multi-select): Wrong neighborhood · Too small · Too large · Wrong price range · Wrong property type · Bad layout · Poor condition · Too old · HOA concerns · Other

**What happens with feedback:**
- Stored in `listing_feedback` table (planned — see Section 6)
- Feeds back into House Profile behavioral signals
- Over time, recalibrates the match score weights for this buyer
- Surfaces patterns back to the buyer as insights ("You consistently dislike homes built before 1980")

**Current status:** ❌ Not yet built. This is the most underdeveloped piece of the core loop and the highest-priority planned feature after profile and scoring are stable.

---

### Step 7 — Al Broker Match Score
Every listing shown to a buyer carries a match score (0–100) derived from their profile. The score is visible to the buyer and included in the agent dossier.

**Score dimensions (weighted):**
| Dimension | Weight | Source |
|---|---|---|
| Budget fit | 30 pts | `budget_max` vs. listing price |
| Must-haves present | 25 pts | `resoFacts` fields vs. `must_haves` |
| Location fit | 20 pts | ZIP cluster match |
| Bedroom fit | 15 pts | `bedrooms_min` vs. listing |
| Market signals | 10 pts | Days on market, price reductions |

**Score → badge:**
| Score | Badge |
|---|---|
| 80–100 | Strong fit |
| 60–79 | Good fit |
| 40–59 | Partial fit |
| 0–39 | Review |

Score weights recalibrate over time based on like/dislike feedback from Step 6.

**Current status:** ❌ Scoring function designed but not yet built. Score not yet displayed in UI.

---

### Step 8 — Outcome: House Found or Dossier Shared
Two valid outcomes, both available at any time (not sequential):

**Outcome A — Buyer finds the house on Al Broker**
Buyer identifies a specific listing they want to pursue. They can share their full profile + that listing with an agent to begin the transaction.

**Outcome B — Buyer shares dossier with a realtor**
Buyer (or Al Broker, via agent marketplace) shares a complete buyer dossier with a realtor to assist in finding a home that may not yet be listed or that the buyer hasn't found yet.

**The dossier contains:**
- Overall Readiness Score (Personal 60% + House 40%)
- Personal Profile: financial readiness, process knowledge, emotional confidence, market awareness
- House Profile: budget, bedrooms, property types, locations, must-haves, deal-breakers
- Behavioral signals: price comfort zone, location clusters, amenity patterns
- AI-inferred summary: style match, school importance, commute priorities
- Liked listings (with match scores)
- Recommended talking points for the agent

**Data ownership:** The buyer generates this data. Al Broker maintains it. The agent receives a read-only brief. The agent does not retain or own the buyer's underlying data.

**Current status:** ⚠️ Shareable profile URL exists (`/profile/share/[passphrase]`). Full dossier format (agent-facing, structured) is planned work.

---

## 4. The Three-Layer Profile Architecture

Every buyer builds a profile across three layers simultaneously. Each layer is enriched differently and serves a different purpose.

### Layer 1 — By the Numbers
Explicit, structured preferences that map directly to API search parameters. Visible and fully editable by the user.

**Fields:**
- Budget min/max
- Bedrooms minimum
- Target location(s)
- Property types (multi-select)
- Must-haves (fireplace, garage, A/C, yard, pool, view, laundry, basement, office, patio)
- Deal-breakers (high HOA, busy street, no parking, pre-1970, no A/C, small sqft, no yard)
- Neighborhood character (urban / suburban / rural) — multi-select
- Lot size preference (no preference / small / large / acreage)
- Year built preference (any / modern 2000+ / established 1980–2000 / historic pre-1980)
- HOA tolerance (none / low <$200 / any)
- Square footage range (min/max)
- Commute destination (optional — for distance-based signals)
- School district importance (toggle)
- Walkability preference (stored from profile; displayed on listing cards via `/walk_transit_bike` API)

**Maps to:** RealtyAPI `search/byaddress` parameters directly via `deriveSearchParams.js`

**Stored in:** `house_profiles` table — explicit fields + `inferred_summary.layer1_extended` JSONB for extended fields

**Current status:** ✅ Core fields built. ⚠️ Extended fields (neighborhood, lot, year built, HOA, sqft, commute, schools) in profile UI but `deriveSearchParams` not yet fully wired.

---

### Layer 2 — About Me *(planned)*
Lifestyle and context metadata. Not house-specific features but factors shaping what a good home looks like for this person. Enriched via AI conversation rather than a form.

**Examples of signals captured:**
- Commute requirements and mode (car, transit, bike, WFH)
- Proximity to outdoors, trails, parks, water
- Noise tolerance (busy street, neighbors, city sounds)
- Walkability vs. drivability preference
- Household dynamics (partner, children, parents, pets)
- Entertaining style (frequent host vs. quiet household)
- Work-from-home needs (dedicated office, outdoor space for calls)
- Renovation tolerance (move-in ready vs. willing to update)

**Enrichment mechanism:** AI conversation with structured extraction goal. Single prompt: "Tell me about your daily life and what home means to you." → Gemini extracts structured signals → written to `about_me` JSONB column in `personal_profiles`.

**Stored in:** `personal_profiles.about_me` JSONB (column to be added)

**Current status:** ❌ Not yet built. Column does not exist. Enrichment flow not designed.

---

### Layer 3 — My Dream House *(planned)*
Descriptive, narrative, aspirational. Freeform text + AI-extracted signals. Most useful for agent context and AI listing reasoning — captures the spirit of what someone wants, not just the filters.

**Enrichment mechanism:** Single open-ended prompt: "Describe your dream home in as much detail as you want." → stored as narrative text + Gemini extracts cross-reference signals (e.g. mentions "garage" without having checked it as a must-have → flags as implicit must-have candidate).

**Stored in:** `house_profiles.dream_house_narrative` (text column to be added) + `house_profiles.dream_house_signals` JSONB

**Current status:** ❌ Not yet built.

---

## 5. The Dual Readiness Score

Every buyer has a combined Readiness Score (0–100) that represents how prepared they are to buy.

```
Personal Profile score (60%) + House Profile score (40%) = Readiness Score
```

### Personal Profile (60%)
Seeded by the onboarding quiz, updated by learning activity.

| Dimension | Weight |
|---|---|
| Financial readiness | 25% |
| Process knowledge | 15% |
| Emotional confidence | 10% |
| Market awareness | 10% |

### House Profile (40%)
Derived from profile completeness and behavioral depth.

| Signal | Weight |
|---|---|
| Budget defined | 25 pts |
| Location defined | 15 pts |
| Bedrooms defined | 10 pts |
| Must-haves selected | 15 pts |
| Deal-breakers selected | 10 pts |
| Neighborhood character set | 10 pts |
| HOA tolerance set | 5 pts |
| Extended fields populated | 10 pts |

---

## 6. Neon Database — Current and Planned Schema

### Current Tables

**`users`** — identity records
```
id, created_at, updated_at
```

**`sessions`** — Better Auth session management
```
id, user_id, expires_at, ...
```

**`accounts`** — Better Auth account links
```
id, user_id, provider, ...
```

**`verifications`** — Better Auth verification tokens
```
id, identifier, value, expires_at
```

**`personal_profiles`** — buyer readiness data
```
id, user_id, buyer_type, purchase_timeframe, target_market,
financial_readiness (JSONB), process_knowledge (JSONB),
emotional_readiness (JSONB), market_knowledge (JSONB),
overall_readiness_score, life_stage, created_at, updated_at
```

**`house_profiles`** — house preference data
```
id, user_id, budget_min, budget_max, budget_confirmed,
bedrooms_min, must_haves (JSONB array), deal_breakers (JSONB array),
locations_explicit (JSONB array), inferred_summary (JSONB),
profile_completeness, created_at, updated_at
```

**`saved_listings`** — listings saved by buyers
```
id, user_id, zpid, address, city, state, zipcode,
price, bedrooms, bathrooms, living_area, home_type,
year_built, img_src, listing_status, latitude, longitude,
raw_data (JSONB), saved_at
```

### Planned Tables

**`listing_feedback`** — like/dislike reactions from Step 6
```sql
CREATE TABLE listing_feedback (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT NOT NULL,
  zpid         TEXT NOT NULL,
  reaction     TEXT NOT NULL,        -- 'like' | 'dislike'
  reasons      JSONB,                -- array of structured reason codes
  notes        TEXT,                 -- optional free text
  match_score  INTEGER,              -- score at time of feedback
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, zpid)
);
```

**`listing_snapshots`** — previous search result sets per buyer (for "New" badge)
```sql
CREATE TABLE listing_snapshots (
  user_id      TEXT NOT NULL,
  zpids        JSONB NOT NULL,       -- array of zpid strings
  query_params JSONB NOT NULL,       -- params used to generate snapshot
  fetched_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id)
);
```

**`listing_cache`** — shared listing data cache (reduces RealtyAPI usage)
```sql
CREATE TABLE listing_cache (
  zpid         TEXT PRIMARY KEY,
  data         JSONB NOT NULL,       -- full RealtyAPI response
  cached_at    TIMESTAMPTZ DEFAULT NOW()
);
-- Expires after 24 hours. Check: cached_at > NOW() - INTERVAL '24 hours'
```

### Planned Column Additions

**`personal_profiles`:**
```sql
ALTER TABLE personal_profiles ADD COLUMN about_me JSONB;
-- Stores Layer 2 AI-extracted lifestyle signals
```

**`house_profiles`:**
```sql
ALTER TABLE house_profiles ADD COLUMN dream_house_narrative TEXT;
ALTER TABLE house_profiles ADD COLUMN dream_house_signals JSONB;
-- Stores Layer 3 narrative and extracted signals
```

---

## 7. The Agent Dossier

The dossier is Al Broker's core deliverable — the document delivered to an agent when a buyer selects them or shares their profile. It has no equivalent anywhere in the market.

**Sample dossier contents:**
```
BUYER READINESS BRIEF

Overall Readiness Score: 78 / 100

PERSONAL PROFILE
  Financial Readiness:   82/100  Pre-approval in progress
  Process Knowledge:     71/100  Strong on timeline, gaps in closing costs
  Emotional Confidence:  68/100  Moderate — prefers thorough review before deciding
  Market Awareness:      74/100  Good neighborhood research, pricing intuition developing
  Life Stage:            First-timer
  Timeline:              3–6 months

HOUSE PROFILE
  Budget:                $400,000–$500,000 (ceiling $525,000)
  Bedrooms:              2 minimum, 3 preferred
  Property type:         Condo, Townhouse
  Locations:             Lakewood CO (4 saves), Denver Highlands (2 saves)
  Must-haves:            Garage, fireplace, in-unit laundry
  Deal-breakers:         High HOA (>$400/mo), busy street

BEHAVIORAL SIGNALS (from 8 saved listings)
  Price comfort:         ~$465,000 (median of saves)
  Style signal:          Modern builds, 2010+, low maintenance
  Location priority:     West Denver metro corridor
  School importance:     Low (no children indicated)

LIKED LISTINGS (top 3 by match score)
  1204 S Reed Way, Lakewood — Score 94 · "Loved the garage and mountain view"
  13349 W Alameda Pkwy, Lakewood — Score 81 · "Like the layout"

RECOMMENDED TALKING POINTS
  · Walk through closing cost breakdown early — identified gap
  · Reassure on decision timeline — prefers thorough process
  · Lead with low-maintenance properties in preferred corridors
  · Avoid listings with HOA > $400/mo — flagged as deal-breaker
```

**Current status:** ⚠️ Shareable profile URL exists. Full structured dossier with liked listings and talking points is planned work.

---

## 8. Go-To-Market Sequence

**Phase 1 — Pilot (current):**
- Geography: Colorado-first, small number of additional pilot markets
- Channel: Founder personal networks (Abby's Coldwell Banker relationships, Amy's network)
- Agent supply: 3–5 agents from Abby's network, free pilot, structured feedback
- Buyer supply: Founder-referred contacts placed manually through the platform
- Revenue: Referral commissions only (~$2,500/close)

**Phase 2 — Scale:**
- Geography: Multi-state expansion via RealtyAPI (no IDX paperwork required)
- Primary sales target: Individual agents — lower friction, direct pain point, faster decisions
- Secondary target: Brokerages — enterprise upsell once individual agent traction is proven
- Revenue: Agent SaaS ($199–$399/mo) + referral hybrid + affiliate partners

**Why individual agents first, not brokerages:**
Brokerages require multi-stakeholder buy-in and budget approval. Individual agents feel the NAR pain point directly, make their own purchasing decisions, and can onboard in days. The brokerage white-label is the scale play — it requires a proven product with agent testimonials to sell.

---

## 9. Revenue Streams

| Stream | Phase | Structure |
|---|---|---|
| **Referral commissions** | 1 (bootstrap) | ~$2,500 per closed referral. Self-funds MVP build. |
| **Agent SaaS licensing** | 2 | $199–$399/mo per agent. Marketplace listing + dossier delivery. |
| **Brokerage white-label** | 2+ | $1,000–$3,000/mo. Full platform under brokerage brand. |
| **Affiliate / partner fees** | 2+ | Referral fees from mortgage lenders, inspectors, title companies. |

---

## 10. Competitive Position

| Competitor | What they do | Al Broker's gap they don't fill |
|---|---|---|
| Zillow / Redfin | Listing portals | Capture browsing data but never surface it to agents. No education, no readiness scoring, no warm handoff. |
| NerdWallet / Bankrate | Finance education | No process coaching, no marketplace, no preference profiling. |
| Homebot | Post-purchase equity tracking | Serves existing homeowners, not buyers. Entirely different segment. |
| Traditional agent onboarding | Manual buyer education | Inconsistent, unscalable, costs agents hours of unpaid time per client. |

**Al Broker's unique position:** The only platform combining buyer education, AI-built dual-profile preference profiling, a transparent agent marketplace with verified performance scoring, and a complete buyer dossier delivered to the agent before the first meeting.

---

## 11. Key Terminology

| Term | Definition |
|---|---|
| **Readiness Score** | Combined 0–100 score. Personal Profile (60%) + House Profile (40%). |
| **Personal Profile** | Four-dimension readiness assessment. Seeded by quiz, updated by learning activity. |
| **House Profile** | Three-layer preference record. Layer 1 (explicit) + Layer 2 (lifestyle) + Layer 3 (narrative). |
| **Layer 1** | By the numbers — structured, API-mappable preferences. Editable by user. |
| **Layer 2** | About Me — lifestyle context. Enriched via AI conversation. |
| **Layer 3** | Dream House — narrative and aspirational. Enriched via freeform prompt + AI extraction. |
| **Buyer Dossier** | Read-only document delivered to an agent upon buyer selection. Al Broker's core deliverable. |
| **Match Score** | 0–100 per-listing score derived from profile fit. Displayed on listing cards and in dossier. |
| **Listing Feedback** | Buyer like/dislike reaction + structured reason. Recalibrates match score weights over time. |
| **Certified Agent** | An agent listed in the Al Broker marketplace with verified commission rate and milestone score. |
| **Milestone Scoring** | Satisfaction surveys at post-showing, post-offer, and post-close. Builds agent performance record. |
| **Profile-Driven Search** | Listings page default: reads House Profile, constructs RealtyAPI query, scores results, renders ranked cards. |
| **Robo-Realtor** | Al Broker's brand voice — the AI that does the work before the human agent steps in. |

---

*Al Broker · Internal · Confidential · April 2026*
