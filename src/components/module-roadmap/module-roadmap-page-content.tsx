import { FutureWorkCard } from "@/components/module-roadmap/future-work-card";
import { PlannedFeaturesCard } from "@/components/module-roadmap/planned-features-card";
import { UnderDevelopmentCard } from "@/components/module-roadmap/under-development-card";
import { PageHeader } from "@/components/shared/page-header";
import type { ModuleRoadmapConfig } from "@/types/module-roadmap";

type ModuleRoadmapPageContentProps = {
  config: ModuleRoadmapConfig;
};

export function ModuleRoadmapPageContent({
  config,
}: ModuleRoadmapPageContentProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={config.title} description={config.description} />

      <div className="grid gap-4 lg:grid-cols-2">
        <UnderDevelopmentCard />
        <PlannedFeaturesCard features={config.plannedFeatures} />
      </div>

      <FutureWorkCard items={config.futureWork} />
    </div>
  );
}
