// A friendlier take on passwords. Instead of inventing something hard to
// remember, we offer two delightful, secure options:
//   1. A memorable word passphrase  →  "amber-otter-maple-74"
//   2. An emoji passcode            →  "🌙🚀🎧🔥"
// Both are stored hashed exactly like any other password.

const ADJECTIVES = [
  "amber", "brisk", "calm", "clever", "cosmic", "crimson", "dapper", "eager",
  "fuzzy", "gentle", "golden", "happy", "humble", "ivory", "jolly", "keen",
  "lucky", "lunar", "mellow", "nimble", "noble", "olive", "plucky", "quiet",
  "rapid", "rustic", "sage", "scarlet", "silver", "snug", "solar", "spry",
  "sturdy", "sunny", "swift", "teal", "tidy", "velvet", "vivid", "witty",
];

const NOUNS = [
  "otter", "maple", "comet", "harbor", "falcon", "willow", "ember", "river",
  "cedar", "lynx", "meadow", "quartz", "raven", "summit", "thicket", "tundra",
  "anchor", "beacon", "cobble", "dune", "fjord", "glade", "heron", "isle",
  "kelp", "lantern", "marsh", "nectar", "orchard", "pebble", "reef", "spruce",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// e.g. "amber-otter-maple-74" — three words plus two digits.
export function generatePassphrase(): string {
  const a = pick(ADJECTIVES);
  const b = pick(NOUNS);
  const c = pick(NOUNS.filter((n) => n !== b));
  const n = Math.floor(Math.random() * 90) + 10;
  return `${a}-${b}-${c}-${n}`;
}

export const EMOJI_PALETTE = [
  "🌙", "🚀", "🎧", "🔥", "🌊", "🍕", "⚡", "🎲",
  "🪐", "🦊", "🌵", "🎸", "🧠", "🪄", "🛰️", "🍀",
  "👾", "🦉", "🌈", "🧩", "🎯", "🦄", "🍩", "🗝️",
];

// An emoji passcode is just a string of emoji used as the password value.
export function isEmojiPasscode(value: string): boolean {
  // Heuristic: contains at least one emoji and no spaces.
  return /\p{Extended_Pictographic}/u.test(value) && !/\s/.test(value);
}

export function passwordStrengthHint(value: string): string {
  if (!value) return "";
  if (isEmojiPasscode(value)) {
    const count = [...value.match(/\p{Extended_Pictographic}/gu) ?? []].length;
    if (count < 4) return "Pick at least 4 emoji for a strong passcode.";
    return "Nice emoji passcode 🔐";
  }
  if (value.length < 8) return "A little short — aim for 8+ characters.";
  if (value.includes("-") && value.split("-").length >= 3)
    return "Great — a memorable passphrase.";
  return "Looks good.";
}
