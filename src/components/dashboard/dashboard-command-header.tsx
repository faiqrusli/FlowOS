import { formatTodayHeading } from "@/lib/date-utils";
import { type } from "@/lib/typography";

type DashboardCommandHeaderProps = {
  displayName?: string;
  loading?: boolean;
};

export function DashboardCommandHeader({
  displayName,
  loading,
}: DashboardCommandHeaderProps) {
  const greeting = displayName
    ? `Good day, ${displayName.split(" ")[0]}`
    : "Command center";

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {!loading && <p className={type.pageGreeting}>{greeting}</p>}
        <h1 className={type.pageTitle}>Dashboard</h1>
      </div>
      {!loading && (
        <p className={type.pageDate}>{formatTodayHeading()}</p>
      )}
    </div>
  );
}
