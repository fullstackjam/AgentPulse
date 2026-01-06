import type { AgentStats } from "../types";
import { VelocityBar } from "./VelocityBar";
import { DeltaBadge } from "./DeltaBadge";
import { CategoryBadge } from "./CategoryBadge";

interface AgentRowProps {
  agent: AgentStats;
  rank: number;
  maxVelocity: number;
}

export function AgentRow({ agent, rank, maxVelocity }: AgentRowProps) {
  const isTopThree = rank <= 3;

  return (
    <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold ${
            isTopThree
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-gray-800 text-gray-400"
          }`}
        >
          {rank}
        </span>
      </td>

      <td className="px-4 py-4">
        <div className="flex flex-col gap-1">
          <a
            href={`https://github.com/${agent.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1.5"
          >
            {agent.name}
            <svg
              className="w-3.5 h-3.5 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <span className="text-xs text-gray-500 font-mono">{agent.repo}</span>
        </div>
      </td>

      <td className="px-4 py-4">
        <CategoryBadge category={agent.category} />
      </td>

      <td className="px-4 py-4 text-right">
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-mono text-gray-200">
            {agent.stars.toLocaleString()}
          </span>
          <DeltaBadge value={agent.starDelta7d} />
        </div>
      </td>

      <td className="px-4 py-4 text-right font-mono text-gray-400">
        {agent.forks.toLocaleString()}
      </td>

      <td className="px-4 py-4 text-right font-mono text-gray-400">
        {agent.commits30d}
      </td>

      <td className="px-4 py-4 w-40">
        <VelocityBar value={agent.velocityScore} maxValue={maxVelocity} />
      </td>
    </tr>
  );
}
