/**
 * Al Broker — Retro Sci-Fi Agent Passphrase Generator
 *
 * Generates three-word passphrases that evoke a distinct AI agent persona —
 * retro-futurist aesthetic meets real estate detective character.
 *
 * Pattern: [adjective] + [robotic/AI noun] + [real estate/investigator role]
 *
 * Examples:
 *   copper-robo-realtor
 *   stochastic-cyber-sleuth
 *   chromium-servo-broker
 *   kinetic-droid-surveyor
 *   iridium-nexus-appraiser
 */

// Retro-sci-fi adjectives — materials, physics terms, vintage-future feel
const ADJECTIVES = [
  'atomic',
  'bismuth',
  'chromium',
  'cobalt',
  'copper',
  'crystalline',
  'electric',
  'ferric',
  'galvanic',
  'iridium',
  'kinetic',
  'magnetic',
  'mercuric',
  'molybdenum',
  'nickel',
  'osmium',
  'photonic',
  'plasma',
  'plutonic',
  'quantum',
  'radium',
  'rhodium',
  'sintered',
  'solar',
  'solenoid',
  'spectral',
  'stochastic',
  'telluric',
  'tungsten',
  'vanadium',
  'voltaic',
  'xenon',
  'zirconium',
];

// Robotic / AI nouns — the machine body of the agent
const NOUNS = [
  'android',
  'automaton',
  'capacitor',
  'chassis',
  'circuit',
  'cogitron',
  'cortex',
  'cyber',
  'droid',
  'dynamo',
  'exo',
  'gearwork',
  'mainframe',
  'mech',
  'module',
  'nexus',
  'relay',
  'robo',
  'servo',
  'synthex',
  'unit',
  'vector',
];

// Real estate / investigator roles — the professional identity
const ROLES = [
  'agent',
  'appraiser',
  'assessor',
  'broker',
  'cartographer',
  'commissioner',
  'consul',
  'curator',
  'detective',
  'docent',
  'envoy',
  'inspector',
  'navigator',
  'prospector',
  'realtor',
  'scout',
  'sleuth',
  'surveyor',
  'tracker',
  'valuer',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a random retro sci-fi agent passphrase.
 * @returns {string} e.g. "copper-robo-realtor"
 */
export function generatePassphrase() {
  return `${pick(ADJECTIVES)}-${pick(NOUNS)}-${pick(ROLES)}`;
}

/**
 * Hashes a passphrase using SHA-256 for storage.
 * The raw passphrase is never stored — only this hash.
 * @param {string} passphrase
 * @returns {Promise<string>} hex hash
 */
export async function hashPassphrase(passphrase) {
  const encoder = new TextEncoder();
  const data = encoder.encode(passphrase.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Derives a deterministic user ID from a passphrase.
 * Used as the user_id in Neon — same passphrase always maps to same profile.
 * @param {string} passphrase
 * @returns {Promise<string>} e.g. "pp_a3f9b2c1d4e5f6..."
 */
export async function passphraseToUserId(passphrase) {
  const hash = await hashPassphrase(passphrase);
  return `pp_${hash.slice(0, 24)}`;
}

/**
 * Validates passphrase format — three lowercase words separated by dashes.
 * @param {string} input
 * @returns {boolean}
 */
export function isValidPassphrase(input) {
  return /^[a-z]+-[a-z]+-[a-z]+$/.test(input.trim().toLowerCase());
}

/**
 * Returns a fun description of the passphrase persona.
 * Shown on the passphrase screen to make the code feel alive.
 * @param {string} passphrase
 * @returns {string}
 */
export function passphrasePersona(passphrase) {
  const parts = passphrase.toLowerCase().split('-');
  if (parts.length !== 3) return 'Your Al Broker agent identity';
  const [adj, noun, role] = parts;

  const adjectiveDesc = {
    atomic: 'nuclear-powered', bismuth: 'crystalline', chromium: 'chrome-plated',
    cobalt: 'cobalt-blue', copper: 'copper-wired', crystalline: 'crystal-matrix',
    electric: 'high-voltage', ferric: 'iron-core', galvanic: 'galvanically charged',
    iridium: 'iridium-alloy', kinetic: 'kinetically driven', magnetic: 'magnetically aligned',
    mercuric: 'mercury-based', molybdenum: 'molybdenum-hardened', nickel: 'nickel-plated',
    osmium: 'osmium-dense', photonic: 'light-speed', plasma: 'plasma-fueled',
    plutonic: 'deep-core', quantum: 'quantum-entangled', radium: 'radium-lit',
    rhodium: 'rhodium-coated', sintered: 'sintered-metal', solar: 'solar-charged',
    solenoid: 'electromagnetically wound', spectral: 'full-spectrum', stochastic: 'probabilistically tuned',
    telluric: 'earth-current', tungsten: 'tungsten-tipped', vanadium: 'vanadium-alloy',
    voltaic: 'voltaic-cell', xenon: 'xenon-lit', zirconium: 'zirconium-shielded',
  }[adj] || adj;

  return `A ${adjectiveDesc} ${noun} ${role} — your personal Al Broker agent`;
}
