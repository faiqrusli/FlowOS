import type { Metadata } from "next";
import { HabitsPageContent } from "@/components/habits/habits-page-content";

export const metadata: Metadata = {
  title: "Habits",
};

export default function HabitsPage() {
  return <HabitsPageContent />;
}
