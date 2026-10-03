import { INFO } from "@/lib/algo-info";
import { Complexity, Panel } from "./ui";

const CURVES: [string, (n: number) => number, string][] = [
  ["O(1)", () => 1, "var(--sorted)"],
  ["O(log n)", (n) => Math.log2(n), "var(--merge)"],
  ["O(n)", (n) => n, "var(--compare)"],
  ["O(n log n)", (n) => n * Math.log2(n), "var(--pivot)"],
  ["O(n²)", (n) => n * n, "var(--swap)"],
];

export function About() {
  const W = 400, H = 220, N = 20, maxY = 120;
  const path = (fn: (n: number) => number) =>
    Array.from({ length: N }, (_, i) => i + 1).map((n, i) => `${i ? "L" : "M"}${(n / N) * W},${H - Math.min(fn(n) / maxY, 1) * H}`).join(" ");
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-3">
        {Object.values(INFO).map((d) => (
          <Panel key={d.name}>
            <h3 className="font-display text-lg font-semibold">{d.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d.what}</p>
            <div className="mt-4"><Complexity rows={d.complexity} /></div>
            <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">💡 {d.analogy}</p>
          </Panel>
        ))}
      </div>
      <Panel>
        <h3 className="font-display text-lg font-semibold">How running time grows</h3>
        <p className="mt-1 text-sm text-muted-foreground">Operations needed as input size n grows (n = 1 to 20). Lower curves scale better.</p>
        <div className="mt-4 grid items-center gap-6 md:grid-cols-[1fr_200px]">
          <svg viewBox={`-10 -10 ${W + 20} ${H + 30}`} className="w-full">
            <line x1={0} y1={H} x2={W} y2={H} stroke="var(--border)" />
            <line x1={0} y1={0} x2={0} y2={H} stroke="var(--border)" />
            {CURVES.map(([k, fn, c]) => <path key={k} d={path(fn)} fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" />)}
            <text x={W} y={H + 18} textAnchor="end" fontSize="11" fill="var(--muted-foreground)">input size n →</text>
          </svg>
          <ul className="space-y-2 text-sm">
            {CURVES.map(([k, , c]) => <li key={k} className="flex items-center gap-2"><span className="h-1 w-6 rounded" style={{ background: c }} /><span className="font-mono">{k}</span></li>)}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
