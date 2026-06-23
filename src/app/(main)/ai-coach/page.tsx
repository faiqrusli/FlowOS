import type { Metadata } from "next";
import { ModuleRoadmapPageContent } from "@/components/module-roadmap/module-roadmap-page-content";
import { aiCoachModuleConfig } from "@/lib/module-roadmap-content";

export const metadata: Metadata = {
  title: "AI Coach",
};

export default function AICoachPage() {
  return <ModuleRoadmapPageContent config={aiCoachModuleConfig} />;
}
