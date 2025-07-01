import React, { useState } from 'react';
import { Search, Filter, Star, Plus, Eye, Users } from 'lucide-react';

interface Breed {
  id: string;
  name: string;
  origin: string;
  category: string;
  description: string;
  traits: string[];
  avgWeight: string;
  growthRate: string;
  feedEfficiency: string;
  rating: number;
  contributors: number;
  imageUrl: string;
}

const breeds: Breed[] = [
  {
    id: '1',
    name: 'Kolbroek',
    origin: 'South Africa',
    category: 'Heritage',
    description: 'Indigenous South African breed known for excellent meat quality and adaptability to local conditions.',
    traits: ['Hardy', 'Disease Resistant', 'Good Mothering', 'Slow Growing'],
    avgWeight: '80-120kg',
    growthRate: 'Slow (400-500g/day)',
    feedEfficiency: 'Excellent',
    rating: 4.8,
    contributors: 23,
    imageUrl: 'https://images.pexels.com/photos/1300353/pexels-photo-1300353.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Large White',
    origin: 'England',
    category: 'Commercial',
    description: 'Popular commercial breed with excellent growth rates and lean meat production.',
    traits: ['Fast Growing', 'High Fertility', 'Good Feed Conversion', 'Lean Meat'],
    avgWeight: '250-350kg',
    growthRate: 'Fast (700-900g/day)',
    feedEfficiency: 'Very Good',
    rating: 4.6,
    contributors: 45,
    imageUrl: 'https://images.pexels.com/photos/1300353/pexels-photo-1300353.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Landrace',
    origin: 'Denmark',
    category: 'Commercial',
    description: 'Excellent maternal breed with high prolificacy and good milk production.',
    traits: ['High Prolificacy', 'Good Milk Production', 'Long Body', 'Docile'],
    avgWeight: '200-300kg',
    growthRate: 'Moderate (600-750g/day)',
    feedEfficiency: 'Good',
    rating: 4.4,
    contributors: 32,
    imageUrl: 'https://images.pexels.com/photos/1300353/pexels-photo-1300353.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'Duroc',
    origin: 'United States',
    category: 'Commercial',
    description: 'Red-colored breed known for excellent meat quality and marbling.',
    traits: ['Excellent Meat Quality', 'Good Marbling', 'Hardy', 'Fast Growing'],
    avgWeight: '270-350kg',
    growthRate: 'Fast (750-850g/day)',
    feedEfficiency: 'Good',
    rating: 4.5,
    contributors: 28,
    imageUrl: 'https://images.pexels.com/photos/1300353/pexels-photo-1300353.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const BreedCard: React.FC<{ breed: Breed }> = ({ breed }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <div className="aspect-video bg-gray-200 relative">
      <img 
        src={breed.imageUrl} 
        alt={breed.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
        <Star className="h-3 w-3 text-yellow-500 fill-current" />
        <span className="text-xs font-medium">{breed.rating}</span>
      </div>
    </div>
    
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{breed.name}</h3>
          <p className="text-sm text-gray-600">{breed.origin}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          breed.category === 'Heritage' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {breed.category}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{breed.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Avg. Weight:</span>
          <span className="font-medium">{breed.avgWeight}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Growth Rate:</span>
          <span className="font-medium">{breed.growthRate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Feed Efficiency:</span>
          <span className="font-medium">{breed.feedEfficiency}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {breed.traits.slice(0, 3).map((trait, index) => (
          <span 
            key={index}
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
        <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  </div>
);

export const BreedEncyclopedia: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBreeds = breeds.filter(breed => {
    const matchesSearch = breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         breed.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || breed.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Breed Encyclopedia</h1>
        <p className="text-gray-600 mt-1">Comprehensive guide to pig breeds for South African farmers</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search breeds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="heritage">Heritage</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          
          <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Breed</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{breeds.length}</div>
          <div className="text-sm text-gray-600">Total Breeds</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">128</div>
          <div className="text-sm text-gray-600">Active Contributors</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">4.6</div>
          <div className="text-sm text-gray-600">Avg. Rating</div>
        </div>
      </div>

      {/* Breed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBreeds.map((breed) => (
          <BreedCard key={breed.id} breed={breed} />
        ))}
      </div>

      {filteredBreeds.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No breeds found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};