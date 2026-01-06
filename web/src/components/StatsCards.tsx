import type { AgentStats } from "../types";

interface StatsCardsProps {
  agents: AgentStats[];
}

export function StatsCards({ agents }: StatsCardsProps) {
  const totalStars = agents.reduce((sum, a) => sum + a.stars, 0);
  const totalDelta = agents.reduce((sum, a) => sum + a.starDelta7d, 0);
  const avgVelocity = Math.round(
    agents.reduce((sum, a) => sum + a.velocityScore, 0) / agents.length
  );
  const topMover = [...agents].sort(
    (a, b) => b.starDelta7d - a.starDelta7d
  )[0];

  const cards = [
    {
      label: "Total Stars",
      value: totalStars.toLocaleString(),
      sub: `across ${agents.length} agents`,
      color: "from-yellow-500/20 to-orange-500/20",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    {
      label: "7-Day Growth",
      value: totalDelta > 0 ? `+${totalDelta.toLocaleString()}` : totalDelta.toLocaleString(),
      sub: "stars this week",
      color: totalDelta >= 0 ? "from-emerald-500/20 to-green-500/20" : "from-red-500/20 to-rose-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: "Avg Velocity",
      value: avgVelocity.toString(),
      sub: "momentum score",
      color: "from-blue-500/20 to-cyan-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Top Mover",
      value: topMover?.name || "-",
      sub: topMover ? `+${topMover.starDelta7d.toLocaleString()} stars` : "",
      color: "from-purple-500/20 to-pink-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-gradient-to-br ${card.color} rounded-xl p-4 border border-gray-800/50`}
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            {card.icon}
            <span className="text-xs uppercase tracking-wider">{card.label}</span>
          </div>
          <div className="text-2xl font-bold text-white">{card.value}</div>
          <div className="text-xs text-gray-500 mt-1">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
