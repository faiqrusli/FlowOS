import { useEffect, useState } from "react";
import { getTodayDateString } from "@/lib/date-utils";
import { createDateChangeDetector } from "@/lib/date-refresh";

const DATE_CHECK_INTERVAL_MS = 60_000;

export function useAppDateKey(): string {
  const [dateKey, setDateKey] = useState(getTodayDateString);

  useEffect(() => {
    const checkDate = createDateChangeDetector(getTodayDateString, setDateKey);
    const intervalId = window.setInterval(checkDate, DATE_CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", checkDate);
    window.addEventListener("focus", checkDate);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", checkDate);
      window.removeEventListener("focus", checkDate);
    };
  }, []);

  return dateKey;
}
