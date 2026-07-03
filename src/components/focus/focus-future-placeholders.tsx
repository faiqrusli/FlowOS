"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PLACEHOLDERS = [
  "AI focus insights",
  "Achievement badges",
  "Compare days",
  "Focus forecasts",
  "Team focus",
] as const;

export function FocusFuturePlaceholders() {
  return (
    <Card className="border-dashed border-border/40 bg-muted/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-muted-foreground">
          Coming soon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {PLACEHOLDERS.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border/35 bg-background/70 px-3 py-1 text-xs text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
