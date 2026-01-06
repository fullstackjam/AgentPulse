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
  timestamp: string | null;
  agents: AgentStats[];
  message?: string;
}

export type SortField =
  | "velocityScore"
  | "stars"
  | "starDelta7d"
  | "forks"
  | "commits30d";
export type SortDirection = "asc" | "desc";
