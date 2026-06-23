import type { Metadata } from "next";
import { ModuleRoadmapPageContent } from "@/components/module-roadmap/module-roadmap-page-content";
import { weeklyReviewModuleConfig } from "@/lib/module-roadmap-content";

export const metadata: Metadata = {
  title: "Weekly Review",
};

export default function WeeklyReviewPage() {
  return <ModuleRoadmapPageContent config={weeklyReviewModuleConfig} />;
}
