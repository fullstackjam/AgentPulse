import type { AgentStats, Snapshot } from "../types.js";

const WEIGHTS = {
  STAR_DELTA_7D: 10,
  FORK_DELTA_30D: 5,
  COMMITS_30D: 1,
};

export function calculateVelocityScore(
  starDelta7d: number,
  forkDelta30d: number,
  commits30d: number
): number {
  return (
    Math.max(0, starDelta7d) * WEIGHTS.STAR_DELTA_7D +
    Math.max(0, forkDelta30d) * WEIGHTS.FORK_DELTA_30D +
    commits30d * WEIGHTS.COMMITS_30D
  );
}

export function computeDeltas(
  currentStats: { stars: number; forks: number },
  snapshot7dAgo: Snapshot | null,
  snapshot30dAgo: Snapshot | null,
  agentId: string
): { starDelta7d: number; forkDelta30d: number } {
  let starDelta7d = 0;
  let forkDelta30d = 0;

  if (snapshot7dAgo) {
    const prev = snapshot7dAgo.agents.find((a) => a.id === agentId);
    if (prev) {
      starDelta7d = currentStats.stars - prev.stars;
    }
  }

  if (snapshot30dAgo) {
    const prev = snapshot30dAgo.agents.find((a) => a.id === agentId);
    if (prev) {
      forkDelta30d = currentStats.forks - prev.forks;
    }
  }

  return { starDelta7d, forkDelta30d };
}

export function rankAgentsByVelocity(agents: AgentStats[]): AgentStats[] {
  return [...agents].sort((a, b) => b.velocityScore - a.velocityScore);
}
