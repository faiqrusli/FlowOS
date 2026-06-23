import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ReflectionQuestionsCardProps = {
  wentWell: string;
  wentWrong: string;
  onWentWellChange: (value: string) => void;
  onWentWrongChange: (value: string) => void;
  disabled?: boolean;
};

export function ReflectionQuestionsCard({
  wentWell,
  wentWrong,
  onWentWellChange,
  onWentWrongChange,
  disabled,
}: ReflectionQuestionsCardProps) {
  return (
    <Card className="border-neutral-200/80 bg-white ring-neutral-200/80">
      <CardHeader>
        <CardTitle>Reflection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="went-well">What went well today?</Label>
          <Textarea
            id="went-well"
            value={wentWell}
            onChange={(e) => onWentWellChange(e.target.value)}
            placeholder="Celebrate wins, progress, and positive moments…"
            rows={4}
            disabled={disabled}
            className="min-h-24 resize-y bg-neutral-50/50"
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
            className="min-h-24 resize-y bg-neutral-50/50"
          />
        </div>
      </CardContent>
    </Card>
  );
}
