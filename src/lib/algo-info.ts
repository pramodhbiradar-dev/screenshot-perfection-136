export const INFO = {
  merge: {
    name: "Merge Sort",
    what: "A divide-and-conquer sort that splits the array in halves, sorts each half, then merges them back together in order.",
    how: ["Split the array into two halves", "Recursively sort each half", "Merge the two sorted halves by repeatedly taking the smaller front element"],
    complexity: [["Best", "O(n log n)"], ["Average", "O(n log n)"], ["Worst", "O(n log n)"], ["Space", "O(n)"]] as [string, string][],
    pros: ["Guaranteed O(n log n)", "Stable — equal items keep their order", "Great for linked lists & external sorting"],
    cons: ["Needs O(n) extra memory", "Slower than Quick Sort on small arrays in practice"],
    analogy: "Two sorted piles of exam papers: you repeatedly pick the lower roll number from the top of either pile to build one sorted stack.",
  },
  quick: {
    name: "Quick Sort",
    what: "A divide-and-conquer sort that picks a pivot, partitions smaller items to its left and larger to its right, then recurses.",
    how: ["Pick a pivot (here: the last element)", "Partition: move smaller elements left of the pivot", "Place pivot in its final spot, recurse on both sides"],
    complexity: [["Best", "O(n log n)"], ["Average", "O(n log n)"], ["Worst", "O(n²)"], ["Space", "O(log n) avg stack"]] as [string, string][],
    pros: ["Very fast in practice", "In-place — little extra memory", "Cache friendly"],
    cons: ["O(n²) worst case on bad pivots (e.g. sorted input)", "Not stable"],
    analogy: "Lining students up by height: pick one student, everyone shorter steps left, taller steps right — repeat in each group.",
  },
  binary: {
    name: "Binary Search",
    what: "Finds a target in a sorted array by repeatedly halving the search interval.",
    how: ["Look at the middle element", "If it equals the target — done", "If target is larger, search the right half; else the left half"],
    complexity: [["Best", "O(1)"], ["Average", "O(log n)"], ["Worst", "O(log n)"], ["Space", "O(1)"]] as [string, string][],
    pros: ["Extremely fast on large data", "Simple to implement iteratively"],
    cons: ["Requires sorted data", "Needs random access (arrays, not linked lists)"],
    analogy: "Imagine searching for a word in a dictionary. Instead of checking every page from the beginning, you open the middle and decide whether to search the left or right half.",
  },
};
export type InfoKey = keyof typeof INFO;
