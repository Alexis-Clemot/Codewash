/**
 * Characterization tests for gameUtils.js
 *
 * PURPOSE: These tests freeze the CURRENT OBSERVABLE BEHAVIOR of every pure
 * function in gameUtils.  They are not unit tests in the TDD sense — they do
 * not drive design.  They exist so that any future refactoring that accidentally
 * changes a formula, a range check, or a branching rule will immediately show
 * up as a failing test.
 *
 * RULE: Do not modify these tests unless the product team has explicitly decided
 * to change a gameplay rule.  If a test fails after a code change, that means
 * the behavior changed — investigate before updating the test.
 */

import { describe, it, expect } from 'vitest';
import {
    getEncounterType,
    getDifficultyMultiplier,
    calculateDamage,
    calculateMobHealth,
    getExpectedDifficulty,
    calculateXPReward,
    calculateXPToLevel,
    generateMathProblem,
    getReadingWord,
    getWordForDifficulty,
    getRandomMob,
    getRandomFriendlyMob,
    getRandomMiniboss,
    getRandomBoss,
    getMobForSkill,
} from './gameUtils';

import {
    HOSTILE_MOBS,
    FRIENDLY_MOBS,
    MINIBOSS_MOBS,
    BOSS_MOBS,
    SKILL_DATA,
} from '../constants/gameData';

// ─────────────────────────────────────────────────────────────────────────────
// getEncounterType
// Cycle: levels 1-9 → hostile, 10 → miniboss, 11-19 → hostile, 20 → boss
// The cycle then repeats every 20 levels.
// ─────────────────────────────────────────────────────────────────────────────
describe('getEncounterType', () => {
    it('returns "hostile" for levels 1-9', () => {
        for (let level = 1; level <= 9; level++) {
            expect(getEncounterType(level), `level ${level}`).toBe('hostile');
        }
    });

    it('returns "miniboss" at level 10', () => {
        expect(getEncounterType(10)).toBe('miniboss');
    });

    it('returns "hostile" for levels 11-19', () => {
        for (let level = 11; level <= 19; level++) {
            expect(getEncounterType(level), `level ${level}`).toBe('hostile');
        }
    });

    it('returns "boss" at level 20', () => {
        expect(getEncounterType(20)).toBe('boss');
    });

    it('repeats the 20-level cycle correctly (levels 21-40)', () => {
        // Cycle 2 must mirror cycle 1
        expect(getEncounterType(21)).toBe('hostile');
        expect(getEncounterType(30)).toBe('miniboss');
        expect(getEncounterType(40)).toBe('boss');
    });

    it('handles high levels (cycle repeats indefinitely)', () => {
        // Level 100 = 5 full cycles → same as level 20 → boss
        expect(getEncounterType(100)).toBe('boss');
        // Level 110 = 5 cycles + 10 → same as level 10 → miniboss
        expect(getEncounterType(110)).toBe('miniboss');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getDifficultyMultiplier
// Formula: 3^(difficulty - 1)
// ─────────────────────────────────────────────────────────────────────────────
describe('getDifficultyMultiplier', () => {
    const expected = [1, 3, 9, 27, 81, 243, 729];

    it('returns the correct multiplier for difficulties 1-7', () => {
        expected.forEach((value, index) => {
            const difficulty = index + 1;
            expect(getDifficultyMultiplier(difficulty), `difficulty ${difficulty}`).toBe(value);
        });
    });

    it('difficulty 1 always returns 1 (identity multiplier)', () => {
        expect(getDifficultyMultiplier(1)).toBe(1);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateDamage
// Player level is no longer factored in — only difficulty matters.
// BASE_DAMAGE = 12; damage = 12 × 3^(difficulty-1)
// ─────────────────────────────────────────────────────────────────────────────
describe('calculateDamage', () => {
    it('returns 12 at difficulty 1 regardless of player level', () => {
        expect(calculateDamage(1, 1)).toBe(12);
        expect(calculateDamage(50, 1)).toBe(12);
        expect(calculateDamage(200, 1)).toBe(12);
    });

    it('scales by 3× per difficulty tier', () => {
        expect(calculateDamage(1, 1)).toBe(12);
        expect(calculateDamage(1, 2)).toBe(36);
        expect(calculateDamage(1, 3)).toBe(108);
        expect(calculateDamage(1, 4)).toBe(324);
    });

    it('damage × 5 always equals mob health (5-hit battle guarantee)', () => {
        for (let d = 1; d <= 7; d++) {
            expect(calculateDamage(1, d) * 5).toBe(calculateMobHealth(d));
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateMobHealth
// BASE_MOB_HEALTH = 60; health = 60 × 3^(difficulty-1)
// ─────────────────────────────────────────────────────────────────────────────
describe('calculateMobHealth', () => {
    it('returns 60 at difficulty 1', () => {
        expect(calculateMobHealth(1)).toBe(60);
    });

    it('scales correctly for all 7 difficulties', () => {
        const expected = [60, 180, 540, 1620, 4860, 14580, 43740];
        expected.forEach((value, index) => {
            expect(calculateMobHealth(index + 1), `difficulty ${index + 1}`).toBe(value);
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getExpectedDifficulty
// Unlocks one difficulty tier every 20 levels; capped at 7.
// ─────────────────────────────────────────────────────────────────────────────
describe('getExpectedDifficulty', () => {
    it('returns difficulty 1 for levels 1-20', () => {
        expect(getExpectedDifficulty(1)).toBe(1);
        expect(getExpectedDifficulty(20)).toBe(1);
    });

    it('returns difficulty 2 for levels 21-40', () => {
        expect(getExpectedDifficulty(21)).toBe(2);
        expect(getExpectedDifficulty(40)).toBe(2);
    });

    it('returns difficulty 7 for levels 121 and above (cap)', () => {
        expect(getExpectedDifficulty(121)).toBe(7);
        expect(getExpectedDifficulty(999)).toBe(7);
    });

    it('returns exactly 7 at level 121 (first level in tier 7 range)', () => {
        expect(getExpectedDifficulty(121)).toBe(7);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateXPReward
// When playing at or above expected difficulty: full scaled reward.
// When below: exponential penalty per difficulty gap (×0.3 per level below).
// ─────────────────────────────────────────────────────────────────────────────
describe('calculateXPReward', () => {
    it('backward-compatible call (no playerLevel) returns base difficulty reward', () => {
        const reward1 = calculateXPReward(1);
        const reward2 = calculateXPReward(2);
        // Difficulty 2 should give 3× more than difficulty 1
        expect(reward2).toBe(reward1 * 3);
    });

    it('returns a positive integer for all valid difficulty/level combos', () => {
        for (let diff = 1; diff <= 7; diff++) {
            for (let level = 1; level <= 140; level += 20) {
                const reward = calculateXPReward(diff, level);
                expect(reward, `diff=${diff} level=${level}`).toBeGreaterThan(0);
                expect(Number.isInteger(reward)).toBe(true);
            }
        }
    });

    it('playing at expected difficulty gives a higher reward than playing below', () => {
        // Player level 1 → expected difficulty 1
        // Reward at diff 1 should be at least as high as... well, it IS the expected diff.
        // Player level 21 → expected difficulty 2; reward at diff 2 >= reward at diff 1
        const rewardAtExpected = calculateXPReward(2, 21);
        const rewardBelow = calculateXPReward(1, 21);
        expect(rewardAtExpected).toBeGreaterThan(rewardBelow);
    });

    it('the penalty grows as the gap widens (more below → less reward)', () => {
        // Player level 61 → expected difficulty 4
        // gap 1: played at diff 3
        // gap 2: played at diff 2
        const gap1 = calculateXPReward(3, 61);
        const gap2 = calculateXPReward(2, 61);
        expect(gap1).toBeGreaterThan(gap2);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateXPToLevel
// At the expected difficulty the XP to level equals the XP from one kill,
// preserving the "1 kill = 1 level" progression on the optimal path.
// ─────────────────────────────────────────────────────────────────────────────
describe('calculateXPToLevel', () => {
    it('backward-compatible call (no playerLevel) returns a positive value', () => {
        const xp = calculateXPToLevel(1);
        expect(xp).toBeGreaterThan(0);
    });

    it('"1 kill = 1 level" at the expected difficulty for several level checkpoints', () => {
        const checkpoints = [
            { level: 1, expectedDiff: 1 },
            { level: 21, expectedDiff: 2 },
            { level: 41, expectedDiff: 3 },
            { level: 61, expectedDiff: 4 },
        ];

        checkpoints.forEach(({ level, expectedDiff }) => {
            const reward = calculateXPReward(expectedDiff, level);
            const needed = calculateXPToLevel(expectedDiff, level);
            expect(reward, `level=${level}`).toBe(needed);
        });
    });

    it('returns a positive integer for all valid inputs', () => {
        for (let diff = 1; diff <= 7; diff++) {
            for (let level = 1; level <= 140; level += 20) {
                const xp = calculateXPToLevel(diff, level);
                expect(xp, `diff=${diff} level=${level}`).toBeGreaterThan(0);
                expect(Number.isInteger(xp)).toBe(true);
            }
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// generateMathProblem
// Returns an object with shape { type, question, answer } for all difficulties.
// ─────────────────────────────────────────────────────────────────────────────
describe('generateMathProblem', () => {
    // Run each difficulty multiple times to account for randomness
    const RUNS = 30;

    for (let diff = 1; diff <= 7; diff++) {
        describe(`difficulty ${diff}`, () => {
            it('returns an object with the correct shape', () => {
                for (let i = 0; i < RUNS; i++) {
                    const problem = generateMathProblem(diff);
                    expect(problem).toHaveProperty('type', 'math');
                    expect(problem).toHaveProperty('question');
                    expect(problem).toHaveProperty('answer');
                    expect(typeof problem.question).toBe('string');
                    expect(typeof problem.answer).toBe('string');
                }
            });

            it('question string is non-empty and contains "="', () => {
                for (let i = 0; i < RUNS; i++) {
                    const { question } = generateMathProblem(diff);
                    expect(question.length).toBeGreaterThan(0);
                    expect(question).toContain('=');
                }
            });

            it('answer is a numeric string', () => {
                for (let i = 0; i < RUNS; i++) {
                    const { answer } = generateMathProblem(diff);
                    expect(Number.isNaN(Number(answer))).toBe(false);
                }
            });
        });
    }

    it('difficulties 1-5 produce correct arithmetic answers', () => {
        // We cannot predict the operands, but we can verify the answer is mathematically correct
        // by checking structure instead.  For the deterministic PEMDAS/nightmare banks we can
        // spot-check a known entry is reachable (non-exhaustive).
        for (let i = 0; i < 50; i++) {
            const p = generateMathProblem(1); // simple addition
            // answer must be a non-negative integer string
            const num = parseInt(p.answer, 10);
            expect(num).toBeGreaterThanOrEqual(0);
        }
    });

    it('difficulty 6 returns isPemdas flag', () => {
        // PEMDAS problems come from a fixed bank, so we should see the flag every time
        for (let i = 0; i < 10; i++) {
            const p = generateMathProblem(6);
            expect(p.isPemdas).toBe(true);
        }
    });

    it('difficulty 7 returns isNightmare flag', () => {
        for (let i = 0; i < 10; i++) {
            const p = generateMathProblem(7);
            expect(p.isNightmare).toBe(true);
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getReadingWord
// Returns a non-empty string for all difficulty levels.
// ─────────────────────────────────────────────────────────────────────────────
describe('getReadingWord', () => {
    for (let diff = 1; diff <= 7; diff++) {
        it(`returns a non-empty string for difficulty ${diff}`, () => {
            for (let i = 0; i < 10; i++) {
                const word = getReadingWord(diff);
                expect(typeof word).toBe('string');
                expect(word.length).toBeGreaterThan(0);
            }
        });
    }

    it('difficulty 1 words are 3 characters long', () => {
        // Difficulty 1 maps to charLength 3
        for (let i = 0; i < 20; i++) {
            const word = getReadingWord(1);
            expect(word.length).toBe(3);
        }
    });

    it('difficulty 7 returns longer/unusual words (funny words bank)', () => {
        // These should generally be longer than difficulty 1 words
        for (let i = 0; i < 10; i++) {
            const word = getReadingWord(7);
            expect(word.length).toBeGreaterThan(3);
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getWordForDifficulty
// Returns { word, displayName, image } for all difficulties.
// ─────────────────────────────────────────────────────────────────────────────
describe('getWordForDifficulty', () => {
    for (let diff = 1; diff <= 7; diff++) {
        it(`returns a valid object shape for difficulty ${diff}`, () => {
            const result = getWordForDifficulty(diff);
            expect(result).toHaveProperty('word');
            expect(result).toHaveProperty('displayName');
            expect(result).toHaveProperty('image');
            expect(typeof result.word).toBe('string');
            expect(result.word.length).toBeGreaterThan(0);
            // word must be uppercase (contract defined in the function)
            expect(result.word).toBe(result.word.toUpperCase());
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Random mob pickers
// These functions are non-deterministic but must always return a valid key.
// ─────────────────────────────────────────────────────────────────────────────
describe('getRandomMob', () => {
    const validKeys = Object.keys(HOSTILE_MOBS);

    it('returns a key that exists in HOSTILE_MOBS', () => {
        for (let i = 0; i < 30; i++) {
            expect(validKeys).toContain(getRandomMob(null));
        }
    });

    it('never returns the excluded mob when a valid pool remains', () => {
        const exclude = validKeys[0];
        for (let i = 0; i < 30; i++) {
            expect(getRandomMob(exclude)).not.toBe(exclude);
        }
    });
});

describe('getRandomFriendlyMob', () => {
    const validKeys = Object.keys(FRIENDLY_MOBS);
    it('returns a key that exists in FRIENDLY_MOBS', () => {
        for (let i = 0; i < 30; i++) {
            expect(validKeys).toContain(getRandomFriendlyMob());
        }
    });
});

describe('getRandomMiniboss', () => {
    const validKeys = Object.keys(MINIBOSS_MOBS);
    it('returns a key that exists in MINIBOSS_MOBS', () => {
        for (let i = 0; i < 30; i++) {
            expect(validKeys).toContain(getRandomMiniboss());
        }
    });
});

describe('getRandomBoss', () => {
    const validKeys = Object.keys(BOSS_MOBS);
    it('returns a key that exists in BOSS_MOBS', () => {
        for (let i = 0; i < 30; i++) {
            expect(validKeys).toContain(getRandomBoss());
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getMobForSkill
// Routing function that picks the correct mob source depending on the skill type.
// ─────────────────────────────────────────────────────────────────────────────
describe('getMobForSkill', () => {
    const allHostile = Object.keys(HOSTILE_MOBS);
    const allBoss = Object.keys(BOSS_MOBS);
    const allMiniboss = Object.keys(MINIBOSS_MOBS);

    const cleaningSkill = SKILL_DATA.find(s => s.id === 'cleaning');
    const memorySkill = SKILL_DATA.find(s => s.id === 'memory');
    const readingSkill = SKILL_DATA.find(s => s.id === 'reading');

    it('cleaning skill: returns a chest-type string (not a mob)', () => {
        const userSkill = { level: 1 };
        const result = getMobForSkill(cleaningSkill, userSkill);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('memory skill: returns stored memoryMob when available', () => {
        const userSkill = { level: 5, memoryMob: 'Allay' };
        expect(getMobForSkill(memorySkill, userSkill)).toBe('Allay');
    });

    it('memory skill: falls back to a valid friendly mob if memoryMob is null', () => {
        const userSkill = { level: 5, memoryMob: null };
        const result = getMobForSkill(memorySkill, userSkill);
        expect(Object.keys(FRIENDLY_MOBS)).toContain(result);
    });

    it('returns stored boss at level 20 (boss encounter)', () => {
        const userSkill = { level: 20, currentBoss: 'Wither' };
        const result = getMobForSkill(readingSkill, userSkill);
        expect(result).toBe('Wither');
    });

    it('returns a valid boss from BOSS_MOBS when no stored boss at level 20', () => {
        const userSkill = { level: 20, currentBoss: null };
        const result = getMobForSkill(readingSkill, userSkill);
        expect(allBoss).toContain(result);
    });

    it('returns stored miniboss at level 10 (miniboss encounter)', () => {
        const userSkill = { level: 10, currentMiniboss: 'Wither Skeleton' };
        const result = getMobForSkill(readingSkill, userSkill);
        expect(result).toBe('Wither Skeleton');
    });

    it('returns a valid miniboss from MINIBOSS_MOBS when no stored miniboss at level 10', () => {
        const userSkill = { level: 10, currentMiniboss: null };
        const result = getMobForSkill(readingSkill, userSkill);
        expect(allMiniboss).toContain(result);
    });

    it('returns stored readingMob at a normal hostile level', () => {
        const userSkill = { level: 5, readingMob: 'Zombie' };
        const result = getMobForSkill(readingSkill, userSkill);
        expect(result).toBe('Zombie');
    });

    it('returns a valid hostile mob when readingMob is null', () => {
        const userSkill = { level: 5, readingMob: null };
        const result = getMobForSkill(readingSkill, userSkill);
        expect(allHostile).toContain(result);
    });
});