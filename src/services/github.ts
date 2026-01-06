import type { GitHubRepoStats } from "../types.js";

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubRepoResponse {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
}

interface GitHubCommitResponse {
  sha: string;
  commit: {
    committer: {
      date: string;
    };
  };
}

export async function fetchRepoStats(repo: string): Promise<GitHubRepoStats> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${repo}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "AgentPulse/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error for ${repo}: ${response.status}`);
  }

  const data = (await response.json()) as GitHubRepoResponse;

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    pushedAt: data.pushed_at,
  };
}

export async function fetchCommitCount30d(repo: string): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/commits?since=${since.toISOString()}&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "AgentPulse/1.0",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 409) {
      return 0;
    }
    throw new Error(`GitHub commits API error for ${repo}: ${response.status}`);
  }

  const commits = (await response.json()) as GitHubCommitResponse[];
  return commits.length;
}
