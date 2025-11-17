import { checkTierLimit, UserTier } from './auth';

describe('auth tier logic', () => {
    it('should allow action when user is premium', () => {
        const tier: UserTier = 'premium';
        const count = 100;
        const limit = 25;
        expect(checkTierLimit(tier, count, limit)).toBe(true);
    });

    it('should allow action when free user is under limit', () => {
        const tier: UserTier = 'free';
        const count = 20;
        const limit = 25;
        expect(checkTierLimit(tier, count, limit)).toBe(true);
    });

    it('should deny action when free user is at limit', () => {
        const tier: UserTier = 'free';
        const count = 25;
        const limit = 25;
        expect(checkTierLimit(tier, count, limit)).toBe(false);
    });

    it('should deny action when free user is over limit', () => {
        const tier: UserTier = 'free';
        const count = 30;
        const limit = 25;
        expect(checkTierLimit(tier, count, limit)).toBe(false);
    });
});
