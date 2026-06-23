import type { Metadata } from "next";
import { FutureWorkPageContent } from "@/components/future-work/future-work-page-content";

export const metadata: Metadata = {
  title: "Future Work",
};

export default function FutureWorkPage() {
  return <FutureWorkPageContent />;
}
