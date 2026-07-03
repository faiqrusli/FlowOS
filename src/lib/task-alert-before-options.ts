import {
  formatDurationMinutes,
  formatDurationTimeInput,
  parseDurationTimeInput,
} from "@/lib/task-duration-options";

export const TASK_ALERT_BEFORE_OPTIONS = [
  { label: "5 min", minutes: 5 },
  { label: "10 min", minutes: 10 },
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "1 hour", minutes: 60 },
  { label: "2 hours", minutes: 120 },
] as const;

export type TaskAlertBeforeValue = {
  notification_enabled: boolean;
  notification_lead_minutes: number | null;
};

export function formatAlertBeforeLabel(
  notificationEnabled: boolean,
  leadMinutes: number | null | undefined
): string {
  if (!notificationEnabled) return "Silent";
  if (!leadMinutes || leadMinutes <= 0) return "None";
  return formatDurationMinutes(leadMinutes);
}

export function isAlertBeforeConfigured(
  notificationEnabled: boolean,
  leadMinutes: number | null | undefined
): boolean {
  return (
    notificationEnabled &&
    leadMinutes !== null &&
    leadMinutes !== undefined &&
    leadMinutes > 0
  );
}

export function alertBeforeToTaskUpdates(
  notificationEnabled: boolean,
  leadMinutes: number | null
): TaskAlertBeforeValue {
  return {
    notification_enabled: notificationEnabled,
    notification_lead_minutes: notificationEnabled ? leadMinutes : null,
  };
}

export function applySilentAlert(): TaskAlertBeforeValue {
  return { notification_enabled: false, notification_lead_minutes: null };
}

export function applyClearAlert(): TaskAlertBeforeValue {
  return { notification_enabled: true, notification_lead_minutes: null };
}

export function applyPresetAlert(minutes: number): TaskAlertBeforeValue {
  return {
    notification_enabled: true,
    notification_lead_minutes: minutes,
  };
}

export {
  formatDurationTimeInput as formatAlertBeforeTimeInput,
  parseDurationTimeInput as parseAlertBeforeTimeInput,
};
