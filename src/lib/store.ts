import { create } from "zustand";
import { temporal } from "zundo";
import { persist } from "zustand/middleware";
import { PRESETS, BLANK_CASE, type Preset } from "./presets";

export type Mode = "mocked" | "live";

export type LabState = {
  selectedPresetId: string;
  caseText: string;
  outcome: string;
  luckPct: number;
  skillPct: number;
  naive: string;
  evidenceAware: string;
  survivors: number;
  total: number;
  missingFailures: string;
  confidenceBefore: number;
  confidenceAfter: number;
  lesson: string;
  notes: string;
  mode: Mode;
  sampleSize: number;
  noise: number;
};

type Actions = {
  loadPreset: (id: string) => void;
  setCase: (text: string) => void;
  setOutcome: (text: string) => void;
  setNotes: (text: string) => void;
  setMode: (m: Mode) => void;
  setSampleSize: (n: number) => void;
  setNoise: (n: number) => void;
  setConfidenceBefore: (n: number) => void;
  setConfidenceAfter: (n: number) => void;
  applyAnalysis: (a: {
    luckPct: number;
    skillPct: number;
    survivors: number;
    total: number;
    naive: string;
    evidenceAware: string;
    missingFailures: string;
    lesson: string;
  }) => void;
  resetSession: () => void;
};

const presetToState = (p: Preset): LabState => ({
  selectedPresetId: p.id,
  caseText: p.case,
  outcome: p.outcome,
  luckPct: p.luckPct,
  skillPct: p.skillPct,
  naive: p.naive,
  evidenceAware: p.evidenceAware,
  survivors: p.survivors,
  total: p.total,
  missingFailures: p.missingFailures,
  confidenceBefore: p.confidenceBefore,
  confidenceAfter: p.confidenceAfter,
  lesson: p.lesson,
  notes: "",
  mode: "mocked",
  sampleSize: 10000,
  noise: 20,
});

const initial: LabState = presetToState(PRESETS[0]);

export const useLab = create<LabState & Actions>()(
  persist(
    temporal(
      (set) => ({
        ...initial,
        loadPreset: (id) => {
          const p = id === "blank" ? BLANK_CASE : PRESETS.find((x) => x.id === id) || PRESETS[0];
          set({ ...presetToState(p), mode: "mocked" });
        },
        setCase: (caseText) => set({ caseText }),
        setOutcome: (outcome) => set({ outcome }),
        setNotes: (notes) => set({ notes }),
        setMode: (mode) => set({ mode }),
        setSampleSize: (sampleSize) => set({ sampleSize }),
        setNoise: (noise) => set({ noise }),
        setConfidenceBefore: (confidenceBefore) => set({ confidenceBefore }),
        setConfidenceAfter: (confidenceAfter) => set({ confidenceAfter }),
        applyAnalysis: (a) => set({ ...a }),
        resetSession: () => set({ ...initial }),
      }),
      {
        partialize: (s) => {
          const { ...rest } = s as LabState & Actions;
          // Strip actions from history snapshots
          const {
            loadPreset, setCase, setOutcome, setNotes, setMode, setSampleSize,
            setNoise, setConfidenceBefore, setConfidenceAfter, applyAnalysis, resetSession,
            ...data
          } = rest as any;
          return data;
        },
        limit: 50,
      },
    ),
    {
      name: "randomness-lab-state",
      partialize: (s) => ({
        selectedPresetId: s.selectedPresetId,
        caseText: s.caseText,
        outcome: s.outcome,
        luckPct: s.luckPct,
        skillPct: s.skillPct,
        naive: s.naive,
        evidenceAware: s.evidenceAware,
        survivors: s.survivors,
        total: s.total,
        missingFailures: s.missingFailures,
        confidenceBefore: s.confidenceBefore,
        confidenceAfter: s.confidenceAfter,
        lesson: s.lesson,
        notes: s.notes,
        mode: s.mode,
        sampleSize: s.sampleSize,
        noise: s.noise,
      }),
    },
  ),
);
