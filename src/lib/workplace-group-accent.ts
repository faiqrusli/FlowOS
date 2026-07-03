import type { TaskGroupColorKey } from "@/lib/task-group-appearance";

const WORKPLACE_ACCENT_OPACITY: Record<TaskGroupColorKey, string> = {
  sky: "border-l-sky-400/30",
  blue: "border-l-blue-400/30",
  indigo: "border-l-indigo-400/30",
  violet: "border-l-violet-400/30",
  emerald: "border-l-emerald-500/30",
  teal: "border-l-teal-400/30",
  amber: "border-l-amber-400/30",
  orange: "border-l-orange-400/30",
  rose: "border-l-rose-400/30",
  slate: "border-l-slate-400/30",
  inbox: "border-l-[#9B8AD4]/35",
  later: "border-l-[#C9B896]/35",
};

export function getWorkplaceGroupAccentClass(
  colorKey: TaskGroupColorKey
): string {
  return WORKPLACE_ACCENT_OPACITY[colorKey] ?? "border-l-slate-400/30";
}
