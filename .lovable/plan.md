## Randomness Lab — Build Plan

A calm, minimalist single-page web app that teaches luck vs skill, survivorship bias, and decision quality through interactive case studies. Mocked-first, fully responsive, persisted via localStorage.

### Routes

- `/` — Home (hero, presets, "How it works", CTA)
- `/lab` — 3-panel lab (preset/input · case+analysis · journal/lessons)
- `/about` — Brief explanation of concepts and inspiration

Each route gets unique `head()` metadata (title, description, og tags).

### Information architecture

**Home**
- Hero: one-line tagline + 2-sentence explainer
- 4 preset cards (launch directly into `/lab` with that preset)
- "How it works" — 4 steps: Review case → Inspect luck vs skill → Reveal missing data → Update judgment
- CTAs: "Try a preset" / "Open blank lab"

**Lab (`/lab`)**
- Left panel: preset selector, case input (title + description textarea), mode toggle (Mocked / Live), settings (sample size, noise level for mocked analyses)
- Center panel (tabs on mobile, stacked sections on desktop):
  - Case view (case + observed outcome)
  - Luck vs Skill breakdown (split bar + commentary)
  - Survivorship bias comparison ("What you see" vs "What's missing" — naive vs evidence-aware interpretation side by side)
- Right panel: Decision journal (notes), Confidence slider (before/after), Lessons learned list, "What changed" summary
- Top bar: Undo, Redo, Reset, Theme toggle, Mode badge ("Simulated" vs "Live")

**Responsive behavior**
- Desktop ≥1024px: 3-panel grid (280px / 1fr / 340px)
- Tablet 640–1024px: left panel collapses to a Sheet drawer; center + right stacked
- Mobile <640px: vertical stack with sticky top action bar; panels become accordions/tabs

### Presets (preloaded, all mocked)

1. **Star trader with a lucky streak** — 7 winning years, leverage, no risk-adjusted analysis
2. **Startup founder success story** — narrative of grit; ignores 95% of peers who failed
3. **Fitness influencer routine** — survivorship of genetics + selection
4. **Fund manager track record** — alpha vs beta, factor exposure

Each preset ships with: case text, observed outcome, luck/skill split, missing-failures view, confidence update, lesson summary, and 3–5 quick action chips ("Explain this result", "Compare naive vs evidence-aware", "Stress test the streak", "Show survivor pool").

### Learning features

- Inline labels (small badges) on Case / Outcome / Luck / Skill / Bias / Missing data / Confidence / Lesson
- "Explain this result" expands a plain-language paragraph
- Naive vs evidence-aware comparison rendered as two cards side by side
- Glossary tooltips on key terms

### State & persistence

Single Zustand store with `temporal` middleware (zundo) for undo/redo. Persisted to localStorage:
- `theme`, `mode` (mocked/live), `selectedPresetId`, `currentCase`, `journalNotes`, `confidenceBefore/After`, `lessons[]`, `recentCases[]`

Undo/redo tracks: preset change, case edits, replay/regenerate, setting changes, session clear. Reset returns to Home without wiping built-in presets.

### Mocked analysis engine

Pure TypeScript module `src/lib/mock-analysis.ts`:
- Deterministic per-case (seeded by case id) so re-runs are stable
- Generates luck/skill split, survivor counts, counterfactual outcomes, naive vs evidence-aware text
- Settings (sample size, noise) tweak outputs visibly

### Optional Live mode

Toggle in settings. When enabled, shows a "Live" badge and routes the analysis call through a server function (`src/lib/analysis.functions.ts`) using Lovable AI Gateway. Falls back to mocked on error. **Not enabled in v1 build** — UI affordance present, but behind a "Coming soon" state unless the user asks to wire it up. Mocked remains the polished default.

### Design system

Edits to `src/styles.css` only — keep oklch tokens, refine to a calm neutral palette:
- Light: near-white bg, soft ink foreground, single muted accent (subtle blue-gray)
- Dark: deep neutral bg, off-white foreground, same accent shifted
- Soft shadows (`--shadow-soft`), generous spacing scale, Inter via system fallback
- All components use semantic tokens — no hardcoded colors

### Accessibility

- All interactive elements are buttons/links with visible focus rings (`ring-ring`)
- Keyboard shortcuts: `⌘Z` undo, `⌘⇧Z` redo, `⌘.` reset, `T` theme toggle
- AA contrast verified in both themes
- 44px min tap targets on mobile

### Technical details

- TanStack Start file-based routes; no auth, no backend in v1
- shadcn components: Button, Card, Tabs, Sheet, Slider, Textarea, Badge, Tooltip, Accordion, DropdownMenu, Switch
- Theme toggle via `next-themes`-style class on `<html>` (custom hook, no extra dep needed) persisted in localStorage
- Undo/redo via `zundo` (small zustand temporal middleware) — `bun add zustand zundo`
- Icons from `lucide-react` (already available)
- Charts: lightweight inline SVG bars for luck/skill split (no chart lib needed)

### File plan

```
src/
  routes/
    index.tsx              Home
    lab.tsx                Lab (3-panel)
    about.tsx              About
  components/
    layout/Header.tsx      Nav + theme toggle + mode badge
    layout/Footer.tsx
    home/Hero.tsx
    home/PresetGrid.tsx
    home/HowItWorks.tsx
    lab/LeftPanel.tsx
    lab/CenterPanel.tsx
    lab/RightPanel.tsx
    lab/CaseView.tsx
    lab/LuckSkillBreakdown.tsx
    lab/SurvivorshipCompare.tsx
    lab/DecisionJournal.tsx
    lab/ConfidenceSlider.tsx
    lab/ActionBar.tsx      Undo/Redo/Reset
    lab/ModeBadge.tsx
    common/InlineLabel.tsx
    common/GlossaryTooltip.tsx
    theme/ThemeToggle.tsx
  lib/
    presets.ts             4 preloaded presets
    mock-analysis.ts       Deterministic mocked engine
    store.ts               Zustand + zundo + persist
    theme.ts               Theme hook
    analysis.functions.ts  (stub for optional live mode)
  styles.css               Refined tokens
```

### Out of scope for v1

- Live LLM wiring (UI placeholder only)
- Auth, cloud sync, sharing
- Custom preset creation beyond the blank lab

Ready to build on approval.