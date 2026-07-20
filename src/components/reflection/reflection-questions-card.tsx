import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { drawerWritingFieldClass } from "@/lib/theme/surface-classes";
import { type as typography } from "@/lib/typography";

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
        <Label
          htmlFor="went-well"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-success/75"
        >
          What went well
        </Label>
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
        <Label
          htmlFor="went-wrong"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-warning/75"
        >
          What went wrong
        </Label>
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
    return <section className="space-y-5">{fields}</section>;
  }

  return (
    <section className="rounded-xl bg-surface-section px-4 py-5 sm:px-5">
      {hideTitle ? null : (
        <h2 className={typography.sectionTitle}>Reflection</h2>
      )}
      <div className={cn("space-y-6", hideTitle ? "mt-0" : "mt-4")}>{fields}</div>
    </section>
  );
}
