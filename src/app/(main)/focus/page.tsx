import type { Metadata } from "next";
import { FocusPageContent } from "@/components/focus/focus-page-content";

export const metadata: Metadata = {
  title: "Focus",
  description:
    "Review focus history, analytics, and settings. Execute deep work in Workplace.",
};

export default function FocusPage() {
  return <FocusPageContent />;
}
