export const TASK_DURATION_OPTIONS = [
  { label: "5 min", minutes: 5 },
  { label: "10 min", minutes: 10 },
  { label: "15 min", minutes: 15 },
  { label: "20 min", minutes: 20 },
  { label: "25 min", minutes: 25 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "1 hr", minutes: 60 },
  { label: "1.5 hr", minutes: 90 },
  { label: "2 hr", minutes: 120 },
] as const;

export function formatDurationMinutes(minutes: number | null | undefined): string {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
}

/** Compact H:MM for custom duration input (e.g. 30 → "0:30", 90 → "1:30"). */
export function formatDurationTimeInput(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${String(mins).padStart(2, "0")}`;
}

/** Parse H:MM or plain minutes from custom duration input. */
export function parseDurationTimeInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.includes(":")) {
    const [hoursPart, minutesPart] = trimmed.split(":");
    const hours = Number.parseInt(hoursPart ?? "", 10);
    const mins = Number.parseInt(minutesPart ?? "", 10);
    if (
      Number.isNaN(hours) ||
      Number.isNaN(mins) ||
      hours < 0 ||
      mins < 0 ||
      mins >= 60
    ) {
      return null;
    }
    const total = hours * 60 + mins;
    return total > 0 ? total : null;
  }

  const plain = Number.parseInt(trimmed, 10);
  if (Number.isNaN(plain) || plain <= 0) return null;
  return plain;
}
