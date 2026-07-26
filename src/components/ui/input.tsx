import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-border-control bg-transparent px-2.5 py-1 text-base transition-[border-color,box-shadow,background-color] duration-150 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-placeholder hover:border-border-subtle hover:bg-surface-inset-hover focus-visible:border-primary/40 focus-visible:bg-surface-inset focus-visible:ring-2 focus-visible:ring-ring/40 hover:focus-visible:border-primary/40 hover:focus-visible:bg-surface-inset-hover hover:focus-visible:ring-2 hover:focus-visible:ring-ring/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/40 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25 md:text-sm dark:bg-surface-inset dark:hover:border-border-subtle dark:hover:bg-surface-inset-hover dark:focus-visible:bg-surface-inset dark:hover:focus-visible:border-primary/40 dark:hover:focus-visible:bg-surface-inset-hover dark:disabled:bg-surface-disabled/40 dark:aria-invalid:ring-destructive/35",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
