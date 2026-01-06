import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env, Snapshot, AgentStats } from "./types.js";
import { KV_KEYS } from "./types.js";
import { AGENTS } from "./data/agents.js";
import { fetchRepoStats, fetchCommitCount30d } from "./services/github.js";
import {
  calculateVelocityScore,
  computeDeltas,
  rankAgentsByVelocity,
} from "./services/velocity.js";
import { fetchPyPIDownloads } from "./services/pypi.js";
import { fetchOpenVSXDownloads } from "./services/openvsx.js";
import { fetchHNStats } from "./services/hackernews.js";

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", cors());

app.get("/api/agents", async (c) => {
  const snapshot = await c.env.KV.get<Snapshot>(KV_KEYS.CURRENT, "json");

  if (!snapshot) {
    return c.json({
      timestamp: null,
      agents: AGENTS.map((agent) => ({
        ...agent,
        stars: 0,
        forks: 0,
        commits30d: 0,
        starDelta7d: 0,
        forkDelta30d: 0,
        velocityScore: 0,
      })),
      message: "No data yet. Waiting for first cron run.",
    });
  }

  return c.json(snapshot);
});

app.post("/cron", async (c) => {
  const authHeader = c.req.header("Authorization");
  const expectedSecret = c.env.CRON_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const today = new Date().toISOString().split("T")[0];
  const date7dAgo = getDateNDaysAgo(7);
  const date30dAgo = getDateNDaysAgo(30);

  const [snapshot7dAgo, snapshot30dAgo] = await Promise.all([
    c.env.KV.get<Snapshot>(KV_KEYS.dateKey(date7dAgo), "json"),
    c.env.KV.get<Snapshot>(KV_KEYS.dateKey(date30dAgo), "json"),
  ]);

  const agentStats: AgentStats[] = [];

  for (const agent of AGENTS) {
    try {
      const [repoStats, commits30d, pypiDownloads, vsCodeDownloads, hnStats] =
        await Promise.all([
          fetchRepoStats(agent.repo),
          fetchCommitCount30d(agent.repo),
          agent.pypiPackage
            ? fetchPyPIDownloads(agent.pypiPackage)
            : Promise.resolve(null),
          agent.openVsxId
            ? fetchOpenVSXDownloads(agent.openVsxId)
            : Promise.resolve(null),
          agent.hnKeyword ? fetchHNStats(agent.hnKeyword) : Promise.resolve(null),
        ]);

      const { starDelta7d, forkDelta30d } = computeDeltas(
        { stars: repoStats.stars, forks: repoStats.forks },
        snapshot7dAgo,
        snapshot30dAgo,
        agent.id
      );

      const velocityScore = calculateVelocityScore(
        starDelta7d,
        forkDelta30d,
        commits30d
      );

      agentStats.push({
        id: agent.id,
        name: agent.name,
        repo: agent.repo,
        category: agent.category,
        website: agent.website,
        stars: repoStats.stars,
        forks: repoStats.forks,
        commits30d,
        starDelta7d,
        forkDelta30d,
        velocityScore,
        pypiDownloads: pypiDownloads ?? undefined,
        vsCodeDownloads: vsCodeDownloads ?? undefined,
        hnMentions: hnStats?.mentions ?? undefined,
        hnPoints: hnStats?.totalPoints ?? undefined,
      });
    } catch (error) {
      console.error(`Failed to fetch stats for ${agent.repo}:`, error);
      agentStats.push({
        id: agent.id,
        name: agent.name,
        repo: agent.repo,
        category: agent.category,
        website: agent.website,
        stars: 0,
        forks: 0,
        commits30d: 0,
        starDelta7d: 0,
        forkDelta30d: 0,
        velocityScore: 0,
      });
    }
  }

  const rankedAgents = rankAgentsByVelocity(agentStats);
  const snapshot: Snapshot = {
    timestamp: new Date().toISOString(),
    agents: rankedAgents,
  };

  await Promise.all([
    c.env.KV.put(KV_KEYS.CURRENT, JSON.stringify(snapshot)),
    c.env.KV.put(KV_KEYS.dateKey(today), JSON.stringify(snapshot)),
  ]);

  return c.json({
    success: true,
    timestamp: snapshot.timestamp,
    agentsUpdated: rankedAgents.length,
  });
});

function getDateNDaysAgo(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().split("T")[0];
}

export default app;
