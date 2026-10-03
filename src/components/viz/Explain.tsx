import { INFO, type InfoKey } from "@/lib/algo-info";
import { Complexity, Panel } from "./ui";

export function Explain({ k }: { k: InfoKey }) {
  const d = INFO[k];
  return (
    <Panel>
      <h3 className="font-display text-lg font-semibold">How {d.name} works</h3>
      <p className="mt-2 text-sm text-muted-foreground">{d.what}</p>
      <div className="mt-4 grid gap-5 md:grid-cols-3">
        <div>
          <h4 className="label">Steps</h4>
          <ol className="mt-2 space-y-1.5 text-sm">{d.how.map((s, i) => <li key={s} className="flex gap-2"><span className="font-mono text-primary">{i + 1}.</span>{s}</li>)}</ol>
        </div>
        <div>
          <h4 className="label">Complexity</h4>
          <div className="mt-2"><Complexity rows={d.complexity} /></div>
        </div>
        <div>
          <h4 className="label">Advantages</h4>
          <ul className="mt-2 space-y-1 text-sm">{d.pros.map((p) => <li key={p}>+ {p}</li>)}</ul>
          <h4 className="label mt-3">Limitations</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">{d.cons.map((p) => <li key={p}>− {p}</li>)}</ul>
        </div>
      </div>
      <div className="mt-5 rounded-lg border-l-2 border-primary bg-muted/50 p-3 text-sm"><span className="font-semibold">Real-world analogy: </span>{d.analogy}</div>
    </Panel>
  );
}
