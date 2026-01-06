import { useState, useMemo } from "react";
import type { AgentStats, SortField, SortDirection } from "../types";
import { AgentRow } from "./AgentRow";
import { SortHeader } from "./SortHeader";

interface AgentTableProps {
  agents: AgentStats[];
}

export function AgentTable({ agents }: AgentTableProps) {
  const [sortField, setSortField] = useState<SortField>("velocityScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getDownloads = (agent: AgentStats) =>
    (agent.pypiDownloads ?? 0) +
    (agent.npmDownloads ?? 0) +
    (agent.vsCodeDownloads ?? 0);

  const sortedAgents = useMemo(() => {
    return [...agents].sort((a, b) => {
      let aVal: number;
      let bVal: number;

      if (sortField === "downloads") {
        aVal = getDownloads(a);
        bVal = getDownloads(b);
      } else if (sortField === "hnPoints") {
        aVal = a.hnPoints ?? 0;
        bVal = b.hnPoints ?? 0;
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      const modifier = sortDirection === "desc" ? -1 : 1;
      return (aVal - bVal) * modifier;
    });
  }, [agents, sortField, sortDirection]);

  const maxVelocity = Math.max(...agents.map((a) => a.velocityScore), 1);

  return (
    <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800/50">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <SortHeader
                field="stars"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              >
                Stars
              </SortHeader>
              <SortHeader
                field="forks"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              >
                Forks
              </SortHeader>
              <SortHeader
                field="commits30d"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              >
                Commits
              </SortHeader>
              <SortHeader
                field="downloads"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              >
                Downloads
              </SortHeader>
              <SortHeader
                field="hnPoints"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              >
                HN Buzz
              </SortHeader>
              <SortHeader
                field="velocityScore"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              >
                Velocity
              </SortHeader>
            </tr>
          </thead>
          <tbody>
            {sortedAgents.map((agent, index) => (
              <AgentRow
                key={agent.id}
                agent={agent}
                rank={index + 1}
                maxVelocity={maxVelocity}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
