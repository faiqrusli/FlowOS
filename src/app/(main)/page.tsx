import type { Metadata } from "next";

import { WorkplacePageContent } from "@/components/workplace/workplace-page-content";

export const metadata: Metadata = {
  title: "Today",
  description:
    "Plan and execute today's work with tasks, Focus, habits, and schedule in one place.",
};

export default function Home() {
  return <WorkplacePageContent />;
}
