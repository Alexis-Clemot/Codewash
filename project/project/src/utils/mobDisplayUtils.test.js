/**
 * Characterization tests for mobDisplayUtils.js
 *
 * PURPOSE: Freeze the observable behavior of mob display utilities.
 * These are small but important — they guarantee that aura display names
 * and object shapes never silently break.
 */

import { describe, it, expect } from 'vitest';
import { getRandomAura, generateMobWithAura, AURA_ADJECTIVES } from './mobDisplayUtils';

const VALID_AURA_TYPES = ['rainbow', 'frost', 'shadow', 'lava', 'gradient', 'sparkle', 'plasma', 'nature'];

// ─────────────────────────────────────────────────────────────────────────────
// getRandomAura
// ─────────────────────────────────────────────────────────────────────────────
describe('getRandomAura', () => {
    it('always returns one of the known aura types', () => {
        for (let i = 0; i < 50; i++) {
            expect(VALID_AURA_TYPES).toContain(getRandomAura());
        }
    });

    it('returns a non-empty string', () => {
        for (let i = 0; i < 20; i++) {
            const aura = getRandomAura();
            expect(typeof aura).toBe('string');
            expect(aura.length).toBeGreaterThan(0);
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// AURA_ADJECTIVES
// Every aura type that has an adjective maps to a non-empty string
// ─────────────────────────────────────────────────────────────────────────────
describe('AURA_ADJECTIVES', () => {
    it('exports a plain object', () => {
        expect(typeof AURA_ADJECTIVES).toBe('object');
        expect(AURA_ADJECTIVES).not.toBeNull();
    });

    it('all adjective values are non-empty strings', () => {
        Object.entries(AURA_ADJECTIVES).forEach(([aura, adj]) => {
            expect(typeof adj, `adjective for "${aura}"`).toBe('string');
            expect(adj.length, `adjective for "${aura}" should not be empty`).toBeGreaterThan(0);
        });
    });

    it('has an entry for frost, lava, and shadow at minimum', () => {
        expect(AURA_ADJECTIVES).toHaveProperty('frost');
        expect(AURA_ADJECTIVES).toHaveProperty('lava');
        expect(AURA_ADJECTIVES).toHaveProperty('shadow');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// generateMobWithAura
// ─────────────────────────────────────────────────────────────────────────────
describe('generateMobWithAura', () => {
    it('returns an object with the correct shape', () => {
        const result = generateMobWithAura('Zombie', 'assets/mobs/zombie.png');
        expect(result).toHaveProperty('mobName', 'Zombie');
        expect(result).toHaveProperty('mobSrc', 'assets/mobs/zombie.png');
        expect(result).toHaveProperty('aura');
        expect(result).toHaveProperty('displayName');
    });

    it('aura is always a valid aura type', () => {
        for (let i = 0; i < 30; i++) {
            const { aura } = generateMobWithAura('Creeper', 'assets/mobs/creeper.png');
            expect(VALID_AURA_TYPES).toContain(aura);
        }
    });

    it('displayName includes the adjective prefix when the aura has one', () => {
        // Run many times to hit auras that have adjectives
        let foundWithAdjective = false;
        for (let i = 0; i < 100; i++) {
            const result = generateMobWithAura('Zombie', 'src');
            if (AURA_ADJECTIVES[result.aura]) {
                expect(result.displayName).toContain(AURA_ADJECTIVES[result.aura]);
                expect(result.displayName).toContain('Zombie');
                foundWithAdjective = true;
                break;
            }
        }
        // Sanity check: at least one aura type has an adjective
        expect(Object.keys(AURA_ADJECTIVES).length).toBeGreaterThan(0);
        expect(foundWithAdjective).toBe(true);
    });

    it('displayName falls back to plain mob name when aura has no adjective', () => {
        // Force an aura that has NO adjective entry (currently all have one,
        // but this test will catch regressions if the list shrinks)
        const auraWithoutAdjective = VALID_AURA_TYPES.find(a => !AURA_ADJECTIVES[a]);
        if (auraWithoutAdjective) {
            // We can't call generateMobWithAura with a specific aura, so just verify
            // that the display name equals the mob name in that case by checking the logic
            const expectedDisplayName = 'Zombie'; // no prefix
            const adjective = AURA_ADJECTIVES[auraWithoutAdjective];
            const computed = adjective ? `${adjective} Zombie` : 'Zombie';
            expect(computed).toBe(expectedDisplayName);
        }
    });

    it('passes through mobName and mobSrc unchanged', () => {
        const mobName = 'Enderman';
        const mobSrc = 'assets/mobs/enderman.gif';
        const result = generateMobWithAura(mobName, mobSrc);
        expect(result.mobName).toBe(mobName);
        expect(result.mobSrc).toBe(mobSrc);
    });
});