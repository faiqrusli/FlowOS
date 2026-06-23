"use client";

import type { ComponentType } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

function ThemeOption({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors",
        active
          ? "border-foreground/20 bg-background text-foreground shadow-sm"
          : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      )}
    >
      <Icon className="size-3.5 stroke-[1.5]" />
      {label}
    </button>
  );
}

export function SettingsAppearancePanel() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-5">
      <section>
        <h3 className="text-xs font-medium text-muted-foreground">Theme</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Choose how FlowOS looks on your device.
        </p>
        <div className="mt-3 flex gap-2">
          <ThemeOption
            active={theme === "light"}
            label="Light"
            icon={Sun}
            onClick={() => setTheme("light")}
          />
          <ThemeOption
            active={theme === "dark"}
            label="Dark"
            icon={Moon}
            onClick={() => setTheme("dark")}
          />
          <ThemeOption
            active={theme === "system"}
            label="System"
            icon={Laptop}
            onClick={() => setTheme("system")}
          />
        </div>
      </section>

      <section className="border-t border-border/60 pt-5">
        <h3 className="text-xs font-medium text-muted-foreground">Layout</h3>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <div>
              <p className="text-sm">Compact mode</p>
              <p className="text-xs text-muted-foreground">Denser spacing.</p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Planned
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <div>
              <p className="text-sm">Custom themes</p>
              <p className="text-xs text-muted-foreground">Accent colors.</p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Planned
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
