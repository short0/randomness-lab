import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Randomness Lab" },
      { name: "description", content: "What Randomness Lab is and how to use it." },
      { property: "og:title", content: "About Randomness Lab" },
      { property: "og:description", content: "A teaching tool for luck, skill, and survivorship bias." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Randomness Lab is an interactive sandbox for thinking more clearly about luck,
            skill, survivorship bias, and decision quality under uncertainty.
          </p>
          <p>
            <span className="text-foreground">Outcome quality vs decision quality:</span> A
            decision can be good even when the outcome is bad — and vice versa. We tend
            to judge decisions by their results, which is exactly when randomness fools us.
          </p>
          <p>
            <span className="text-foreground">Survivorship bias:</span> We mostly see the
            winners. The silent population of failures, drop-outs, and dead funds is the
            evidence that would change our minds — if we could see it.
          </p>
          <p>
            All analyses in this app are <span className="text-foreground">mocked by default</span> so
            it works instantly with no setup. An optional live mode is reserved for later.
          </p>
          <p>
            <Link to="/" className="underline-offset-4 hover:underline">← Home</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
