const CATEGORY_COLORS: Record<string, string> = {
  IDE: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "VSCode Extension": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "IDE Extension": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  CLI: "bg-green-500/20 text-green-300 border-green-500/30",
  Platform: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "GitHub Bot": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  "PR Review": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Research: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Self-hosted Copilot": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClass =
    CATEGORY_COLORS[category] ||
    "bg-gray-500/20 text-gray-300 border-gray-500/30";

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs rounded-full border ${colorClass}`}
    >
      {category}
    </span>
  );
}
