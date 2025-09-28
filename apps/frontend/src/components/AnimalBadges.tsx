import React from 'react';
import { Badge } from './ui/badge';
import { Bird, Circle, Target } from 'lucide-react';

const LIVESTOCK_TYPES = [
  { id: 'chickens', label: 'Chickens', icon: Bird, color: 'bg-orange-100 text-orange-800' },
  { id: 'pigs', label: 'Pigs', icon: Circle, color: 'bg-pink-100 text-pink-800' },
  { id: 'goats', label: 'Goats', icon: Target, color: 'bg-amber-100 text-amber-800' },
  { id: 'rabbits', label: 'Rabbits', icon: Circle, color: 'bg-gray-100 text-gray-800' }
];

interface AnimalBadgesProps {
  animalIds: string[];
}

export const AnimalBadges: React.FC<AnimalBadgesProps> = ({ animalIds }) => (
  <>
    {animalIds.map((animal) => {
      const animalData = LIVESTOCK_TYPES.find(t => t.id === animal);
      return (
        <Badge key={animal} className={animalData?.color || 'bg-gray-100 text-gray-800'}>
          {animalData?.label}
        </Badge>
      );
    })}
  </>
);