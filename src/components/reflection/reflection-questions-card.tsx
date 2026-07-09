import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { drawerWritingFieldClass } from "@/lib/theme/surface-classes";

type ReflectionQuestionsCardProps = {
  wentWell: string;
  wentWrong: string;
  onWentWellChange: (value: string) => void;
  onWentWrongChange: (value: string) => void;
  disabled?: boolean;
  hideTitle?: boolean;
  /** @deprecated Drawer no longer strips card chrome — ignored. */
  compact?: boolean;
};

export function ReflectionQuestionsCard({
  wentWell,
  wentWrong,
  onWentWellChange,
  onWentWrongChange,
  disabled,
  hideTitle = false,
}: ReflectionQuestionsCardProps) {
  return (
    <Card className="border-border/50 shadow-none">
      {hideTitle ? null : (
        <CardHeader>
          <CardTitle>Reflection</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("space-y-6", hideTitle && "pt-4")}>
        <div className="space-y-2">
          <Label htmlFor="went-well">What went well today?</Label>
          <Textarea
            id="went-well"
            value={wentWell}
            onChange={(e) => onWentWellChange(e.target.value)}
            placeholder="Celebrate wins, progress, and positive moments…"
            rows={4}
            disabled={disabled}
            className={cn("min-h-24 resize-y", drawerWritingFieldClass)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="went-wrong">What went wrong today?</Label>
          <Textarea
            id="went-wrong"
            value={wentWrong}
            onChange={(e) => onWentWrongChange(e.target.value)}
            placeholder="Note challenges, distractions, or lessons…"
            rows={4}
            disabled={disabled}
            className={cn("min-h-24 resize-y", drawerWritingFieldClass)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
