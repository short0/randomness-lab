import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Beaker, Eye, Layers, RefreshCcw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRESETS } from "@/lib/presets";
import { useLab } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Randomness Lab — Luck vs skill, made visible" },
      { name: "description", content: "Inspect cases, separate luck from skill, see the failures hidden by survivorship bias." },
      { property: "og:title", content: "Randomness Lab — Luck vs skill, made visible" },
      { property: "og:description", content: "Inspect cases, separate luck from skill, and reveal the failures hidden by survivorship bias." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Randomness Lab",
          url: "https://randomness-insight-lab.lovable.app",
          description: "A sandbox for understanding luck vs skill, survivorship bias, and decision quality under uncertainty.",
          publisher: {
            "@type": "Organization",
            name: "Randomness Lab",
            url: "https://randomness-insight-lab.lovable.app",
          },
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const loadPreset = useLab((s) => s.loadPreset);

  const launch = (id: string) => {
    loadPreset(id);
    navigate({ to: "/lab" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <section className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">A sandbox for clearer thinking</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Tell luck from skill.<br />See what survivorship hides.</h1>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Inspired by <em>Fooled by Randomness</em>. Open a case, see the visible outcome,
            then reveal the silent failures and update your judgment.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Button onClick={() => launch("trader")} className="gap-2">
              Try a preset <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" onClick={() => launch("blank")}>Open blank lab</Button>
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Presets</h2>
            <span className="text-xs text-muted-foreground">Click to launch</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => launch(p.id)}
                className="group text-left"
              >
                <Card className="h-full p-5 transition-all hover:border-foreground/20 hover:shadow-[var(--shadow-soft)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <h2 className="mb-5 text-lg font-semibold tracking-tight">How it works</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Eye, label: "1. Review case", text: "Read the case and the visible outcome." },
              { icon: Layers, label: "2. Inspect luck vs skill", text: "See the breakdown and what drove the result." },
              { icon: Beaker, label: "3. Reveal missing data", text: "Compare survivors to the silent failures." },
              { icon: RefreshCcw, label: "4. Update judgment", text: "Adjust confidence and capture the lesson." },
            ].map(({ icon: Icon, label, text }) => (
              <Card key={label} className="p-4">
                <Icon className="size-4 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">{label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          A learning tool. Mocked outputs by default. <Link to="/about" className="underline-offset-4 hover:underline">About</Link>
        </footer>
      </main>
    </div>
  );
}
