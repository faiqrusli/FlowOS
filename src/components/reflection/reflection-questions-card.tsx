import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ReflectionQuestionsCardProps = {
  wentWell: string;
  wentWrong: string;
  onWentWellChange: (value: string) => void;
  onWentWrongChange: (value: string) => void;
  disabled?: boolean;
  hideTitle?: boolean;
  compact?: boolean;
};

export function ReflectionQuestionsCard({
  wentWell,
  wentWrong,
  onWentWellChange,
  onWentWrongChange,
  disabled,
  hideTitle = false,
  compact = false,
}: ReflectionQuestionsCardProps) {
  return (
    <Card
      className={
        compact
          ? "border-border/40 bg-transparent shadow-none ring-0"
          : ""
      }
    >
      {hideTitle ? null : (
        <CardHeader>
          <CardTitle>Reflection</CardTitle>
        </CardHeader>
      )}
      <CardContent className={hideTitle ? "space-y-6 p-0" : "space-y-6"}>
        <div className="space-y-2">
          <Label htmlFor="went-well">What went well today?</Label>
          <Textarea
            id="went-well"
            value={wentWell}
            onChange={(e) => onWentWellChange(e.target.value)}
            placeholder="Celebrate wins, progress, and positive moments…"
            rows={4}
            disabled={disabled}
            className="min-h-24 resize-y bg-muted/35"
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
            className="min-h-24 resize-y bg-muted/35"
          />
        </div>
      </CardContent>
    </Card>
  );
}
