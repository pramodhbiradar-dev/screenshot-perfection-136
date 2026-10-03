// @ts-nocheck -- dense array-index math; the project tsconfig enables noUncheckedIndexedAccess, all indices here are bounds-checked by loop logic.
export type SortFrame = {
  arr: number[];
  compare: number[];
  swap: number[];
  merged: number[];
  sorted: number[];
  pivot: number | null;
  range: [number, number] | null;
  msg: string;
  comparisons: number;
  swaps: number;
  steps: number;
};

export type SortAlgo = "merge" | "quick";

export function mergeSortFrames(input: number[]): SortFrame[] {
  const a = [...input];
  const frames: SortFrame[] = [];
  let comparisons = 0, swaps = 0, steps = 0;
  const push = (f: Partial<SortFrame> & { msg: string }) => {
    steps++;
    frames.push({ arr: [...a], compare: [], swap: [], merged: [], sorted: [], pivot: null, range: null, comparisons, swaps, steps, ...f });
  };
  frames.push({ arr: [...a], compare: [], swap: [], merged: [], sorted: [], pivot: null, range: null, msg: "Original array — press Start or Next Step", comparisons: 0, swaps: 0, steps: 0 });

  const sort = (l: number, r: number) => {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    push({ range: [l, r], msg: `Split [${l}..${r}] into [${l}..${m}] and [${m + 1}..${r}]` });
    sort(l, m);
    sort(m + 1, r);
    const left = a.slice(l, m + 1), right = a.slice(m + 1, r + 1);
    push({ range: [l, r], msg: `Merge left [${left.join(", ")}] with right [${right.join(", ")}]` });
    let i = 0, j = 0, k = l;
    const merged: number[] = [];
    while (i < left.length && j < right.length) {
      comparisons++;
      push({ range: [l, r], compare: [l + i < k ? k : l + i, m + 1 + j].filter((x) => x <= r), merged: [...merged], msg: `Comparing ${left[i]} and ${right[j]}` });
      if (left[i] <= right[j]) {
        a[k] = left[i];
        swaps++;
        merged.push(k);
        push({ range: [l, r], merged: [...merged], swap: [k], msg: `${left[i]} is smaller → place ${left[i]} at index ${k}` });
        i++;
      } else {
        a[k] = right[j];
        swaps++;
        merged.push(k);
        push({ range: [l, r], merged: [...merged], swap: [k], msg: `${right[j]} is smaller → place ${right[j]} at index ${k}` });
        j++;
      }
      k++;
    }
    while (i < left.length) { a[k] = left[i]; swaps++; merged.push(k); push({ range: [l, r], merged: [...merged], swap: [k], msg: `Copy remaining ${left[i]} to index ${k}` }); i++; k++; }
    while (j < right.length) { a[k] = right[j]; swaps++; merged.push(k); push({ range: [l, r], merged: [...merged], swap: [k], msg: `Copy remaining ${right[j]} to index ${k}` }); j++; k++; }
    push({ range: [l, r], merged: [...merged], msg: `Subarray [${l}..${r}] is sorted: [${a.slice(l, r + 1).join(", ")}]` });
  };
  sort(0, a.length - 1);
  push({ sorted: a.map((_, i) => i), msg: "Merge Sort complete — array is sorted ✓" });
  return frames;
}

export function quickSortFrames(input: number[]): SortFrame[] {
  const a = [...input];
  const frames: SortFrame[] = [];
  const sorted = new Set<number>();
  let comparisons = 0, swaps = 0, steps = 0;
  const push = (f: Partial<SortFrame> & { msg: string }) => {
    steps++;
    frames.push({ arr: [...a], compare: [], swap: [], merged: [], sorted: [...sorted], pivot: null, range: null, comparisons, swaps, steps, ...f });
  };
  frames.push({ arr: [...a], compare: [], swap: [], merged: [], sorted: [], pivot: null, range: null, msg: "Original array — press Start or Next Step", comparisons: 0, swaps: 0, steps: 0 });

  const qs = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) { sorted.add(lo); push({ range: [lo, hi], msg: `Single element ${a[lo]} is in its final place` }); return; }
    const pv = a[hi];
    push({ range: [lo, hi], pivot: hi, msg: `Partition [${lo}..${hi}] — pivot selected: ${pv}` });
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      push({ range: [lo, hi], pivot: hi, compare: [j], msg: `Comparing ${a[j]} with pivot ${pv}` });
      if (a[j] < pv) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          swaps++;
          push({ range: [lo, hi], pivot: hi, swap: [i, j], msg: `${a[i]} < ${pv} → move to left partition (swap indices ${i} & ${j})` });
        } else {
          push({ range: [lo, hi], pivot: hi, compare: [j], msg: `${a[j]} < ${pv} → already in left partition` });
        }
      } else {
        push({ range: [lo, hi], pivot: hi, compare: [j], msg: `${a[j]} ≥ ${pv} → stays in right partition` });
      }
    }
    const p = i + 1;
    if (p !== hi) { [a[p], a[hi]] = [a[hi], a[p]]; swaps++; }
    sorted.add(p);
    push({ range: [lo, hi], swap: [p, hi], msg: `Place pivot ${pv} at index ${p} — its final position` });
    qs(lo, p - 1);
    qs(p + 1, hi);
  };
  qs(0, a.length - 1);
  push({ sorted: a.map((_, i) => i), msg: "Quick Sort complete — array is sorted ✓" });
  return frames;
}

/* Plain implementations for timing + comparison metrics */
export function mergeSortMeasure(input: number[]) {
  const a = [...input];
  let comparisons = 0, moves = 0, steps = 0;
  const t0 = performance.now();
  const sort = (l: number, r: number) => {
    if (l >= r) return;
    const m = (l + r) >> 1;
    steps++;
    sort(l, m); sort(m + 1, r);
    const L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < L.length && j < R.length) { comparisons++; steps++; a[k++] = L[i] <= R[j] ? L[i++] : R[j++]; moves++; }
    while (i < L.length) { a[k++] = L[i++]; moves++; steps++; }
    while (j < R.length) { a[k++] = R[j++]; moves++; steps++; }
  };
  sort(0, a.length - 1);
  return { time: performance.now() - t0, comparisons, moves, steps, result: a };
}

export function quickSortMeasure(input: number[]) {
  const a = [...input];
  let comparisons = 0, moves = 0, steps = 0;
  const t0 = performance.now();
  const qs = (lo: number, hi: number) => {
    if (lo >= hi) return;
    steps++;
    const pv = a[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) { comparisons++; steps++; if (a[j] < pv) { i++; if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; moves++; } } }
    if (i + 1 !== hi) { [a[i + 1], a[hi]] = [a[hi], a[i + 1]]; moves++; }
    qs(lo, i); qs(i + 2, hi);
  };
  qs(0, a.length - 1);
  return { time: performance.now() - t0, comparisons, moves, steps, result: a };
}

export type SearchFrame = {
  low: number; mid: number | null; high: number;
  found: number | null; done: boolean;
  msg: string; comparisons: number; steps: number;
};

export function binarySearchFrames(a: number[], target: number): SearchFrame[] {
  const frames: SearchFrame[] = [];
  let low = 0, high = a.length - 1, comparisons = 0, steps = 0;
  frames.push({ low, mid: null, high, found: null, done: false, msg: `Searching for ${target} — Low = ${low}, High = ${high}`, comparisons, steps });
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps++;
    frames.push({ low, mid, high, found: null, done: false, msg: `Low = ${low}, Mid = ${mid}, High = ${high} → check a[${mid}] = ${a[mid]}`, comparisons, steps });
    comparisons++;
    if (a[mid] === target) {
      frames.push({ low, mid, high, found: mid, done: true, msg: `${a[mid]} = ${target} → Element Found at index ${mid}!`, comparisons, steps });
      return frames;
    }
    if (a[mid] < target) {
      frames.push({ low, mid, high, found: null, done: false, msg: `${target} > ${a[mid]} → search right half`, comparisons, steps });
      low = mid + 1;
    } else {
      frames.push({ low, mid, high, found: null, done: false, msg: `${target} < ${a[mid]} → search left half`, comparisons, steps });
      high = mid - 1;
    }
  }
  frames.push({ low, mid: null, high, found: null, done: true, msg: `Low > High — Element Not Found`, comparisons, steps });
  return frames;
}

export function binarySearchTime(a: number[], target: number) {
  const t0 = performance.now();
  for (let r = 0; r < 1000; r++) {
    let lo = 0, hi = a.length - 1;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (a[m] === target) break; if (a[m] < target) lo = m + 1; else hi = m - 1; }
  }
  return (performance.now() - t0) / 1000;
}

export function parseNumbers(text: string): { ok: true; values: number[] } | { ok: false; error: string } {
  const t = text.trim();
  if (!t) return { ok: false, error: "Please enter some numbers first." };
  const parts = t.split(/[\s,]+/).filter(Boolean);
  const values = parts.map(Number);
  if (values.some((v) => !Number.isFinite(v))) return { ok: false, error: "Please enter valid numbers separated by commas." };
  if (values.length < 2) return { ok: false, error: "Enter at least 2 numbers." };
  if (values.length > 60) return { ok: false, error: "That's a lot! Please use at most 60 numbers for a clear visualization." };
  return { ok: true, values };
}

export function randomArray(n: number, min: number, max: number) {
  const lo = Math.min(min, max), hi = Math.max(min, max);
  return Array.from({ length: n }, () => Math.floor(Math.random() * (hi - lo + 1)) + lo);
}
