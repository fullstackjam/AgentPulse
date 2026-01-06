const PYPI_STATS_BASE = "https://pypistats.org/api";

interface PyPIRecentResponse {
  data: {
    last_day: number;
    last_week: number;
    last_month: number;
  };
  package: string;
  type: string;
}

export async function fetchPyPIDownloads(
  packageName: string
): Promise<number | null> {
  try {
    const response = await fetch(
      `${PYPI_STATS_BASE}/packages/${packageName}/recent`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "AgentPulse/1.0",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`PyPI Stats API error: ${response.status}`);
    }

    const data = (await response.json()) as PyPIRecentResponse;
    return data.data.last_week;
  } catch (error) {
    console.error(`Failed to fetch PyPI stats for ${packageName}:`, error);
    return null;
  }
}
