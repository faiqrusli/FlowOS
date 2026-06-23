"use client";

import { useEffect, useState } from "react";
import { FutureRoadmap } from "@/components/roadmap/future-roadmap";
import { ModalSettingsRow } from "@/components/settings/modal-settings-row";
import { SettingsToggleRow } from "@/components/settings/settings-toggle-row";
import {
  DEFAULT_SETTINGS,
  loadSettingsPreferences,
  saveSettingsPreferences,
  type SettingsPreferences,
} from "@/lib/settings-preferences";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-36";

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
            <select
              className={selectClassName}
              value={preferences.productivity.defaultFocusMinutes}
              onChange={(event) =>
                updatePreferences({
                  ...preferences,
                  productivity: {
                    ...preferences.productivity,
                    defaultFocusMinutes: Number(event.target.value),
                  },
                })
              }
            >
              {[15, 25, 30, 45, 50, 60].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} min
                </option>
              ))}
            </select>
          </ModalSettingsRow>
          <ModalSettingsRow label="Default break duration">
            <select
              className={selectClassName}
              value={preferences.productivity.defaultBreakMinutes}
              onChange={(event) =>
                updatePreferences({
                  ...preferences,
                  productivity: {
                    ...preferences.productivity,
                    defaultBreakMinutes: Number(event.target.value),
                  },
                })
              }
            >
              {[5, 10, 15, 20].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} min
                </option>
              ))}
            </select>
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
