import Link from "next/link";
import {
  CalendarDays,
  CheckSquare,
  Focus,
  LayoutDashboard,
  NotebookPen,
  Repeat,
  StickyNote,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

const DAILY_LOOP = [
  {
    title: "Plan",
    description:
      "Capture tasks, set habits, and place work on your schedule so the day has a clear shape.",
  },
  {
    title: "Execute",
    description:
      "Run the day from Today — complete tasks and habits, then drop into focus sessions when you need deep work.",
  },
  {
    title: "Reflect",
    description:
      "Close the loop with daily reflection and notes so tomorrow starts with clearer judgment, not guesswork.",
  },
] as const;

const MODULES = [
  {
    href: "/",
    title: "Today",
    description: "Your home for the day — tasks, habits, timeline, and focus in one place.",
    icon: LayoutDashboard,
  },
  {
    href: "/tasks",
    title: "Tasks",
    description: "Capture, organize, and track work across boards and lists.",
    icon: CheckSquare,
  },
  {
    href: "/habits",
    title: "Habits",
    description: "Build recurring routines and mark them done as the day unfolds.",
    icon: Repeat,
  },
  {
    href: "/schedule",
    title: "Schedule",
    description: "Time-block your day on a full planner when you need structure.",
    icon: CalendarDays,
  },
  {
    href: "/focus",
    title: "Focus",
    description: "Run timed sessions, track history, and protect deep-work blocks.",
    icon: Focus,
  },
  {
    href: "/notes",
    title: "Notes",
    description: "Keep reference material and ideas beside your daily workflow.",
    icon: StickyNote,
  },
  {
    href: "/reflection",
    title: "Reflection",
    description: "Review how the day went and carry lessons into the next one.",
    icon: NotebookPen,
  },
] as const;

export function AboutPageContent() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About FlowOS"
        description="A personal daily productivity operating system — plan, execute, and reflect in one workspace."
      />

      <div className="mx-auto max-w-3xl space-y-4">
        <section className="rounded-xl border-0 bg-surface-section px-5 py-5 shadow-none">
          <h2 className="text-sm font-medium text-foreground">What is FlowOS?</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              FlowOS is built for self-directed people who currently split their
              day across a task manager, habit tracker, focus timer, and journal.
              Instead of switching apps, you get one continuous loop: decide what
              matters, do the work, then look back.
            </p>
            <p>
              Every day is meant to answer two questions —{" "}
              <span className="text-foreground">what should I do next?</span> and{" "}
              <span className="text-foreground">am I on track?</span>
            </p>
          </div>
        </section>

        <section className="rounded-xl border-0 bg-surface-section px-5 py-5 shadow-none">
          <h2 className="text-sm font-medium text-foreground">The daily loop</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Three phases, one product — not four separate tools.
          </p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {DAILY_LOOP.map((phase, index) => (
              <li
                key={phase.title}
                className="rounded-lg bg-surface-raised px-3.5 py-3"
              >
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {index + 1}. {phase.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {phase.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border-0 bg-surface-section px-5 py-5 shadow-none">
          <h2 className="text-sm font-medium text-foreground">What&apos;s included</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Modules available in the app today.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <li key={module.href}>
                  <Link
                    href={module.href}
                    className="flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-ghost-hover"
                  >
                    <Icon
                      className="mt-0.5 size-4 shrink-0 stroke-[1.5] text-foreground"
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {module.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {module.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl border-0 bg-surface-section px-5 py-5 shadow-none">
          <h2 className="text-sm font-medium text-foreground">Who it&apos;s for</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Knowledge workers, researchers, writers, and serious students who
              already run a daily system — and want that system in one dark,
              calm workspace instead of a pile of single-purpose apps.
            </p>
            <p>
              FlowOS is personal by design: one person, one daily loop, no team
              boards or collaboration features.
            </p>
          </div>
        </section>

        <section className="rounded-xl border-0 bg-surface-section px-5 py-5 shadow-none">
          <h2 className="text-sm font-medium text-foreground">Getting started</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground">
            <li>
              Open{" "}
              <Link href="/" className="text-foreground underline-offset-2 hover:underline">
                Today
              </Link>{" "}
              — that&apos;s home for the day.
            </li>
            <li>Add a few tasks and habits, or place work on the schedule.</li>
            <li>Start a focus session when you need uninterrupted time.</li>
            <li>
              End the day in{" "}
              <Link
                href="/reflection"
                className="text-foreground underline-offset-2 hover:underline"
              >
                Reflection
              </Link>{" "}
              so the next morning starts with context.
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
