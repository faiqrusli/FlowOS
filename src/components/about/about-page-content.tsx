import Link from "next/link";
import { KeyboardShortcutsSection } from "@/components/about/keyboard-shortcuts-section";
import { type } from "@/lib/typography";

const LOOP = [
  { title: "Plan", line: "Create intention." },
  { title: "Commit", line: "Choose what deserves today." },
  { title: "Execute", line: "Do the work. Track reality." },
  { title: "Reflect", line: "Learn, then improve the next cycle." },
] as const;

const MODULES = [
  { href: "/", title: "Today", line: "Where the day is run." },
  { href: "/tasks", title: "Tasks", line: "Capture and organize work." },
  { href: "/habits", title: "Habits", line: "Routines that compound." },
  { href: "/schedule", title: "Schedule", line: "Intention on a timeline." },
  { href: "/focus", title: "Focus", line: "Evidence of real work." },
  { href: "/notes", title: "Notes", line: "Context beside the work." },
  { href: "/reflection", title: "Reflection", line: "Plans vs. reality." },
] as const;

export function AboutPageContent() {
  return (
    <div className="mx-auto max-w-xl space-y-12 pb-12 pt-2">
      <header className="space-y-5">
        <h1 className={type.pageTitle}>FlowOS</h1>
        <p className="text-base leading-relaxed text-foreground/90">
          A personal execution system.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Most tools help you organize work. FlowOS exists for the harder gap —
          between what you intended and what you actually did.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className={type.sectionTitle}>One loop</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Tasks, habits, schedule, focus, and reflection are not separate apps
          sharing a sidebar. They are stages of the same day.
        </p>
        <ol className="space-y-3">
          {LOOP.map((step, index) => (
            <li key={step.title} className="flex gap-3 text-sm">
              <span className="w-4 shrink-0 tabular-nums text-muted-foreground">
                {index + 1}
              </span>
              <span>
                <span className="font-medium text-foreground">{step.title}</span>
                <span className="text-muted-foreground"> — {step.line}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className={type.sectionTitle}>Today is the center</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Not projects. Not endless lists.{" "}
          <Link
            href="/"
            className="text-foreground underline-offset-2 hover:underline"
          >
            Today
          </Link>{" "}
          answers three questions: what matters now, what comes next, and whether
          you are still on what you committed to.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={type.sectionTitle}>Modules</h2>
        <ul className="space-y-2.5">
          {MODULES.map((module) => (
            <li key={module.href} className="flex gap-3 text-sm">
              <Link
                href={module.href}
                className="w-24 shrink-0 font-medium text-foreground underline-offset-2 hover:underline"
              >
                {module.title}
              </Link>
              <span className="text-muted-foreground">{module.line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className={type.sectionTitle}>Personal by design</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Built for one person managing their own day — not teams, not
          collaboration, not another place to collect tasks.
        </p>
      </section>

      <p className="border-t border-border-subtle/70 pt-10 text-sm leading-relaxed text-muted-foreground">
        Know what matters. Commit. Execute. See progress. Reflect. Improve.
      </p>

      <KeyboardShortcutsSection className="rounded-none bg-transparent px-0 py-0 shadow-none" />
    </div>
  );
}
