import React from 'react';
import { Star, Eye, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Breed } from '../lib/types';
import { getCategoryColor } from '../lib/utils';

export const BreedCard: React.FC<{ breed: Breed; onViewDetails: (breed: Breed) => void }> = ({ breed, onViewDetails }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative rounded-t-xl">
        <img
          src={breed.imageUrl}
          alt={breed.name}
          className="w-full h-full object-cover rounded-t-xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '';
              const placeholder = document.createElement('div');
              placeholder.innerHTML =
                '<svg width="400" height="240" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6" /><text x="50%" y="50%" fontSize="18" fill="#9ca3af" dy=".3em" textAnchor="middle">Breed Image</text></svg>';
              parent.appendChild(placeholder);
            }
          }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          <span className="text-xs font-medium">{breed.rating}</span>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{breed.name}</CardTitle>
            <p className="text-sm text-gray-600">{breed.origin}</p>
          </div>
          <Badge className={`text-xs ${getCategoryColor(breed.category)}`}>
            {breed.category.charAt(0).toUpperCase() + breed.category.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className="mb-4 line-clamp-2">{breed.description}</CardDescription>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Male Weight:</span>
            <span className="font-medium">{breed.weight.male}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Female Weight:</span>
            <span className="font-medium">{breed.weight.female}</span>
          </div>
          {breed.eggProduction && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Egg Production:</span>
              <span className="font-medium">{breed.eggProduction}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Temperament:</span>
            <span className="font-medium">{breed.temperament}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {breed.traits.slice(0, 3).map((trait) => (
            <span
              key={trait}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {trait}
            </span>
          ))}
          {breed.traits.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              +{breed.traits.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{breed.contributors} contributors</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => onViewDetails(breed)}>
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
