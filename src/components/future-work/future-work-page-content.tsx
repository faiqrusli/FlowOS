import { PageHeader } from "@/components/shared/page-header";
import { FutureRoadmap } from "@/components/roadmap/future-roadmap";

export function FutureWorkPageContent() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Future Work"
        description="Upcoming modules planned for future FlowOS releases."
      />

      <div className="mx-auto max-w-2xl">
        <section className="rounded-xl border border-border/60 bg-card px-5 py-4">
          <p className="text-sm text-muted-foreground">
            These features are intentionally hidden from the main navigation
            while core productivity modules are polished for release.
          </p>
          <FutureRoadmap className="mt-4" />
        </section>
      </div>
    </div>
  );
}
