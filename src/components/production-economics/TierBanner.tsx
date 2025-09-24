import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { UserTier } from '@/lib/auth-types'; // A new file I'll need to create

export const TierBanner: React.FC = () => {
  const [tier, setTier] = useState<UserTier | null>(null);

  useEffect(() => {
    const fetchTier = async () => {
      try {
        const response = await fetch('/api/v1/auth/tier');
        const data = await response.json();
        setTier(data.tier);
      } catch (error) {
        console.error("Failed to fetch user tier", error);
      }
    };
    fetchTier();
  }, []);

  if (!tier) return null;

  if (tier === 'premium' || tier === 'enterprise') {
    return (
        <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-r-lg">
            <p><span className="font-bold">Premium Tier</span> enabled. All features are unlocked.</p>
        </div>
    );
  }

  return (
    <div className="p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded-r-lg flex items-center justify-between">
        <p>
            You are on the <span className="font-bold">Free Tier</span>.
            You are limited to 25 animals and 5 groups.
        </p>
        <Button size="sm">
            <Star className="mr-2 h-4 w-4" />
            Upgrade to Premium
        </Button>
    </div>
  );
};
