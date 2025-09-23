import React, { useEffect, useMemo, useState } from 'react';
import { Search, Star, Plus, Eye, Users, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { breeds } from '../lib/data';
import { Breed } from '../lib/types';
import { BreedCard } from './BreedCard';
import { BreedDetailModal } from './BreedDetailModal';

/** ===== Flatten + Normalize LIVESTOCK_DATA ===== */
function normalizeBreed(raw: any, livestockType: string, category: string, index: number): UIBreed {
  const id =
    (typeof raw?.id === 'string' && raw.id) ||
    `${livestockType}-${category}-${(raw?.name ?? 'item').toString().toLowerCase().replace(/\s+/g, '-')}-${index}`;

  const characteristics: Characteristics | undefined =
    raw?.characteristics && typeof raw.characteristics === 'object'
      ? raw.characteristics
      : undefined;

  const performance: PerfRecord | undefined =
    raw?.performance && typeof raw.performance === 'object'
      ? Object.fromEntries(
          Object.entries(raw.performance).map(([k, v]) => [k, Number(v) || 0])
        )
      : undefined;

  return {
    id,
    name: raw?.name ?? 'Unknown',
    livestockType,
    category,
    subcategory: raw?.subcategory,
    origin: raw?.origin,
    description: raw?.description,
    temperament: raw?.temperament ?? (Array.isArray(raw?.traits) ? undefined : raw?.traits?.temperament),
    traits: raw?.traits,
    characteristics,
    performance,
    rating: typeof raw?.rating === 'number' ? raw.rating : undefined,
    contributors: typeof raw?.contributors === 'number' ? raw.contributors : undefined,
    imageUrl: raw?.imageUrl,
  };
}

/** ===== Main Component ===== */
export const BreedEncyclopedia: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLivestock, setSelectedLivestock] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, _setSortBy] = useState('name');
  const [selectedOrigin, _setSelectedOrigin] = useState('all');
  const [selectedTemperament, _setSelectedTemperament] = useState('all');
  const [selectedTrait, _setSelectedTrait] = useState('all');
  const [expandedBreed, setExpandedBreed] = useState<string | null>(null);

  const { categories, origins, temperaments, allTraits } = useMemo(() => {
    const categories = ['all', ...Array.from(new Set(breeds.map(b => b.category)))];
    const origins = ['all', ...Array.from(new Set(breeds.map(b => b.origin)))];
    const temperaments = ['all', ...Array.from(new Set(breeds.map(b => b.temperament)))];
    const allTraits = ['all', ...Array.from(new Set(breeds.flatMap(b => b.traits)))];
    return { categories, origins, temperaments, allTraits };
  }, [breeds]);
  const livestockTypes = useMemo(() => ['all', ...Array.from(new Set(breeds.map(b => b.livestockType)))], []);

  const filteredBreeds = useMemo(() => {
    return breeds
      .filter(breed => {
        const matchesSearch =
          searchTerm === '' ||
          breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          breed.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          breed.traits.some(trait => trait.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || breed.category === selectedCategory;
        const matchesOrigin = selectedOrigin === 'all' || breed.origin === selectedOrigin;
        const matchesTemperament =
          selectedTemperament === 'all' || breed.temperament === selectedTemperament;
        const matchesTrait = selectedTrait === 'all' || breed.traits.includes(selectedTrait);
        const matchesLivestock = selectedLivestock === 'all' || breed.livestockType === selectedLivestock;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesOrigin &&
          matchesTemperament &&
          matchesTrait &&
          matchesLivestock
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'rating':
            return b.rating - a.rating;
          case 'origin':
            return a.origin.localeCompare(b.origin);
          default:
            return 0;
        }
      });
  }, [searchTerm, selectedCategory, selectedOrigin, selectedTemperament, selectedTrait, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Livestock Encyclopedia</h1>
        <p className="text-gray-600 mt-1">
          Comprehensive database of {breeds.length} livestock breeds with detailed information.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search breeds, traits, or characteristics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={selectedLivestock}
            onChange={(e) => {
              setSelectedLivestock(e.target.value);
              setSelectedCategory('all');
            }}
            className="w-full lg:w-48 h-9 px-3 py-1 border border-gray-200 rounded-md text-sm capitalize"
          >
            {livestockTypes.map(type => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full lg:w-48 h-9 px-3 py-1 border border-gray-200 rounded-md text-sm capitalize"
            disabled={selectedLivestock === 'all'}
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize">
                {cat}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Breeds Grid */}
      {filteredBreeds.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-12 w-12 text-gray-400 mx-auto mb-4">
              <svg fill="currentColor" viewBox="0 0 20 20" className="h-12 w-12">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No breeds found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No breeds available in the database.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBreeds.map(breed => (
            <BreedCard
              key={breed.id}
              breed={breed}
              isExpanded={expandedBreed === breed.id}
              onToggleExpand={() => setExpandedBreed(expandedBreed === breed.id ? null : breed.id)}
            />
          ))}
        </div>
      )}

      <div className="text-center text-sm text-gray-600">
        Showing {filteredBreeds.length} of {breeds.length} breeds
      </div>
    </div>
  );
};
