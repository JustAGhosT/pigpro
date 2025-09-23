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

export const BreedEncyclopedia: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBreedForModal, setSelectedBreedForModal] = useState<Breed | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedOrigin, setSelectedOrigin] = useState('all');
  const [selectedTemperament, setSelectedTemperament] = useState('all');
  const [selectedTrait, setSelectedTrait] = useState('all');

  const { categories, origins, temperaments, allTraits } = useMemo(() => {
    const categories = ['all', ...Array.from(new Set(breeds.map(b => b.category)))];
    const origins = ['all', ...Array.from(new Set(breeds.map(b => b.origin)))];
    const temperaments = ['all', ...Array.from(new Set(breeds.map(b => b.temperament)))];
    const allTraits = ['all', ...Array.from(new Set(breeds.flatMap(b => b.traits)))];
    return { categories, origins, temperaments, allTraits };
  }, [breeds]);

  const handleViewDetails = (breed: Breed) => {
    setSelectedBreedForModal(breed);
    setIsModalOpen(true);
  };

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
        return (
          matchesSearch &&
          matchesCategory &&
          matchesOrigin &&
          matchesTemperament &&
          matchesTrait
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Livestock Encyclopedia</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive database of {breeds.length} livestock breeds with detailed information
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Breed
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search breeds, traits, or characteristics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="origin">Sort by Origin</option>
              </select>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
              >
                {origins.map(origin => (
                  <option key={origin} value={origin}>
                    {origin === 'all' ? 'All Origins' : origin}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedTemperament}
                onChange={(e) => setSelectedTemperament(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
              >
                {temperaments.map(t => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'All Temperaments' : t}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedTrait}
                onChange={(e) => setSelectedTrait(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
              >
                {allTraits.map(t => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'All Traits' : t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {categories.filter(c => c !== 'all').map(category => (
          <Card key={category}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {breeds.filter(b => b.category === category).length}
              </div>
              <div className="text-sm text-gray-600">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Breeds Grid */}
      {filteredBreeds.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-12 w-12 text-gray-400 mx-auto mb-4">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
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
            <BreedCard key={breed.id} breed={breed} onViewDetails={handleViewDetails} />
          ))}
        </div>
      )}

      <div className="text-center text-sm text-gray-600">
        Showing {filteredBreeds.length} of {breeds.length} breeds
      </div>

      {isModalOpen && selectedBreedForModal && (
        <BreedDetailModal breed={selectedBreedForModal} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};