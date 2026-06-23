import type { Metadata } from "next";
import { NotesPageContent } from "@/components/notes/notes-page-content";

export const metadata: Metadata = {
  title: "Notes",
  description: "Personal growth notes and knowledge capture",
};

export default function NotesPage() {
  return <NotesPageContent />;
}
