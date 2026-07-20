import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/about-page-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "A personal execution system for planning, executing, and continuously improving your work.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
