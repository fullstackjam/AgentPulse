const OPENVSX_API_BASE = "https://open-vsx.org/api";

interface OpenVSXResponse {
  downloadCount: number;
  averageRating?: number;
  reviewCount?: number;
  displayName: string;
  namespace: string;
  name: string;
}

export async function fetchOpenVSXDownloads(
  extensionId: string
): Promise<number | null> {
  try {
    const response = await fetch(`${OPENVSX_API_BASE}/${extensionId}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "AgentPulse/1.0",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Open VSX API error: ${response.status}`);
    }

    const data = (await response.json()) as OpenVSXResponse;
    return data.downloadCount;
  } catch (error) {
    console.error(`Failed to fetch Open VSX stats for ${extensionId}:`, error);
    return null;
  }
}
