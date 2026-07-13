import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { drawerWritingFieldClass } from "@/lib/theme/surface-classes";

type ReflectionQuestionsCardProps = {
  wentWell: string;
  wentWrong: string;
  onWentWellChange: (value: string) => void;
  onWentWrongChange: (value: string) => void;
  disabled?: boolean;
  hideTitle?: boolean;
  /** Drawer: no outer card — content sits on chrome. */
  flat?: boolean;
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
  flat = false,
}: ReflectionQuestionsCardProps) {
  const fields = (
    <>
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
    </>
  );

  if (flat) {
    return <section className="space-y-6">{fields}</section>;
  }

  return (
    <Card className="border-border-subtle shadow-none">
      {hideTitle ? null : (
        <CardHeader>
          <CardTitle>Reflection</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("space-y-6", hideTitle && "pt-4")}>
        {fields}
      </CardContent>
    </Card>
  );
}
