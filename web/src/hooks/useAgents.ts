import { useState, useEffect } from "react";
import type { Snapshot } from "../types";

const API_URL = import.meta.env.PROD
  ? "https://agentpulse.fullstackjam.com/api/agents"
  : "/api/agents";

export function useAgents() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch");
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  return { data, loading, error };
}
