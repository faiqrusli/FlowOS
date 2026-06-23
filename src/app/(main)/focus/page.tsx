import type { Metadata } from "next";
import { FocusPageContent } from "@/components/focus/focus-page-content";

export const metadata: Metadata = {
  title: "Focus",
};

export default function FocusPage() {
  return <FocusPageContent />;
}
