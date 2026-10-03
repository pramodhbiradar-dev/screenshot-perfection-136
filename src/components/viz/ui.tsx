import type { ReactNode } from "react";
import { SPEEDS } from "@/hooks/use-player";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`panel p-5 ${className}`}>{children}</div>;
}

export function Btn({ children, onClick, disabled, variant = "ghost", title }: { children: ReactNode; onClick?: () => void; disabled?: boolean; variant?: "primary" | "ghost"; title?: string }) {
  return (
    <button title={title} onClick={onClick} disabled={disabled} className={variant === "primary" ? "btn btn-primary" : "btn btn-ghost"}>
      {children}
    </button>
  );
}

export function Stat({ label, value, accent }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className="stat">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono text-2xl font-semibold ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

export function SpeedControl({ delay, setDelay }: { delay: number; setDelay: (n: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">Animation speed</span>
      {Object.entries(SPEEDS).map(([k, v]) => (
        <button key={k} onClick={() => setDelay(v)} className={`chip ${delay === v ? "chip-active" : ""}`}>{k}</button>
      ))}
      <input title="Delay between steps" type="range" min={40} max={1200} step={10} value={1240 - delay} onChange={(e) => setDelay(1240 - Number(e.target.value))} className="w-32 accent-primary" />
      <span className="font-mono text-xs text-muted-foreground">{delay}ms/step</span>
    </div>
  );
}

export function Progress({ index, total }: { index: number; total: number }) {
  const pct = total > 1 ? (index / (total - 1)) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-xs text-muted-foreground"><span>Step {index} / {Math.max(total - 1, 0)}</span><span>{pct.toFixed(0)}%</span></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {items.map(([cls, label]) => (
        <span key={label} className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded-sm ${cls}`} />{label}</span>
      ))}
    </div>
  );
}

export function Complexity({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
      {rows.map(([k, v]) => (<><dt key={k + "k"} className="text-muted-foreground">{k}</dt><dd key={k + "v"} className="font-mono text-foreground">{v}</dd></>))}
    </dl>
  );
}
