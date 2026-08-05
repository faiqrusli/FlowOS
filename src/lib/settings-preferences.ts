import {
  readStorageJson,
  setStorageItem,
  writeStorageJson,
} from "@/lib/safe-storage";

export type ThemePreference = "dark";

export type WeekStart = "monday" | "sunday";

export type DashboardView = "overview" | "timeline" | "compact";

export type SettingsPreferences = {
  notifications: {
    dailyReminders: boolean;
    habitReminders: boolean;
    taskReminders: boolean;
    focusNotifications: boolean;
    weeklyReviewReminders: boolean;
  };
  productivity: {
    defaultFocusMinutes: number;
    defaultBreakMinutes: number;
    weekStartsOn: WeekStart;
    defaultDashboardView: DashboardView;
  };
  ai: {
    enableInsights: boolean;
    weeklyAiReview: boolean;
    goalRecommendations: boolean;
    reflectionAnalysis: boolean;
  };
};

const STORAGE_KEY = "flowos.settings";

export const DEFAULT_SETTINGS: SettingsPreferences = {
  notifications: {
    dailyReminders: true,
    habitReminders: true,
    taskReminders: true,
    focusNotifications: true,
    weeklyReviewReminders: false,
  },
  productivity: {
    defaultFocusMinutes: 25,
    defaultBreakMinutes: 5,
    weekStartsOn: "monday",
    defaultDashboardView: "overview",
  },
  ai: {
    enableInsights: true,
    weeklyAiReview: false,
    goalRecommendations: false,
    reflectionAnalysis: false,
  },
};

export function loadSettingsPreferences(): SettingsPreferences {
  const parsed = readStorageJson<Partial<SettingsPreferences> | null>(
    STORAGE_KEY,
    null
  );
  if (!parsed) return DEFAULT_SETTINGS;

  return {
    notifications: {
      ...DEFAULT_SETTINGS.notifications,
      ...parsed.notifications,
    },
    productivity: {
      ...DEFAULT_SETTINGS.productivity,
      ...parsed.productivity,
    },
    ai: {
      ...DEFAULT_SETTINGS.ai,
      ...parsed.ai,
    },
  };
}

export function saveSettingsPreferences(preferences: SettingsPreferences): void {
  writeStorageJson(STORAGE_KEY, preferences);
}

const THEME_KEY = "flowos.theme";

/** FlowOS is dark-only — always resolve dark regardless of stored legacy values. */
export function loadThemePreference(): ThemePreference {
  return "dark";
}

export function saveThemePreference(theme: ThemePreference): void {
  setStorageItem(THEME_KEY, theme);
}

export function resolveTheme(): "dark" {
  return "dark";
}
