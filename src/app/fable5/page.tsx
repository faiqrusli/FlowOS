import type { Metadata } from "next";
import { TodayPrototype } from "@/components/fable5/today-prototype";

export const metadata: Metadata = {
  title: "Today · Fable5 prototype",
  description:
    "Greenfield Today experience — Full / Focus / Work modes, focus engine, timeline, and queue.",
};

export default function Fable5Page() {
  return (
    <main className="h-[100dvh] min-h-0 overflow-hidden bg-background text-foreground">
      <TodayPrototype />
    </main>
  );
}
