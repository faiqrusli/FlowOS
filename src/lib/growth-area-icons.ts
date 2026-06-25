export type GrowthAreaIconOption = {
  emoji: string;
  label: string;
};

export type GrowthAreaIconCategory = {
  id: string;
  label: string;
  icons: GrowthAreaIconOption[];
};

export const GROWTH_AREA_ICON_CATEGORIES: GrowthAreaIconCategory[] = [
  {
    id: "core",
    label: "Core Areas",
    icons: [
      { emoji: "🧠", label: "Mindset" },
      { emoji: "🎯", label: "Discipline" },
      { emoji: "📘", label: "Learning" },
      { emoji: "💪", label: "Fitness" },
      { emoji: "💼", label: "Career" },
      { emoji: "💰", label: "Finance" },
      { emoji: "🕊️", label: "Mindfulness" },
      { emoji: "❤️", label: "Relationships" },
      { emoji: "📅", label: "Daily Notes" },
      { emoji: "🚀", label: "Startup" },
    ],
  },
  {
    id: "productivity",
    label: "Productivity",
    icons: [
      { emoji: "📚", label: "Study" },
      { emoji: "💻", label: "Programming" },
      { emoji: "🤖", label: "AI" },
      { emoji: "📝", label: "Notes" },
      { emoji: "📋", label: "Projects" },
      { emoji: "✅", label: "Tasks" },
      { emoji: "🔄", label: "Habits" },
      { emoji: "⏱️", label: "Focus" },
      { emoji: "🎓", label: "Education" },
      { emoji: "🔬", label: "Research" },
    ],
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    icons: [
      { emoji: "🏠", label: "Personal" },
      { emoji: "✈️", label: "Travel" },
      { emoji: "🎨", label: "Creative" },
      { emoji: "🎵", label: "Music" },
      { emoji: "🎮", label: "Gaming" },
      { emoji: "🍽️", label: "Food" },
      { emoji: "☕", label: "Coffee" },
      { emoji: "🚗", label: "Transport" },
      { emoji: "🛍️", label: "Shopping" },
      { emoji: "🌍", label: "Other" },
    ],
  },
];
