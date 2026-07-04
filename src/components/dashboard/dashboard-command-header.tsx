import { formatTodayHeading } from "@/lib/date-utils";
import { type } from "@/lib/typography";

type DashboardCommandHeaderProps = {
  displayName?: string;
  loading?: boolean;
  title?: string;
  anonymousGreeting?: string | null;
};

export function DashboardCommandHeader({
  displayName,
  loading,
  title = "Dashboard",
  anonymousGreeting = "Command center",
}: DashboardCommandHeaderProps) {
  const greeting = displayName
    ? `Good day, ${displayName.split(" ")[0]}`
    : anonymousGreeting;

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {!loading && greeting ? (
          <p className={type.pageGreeting}>{greeting}</p>
        ) : null}
        <h1 className={type.pageTitle}>{title}</h1>
      </div>
      {!loading && (
        <p className={type.pageDate}>{formatTodayHeading()}</p>
      )}
    </div>
  );
}
