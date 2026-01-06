const HN_ALGOLIA_BASE = "https://hn.algolia.com/api/v1";

interface HNHit {
  objectID: string;
  title: string;
  points: number;
  num_comments: number;
  created_at_i: number;
}

interface HNSearchResponse {
  hits: HNHit[];
  nbHits: number;
  page: number;
  nbPages: number;
}

export interface HNStats {
  mentions: number;
  totalPoints: number;
}

export async function fetchHNStats(keyword: string): Promise<HNStats | null> {
  try {
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

    const response = await fetch(
      `${HN_ALGOLIA_BASE}/search?query=${encodeURIComponent(keyword)}&tags=story&numericFilters=created_at_i>${thirtyDaysAgo}&hitsPerPage=100`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "AgentPulse/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HN Algolia API error: ${response.status}`);
    }

    const data = (await response.json()) as HNSearchResponse;

    const totalPoints = data.hits.reduce((sum, hit) => sum + hit.points, 0);

    return {
      mentions: data.nbHits,
      totalPoints,
    };
  } catch (error) {
    console.error(`Failed to fetch HN stats for "${keyword}":`, error);
    return null;
  }
}
