import type { ReactNode } from "react";
import { type } from "@/lib/typography";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className={type.pageTitle}>{title}</h1>
        <p className={type.pageDescription}>{description}</p>
      </div>
      {action}
    </div>
  );
}
