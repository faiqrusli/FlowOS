export function isTodayUnifiedQueueEnabled(): boolean {
  return process.env.NEXT_PUBLIC_TODAY_UNIFIED_QUEUE === "true";
}
