import type { Metadata } from "next";
import { NotesPageContent } from "@/components/notes/notes-page-content";

export const metadata: Metadata = {
  title: "Notes",
  description: "Personal growth notes and knowledge capture",
};

export default function NotesPage() {
  return (
    <div className="flex h-[calc(100dvh-6.5rem)] min-h-0 flex-col overflow-hidden lg:h-[calc(100dvh-4rem)]">
      <NotesPageContent />
    </div>
  );
}
