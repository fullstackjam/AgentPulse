export interface AgentConfig {
  id: string;
  name: string;
  repo: string;
  category: string;
  website?: string;
  // Package registry identifiers
  pypiPackage?: string;      // PyPI package name (e.g., "aider-chat")
  npmPackage?: string;       // npm package name (e.g., "@anthropic-ai/claude-code")
  openVsxId?: string;        // Open VSX extension ID (e.g., "saoudrizwan/claude-dev")
  // Search keywords
  hnKeyword?: string;        // Hacker News search keyword
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
  pypiDownloads?: number;
  npmDownloads?: number;
  vsCodeDownloads?: number;
  hnMentions?: number;
  hnPoints?: number;
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
