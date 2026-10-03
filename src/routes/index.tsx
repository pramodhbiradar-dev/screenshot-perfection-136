import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SortingVisualizer } from "@/components/viz/SortingVisualizer";
import { SearchVisualizer } from "@/components/viz/SearchVisualizer";
import { Comparison } from "@/components/viz/Comparison";
import { About } from "@/components/viz/About";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sorting & Searching Visualizer — Learn DAA step by step" },
      { name: "description", content: "Interactive Merge Sort, Quick Sort and Binary Search visualizer with step mode, live stats and algorithm comparison." },
      { property: "og:title", content: "Sorting & Searching Visualizer" },
      { property: "og:description", content: "Explore Merge Sort, Quick Sort and Binary Search step-by-step." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TABS = [["sort", "Sorting Visualizer"], ["search", "Searching Visualizer"], ["compare", "Algorithm Comparison"], ["about", "About Algorithms"]] as const;
type Tab = (typeof TABS)[number][0];

function Index() {
  const [tab, setTab] = useState<Tab>("sort");
  const [light, setLight] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("light", light); }, [light]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 items-end gap-0.5">{[40, 70, 55, 100].map((h, i) => <span key={i} className="w-1.5 rounded-sm bg-primary" style={{ height: `${h}%` }} />)}</div>
            <span className="font-display font-semibold">Sorting & Searching Visualizer</span>
          </div>
          <button onClick={() => setLight((l) => !l)} className="btn btn-ghost" title="Toggle theme">{light ? "☾ Dark" : "☀ Light"}</button>
        </div>
      </header>

      <section className="hero">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">DAA · Interactive learning tool</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">Sorting & Searching Visualizer</h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">Explore algorithms step-by-step and understand how they work.</p>
          <a href="#viz" className="btn btn-primary mt-7 inline-flex">Start Visualizing ↓</a>
        </div>
      </section>

      <main id="viz" className="mx-auto max-w-6xl scroll-mt-16 px-4 pb-16">
        <nav className="tabs">
          {TABS.map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`tab ${tab === k ? "tab-active" : ""}`}>{label}</button>
          ))}
        </nav>
        <div className="mt-6 animate-fade-in" key={tab}>
          {tab === "sort" && <SortingVisualizer />}
          {tab === "search" && <SearchVisualizer />}
          {tab === "compare" && <Comparison />}
          {tab === "about" && <About />}
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">DAA Interactive Learning Tool · Built with HTML, CSS & JavaScript</footer>
    </div>
  );
}
