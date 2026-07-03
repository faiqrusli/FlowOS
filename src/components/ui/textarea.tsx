import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-[border-color,box-shadow,background-color] duration-150 outline-none placeholder:text-muted-foreground hover:border-[color-mix(in_oklch,var(--input),var(--foreground)_18%)] focus-visible:border-primary/60 focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:bg-input/40 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25 md:text-sm dark:bg-input/30 dark:hover:bg-input/40 dark:focus-visible:bg-input/20 dark:focus-visible:shadow-[0_0_16px_-4px_var(--primary-glow)] dark:disabled:bg-input/15 dark:aria-invalid:ring-destructive/35",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
