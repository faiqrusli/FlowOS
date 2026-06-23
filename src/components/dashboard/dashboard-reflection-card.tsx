import {
  DashboardEmptyLine,
  DashboardPanel,
  DashboardSupportingText,
} from "@/components/dashboard/dashboard-card-shell";
import { parseReflectionLines } from "@/lib/reflection-preview";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { Reflection } from "@/types/reflection";

type DashboardReflectionCardProps = {
  reflection: Reflection | null;
};

export function DashboardReflectionCard({
  reflection,
}: DashboardReflectionCardProps) {
  const completed = Boolean(reflection);
  const wins = reflection ? parseReflectionLines(reflection.went_well) : [];
  const improvements = reflection
    ? parseReflectionLines(reflection.went_wrong)
    : [];

  return (
    <DashboardPanel
      title="Reflection"
      href="/reflection"
      actionLabel={completed ? "View" : "Write"}
    >
      {completed ? (
        <>
          <DashboardSupportingText className="text-emerald-700 dark:text-emerald-400">
            Completed today
          </DashboardSupportingText>
          {wins[0] && (
            <p className={cn("line-clamp-2", type.body, "leading-relaxed")}>
              {wins[0]}
            </p>
          )}
          {improvements[0] && (
            <DashboardSupportingText className="line-clamp-2">
              {improvements[0]}
            </DashboardSupportingText>
          )}
        </>
      ) : (
        <>
          <DashboardEmptyLine message="Not completed yet." />
          <DashboardSupportingText>
            Capture what went well, what didn&apos;t, and one improvement for
            tomorrow.
          </DashboardSupportingText>
        </>
      )}
    </DashboardPanel>
  );
}
