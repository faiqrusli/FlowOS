import type { Metadata } from "next";
import { WeeklyReflectionPageContent } from "@/components/reflection/weekly-reflection-page-content";

export const metadata: Metadata = {
  title: "Weekly Reflection",
};

export default function WeeklyReflectionPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <WeeklyReflectionPageContent />
    </div>
  );
}
