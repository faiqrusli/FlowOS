"use client";

import { Clock, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useState } from "react";
import {
  TimelinePlanner,
  type TimelinePlannerProps,
} from "@/components/tasks/timeline-planner";
import {
  panelToggleHoverIconClass,
  panelTogglePrimaryIconClass,
  panelToggleTabClass,
} from "@/lib/panel-toggle-styles";
import {
  PANEL_LAYOUT_MS,
  panelSlideTransitionStyle,
  panelWidthTransitionStyle,
} from "@/lib/panel-layout-animation";
import { TIMELINE_DRAWER_WIDTH_PX } from "@/lib/timeline-drag";
import { cn } from "@/lib/utils";

/** Below this, Quick Schedule overlays so the Tasks board keeps drag width. */
const QUICK_SCHEDULE_OVERLAY_BELOW_PX = 1024;

type TimelineDrawerProps = Omit<TimelinePlannerProps, "variant" | "onClose"> & {
  open: boolean;
  onClose: () => void;
};

function TimelineTabButton({
  onClick,
  active,
  className,
  style,
}: {
  onClick: () => void;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={cn(panelToggleTabClass(), className)}
      aria-label={active ? "Collapse Quick Schedule" : "Open Quick Schedule"}
    >
      <Clock className={panelTogglePrimaryIconClass()} />
      {active ? (
        <PanelRightClose className={panelToggleHoverIconClass()} />
      ) : (
        <PanelRightOpen className={panelToggleHoverIconClass()} />
      )}
    </button>
  );
}

function TimelineDrawerPanel({
  open,
  showContent,
  onClose,
  className,
  style,
  ...props
}: TimelineDrawerProps & {
  showContent: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "relative h-full shrink-0 overflow-hidden bg-surface-canvas",
        open && "shadow-[-8px_0_20px_rgba(0,0,0,0.22)]",
        className,
      )}
      style={style}
    >
      <div
        className={cn(
          "relative h-full overflow-hidden",
          open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-5 opacity-0",
        )}
        style={{ transition: panelSlideTransitionStyle() }}
      >
        {showContent ? (
          <TimelinePlanner variant="drawer" onClose={onClose} {...props} />
        ) : null}
      </div>
    </div>
  );
}

export function TimelineDrawer({ open, onClose, ...props }: TimelineDrawerProps) {
  const [showContent, setShowContent] = useState(open);
  const [overlayMode, setOverlayMode] = useState(false);

  useEffect(() => {
    if (open) {
      setShowContent(true);
      return;
    }

    const timer = window.setTimeout(() => setShowContent(false), PANEL_LAYOUT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    const sync = () => {
      setOverlayMode(window.innerWidth < QUICK_SCHEDULE_OVERLAY_BELOW_PX);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const panelWidth = `min(100%, ${TIMELINE_DRAWER_WIDTH_PX}px)`;

  // Narrow layouts: float over the board so columns keep width and stay draggable.
  if (overlayMode) {
    return (
      <>
        {open ? (
          <button
            type="button"
            aria-label="Close Quick Schedule"
            className="fixed inset-0 z-40 bg-black/35"
            onClick={onClose}
          />
        ) : null}
        <div
          aria-hidden={!open}
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex",
            !open && "pointer-events-none",
          )}
          style={{
            width: panelWidth,
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: panelSlideTransitionStyle(),
          }}
        >
          {open ? (
            <TimelineTabButton
              active
              onClick={onClose}
              className="absolute top-1/2 -left-8 z-30 -translate-y-1/2"
            />
          ) : null}
          <TimelineDrawerPanel
            open={open}
            showContent={showContent}
            onClose={onClose}
            className="w-full"
            {...props}
          />
        </div>
      </>
    );
  }

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "relative h-full shrink-0 overflow-visible",
        open ? "z-30" : "z-0",
        !open && "pointer-events-none",
      )}
      style={{
        width: open ? panelWidth : 0,
        transition: panelWidthTransitionStyle(),
      }}
    >
      {open ? (
        <TimelineTabButton
          active
          onClick={onClose}
          className="absolute top-1/2 -left-8 z-30 -translate-y-1/2"
        />
      ) : null}
      <TimelineDrawerPanel
        open={open}
        showContent={showContent}
        onClose={onClose}
        style={{ width: panelWidth }}
        {...props}
      />
    </div>
  );
}

export function TimelineDrawerToggle({
  open,
  detailPanelOffsetPx = 0,
  onToggle,
}: {
  open: boolean;
  detailPanelOffsetPx?: number;
  onToggle: () => void;
}) {
  const [mounted, setMounted] = useState(!open);
  const [visible, setVisible] = useState(!open);

  useEffect(() => {
    if (open) {
      setVisible(false);
      const timer = window.setTimeout(() => setMounted(false), PANEL_LAYOUT_MS);
      return () => window.clearTimeout(timer);
    }

    setMounted(true);
    setVisible(false);
    const frame = window.requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  if (!mounted) return null;

  return (
    <TimelineTabButton
      onClick={onToggle}
      className={cn(
        "fixed top-1/2 z-30 -translate-y-1/2",
        visible ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-5 opacity-0"
      )}
      style={{
        right: detailPanelOffsetPx,
        transition: panelWidthTransitionStyle(),
      }}
    />
  );
}
