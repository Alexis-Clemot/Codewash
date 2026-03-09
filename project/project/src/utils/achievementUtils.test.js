/**
 * Characterization tests for achievementUtils.js
 *
 * PURPOSE: Freeze the current behavior of every achievement utility so that
 * future refactors can be verified against a known-good baseline.
 *
 * RULE: Do not update these tests unless the achievement rules have been
 * intentionally changed by the product team.
 */

import { describe, it, expect } from 'vitest';
import {
    getDefaultStats,
    isAchievementUnlocked,
    getCurrentTier,
    getNextTier,
    getTierProgress,
    getNewlyUnlockedAchievements,
    getNewTierAchievements,
    addUniqueToArray,
    recordLoginDate,
    getAchievementDisplayName,
} from './achievementUtils';
import { ACHIEVEMENTS } from '../constants/achievements';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns a fresh default stats object (never mutate the one from getDefaultStats) */
const freshStats = () => getDefaultStats();

/** Returns a skills object with all skills at level 1 */
const freshSkills = () =>
    Object.fromEntries(
        Object.keys(ACHIEVEMENTS)
            .map(() => null)
            .filter(Boolean)
    );

// ─────────────────────────────────────────────────────────────────────────────
// getDefaultStats
// ─────────────────────────────────────────────────────────────────────────────
describe('getDefaultStats', () => {
    it('returns an object with all required stat keys', () => {
        const stats = getDefaultStats();
        const requiredKeys = [
            'phantomsCaught',
            'totalMobsDefeated',
            'totalBossesDefeated',
            'totalMinibossesDefeated',
            'totalDeaths',
            'uniqueMobsDefeated',
            'uniqueBossesDefeated',
            'uniqueMinibossesDefeated',
            'themeChanges',
            'borderChanges',
            'battlesThisSession',
            'loginDates',
            'perfectMemoryGames',
            'achievementsUnlocked',
        ];
        requiredKeys.forEach(key => {
            expect(stats, `missing key: ${key}`).toHaveProperty(key);
        });
    });

    it('numeric counters all start at 0', () => {
        const stats = getDefaultStats();
        const numericKeys = [
            'phantomsCaught', 'totalMobsDefeated', 'totalBossesDefeated',
            'totalMinibossesDefeated', 'totalDeaths', 'themeChanges',
            'borderChanges', 'battlesThisSession', 'perfectMemoryGames',
        ];
        numericKeys.forEach(key => {
            expect(stats[key], key).toBe(0);
        });
    });

    it('array fields all start as empty arrays', () => {
        const stats = getDefaultStats();
        const arrayKeys = [
            'uniqueMobsDefeated', 'uniqueBossesDefeated', 'uniqueMinibossesDefeated',
            'loginDates', 'achievementsUnlocked',
        ];
        arrayKeys.forEach(key => {
            expect(Array.isArray(stats[key]), key).toBe(true);
            expect(stats[key].length, key).toBe(0);
        });
    });

    it('each call returns an independent object (not a singleton)', () => {
        const a = getDefaultStats();
        const b = getDefaultStats();
        a.phantomsCaught = 99;
        expect(b.phantomsCaught).toBe(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// isAchievementUnlocked
// ─────────────────────────────────────────────────────────────────────────────
describe('isAchievementUnlocked', () => {
    it('returns false for a tiered achievement with no progress', () => {
        const stats = freshStats(); // phantomsCaught = 0
        expect(isAchievementUnlocked('phantom_hunter', stats, {})).toBe(false);
    });

    it('returns true for a tiered achievement once tier 1 threshold is reached', () => {
        const stats = { ...freshStats(), phantomsCaught: 5 };
        expect(isAchievementUnlocked('phantom_hunter', stats, {})).toBe(true);
    });

    it('returns false for an unknown achievement id', () => {
        expect(isAchievementUnlocked('nonexistent_id', freshStats(), {})).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getCurrentTier
// ─────────────────────────────────────────────────────────────────────────────
describe('getCurrentTier', () => {
    it('returns -1 when no tier has been reached', () => {
        const stats = freshStats();
        expect(getCurrentTier('phantom_hunter', stats, {})).toBe(-1);
    });

    it('returns 0 (tier index) when tier 1 is reached (5 phantoms)', () => {
        const stats = { ...freshStats(), phantomsCaught: 5 };
        expect(getCurrentTier('phantom_hunter', stats, {})).toBe(0);
    });

    it('returns 1 when tier 2 is reached (10 phantoms)', () => {
        const stats = { ...freshStats(), phantomsCaught: 10 };
        expect(getCurrentTier('phantom_hunter', stats, {})).toBe(1);
    });

    it('returns 7 (max index) for 100+ phantoms', () => {
        const stats = { ...freshStats(), phantomsCaught: 100 };
        expect(getCurrentTier('phantom_hunter', stats, {})).toBe(7);
    });

    it('returns -1 for non-tiered achievements', () => {
        // Non-tiered achievements should not have a tier index
        const nonTiered = Object.keys(ACHIEVEMENTS).find(
            id => !ACHIEVEMENTS[id].isTiered
        );
        if (nonTiered) {
            expect(getCurrentTier(nonTiered, freshStats(), {})).toBe(-1);
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getNextTier
// ─────────────────────────────────────────────────────────────────────────────
describe('getNextTier', () => {
    it('returns the first tier object when at tier -1 (no progress)', () => {
        const stats = freshStats();
        const next = getNextTier('phantom_hunter', stats, {});
        expect(next).not.toBeNull();
        expect(next).toHaveProperty('level', 5); // tier 1 threshold
    });

    it('returns the second tier when at tier 0', () => {
        const stats = { ...freshStats(), phantomsCaught: 5 };
        const next = getNextTier('phantom_hunter', stats, {});
        expect(next).toHaveProperty('level', 10);
    });

    it('returns null when at the maximum tier', () => {
        const stats = { ...freshStats(), phantomsCaught: 100 };
        const next = getNextTier('phantom_hunter', stats, {});
        expect(next).toBeNull();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getTierProgress
// ─────────────────────────────────────────────────────────────────────────────
describe('getTierProgress', () => {
    it('returns 0 for a non-tiered achievement', () => {
        const nonTiered = Object.keys(ACHIEVEMENTS).find(
            id => !ACHIEVEMENTS[id].isTiered
        );
        if (nonTiered) {
            expect(getTierProgress(nonTiered, freshStats(), {})).toBe(0);
        }
    });

    it('returns 0 when no progress has been made', () => {
        const stats = freshStats(); // phantomsCaught = 0
        expect(getTierProgress('phantom_hunter', stats, {})).toBe(0);
    });

    it('returns 100 when at the maximum tier', () => {
        const stats = { ...freshStats(), phantomsCaught: 100 };
        expect(getTierProgress('phantom_hunter', stats, {})).toBe(100);
    });

    it('returns a value between 0 and 100 for partial progress', () => {
        // Tier 1 is 5 phantoms, tier 2 is 10.  At 7/10 we are 40% through tier 1→2.
        const stats = { ...freshStats(), phantomsCaught: 7 };
        const progress = getTierProgress('phantom_hunter', stats, {});
        expect(progress).toBeGreaterThan(0);
        expect(progress).toBeLessThan(100);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getNewlyUnlockedAchievements
// ─────────────────────────────────────────────────────────────────────────────
describe('getNewlyUnlockedAchievements', () => {
    it('returns empty array when nothing changed', () => {
        const stats = freshStats();
        const result = getNewlyUnlockedAchievements(stats, stats, {}, {});
        expect(result).toEqual([]);
    });

    it('detects a newly unlocked tiered achievement (tier 1 crossed)', () => {
        const oldStats = freshStats(); // phantomsCaught = 0
        const newStats = { ...freshStats(), phantomsCaught: 5 };
        const result = getNewlyUnlockedAchievements(oldStats, newStats, {}, {});
        expect(result).toContain('phantom_hunter');
    });

    it('does not report an achievement that was already unlocked', () => {
        const stats = { ...freshStats(), phantomsCaught: 5 };
        // Both old and new have 5 phantoms → was already unlocked
        const result = getNewlyUnlockedAchievements(stats, stats, {}, {});
        expect(result).not.toContain('phantom_hunter');
    });

    it('returns an array (never null or undefined)', () => {
        const result = getNewlyUnlockedAchievements(freshStats(), freshStats(), {}, {});
        expect(Array.isArray(result)).toBe(true);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getNewTierAchievements
// ─────────────────────────────────────────────────────────────────────────────
describe('getNewTierAchievements', () => {
    it('returns empty array when no tier advanced', () => {
        const stats = freshStats();
        const result = getNewTierAchievements(stats, stats, {}, {});
        expect(result).toEqual([]);
    });

    it('detects a tier advancement for phantom_hunter', () => {
        const oldStats = { ...freshStats(), phantomsCaught: 5 }; // tier 0
        const newStats = { ...freshStats(), phantomsCaught: 10 }; // tier 1
        const result = getNewTierAchievements(oldStats, newStats, {}, {});
        expect(result.some(r => r.achievementId === 'phantom_hunter')).toBe(true);
    });

    it('each result entry has achievementId and tierIndex', () => {
        const oldStats = freshStats();
        const newStats = { ...freshStats(), phantomsCaught: 5 };
        const result = getNewTierAchievements(oldStats, newStats, {}, {});
        result.forEach(entry => {
            expect(entry).toHaveProperty('achievementId');
            expect(entry).toHaveProperty('tierIndex');
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// addUniqueToArray
// ─────────────────────────────────────────────────────────────────────────────
describe('addUniqueToArray', () => {
    it('adds a new value to the array', () => {
        const result = addUniqueToArray(['Zombie', 'Creeper'], 'Skeleton');
        expect(result).toContain('Skeleton');
        expect(result.length).toBe(3);
    });

    it('does not add a duplicate value', () => {
        const result = addUniqueToArray(['Zombie', 'Creeper'], 'Zombie');
        expect(result.length).toBe(2);
    });

    it('does not mutate the original array', () => {
        const original = ['Zombie'];
        addUniqueToArray(original, 'Creeper');
        expect(original.length).toBe(1);
    });

    it('works on an empty array', () => {
        expect(addUniqueToArray([], 'Zombie')).toEqual(['Zombie']);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// recordLoginDate
// ─────────────────────────────────────────────────────────────────────────────
describe('recordLoginDate', () => {
    it('adds today\'s date when not already present', () => {
        const today = new Date().toISOString().split('T')[0];
        const result = recordLoginDate([]);
        expect(result).toContain(today);
    });

    it('does not add a duplicate for the same day', () => {
        const today = new Date().toISOString().split('T')[0];
        const result = recordLoginDate([today]);
        expect(result.length).toBe(1);
    });

    it('does not mutate the original array', () => {
        const original = [];
        recordLoginDate(original);
        expect(original.length).toBe(0);
    });

    it('preserves existing dates', () => {
        const pastDate = '2024-01-01';
        const result = recordLoginDate([pastDate]);
        expect(result).toContain(pastDate);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getAchievementDisplayName
// ─────────────────────────────────────────────────────────────────────────────
describe('getAchievementDisplayName', () => {
    it('returns empty string for an unknown achievement id', () => {
        expect(getAchievementDisplayName('does_not_exist', freshStats(), {})).toBe('');
    });

    it('returns the base name for a tiered achievement before tier 1 is reached', () => {
        const stats = freshStats();
        const name = getAchievementDisplayName('phantom_hunter', stats, {});
        expect(name).toBe(ACHIEVEMENTS.phantom_hunter.name);
    });

    it('returns the tier name once tier 0 is reached', () => {
        const stats = { ...freshStats(), phantomsCaught: 5 };
        const name = getAchievementDisplayName('phantom_hunter', stats, {});
        expect(name).toBe(ACHIEVEMENTS.phantom_hunter.tiers[0].tierName);
    });
});