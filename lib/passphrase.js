/**
 * Al Broker — Retro Sci-Fi Passphrase Generator
 *
 * Generates memorable three-word passphrases in the format:
 * adjective-noun-descriptor
 *
 * e.g. "quantum-beacon-locked", "stellar-relay-primed", "ionic-transmitter-synced"
 *
 * The passphrase is used as the user's identity token.
 * It maps to a UUID stored in Neon — the passphrase itself is never stored,
 * only a SHA-256 hash of it (to allow lookup without exposing the phrase).
 */

const ADJECTIVES = [
  'atomic', 'binary', 'cosmic', 'crystalline', 'digital',
  'electric', 'galactic', 'ionic', 'kinetic', 'lunar',
  'magnetic', 'nebular', 'orbital', 'photonic', 'plasma',
  'quantum', 'radiant', 'solar', 'stellar', 'synthetic',
  'thermal', 'ultrawave', 'xenon', 'charged', 'frozen',
  'hypersonic', 'infrared', 'molten', 'neutron', 'prismatic',
  'resonant', 'spectral', 'tachyon', 'unstable', 'volatile',
];

const NOUNS = [
  'antenna', 'aperture', 'beacon', 'capsule', 'circuit',
  'conduit', 'coordinate', 'datum', 'frequency', 'habitat',
  'ignition', 'lattice', 'module', 'nebula', 'orbit',
  'payload', 'probe', 'reactor', 'relay', 'satellite',
  'sector', 'signal', 'spectrum', 'trajectory', 'transmitter',
  'vector', 'warp', 'core', 'grid', 'nexus',
  'node', 'portal', 'pulse', 'sequence', 'station',
];

const DESCRIPTORS = [
  'active', 'aligned', 'charted', 'classified', 'decoded',
  'engaged', 'focused', 'linked', 'locked', 'mapped',
  'primed', 'ready', 'scanned', 'synced', 'traced',
  'tuned', 'verified', 'armed', 'calibrated', 'cleared',
  'confirmed', 'docked', 'enabled', 'initiated', 'launched',
  'online', 'patched', 'queued', 'secured', 'transmitted',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a random retro sci-fi passphrase.
 * @returns {string} e.g. "quantum-beacon-locked"
 */
export function generatePassphrase() {
  return `${pick(ADJECTIVES)}-${pick(NOUNS)}-${pick(DESCRIPTORS)}`;
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
 * Derives a deterministic UUID-like ID from a passphrase hash.
 * Used as the user_id in Neon.
 * @param {string} passphrase
 * @returns {Promise<string>} e.g. "pp_a3f9b2c1..."
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
