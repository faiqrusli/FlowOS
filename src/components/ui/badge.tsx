import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "h-5 rounded-4xl bg-primary px-2 py-0.5 text-xs text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "h-5 rounded-4xl bg-secondary px-2 py-0.5 text-xs text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "h-5 rounded-4xl bg-destructive/10 px-2 py-0.5 text-xs text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "h-5 rounded-4xl border-border px-2 py-0.5 text-xs text-foreground [a]:hover:bg-surface-hover [a]:hover:text-muted-foreground",
        ghost:
          "h-5 rounded-4xl px-2 py-0.5 text-xs hover:bg-surface-hover hover:text-muted-foreground",
        link: "h-5 rounded-4xl px-2 py-0.5 text-xs text-primary underline-offset-4 hover:underline",
        "entity-dot":
          "h-5 rounded-md border-border bg-transparent px-2 py-0.5 text-xs text-foreground",
        "entity-habit":
          "h-4 rounded-md border-transparent bg-transparent px-1 py-px text-[11px] font-semibold uppercase tracking-wide text-warning/65",
        "entity-focus":
          "h-4 rounded-md border-transparent bg-transparent p-0 text-accent-text",
        "status-success":
          "h-5 rounded-md border-transparent bg-success-muted px-2 py-0.5 text-xs text-success",
        "status-warning":
          "h-5 rounded-md border-transparent bg-warning-muted px-2 py-0.5 text-xs text-warning",
        "status-destructive":
          "h-5 rounded-md border-transparent bg-destructive-muted px-2 py-0.5 text-xs text-destructive",
        plain:
          "h-4 rounded-md border-border/35 bg-surface-raised px-1.5 py-0 text-[11px] text-foreground/85",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    dotClassName?: string;
  };

function Badge({
  className,
  variant = "default",
  dotClassName,
  children,
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
        children: (
          <>
            {dotClassName ? (
              <span
                aria-hidden
                className={cn("size-2 shrink-0 rounded-full", dotClassName)}
              />
            ) : null}
            {children}
          </>
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
