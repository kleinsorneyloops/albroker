import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';

function getDb() {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);
  return sql;
}

export default async (req) => {
  const sql = getDb();

  if (req.method === 'POST') {
    try {
      const { profile, userId: existingId } = await req.json();
      const userId = existingId || randomUUID();

      if (!existingId) {
        await sql`
          INSERT INTO users (id, name, email, email_verified, created_at, updated_at)
          VALUES (
            ${userId},
            ${'Anonymous'},
            ${`anon_${userId}@albroker.local`},
            false,
            NOW(),
            NOW()
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }

      await sql`
        INSERT INTO personal_profiles (
          user_id, quiz_answers, life_stage, timeline, target_move_date,
          household_size, has_children, school_importance, profile_completeness,
          last_updated, created_at
        )
        VALUES (
          ${userId},
          ${JSON.stringify(profile)},
          ${profile.journeyStage || null},
          ${profile.purchaseTimeframe || null},
          ${null},
          ${profile.householdSize ? 1 : null},
          ${false},
          ${profile.homePriorities?.includes('School district') ? 'high' : null},
          ${computeCompleteness(profile)},
          NOW(),
          NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
          quiz_answers         = EXCLUDED.quiz_answers,
          life_stage           = EXCLUDED.life_stage,
          timeline             = EXCLUDED.timeline,
          school_importance    = EXCLUDED.school_importance,
          profile_completeness = EXCLUDED.profile_completeness,
          last_updated         = NOW()
      `;

      return new Response(JSON.stringify({ userId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Profile POST error:', err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (req.method === 'GET') {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const rows = await sql`
        SELECT quiz_answers, life_stage, timeline, school_importance,
               profile_completeness, last_updated
        FROM personal_profiles
        WHERE user_id = ${userId}
        LIMIT 1
      `;

      if (rows.length === 0) {
        return new Response(JSON.stringify({ profile: null }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const profile = rows[0].quiz_answers || {};

      return new Response(JSON.stringify({ profile }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Profile GET error:', err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};

function computeCompleteness(profile) {
  const fields = [
    'journeyStage', 'buyerType', 'buyingReason', 'purchaseTimeframe',
    'processConfidence', 'topicsUnderstood', 'topicsConfusing', 'monthlyCostUnderstanding',
    'financialFears', 'processFears', 'financialUncertaintyInfluence', 'biggestBlocker',
    'wishKnewBeforeSearch', 'homePriorities', 'decisionInfluence', 'researchMethod',
    'ageRange', 'householdSize', 'householdIncome', 'targetBudgetRange',
    'currentHousingSituation', 'employmentSituation', 'targetMarket',
  ];
  const filled = fields.filter((f) => {
    const v = profile[f];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && v !== '';
  });
  return Math.round((filled.length / fields.length) * 100);
}

export cons
