import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env, Snapshot, AgentStats, KV_KEYS as KVKeysType } from "./types.js";
import { KV_KEYS } from "./types.js";
import { AGENTS } from "./data/agents.js";
import { fetchRepoStats, fetchCommitCount30d } from "./services/github.js";
import {
  calculateVelocityScore,
  computeDeltas,
  rankAgentsByVelocity,
} from "./services/velocity.js";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

app.get("/", (c) => {
  return c.html(renderHomePage());
});

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
      const [repoStats, commits30d] = await Promise.all([
        fetchRepoStats(agent.repo),
        fetchCommitCount30d(agent.repo),
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

function renderHomePage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgentPulse - AI Agent Adoption Tracker</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .velocity-bar { transition: width 0.3s ease; }
  </style>
</head>
<body class="bg-gray-950 text-gray-100 min-h-screen">
  <div class="max-w-6xl mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">AgentPulse</h1>
      <p class="text-gray-400">Tracking developer adoption momentum of AI coding agents</p>
    </header>

    <div id="last-updated" class="text-sm text-gray-500 mb-4"></div>

    <div class="bg-gray-900 rounded-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Agent</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Stars</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">7d Delta</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Forks</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Commits (30d)</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Velocity</th>
          </tr>
        </thead>
        <tbody id="agents-table" class="divide-y divide-gray-800">
          <tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
        </tbody>
      </table>
    </div>

    <footer class="mt-8 text-center text-sm text-gray-600">
      <p>Data sourced from GitHub public API. Updated daily.</p>
      <p class="mt-1">
        <a href="https://github.com/fullstackjam/AgentPulse" class="text-blue-500 hover:text-blue-400">Source Code</a>
      </p>
    </footer>
  </div>

  <script>
    async function loadAgents() {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        
        if (data.timestamp) {
          document.getElementById('last-updated').textContent = 
            'Last updated: ' + new Date(data.timestamp).toLocaleString();
        }

        const maxVelocity = Math.max(...data.agents.map(a => a.velocityScore), 1);
        const tbody = document.getElementById('agents-table');
        
        if (data.agents.length === 0) {
          tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">No agents found</td></tr>';
          return;
        }

        tbody.innerHTML = data.agents.map((agent, index) => {
          const velocityPercent = (agent.velocityScore / maxVelocity) * 100;
          const deltaColor = agent.starDelta7d > 0 ? 'text-green-400' : agent.starDelta7d < 0 ? 'text-red-400' : 'text-gray-500';
          const deltaPrefix = agent.starDelta7d > 0 ? '+' : '';
          
          return \`
            <tr class="hover:bg-gray-800/50">
              <td class="px-4 py-3 text-gray-500">\${index + 1}</td>
              <td class="px-4 py-3">
                <a href="https://github.com/\${agent.repo}" target="_blank" class="text-blue-400 hover:text-blue-300 font-medium">
                  \${agent.name}
                </a>
              </td>
              <td class="px-4 py-3 text-gray-400 text-sm">\${agent.category}</td>
              <td class="px-4 py-3 text-right font-mono">\${agent.stars.toLocaleString()}</td>
              <td class="px-4 py-3 text-right font-mono \${deltaColor}">\${deltaPrefix}\${agent.starDelta7d.toLocaleString()}</td>
              <td class="px-4 py-3 text-right font-mono text-gray-400">\${agent.forks.toLocaleString()}</td>
              <td class="px-4 py-3 text-right font-mono text-gray-400">\${agent.commits30d}</td>
              <td class="px-4 py-3 w-32">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-800 rounded-full h-2">
                    <div class="velocity-bar bg-blue-500 h-2 rounded-full" style="width: \${velocityPercent}%"></div>
                  </div>
                  <span class="text-xs text-gray-500 w-12 text-right">\${agent.velocityScore}</span>
                </div>
              </td>
            </tr>
          \`;
        }).join('');
      } catch (error) {
        console.error('Failed to load agents:', error);
        document.getElementById('agents-table').innerHTML = 
          '<tr><td colspan="8" class="px-4 py-8 text-center text-red-500">Failed to load data</td></tr>';
      }
    }

    loadAgents();
  </script>
</body>
</html>`;
}

export default app;
