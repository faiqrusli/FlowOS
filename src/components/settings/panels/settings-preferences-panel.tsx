"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ModalSettingsRow } from "@/components/settings/modal-settings-row";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DEFAULT_FOCUS_SETTINGS,
  readFocusSettings,
  writeFocusSettings,
  type FocusSettings,
} from "@/lib/focus-settings";

const selectClassName =
  "h-8 w-full rounded-lg border border-border-subtle bg-surface-5 px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-36";

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
            className={
              minutes === value ? "bg-primary-soft font-medium" : undefined
            }
          >
            {minutes} min
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SettingsPreferencesPanel() {
  const [settings, setSettings] = useState<FocusSettings>(DEFAULT_FOCUS_SETTINGS);

  useEffect(() => {
    setSettings(readFocusSettings());
  }, []);

  function updateDurations(patch: Pick<FocusSettings, "focusMinutes" | "breakMinutes">) {
    setSettings((current) => {
      const next = { ...current, ...patch };
      writeFocusSettings(next);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xs font-medium text-muted-foreground">
          Productivity
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Defaults used by focus sessions and Pomodoro.
        </p>
        <div className="mt-2 divide-y divide-border-subtle rounded-lg bg-surface-5 px-3">
          <ModalSettingsRow label="Default focus duration">
            <DurationSelect
              label="Default focus duration"
              value={settings.focusMinutes}
              options={[15, 25, 30, 45, 50, 60]}
              onChange={(minutes) => updateDurations({ focusMinutes: minutes, breakMinutes: settings.breakMinutes })}
            />
          </ModalSettingsRow>
          <ModalSettingsRow label="Default break duration">
            <DurationSelect
              label="Default break duration"
              value={settings.breakMinutes}
              options={[5, 10, 15, 20]}
              onChange={(minutes) => updateDurations({ focusMinutes: settings.focusMinutes, breakMinutes: minutes })}
            />
          </ModalSettingsRow>
        </div>
      </section>
    </div>
  );
}
