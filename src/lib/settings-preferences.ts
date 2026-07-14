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
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<SettingsPreferences>;
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
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsPreferences(preferences: SettingsPreferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

const THEME_KEY = "flowos.theme";

/** FlowOS is dark-only — always resolve dark regardless of stored legacy values. */
export function loadThemePreference(): ThemePreference {
  return "dark";
}

export function saveThemePreference(theme: ThemePreference): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
}

export function resolveTheme(_theme?: ThemePreference): "dark" {
  return "dark";
}
