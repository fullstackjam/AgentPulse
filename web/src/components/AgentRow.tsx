import type { AgentStats } from "../types";
import { VelocityBar } from "./VelocityBar";
import { DeltaBadge } from "./DeltaBadge";
import { CategoryBadge } from "./CategoryBadge";

function formatDownloads(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

function DownloadsCell({ agent }: { agent: AgentStats }) {
  const pypi = agent.pypiDownloads;
  const npm = agent.npmDownloads;
  const vscode = agent.vsCodeDownloads;
  const total = (pypi ?? 0) + (npm ?? 0) + (vscode ?? 0);

  if (total === 0) {
    return <span className="text-gray-600">-</span>;
  }

  const parts: string[] = [];
  if (pypi) parts.push(`PyPI: ${formatDownloads(pypi)}`);
  if (npm) parts.push(`npm: ${formatDownloads(npm)}`);
  if (vscode) parts.push(`VSCode: ${formatDownloads(vscode)}`);

  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="font-mono text-gray-200">{formatDownloads(total)}</span>
      <span className="text-xs text-gray-500">{parts.join(" · ")}</span>
    </div>
  );
}

function HNBuzzCell({
  mentions,
  points,
}: {
  mentions?: number;
  points?: number;
}) {
  if (!mentions && !points) {
    return <span className="text-gray-600">-</span>;
  }

  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="font-mono text-orange-400">{points ?? 0}</span>
      <span className="text-xs text-gray-500">
        {mentions ?? 0} {mentions === 1 ? "post" : "posts"}
      </span>
    </div>
  );
}

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

      <td className="px-4 py-4 text-right">
        <DownloadsCell agent={agent} />
      </td>

      <td className="px-4 py-4 text-right">
        <HNBuzzCell mentions={agent.hnMentions} points={agent.hnPoints} />
      </td>

      <td className="px-4 py-4 w-40">
        <VelocityBar value={agent.velocityScore} maxValue={maxVelocity} />
      </td>
    </tr>
  );
}
