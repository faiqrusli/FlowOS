"use client";

import type { ReactNode } from "react";
import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

function DropdownMenu({ ...props }: Menu.Root.Props) {
  return <Menu.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({ className, ...props }: Menu.Trigger.Props) {
  return (
    <Menu.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn(
        "cursor-pointer outline-none disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  side = "top",
  align = "start",
  sideOffset = 6,
  collisionAvoidance,
  children,
}: Menu.Positioner.Props & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionAvoidance={collisionAvoidance}
        className="z-50 outline-none"
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "flow-surface-elevated min-w-[12rem] overflow-hidden p-1 outline-none",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-open:duration-150 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97 data-closed:duration-100",
            className,
          )}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

function DropdownMenuItem({ className, ...props }: Menu.Item.Props) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground/90 outline-none select-none transition-colors duration-100 data-highlighted:bg-surface-hover data-highlighted:text-foreground data-disabled:pointer-events-none data-disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.5] [&_svg]:text-muted-foreground [&_svg]:transition-colors [&_svg]:duration-100 data-highlighted:[&_svg]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLinkItem({ className, ...props }: Menu.LinkItem.Props) {
  return (
    <Menu.LinkItem
      data-slot="dropdown-menu-link-item"
      closeOnClick
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground/90 no-underline outline-none select-none transition-colors duration-100 data-highlighted:bg-surface-hover data-highlighted:text-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.5] [&_svg]:text-muted-foreground data-highlighted:[&_svg]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className, ...props }: Menu.Separator.Props) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-divider", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
