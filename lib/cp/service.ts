import { CompetitiveProgrammingProfile } from '@/types/content';
import { competitiveProgrammingProfiles } from '@/content/competitive-programming';

export interface CodeforcesUserResponse {
  status: 'OK' | 'FAILED';
  result?: Array<{
    handle: string;
    rating?: number;
    maxRating?: number;
    rank?: string;
    maxRank?: string;
  }>;
  comment?: string;
}

export class CompetitiveProgrammingService {
  /**
   * Returns all verified CP profiles with verified snapshot baselines.
   */
  getProfiles(): CompetitiveProgrammingProfile[] {
    return competitiveProgrammingProfiles;
  }

  /**
   * Queries the official Codeforces public REST API (codeforces.com/api/user.info)
   * and records the exact retrieval timestamp, or falls back to the verified baseline snapshot.
   */
  async getCodeforcesLiveOrSnapshot(handle: string = 'rana_prince.1806'): Promise<CompetitiveProgrammingProfile> {
    const snapshot = competitiveProgrammingProfiles.find((p) => p.platform === 'Codeforces')!;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`, {
        signal: controller.signal,
        next: { revalidate: 3600 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json: CodeforcesUserResponse = await res.json();
        if (json.status === 'OK' && json.result && json.result.length > 0) {
          const user = json.result[0];
          const nowIso = new Date().toISOString();
          return {
            ...snapshot,
            currentRating: user.rating ?? snapshot.currentRating,
            maxRating: user.maxRating ?? snapshot.maxRating,
            rankTitle: user.rank ? user.rank.charAt(0).toUpperCase() + user.rank.slice(1) : snapshot.rankTitle,
            dataSource: 'live-api',
            lastUpdated: nowIso.split('T')[0],
            retrievedAt: nowIso,
          };
        }
      }
    } catch {
      // Offline, timeout, or rate-limited: safely return verified snapshot
    }

    return snapshot;
  }
}

export const cpService = new CompetitiveProgrammingService();
