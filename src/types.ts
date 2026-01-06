export interface AgentConfig {
  id: string;
  name: string;
  repo: string;
  category: string;
  website?: string;
}

export interface GitHubRepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  pushedAt: string;
}

export interface AgentStats {
  id: string;
  name: string;
  repo: string;
  category: string;
  website?: string;
  stars: number;
  forks: number;
  commits30d: number;
  starDelta7d: number;
  forkDelta30d: number;
  velocityScore: number;
}

export interface Snapshot {
  timestamp: string;
  agents: AgentStats[];
}

export interface Env {
  KV: KVNamespace;
  CRON_SECRET?: string;
}

export const KV_KEYS = {
  CURRENT: "agents:current",
  dateKey: (date: string) => `agents:${date}`,
} as const;
