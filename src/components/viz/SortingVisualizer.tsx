import { useMemo, useState } from "react";
import { mergeSortFrames, mergeSortMeasure, parseNumbers, quickSortFrames, quickSortMeasure, randomArray, type SortAlgo } from "@/lib/algorithms";
import { usePlayer, SPEEDS } from "@/hooks/use-player";
import { Btn, Legend, Panel, Progress, SpeedControl, Stat } from "./ui";
import { Explain } from "./Explain";

const DEFAULT = [38, 12, 27, 43, 9, 31, 18, 25];

export function SortingVisualizer() {
  const [algo, setAlgo] = useState<SortAlgo>("merge");
  const [arr, setArr] = useState<number[]>(DEFAULT);
  const [text, setText] = useState(DEFAULT.join(", "));
  const [size, setSize] = useState(12);
  const [min, setMin] = useState(5);
  const [max, setMax] = useState(99);
  const [error, setError] = useState("");
  const [delay, setDelay] = useState<number>(SPEEDS.Normal);

  const frames = useMemo(() => (algo === "merge" ? mergeSortFrames(arr) : quickSortFrames(arr)), [algo, arr]);
  const time = useMemo(() => (algo === "merge" ? mergeSortMeasure(arr) : quickSortMeasure(arr)).time, [algo, arr]);
  const p = usePlayer(frames, delay);
  const f = p.frame;

  const apply = () => {
    const r = parseNumbers(text);
    if (!r.ok) return setError(r.error);
    setError(""); setArr(r.values);
  };
  const gen = () => {
    if (min > max) return setError("Minimum must be less than maximum.");
    const a = randomArray(size, min, max);
    setError(""); setArr(a); setText(a.join(", "));
  };

  const maxAbs = Math.max(...f.arr.map((v) => Math.abs(v)), 1);
  const stateOf = (i: number) => {
    if (f.sorted.includes(i)) return "bar-sorted";
    if (f.pivot === i) return "bar-pivot";
    if (f.swap.includes(i)) return "bar-swap";
    if (f.compare.includes(i)) return "bar-compare";
    if (f.merged.includes(i)) return "bar-merge";
    return "bar-idle";
  };
  const inRange = (i: number) => !f.range || (i >= f.range[0] && i <= f.range[1]);

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-wrap items-center gap-2">
          {(["merge", "quick"] as const).map((a) => (
            <button key={a} onClick={() => setAlgo(a)} className={`chip text-sm ${algo === a ? "chip-active" : ""}`}>{a === "merge" ? "Merge Sort" : "Quick Sort"}</button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div>
            <label className="label">Custom numbers</label>
            <div className="mt-1.5 flex gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} className="field flex-1" placeholder="38, 12, 27, 43" />
              <Btn onClick={apply} title="Use these numbers">Apply</Btn>
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="label">Size: {size}</label>
              <input type="range" min={4} max={40} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-3 block w-32 accent-primary" />
            </div>
            <div><label className="label">Min</label><input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="field mt-1.5 w-20" /></div>
            <div><label className="label">Max</label><input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="field mt-1.5 w-20" /></div>
            <Btn onClick={gen} title="Create a new random array">Generate Array</Btn>
          </div>
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div className="status" key={p.index}>{f.msg}</div>
        <div className="flex h-72 items-end gap-1 sm:gap-1.5">
          {f.arr.map((v, i) => (
            <div key={i} className={`flex h-full flex-1 flex-col items-center justify-end transition-opacity duration-300 ${inRange(i) ? "opacity-100" : "opacity-25"}`}>
              <span className="mb-1 font-mono text-[10px] text-muted-foreground sm:text-xs">{f.arr.length <= 30 ? v : ""}</span>
              <div className={`bar ${stateOf(i)}`} style={{ height: `${Math.max((Math.abs(v) / maxAbs) * 100, 3)}%` }} />
            </div>
          ))}
        </div>
        <Legend items={[["bar-idle", "Unsorted"], ["bar-compare", "Comparing"], ["bar-swap", algo === "merge" ? "Writing" : "Swapping"], ...(algo === "merge" ? [["bar-merge", "Merged"] as [string, string]] : [["bar-pivot", "Pivot"] as [string, string]]), ["bar-sorted", "Sorted"]]} />
        <Progress index={p.index} total={p.total} />
        <div className="flex flex-wrap gap-2">
          {!p.started && !p.playing && <Btn variant="primary" onClick={p.play} disabled={p.done}>▶ Start</Btn>}
          {p.started && !p.playing && !p.done && <Btn variant="primary" onClick={p.play}>▶ Resume</Btn>}
          {p.playing && <Btn variant="primary" onClick={p.pause}>❚❚ Pause</Btn>}
          <Btn onClick={p.step} disabled={p.done} title="Perform exactly one operation">Next Step →</Btn>
          <Btn onClick={p.reset} title="Restore the array and clear stats">↺ Reset</Btn>
          <Btn onClick={gen} title="New random array">⤨ Randomize</Btn>
        </div>
        <SpeedControl delay={delay} setDelay={setDelay} />
      </Panel>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Comparisons" value={f.comparisons} />
        <Stat label="Steps" value={f.steps} />
        <Stat label={algo === "merge" ? "Writes" : "Swaps"} value={f.swaps} />
        <Stat label="Exec time" value={p.done ? `${time.toFixed(3)}ms` : "—"} accent />
        <Stat label="Array size" value={f.arr.length} />
      </div>

      <Explain k={algo} />
    </div>
  );
}
