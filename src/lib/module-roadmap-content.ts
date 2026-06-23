import type { ModuleRoadmapConfig } from "@/types/module-roadmap";

export const goalsModuleConfig: ModuleRoadmapConfig = {
  title: "Goals",
  description:
    "Define what you are working toward and connect daily execution to long-term outcomes across tasks, habits, and focus.",
  plannedFeatures: [
    "Create long-term and short-term goals",
    "Track progress over time",
    "Set milestones and target dates",
    "Goal-task integration across FlowOS",
  ],
  futureWork: [
    "Goal templates for common productivity outcomes",
    "Progress visualizations and completion trends",
    "Habit and focus session linkage to goals",
    "Dashboard widgets for active goal status",
  ],
};

export const notesModuleConfig: ModuleRoadmapConfig = {
  title: "Notes",
  description:
    "Capture ideas, reference material, and personal knowledge in one place alongside your daily productivity workflow.",
  plannedFeatures: [
    "Personal notes with rich text support",
    "Knowledge management and organization",
    "Quick capture from anywhere in FlowOS",
    "Search and structured note collections",
  ],
  futureWork: [
    "Tags, folders, and pinned notes",
    "Link notes to tasks, habits, and reflections",
    "Markdown export and backup options",
    "Full-text search across all notes",
  ],
};

export const weeklyReviewModuleConfig: ModuleRoadmapConfig = {
  title: "Weekly Review",
  description:
    "Review your week in one structured view by combining schedule adherence, habit consistency, focus output, and reflections.",
  plannedFeatures: [
    "Weekly productivity summary",
    "Habit consistency analysis",
    "Focus session insights",
    "Reflection aggregation",
    "AI-generated weekly insights",
  ],
  futureWork: [
    "Customizable review templates",
    "Week-over-week comparison charts",
    "Exportable weekly reports",
    "Automated review reminders",
  ],
};

export const aiCoachModuleConfig: ModuleRoadmapConfig = {
  title: "AI Coach",
  description:
    "Receive personalized guidance based on your tasks, habits, focus patterns, and reflections to improve planning and follow-through.",
  plannedFeatures: [
    "Daily planning assistance",
    "Reflection analysis and prompts",
    "Goal recommendations",
    "Productivity insights from your data",
    "Personalized coaching conversations",
  ],
  futureWork: [
    "Context-aware suggestions across modules",
    "Weekly review co-pilot",
    "Adaptive habit and schedule recommendations",
    "Privacy controls for AI data usage",
  ],
};
