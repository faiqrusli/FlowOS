import type { Metadata } from "next";
import { ModuleRoadmapPageContent } from "@/components/module-roadmap/module-roadmap-page-content";
import { goalsModuleConfig } from "@/lib/module-roadmap-content";

export const metadata: Metadata = {
  title: "Goals",
};

export default function GoalsPage() {
  return <ModuleRoadmapPageContent config={goalsModuleConfig} />;
}
