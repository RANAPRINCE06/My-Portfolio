import { describe, it, expect } from 'vitest';
import { competitiveProgrammingProfiles } from '@/content/competitive-programming';
import { CompetitiveProgrammingProfileSchema } from '@/lib/validation/content-schemas';
import { cpService } from '@/lib/cp/service';

describe('Competitive Programming Architecture Suite', () => {
  it('validates all verified profiles match the schema', () => {
    for (const profile of competitiveProgrammingProfiles) {
      expect(() => CompetitiveProgrammingProfileSchema.parse(profile)).not.toThrow();
      expect(profile.verificationStatus).toBe('verified');
      expect(['live-api', 'verified-snapshot']).toContain(profile.dataSource);
      expect(profile.lastUpdated).toBeDefined();
    }
  });

  it('contains authentic verified metrics for Codeforces, CodeChef, and LeetCode', () => {
    const cf = competitiveProgrammingProfiles.find((p) => p.platform === 'Codeforces');
    expect(cf).toBeDefined();
    expect(cf?.handle).toBe('rana_prince.1806');
    expect(cf?.currentRating).toBe(1498);
    expect(cf?.maxRating).toBe(1565);
    expect(cf?.rankTitle).toBe('Specialist');

    const cc = competitiveProgrammingProfiles.find((p) => p.platform === 'CodeChef');
    expect(cc).toBeDefined();
    expect(cc?.handle).toBe('rana_prince_06');
    expect(cc?.currentRating).toBe(1606);
    expect(cc?.rankTitle).toBe('3★');

    const lc = competitiveProgrammingProfiles.find((p) => p.platform === 'LeetCode');
    expect(lc).toBeDefined();
    expect(lc?.handle).toBe('RANA_PRINCE_06');
    expect(lc?.problemsSolved).toBe(400);
  });

  it('returns verified fallback on network failure or invalid handle query', async () => {
    const profile = await cpService.getCodeforcesLiveOrSnapshot('invalid_handle_test_404_mock');
    expect(profile.platform).toBe('Codeforces');
    expect(profile.currentRating).toBe(1498);
    expect(profile.maxRating).toBe(1565);
    expect(profile.rankTitle).toBe('Specialist');
  });
});
