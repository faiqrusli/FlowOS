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
  if (typeof window === "undefined") return DEFAULT_FOCUS_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FOCUS_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<FocusSettings>;
    return {
      ...DEFAULT_FOCUS_SETTINGS,
      ...parsed,
      breakActivities:
        parsed.breakActivities?.length
          ? parsed.breakActivities
          : DEFAULT_FOCUS_SETTINGS.breakActivities,
      musicProviders: {
        ...DEFAULT_FOCUS_SETTINGS.musicProviders,
        ...parsed.musicProviders,
      },
    };
  } catch {
    return DEFAULT_FOCUS_SETTINGS;
  }
}

export function writeFocusSettings(settings: FocusSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage errors
  }
}
