import { Hammer } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UnderDevelopmentCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-surface-raised">
            <Hammer className="size-4 text-muted-foreground stroke-[1.5]" />
          </div>
          <CardTitle className="text-base">Under Development</CardTitle>
        </div>
        <CardDescription>
          This module is currently being built as part of the FlowOS roadmap.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">
          Core workflows are being designed to integrate with your existing
          tasks, habits, focus sessions, and reflections.
        </p>
      </CardContent>
    </Card>
  );
}
