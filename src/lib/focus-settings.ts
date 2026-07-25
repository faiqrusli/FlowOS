import { readStorageJson, writeStorageJson } from "@/lib/safe-storage";

export type FocusSettings = {
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  autoBreak: boolean;
  autoResume: boolean;
  breakActivities: string[];
  musicProviders: {
    spotify: boolean;
    brainFm: boolean;
    whiteNoise: boolean;
  };
};

const STORAGE_KEY = "flowos-focus-settings";

export const DEFAULT_BREAK_ACTIVITIES = [
  "Stretch",
  "Drink water",
  "Walk",
  "Breathing",
  "Read goals",
  "Read mindset",
] as const;

export const DEFAULT_FOCUS_SETTINGS: FocusSettings = {
  focusMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  autoBreak: false,
  autoResume: false,
  breakActivities: [...DEFAULT_BREAK_ACTIVITIES],
  musicProviders: {
    spotify: false,
    brainFm: false,
    whiteNoise: false,
  },
};

export function readFocusSettings(): FocusSettings {
  const parsed = readStorageJson<Partial<FocusSettings> | null>(
    STORAGE_KEY,
    null
  );
  if (!parsed) return DEFAULT_FOCUS_SETTINGS;

  return {
    ...DEFAULT_FOCUS_SETTINGS,
    ...parsed,
    breakActivities: parsed.breakActivities?.length
      ? parsed.breakActivities
      : DEFAULT_FOCUS_SETTINGS.breakActivities,
    musicProviders: {
      ...DEFAULT_FOCUS_SETTINGS.musicProviders,
      ...parsed.musicProviders,
    },
  };
}

export function writeFocusSettings(settings: FocusSettings): void {
  writeStorageJson(STORAGE_KEY, settings);
}
