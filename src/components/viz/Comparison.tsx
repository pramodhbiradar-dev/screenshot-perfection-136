import { useState } from "react";
import { mergeSortMeasure, parseNumbers, quickSortMeasure, randomArray } from "@/lib/algorithms";
import { Btn, Panel } from "./ui";

type M = ReturnType<typeof mergeSortMeasure>;

export function Comparison() {
  const [size, setSize] = useState(1000);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [res, setRes] = useState<{ m: M; q: M; n: number } | null>(null);

  const run = () => {
    let a: number[];
    if (text.trim()) {
      const r = parseNumbers(text.replace(/\s+/g, " "));
      if (!r.ok && !r.error.startsWith("That's")) return setError(r.error);
      a = r.ok ? r.values : text.split(/[\s,]+/).filter(Boolean).map(Number);
      if (a.some((v) => !Number.isFinite(v))) return setError("Please enter valid numbers separated by commas.");
    } else a = randomArray(size, 1, 10000);
    setError("");
    setRes({ m: mergeSortMeasure(a), q: quickSortMeasure(a), n: a.length });
  };

  const rows: [string, (x: M) => string | number][] = [
    ["Execution Time", (x) => `${x.time.toFixed(3)} ms`],
    ["Comparisons", (x) => x.comparisons],
    ["Steps", (x) => x.steps],
    ["Swaps / Moves", (x) => x.moves],
  ];
  const chart: [string, (x: M) => number][] = [["Execution Time", (x) => x.time], ["Comparisons", (x) => x.comparisons], ["Steps", (x) => x.steps]];

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-wrap items-end gap-4">
          <div><label className="label">Random array size: {size}</label><input type="range" min={10} max={20000} step={10} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-3 block w-56 accent-primary" /></div>
          <div className="min-w-60 flex-1"><label className="label">…or your own numbers (optional)</label><input value={text} onChange={(e) => setText(e.target.value)} className="field mt-1.5 w-full" placeholder="38, 12, 27, 43, 9" /></div>
          <Btn variant="primary" onClick={run}>Run Comparison</Btn>
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <p className="mt-3 text-xs text-muted-foreground">Both algorithms run on the exact same input. Measurements are real; browser timing can vary between runs.</p>
      </Panel>

      {res && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground"><th className="py-2 font-medium">Metric</th><th className="font-medium text-merge">Merge Sort</th><th className="font-medium text-quick">Quick Sort</th></tr></thead>
              <tbody className="font-mono">
                {rows.map(([k, fn]) => (
                  <tr key={k} className="border-b border-border/50"><td className="py-2.5 font-sans">{k}</td><td>{fn(res.m)}</td><td>{fn(res.q)}</td></tr>
                ))}
                <tr><td className="py-2.5 font-sans">Array Size</td><td>{res.n}</td><td>{res.n}</td></tr>
              </tbody>
            </table>
          </Panel>
          <Panel className="space-y-5">
            {chart.map(([k, fn]) => {
              const a = fn(res.m), b = fn(res.q), mx = Math.max(a, b, 1e-9);
              return (
                <div key={k}>
                  <div className="label mb-2">{k}</div>
                  {([["Merge", a, "bg-merge"], ["Quick", b, "bg-quick"]] as const).map(([n, v, c]) => (
                    <div key={n} className="mb-1.5 flex items-center gap-2 text-xs" title={`${n}: ${v}`}>
                      <span className="w-12 text-muted-foreground">{n}</span>
                      <div className="h-5 flex-1 rounded bg-muted"><div className={`h-full rounded ${c} transition-all duration-700`} style={{ width: `${(v / mx) * 100}%` }} /></div>
                      <span className="w-20 text-right font-mono">{k === "Execution Time" ? v.toFixed(2) + "ms" : v}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </Panel>
        </div>
      )}
    </div>
  );
}
