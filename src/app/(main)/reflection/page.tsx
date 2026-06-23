import type { Metadata } from "next";
import { ReflectionPageContent } from "@/components/reflection/reflection-page-content";

export const metadata: Metadata = {
  title: "Reflection",
};

export default function ReflectionPage() {
  return <ReflectionPageContent />;
}
