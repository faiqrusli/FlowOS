"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  children,
  ...props
}: TooltipPrimitive.Positioner.Props & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        className="z-50 outline-none"
        {...props}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "flow-surface-elevated max-w-64 px-3 py-2 text-xs leading-relaxed text-foreground/90 outline-none",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-open:duration-150 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97 data-closed:duration-100",
            className
          )}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipTrigger };
