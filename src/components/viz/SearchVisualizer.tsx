import { useMemo, useState } from "react";
import { binarySearchFrames, binarySearchTime, parseNumbers, randomArray } from "@/lib/algorithms";
import { usePlayer, SPEEDS } from "@/hooks/use-player";
import { Btn, Panel, Progress, SpeedControl, Stat } from "./ui";
import { Explain } from "./Explain";

const DEFAULT = [5, 12, 18, 23, 31, 42, 56, 67, 81];

export function SearchVisualizer() {
  const [arr, setArr] = useState(DEFAULT);
  const [text, setText] = useState(DEFAULT.join(", "));
  const [targetText, setTargetText] = useState("42");
  const [target, setTarget] = useState(42);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [delay, setDelay] = useState<number>(SPEEDS.Slow);

  const frames = useMemo(() => binarySearchFrames(arr, target), [arr, target]);
  const time = useMemo(() => binarySearchTime(arr, target), [arr, target]);
  const p = usePlayer(frames, delay);
  const f = p.frame;

  const load = (): boolean => {
    const r = parseNumbers(text);
    if (!r.ok) { setError(r.error); return false; }
    if (targetText.trim() === "" || !Number.isFinite(Number(targetText))) { setError("Please enter a valid search value."); return false; }
    const sorted = [...r.values].sort((a, b) => a - b);
    const wasSorted = r.values.every((v, i) => v === sorted[i]);
    setNote(wasSorted ? "" : "Binary Search requires sorted data. Array sorted automatically.");
    setError(""); setArr(sorted); setText(sorted.join(", ")); setTarget(Number(targetText));
    return true;
  };
  const start = () => { if (load()) setTimeout(p.play, 0); };
  const gen = () => {
    const a = randomArray(12, 1, 99).sort((x, y) => x - y);
    setArr(a); setText(a.join(", ")); setNote(""); setError("");
    const t = Math.random() < 0.7 ? (a[Math.floor(Math.random() * a.length)] ?? 100) : 100;
    setTarget(t); setTargetText(String(t));
  };

  const cls = (i: number) => {
    if (f.found === i) return "cell-found";
    if (f.mid === i) return "cell-mid";
    if (i < f.low || i > f.high) return "cell-out";
    return "cell-in";
  };
  const notFound = f.done && f.found === null;

  return (
    <div className="space-y-5">
      <Panel>
        <div className="grid gap-4 md:grid-cols-[1fr_160px_auto]">
          <div><label className="label">Array</label><input value={text} onChange={(e) => setText(e.target.value)} className="field mt-1.5 w-full" /></div>
          <div><label className="label">Search value</label><input value={targetText} onChange={(e) => setTargetText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} className="field mt-1.5 w-full" /></div>
          <div className="flex items-end gap-2"><Btn onClick={load}>Load</Btn><Btn onClick={gen}>Generate Random</Btn></div>
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        {note && <p className="mt-2 text-sm text-primary">{note}</p>}
      </Panel>

      <Panel className="space-y-5">
        <div className="status" key={p.index}>{f.msg}</div>
        <div className="flex flex-wrap justify-center gap-2">
          {arr.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-4 font-mono text-[10px] font-bold text-primary">
                {[f.low === i && !f.done ? "L" : "", f.mid === i ? "M" : "", f.high === i && !f.done ? "H" : ""].filter(Boolean).join("·")}
              </div>
              <div className={`cell ${cls(i)}`}>{v}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{i}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6 font-mono text-sm">
          <span>Low = <b className="text-primary">{f.low}</b></span>
          <span>Mid = <b className="text-primary">{f.mid ?? "—"}</b></span>
          <span>High = <b className="text-primary">{f.high}</b></span>
        </div>
        {f.done && (
          <div className={`result ${notFound ? "result-miss" : "result-hit"}`}>
            {notFound ? "Element Not Found" : `Element Found! ${target} is at index ${f.found}`}
          </div>
        )}
        <Progress index={p.index} total={p.total} />
        <div className="flex flex-wrap gap-2">
          {!p.started && !p.playing && <Btn variant="primary" onClick={start}>▶ Start Search</Btn>}
          {p.started && !p.playing && !p.done && <Btn variant="primary" onClick={p.play}>▶ Resume</Btn>}
          {p.playing && <Btn variant="primary" onClick={p.pause}>❚❚ Pause</Btn>}
          <Btn onClick={p.step} disabled={p.done}>Next Step →</Btn>
          <Btn onClick={p.reset}>↺ Reset</Btn>
        </div>
        <SpeedControl delay={delay} setDelay={setDelay} />
      </Panel>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        <Stat label="Search steps" value={f.steps} />
        <Stat label="Comparisons" value={f.comparisons} />
        <Stat label="Exec time" value={f.done ? `${time.toFixed(4)}ms` : "—"} accent />
        <Stat label="Target" value={target} />
        <Stat label="Final index" value={f.done ? (f.found ?? "−1") : "—"} />
        <Stat label="Array size" value={arr.length} />
      </div>

      <Explain k="binary" />
    </div>
  );
}
