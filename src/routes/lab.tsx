import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import {
  Undo2, Redo2, Home, RefreshCcw, Sparkles, Lightbulb, Settings2,
  ChevronDown,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { InlineLabel } from "@/components/common/InlineLabel";
import { PRESETS } from "@/lib/presets";
import { useLab } from "@/lib/store";
import { analyzeCase } from "@/lib/mock-analysis";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Lab — Randomness Lab" },
      { name: "description", content: "Inspect a case, separate luck from skill, and update your judgment." },
      { property: "og:title", content: "Randomness Lab — Lab" },
      { property: "og:description", content: "Interactive luck vs skill analysis." },
    ],
  }),
  component: Lab,
});

function useTemporal() {
  const temporal = (useLab as any).temporal;
  const state = useStore(temporal);
  return {
    undo: () => temporal.getState().undo(),
    redo: () => temporal.getState().redo(),
    pastStates: state.pastStates as unknown[],
    futureStates: state.futureStates as unknown[],
  };
}

function Lab() {
  const navigate = useNavigate();
  const s = useLab();
  const t = useTemporal();
  const [explainOpen, setExplainOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); t.undo(); }
      else if (meta && (e.key.toLowerCase() === "z" && e.shiftKey || e.key.toLowerCase() === "y")) { e.preventDefault(); t.redo(); }
      else if (meta && e.key === ".") { e.preventDefault(); s.resetSession(); navigate({ to: "/" }); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [t, s, navigate]);

  const replay = () => {
    const a = analyzeCase(s.caseText, s.outcome, { sampleSize: s.sampleSize, noise: s.noise });
    s.applyAnalysis(a);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ActionBar
        onUndo={t.undo} onRedo={t.redo}
        canUndo={t.pastStates.length > 0} canRedo={t.futureStates.length > 0}
        onReset={() => { s.resetSession(); navigate({ to: "/" }); }}
        mode={s.mode}
      />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Mobile drawer for left panel */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings2 className="size-4" /> Case & settings
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto p-4">
              <SheetHeader><SheetTitle>Case & settings</SheetTitle></SheetHeader>
              <div className="mt-4"><LeftPanel /></div>
            </SheetContent>
          </Sheet>
          <Button variant="outline" size="sm" onClick={replay} className="gap-2">
            <Sparkles className="size-4" /> Replay
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr_340px]">
          <aside className="hidden lg:block">
            <LeftPanel />
          </aside>
          <section>
            <CenterPanel onExplain={() => setExplainOpen(true)} explainOpen={explainOpen} onReplay={replay} />
          </section>
          <aside>
            <RightPanel />
          </aside>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          ⌘Z undo · ⌘⇧Z redo · ⌘. reset
        </p>
      </div>
    </div>
  );
}

function ActionBar({ onUndo, onRedo, canUndo, canRedo, onReset, mode }: {
  onUndo: () => void; onRedo: () => void; canUndo: boolean; canRedo: boolean;
  onReset: () => void; mode: "mocked" | "live";
}) {
  return (
    <div className="sticky top-14 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} className="gap-1.5">
            <Undo2 className="size-4" /> <span className="hidden sm:inline">Undo</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo} className="gap-1.5">
            <Redo2 className="size-4" /> <span className="hidden sm:inline">Redo</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
            <Home className="size-4" /> <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
        <Badge variant={mode === "live" ? "default" : "secondary"} className="gap-1.5">
          <span className={cn("size-1.5 rounded-full", mode === "live" ? "bg-green-500" : "bg-muted-foreground")} />
          {mode === "live" ? "Live" : "Simulated"}
        </Badge>
      </div>
    </div>
  );
}

function LeftPanel() {
  const s = useLab();
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Preset</Label>
        <div className="mt-2 grid gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => s.loadPreset(p.id)}
              className={cn(
                "rounded-md border border-transparent px-2.5 py-1.5 text-left text-sm transition-colors",
                s.selectedPresetId === p.id
                  ? "border-border bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {p.title}
            </button>
          ))}
          <button
            onClick={() => s.loadPreset("blank")}
            className={cn(
              "rounded-md border border-transparent px-2.5 py-1.5 text-left text-sm transition-colors",
              s.selectedPresetId === "blank"
                ? "border-border bg-accent text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            Blank lab
          </button>
        </div>
      </Card>

      <Card className="p-4">
        <Label htmlFor="case" className="text-xs uppercase tracking-wider text-muted-foreground">Case</Label>
        <Textarea
          id="case"
          value={s.caseText}
          onChange={(e) => s.setCase(e.target.value)}
          rows={4}
          placeholder="Describe the situation…"
          className="mt-2 resize-none"
        />
        <Label htmlFor="outcome" className="mt-3 block text-xs uppercase tracking-wider text-muted-foreground">Outcome</Label>
        <Textarea
          id="outcome"
          value={s.outcome}
          onChange={(e) => s.setOutcome(e.target.value)}
          rows={2}
          placeholder="What was observed?"
          className="mt-2 resize-none"
        />
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Mode</Label>
          <Switch checked={s.mode === "live"} onCheckedChange={(v) => s.setMode(v ? "live" : "mocked")} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {s.mode === "live" ? "Live LLM mode (preview, falls back to mocked)." : "Mocked output. Instant, deterministic."}
        </p>
      </Card>

      <Card className="p-4">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Settings</Label>
        <div className="mt-3 space-y-4">
          <div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Sample size</span><span>{s.sampleSize.toLocaleString()}</span></div>
            <Slider min={500} max={50000} step={500} value={[s.sampleSize]} onValueChange={(v) => s.setSampleSize(v[0])} className="mt-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Noise</span><span>{s.noise}</span></div>
            <Slider min={0} max={50} step={1} value={[s.noise]} onValueChange={(v) => s.setNoise(v[0])} className="mt-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function CenterPanel({ onExplain, explainOpen, onReplay }: { onExplain: () => void; explainOpen: boolean; onReplay: () => void }) {
  const s = useLab();
  const preset = useMemo(() => PRESETS.find((p) => p.id === s.selectedPresetId), [s.selectedPresetId]);
  const visiblePct = s.total > 0 ? Math.round((s.survivors / s.total) * 1000) / 10 : 0;

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <InlineLabel>Case</InlineLabel>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              {preset?.title ?? "Custom case"}
            </h2>
          </div>
          <Button variant="outline" size="sm" onClick={onReplay} className="gap-1.5 hidden sm:inline-flex">
            <Sparkles className="size-4" /> Replay
          </Button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.caseText || "No case yet — fill in the left panel."}</p>
        <div className="mt-4 rounded-md border border-border/60 bg-muted/40 p-3">
          <InlineLabel>Outcome</InlineLabel>
          <p className="mt-1.5 text-sm">{s.outcome || "—"}</p>
        </div>

        {preset && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {preset.quickActions.map((q) => (
              <button
                key={q}
                onClick={() => q.toLowerCase().includes("explain") ? onExplain() : onReplay()}
                className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <InlineLabel>Luck</InlineLabel><InlineLabel>Skill</InlineLabel>
          </div>
          <span className="text-xs text-muted-foreground">Estimated split</span>
        </div>
        <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full border border-border/60">
          <div className="h-full" style={{ width: `${s.luckPct}%`, backgroundColor: "var(--color-luck)" }} />
          <div className="h-full" style={{ width: `${s.skillPct}%`, backgroundColor: "var(--color-skill)" }} />
        </div>
        <div className="mt-2 flex justify-between text-xs">
          <span><span className="inline-block size-2 rounded-full align-middle" style={{ backgroundColor: "var(--color-luck)" }} /> Luck {s.luckPct}%</span>
          <span><span className="inline-block size-2 rounded-full align-middle" style={{ backgroundColor: "var(--color-skill)" }} /> Skill {s.skillPct}%</span>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <InlineLabel>Survivorship bias</InlineLabel>
          <span className="text-xs text-muted-foreground">{s.survivors.toLocaleString()} of {s.total.toLocaleString()} visible · {visiblePct}%</span>
        </div>
        <Tabs defaultValue="naive" className="mt-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="naive">Naive view</TabsTrigger>
            <TabsTrigger value="aware">Evidence-aware</TabsTrigger>
          </TabsList>
          <TabsContent value="naive" className="mt-3">
            <p className="text-sm leading-relaxed text-muted-foreground">{s.naive || "—"}</p>
          </TabsContent>
          <TabsContent value="aware" className="mt-3">
            <p className="text-sm leading-relaxed">{s.evidenceAware || "—"}</p>
            <div className="mt-3 rounded-md border border-border/60 bg-muted/40 p-3">
              <InlineLabel>Missing data</InlineLabel>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.missingFailures || "—"}</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {explainOpen && (
        <Card className="border-foreground/20 p-5">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-foreground" />
            <h3 className="font-medium">Explain this result</h3>
          </div>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>The visible outcome is one path. The same case, replayed across {s.total.toLocaleString()} similar attempts, would produce many paths — most of which we don't see.</p>
            <p><span className="text-foreground">Outcome quality</span> is what happened. <span className="text-foreground">Decision quality</span> is whether the choice made sense given what was knowable at the time. They can disagree.</p>
            <p>The luck/skill split estimates how much of the result is reproducible (skill) vs path-dependent (luck), conditioned on the case description.</p>
          </div>
        </Card>
      )}
    </div>
  );
}

function RightPanel() {
  const s = useLab();
  const delta = s.confidenceAfter - s.confidenceBefore;
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label htmlFor="notes" className="text-xs uppercase tracking-wider text-muted-foreground">Decision journal</Label>
        <Textarea
          id="notes"
          value={s.notes}
          onChange={(e) => s.setNotes(e.target.value)}
          rows={5}
          placeholder="What's your read? What would change your mind?"
          className="mt-2 resize-none"
        />
      </Card>

      <Card className="p-4">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confidence</Label>
        <div className="mt-3 space-y-4">
          <div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Before</span><span>{s.confidenceBefore}%</span></div>
            <Slider min={0} max={100} step={1} value={[s.confidenceBefore]} onValueChange={(v) => s.setConfidenceBefore(v[0])} className="mt-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">After</span><span>{s.confidenceAfter}%</span></div>
            <Slider min={0} max={100} step={1} value={[s.confidenceAfter]} onValueChange={(v) => s.setConfidenceAfter(v[0])} className="mt-2" />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs">
            <span className="text-muted-foreground">What changed</span>
            <span className={cn("font-medium", delta < 0 ? "text-amber-600 dark:text-amber-400" : delta > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
              {delta > 0 ? "+" : ""}{delta} pts
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <InlineLabel>Lesson</InlineLabel>
        <p className="mt-2 text-sm leading-relaxed">{s.lesson || "—"}</p>
      </Card>
    </div>
  );
}
