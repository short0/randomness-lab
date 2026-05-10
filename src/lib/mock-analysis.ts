// Deterministic seeded mock analysis.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rand(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export type Analysis = {
  luckPct: number;
  skillPct: number;
  survivors: number;
  total: number;
  naive: string;
  evidenceAware: string;
  missingFailures: string;
  lesson: string;
};

export function analyzeCase(
  caseText: string,
  outcome: string,
  settings: { sampleSize: number; noise: number },
): Analysis {
  const r = rand(hash(caseText + "|" + outcome + "|" + settings.sampleSize));
  const baseLuck = 45 + Math.floor(r() * 35);
  const noiseSwing = Math.floor((r() - 0.5) * settings.noise);
  const luckPct = Math.min(95, Math.max(5, baseLuck + noiseSwing));
  const skillPct = 100 - luckPct;
  const total = settings.sampleSize;
  const survivors = Math.max(1, Math.floor(total * (0.002 + r() * 0.05)));
  return {
    luckPct,
    skillPct,
    survivors,
    total,
    naive: "On the surface, the outcome looks like proof the approach works — copy and repeat.",
    evidenceAware: `Once you account for the silent population (~${total - survivors} similar attempts that didn't survive to be observed), the visible result is largely consistent with chance plus some skill.`,
    missingFailures: `Approximately ${total - survivors} comparable cases did not reach a visible outcome. They were never sampled.`,
    lesson: "Judge the decision under the information available at the time, not by the outcome you happened to observe.",
  };
}
