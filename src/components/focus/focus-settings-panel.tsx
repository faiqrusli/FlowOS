"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import {
  DEFAULT_FOCUS_SETTINGS,
  readFocusSettings,
  writeFocusSettings,
  type FocusSettings,
} from "@/lib/focus-settings";
import { cn } from "@/lib/utils";

export function FocusSettingsPanel() {
  const { pomodoro } = useFocusSessionContext();
  const [settings, setSettings] = useState<FocusSettings>(DEFAULT_FOCUS_SETTINGS);
  const [newActivity, setNewActivity] = useState("");

  useEffect(() => {
    setSettings(readFocusSettings());
  }, []);

  function updateSettings(patch: Partial<FocusSettings>) {
    setSettings((current) => {
      const next = { ...current, ...patch };
      writeFocusSettings(next);
      return next;
    });
  }

  function syncPomodoroDurations(focusMinutes: number, breakMinutes: number) {
    pomodoro.setFocusMinutes(focusMinutes);
    pomodoro.setBreakMinutes(breakMinutes);
  }

  return (
    <Card className="border-border/40 bg-card/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Pomodoro</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="focus-minutes">Focus duration (min)</Label>
              <Input
                id="focus-minutes"
                type="number"
                min={1}
                max={180}
                value={settings.focusMinutes}
                onChange={(event) => {
                  const value = Number.parseInt(event.target.value, 10) || 25;
                  updateSettings({ focusMinutes: value });
                  syncPomodoroDurations(value, settings.breakMinutes);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="break-minutes">Break duration (min)</Label>
              <Input
                id="break-minutes"
                type="number"
                min={1}
                max={60}
                value={settings.breakMinutes}
                onChange={(event) => {
                  const value = Number.parseInt(event.target.value, 10) || 5;
                  updateSettings({ breakMinutes: value });
                  syncPomodoroDurations(settings.focusMinutes, value);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="long-break-minutes">Long break (min)</Label>
              <Input
                id="long-break-minutes"
                type="number"
                min={1}
                max={60}
                value={settings.longBreakMinutes}
                onChange={(event) => {
                  const value = Number.parseInt(event.target.value, 10) || 15;
                  updateSettings({ longBreakMinutes: value });
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={settings.autoBreak}
                onCheckedChange={(checked) =>
                  updateSettings({ autoBreak: checked })
                }
              />
              Auto break
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={settings.autoResume}
                onCheckedChange={(checked) =>
                  updateSettings({ autoResume: checked })
                }
              />
              Auto resume
            </label>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Break activities</h3>
          <div className="flex flex-wrap gap-2">
            {settings.breakActivities.map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() =>
                  updateSettings({
                    breakActivities: settings.breakActivities.filter(
                      (item) => item !== activity
                    ),
                  })
                }
                className="rounded-full border border-border/40 bg-muted/20 px-2.5 py-1 text-xs hover:bg-muted/40"
              >
                {activity} ×
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newActivity}
              onChange={(event) => setNewActivity(event.target.value)}
              placeholder="Add activity"
              className="max-w-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const trimmed = newActivity.trim();
                if (!trimmed) return;
                if (settings.breakActivities.includes(trimmed)) return;
                updateSettings({
                  breakActivities: [...settings.breakActivities, trimmed],
                });
                setNewActivity("");
              }}
            >
              Add
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Music</h3>
          <p className="text-xs text-muted-foreground">
            Future integration — no embedded player yet.
          </p>
          <div className="flex flex-wrap gap-4">
            {(
              [
                ["spotify", "Spotify"],
                ["brainFm", "Brain.fm"],
                ["whiteNoise", "White noise"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className={cn(
                  "flex items-center gap-2 text-sm text-muted-foreground"
                )}
              >
                <Switch
                  checked={settings.musicProviders[key]}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      musicProviders: {
                        ...settings.musicProviders,
                        [key]: checked,
                      },
                    })
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
