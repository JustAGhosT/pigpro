// This is a mock authentication/authorization service.
// In a real application, this would involve validating a JWT,
// checking a database for user roles and subscription status.

export type UserTier = 'free' | 'premium' | 'enterprise';

// For demonstration, we'll hardcode the user's tier.
// This could be changed to 'premium' to test the paid features.
const MOCK_USER_TIER: UserTier = 'free';

export const getUserTier = (): UserTier => {
    // In a real app, you'd get this from the user's token claims.
    return MOCK_USER_TIER;
};

export const FREE_TIER_LIMITS = {
    animals: 25,
    groups: 5,
};

export const checkTierLimit = (tier: UserTier, count: number, limit: number): boolean => {
    if (tier === 'free' && count >= limit) {
        return false; // Limit reached
    }
    return true; // Limit not reached or user is on a paid tier
};
