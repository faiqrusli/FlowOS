import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { FutureRoadmap } from "@/components/roadmap/future-roadmap";
import { Button } from "@/components/ui/button";

export function AboutPageContent() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About FlowOS"
        description="A personal productivity operating system for planning, execution, and reflection."
      />

      <div className="mx-auto max-w-2xl space-y-4">
        <section className="rounded-xl border border-border/60 bg-card px-5 py-4">
          <h2 className="text-sm font-medium text-foreground">What is FlowOS?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            FlowOS brings schedule, tasks, habits, focus sessions, and daily
            reflection into one cohesive workspace. It is designed to help you
            answer two questions every day: what should I do next, and am I on
            track?
          </p>
        </section>

        <section className="rounded-xl border border-border/60 bg-card px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-foreground">Future roadmap</h2>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/future-work" />}
            >
              View all
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Planned modules in development — not yet available in the app.
          </p>
          <FutureRoadmap compact className="mt-3" />
        </section>
      </div>
    </div>
  );
}
