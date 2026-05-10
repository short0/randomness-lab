export type Preset = {
  id: string;
  title: string;
  blurb: string;
  case: string;
  outcome: string;
  luckPct: number; // 0-100
  skillPct: number;
  naive: string;
  evidenceAware: string;
  survivors: number;
  total: number;
  missingFailures: string;
  confidenceBefore: number; // 0-100
  confidenceAfter: number;
  lesson: string;
  quickActions: string[];
};

export const PRESETS: Preset[] = [
  {
    id: "trader",
    title: "Star trader with a lucky streak",
    blurb: "Seven straight winning years. Genius — or noise?",
    case: "A trader posts seven consecutive winning years running a leveraged long-volatility book. Investors line up; a magazine cover follows.",
    outcome: "+38% annualized return over 7 years, low reported drawdowns.",
    luckPct: 75,
    skillPct: 25,
    naive: "Seven up years in a row is proof of an edge. Allocate aggressively.",
    evidenceAware: "Out of ~10,000 traders, by chance alone hundreds will post seven up years. Returns came from a strategy that monetizes calm and is short tail risk — the losing year hasn't shown up yet.",
    survivors: 312,
    total: 10000,
    missingFailures: "9,688 traders running similar leveraged books either blew up, capped out, or quietly closed. We never see them in the magazine.",
    confidenceBefore: 80,
    confidenceAfter: 35,
    lesson: "A track record is a sample, not a verdict. Ask what the strategy looks like in the worst 1% of months — not the best 99%.",
    quickActions: ["Explain this result", "Show survivor pool", "Stress test the streak", "Compare naive vs evidence-aware"],
  },
  {
    id: "founder",
    title: "Startup founder success story",
    blurb: "Grit, vision, and 95% peers you never hear from.",
    case: "A founder dropped out, slept in the office, and built a unicorn. The book chronicles the habits that 'made it happen.'",
    outcome: "$2B valuation, 600 employees, glowing press.",
    luckPct: 60,
    skillPct: 40,
    naive: "Copy the habits — sleep less, ship more, ignore advice. Unicorn awaits.",
    evidenceAware: "Of founders who shared the same habits and timing, the vast majority quietly shut down. Habits look causal only because we sample on the survivors.",
    survivors: 1,
    total: 2000,
    missingFailures: "1,999 cohort founders with similar grit, similar markets, similar pitches — most ran out of cash within 4 years. None wrote books.",
    confidenceBefore: 75,
    confidenceAfter: 40,
    lesson: "Process beats outcome as evidence. Judge the decision at the time it was made, not the result it happened to produce.",
    quickActions: ["Explain this result", "Show the failed cohort", "Outcome quality vs decision quality", "Compare naive vs evidence-aware"],
  },
  {
    id: "fitness",
    title: "Fitness influencer routine",
    blurb: "Their genes work harder than their workout.",
    case: "An influencer credits a 4-day split and a strict diet for visible abs and viral reach.",
    outcome: "1.2M followers, brand deals, before/after photos.",
    luckPct: 65,
    skillPct: 35,
    naive: "Follow the routine, get the body and the audience.",
    evidenceAware: "Selection on genetics, age, lighting, and a platform algorithm that surfaces a tiny fraction. The routine is plausibly fine; the result is mostly not the routine.",
    survivors: 1,
    total: 50000,
    missingFailures: "50,000 people running similar routines see modest changes and no audience. They don't post a montage.",
    confidenceBefore: 70,
    confidenceAfter: 30,
    lesson: "When the visible winners share a trait, ask whether the trait or the selection did the work.",
    quickActions: ["Explain this result", "Estimate the silent majority", "Compare naive vs evidence-aware", "What would change my mind?"],
  },
  {
    id: "fund",
    title: "Fund manager track record",
    blurb: "Alpha, or just beta in a costume?",
    case: "A long-only equity fund beats the S&P by 4% per year for a decade. The pitch deck calls it 'consistent alpha.'",
    outcome: "10-year CAGR 14% vs benchmark 10%.",
    luckPct: 55,
    skillPct: 45,
    naive: "Skill is real and persistent. Subscribe.",
    evidenceAware: "After adjusting for size, value, and momentum factor exposure, alpha shrinks to ~0.6% — within noise. The 'edge' was mostly factor tilts that paid this decade.",
    survivors: 84,
    total: 2400,
    missingFailures: "Hundreds of funds with similar tilts underperformed and were merged or liquidated. Indexes don't include the dead.",
    confidenceBefore: 78,
    confidenceAfter: 45,
    lesson: "Decompose the return before celebrating it. Persistent alpha is rare; persistent factor exposure is common.",
    quickActions: ["Explain this result", "Decompose the alpha", "Show closed funds", "Compare naive vs evidence-aware"],
  },
];

export const BLANK_CASE: Preset = {
  id: "blank",
  title: "Blank lab",
  blurb: "Your own case",
  case: "",
  outcome: "",
  luckPct: 50,
  skillPct: 50,
  naive: "",
  evidenceAware: "",
  survivors: 0,
  total: 0,
  missingFailures: "",
  confidenceBefore: 50,
  confidenceAfter: 50,
  lesson: "",
  quickActions: ["Explain this result", "Compare naive vs evidence-aware"],
};
