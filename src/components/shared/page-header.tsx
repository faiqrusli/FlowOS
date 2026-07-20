import type { ReactNode } from "react";
import { type } from "@/lib/typography";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

/** Page title block — section gap to following content comes from shell `space-y-6` (24px). */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className={type.pageTitle}>{title}</h1>
        {description ? (
          <p className={type.pageDescription}>{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
