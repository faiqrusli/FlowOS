import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-border-control bg-transparent px-2.5 py-2 text-base transition-[border-color,box-shadow,background-color] duration-150 outline-none placeholder:text-muted-foreground hover:border-border-subtle hover:bg-surface-inset-hover focus-visible:border-primary/40 focus-visible:bg-surface-inset focus-visible:ring-2 focus-visible:ring-ring/40 hover:focus-visible:border-primary/40 hover:focus-visible:bg-surface-inset-hover hover:focus-visible:ring-2 hover:focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:bg-input/40 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25 md:text-sm dark:bg-surface-inset dark:hover:border-border-subtle dark:hover:bg-surface-inset-hover dark:focus-visible:bg-surface-inset dark:hover:focus-visible:border-primary/40 dark:hover:focus-visible:bg-surface-inset-hover dark:disabled:bg-input/15 dark:aria-invalid:ring-destructive/35",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
