// Memorable passphrase generator — three words and two digits.
// e.g. "amber-otter-maple-74"

const WORDS = [
  "amber","birch","brisk","calm","cedar","cobalt","cosmic","crisp","dune","eager",
  "ember","fern","fjord","flint","frost","glade","golden","grove","haven","heron",
  "humble","ivory","jade","jolly","keen","lantern","lucid","lunar","marble","meadow",
  "mellow","nimble","noble","north","ocean","olive","orbit","pebble","pine","plum",
  "quartz","quiet","rapid","reef","ridge","rustic","sage","scarlet","silver","slate",
  "solar","spry","summit","swift","teal","thatch","tidal","timber","velvet","vivid",
  "willow","winter","witty","zenith",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generatePassphrase(): string {
  const a = pick(WORDS);
  const b = pick(WORDS.filter(w => w !== a));
  const c = pick(WORDS.filter(w => w !== a && w !== b));
  const n = Math.floor(Math.random() * 90) + 10;
  return `${a}-${b}-${c}-${n}`;
}

export function passwordHint(value: string): string {
  if (!value) return "";
  if (value.length < 6) return "A bit short — aim for 6 or more characters.";
  if (value.includes("-") && value.split("-").length >= 3) return "Nice passphrase — easy to remember.";
  return "";
}
