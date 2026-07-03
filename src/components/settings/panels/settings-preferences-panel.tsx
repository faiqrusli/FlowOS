"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FutureRoadmap } from "@/components/roadmap/future-roadmap";
import { ModalSettingsRow } from "@/components/settings/modal-settings-row";
import { SettingsToggleRow } from "@/components/settings/settings-toggle-row";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DEFAULT_SETTINGS,
  loadSettingsPreferences,
  saveSettingsPreferences,
  type SettingsPreferences,
} from "@/lib/settings-preferences";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-36";

/** Dropdown replacement for the previous native <select> (same trigger chrome). */
function DurationSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: number[];
  onChange: (minutes: number) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`${selectClassName} flex items-center justify-between gap-2`}
        aria-label={label}
      >
        <span>{value} min</span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {options.map((minutes) => (
          <DropdownMenuItem
            key={minutes}
            onClick={() => onChange(minutes)}
            className={minutes === value ? "bg-muted font-medium" : undefined}
          >
            {minutes} min
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SettingsPreferencesPanel() {
  const [preferences, setPreferences] =
    useState<SettingsPreferences>(DEFAULT_SETTINGS);

  useEffect(() => {
    setPreferences(loadSettingsPreferences());
  }, []);

  function updatePreferences(next: SettingsPreferences) {
    setPreferences(next);
    saveSettingsPreferences(next);
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xs font-medium text-muted-foreground">Notifications</h3>
        <div className="mt-2 divide-y divide-border/60 rounded-lg border border-border/60 px-3">
          <SettingsToggleRow
            label="Task reminders"
            description="Alerts for upcoming tasks."
            checked={preferences.notifications.taskReminders}
            onCheckedChange={(checked) =>
              updatePreferences({
                ...preferences,
                notifications: {
                  ...preferences.notifications,
                  taskReminders: checked,
                },
              })
            }
            className="py-3"
          />
          <SettingsToggleRow
            label="Habit reminders"
            description="Notifications for scheduled habits."
            checked={preferences.notifications.habitReminders}
            onCheckedChange={(checked) =>
              updatePreferences({
                ...preferences,
                notifications: {
                  ...preferences.notifications,
                  habitReminders: checked,
                },
              })
            }
            className="py-3"
          />
          <SettingsToggleRow
            label="Focus notifications"
            description="Timer and break alerts."
            checked={preferences.notifications.focusNotifications}
            onCheckedChange={(checked) =>
              updatePreferences({
                ...preferences,
                notifications: {
                  ...preferences.notifications,
                  focusNotifications: checked,
                },
              })
            }
            className="py-3"
          />
        </div>
      </section>

      <section>
        <h3 className="text-xs font-medium text-muted-foreground">
          Productivity
        </h3>
        <div className="mt-2 divide-y divide-border/60 rounded-lg border border-border/60 px-3">
          <ModalSettingsRow label="Default focus duration">
            <DurationSelect
              label="Default focus duration"
              value={preferences.productivity.defaultFocusMinutes}
              options={[15, 25, 30, 45, 50, 60]}
              onChange={(minutes) =>
                updatePreferences({
                  ...preferences,
                  productivity: {
                    ...preferences.productivity,
                    defaultFocusMinutes: minutes,
                  },
                })
              }
            />
          </ModalSettingsRow>
          <ModalSettingsRow label="Default break duration">
            <DurationSelect
              label="Default break duration"
              value={preferences.productivity.defaultBreakMinutes}
              options={[5, 10, 15, 20]}
              onChange={(minutes) =>
                updatePreferences({
                  ...preferences,
                  productivity: {
                    ...preferences.productivity,
                    defaultBreakMinutes: minutes,
                  },
                })
              }
            />
          </ModalSettingsRow>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-medium text-muted-foreground">
          Future features
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Planned for upcoming releases.
        </p>
        <FutureRoadmap compact className="mt-2 rounded-lg border border-border/60" />
      </section>
    </div>
  );
}
