import React, { useState } from 'react';
import { Search, Star, Plus, Eye, Users, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface Breed {
  id: string;
  name: string;
  origin: string;
  category: 'chicken' | 'duck' | 'goose' | 'turkey' | 'guinea-fowl' | 'pigeon' | 'pig' | 'goat' | 'rabbit';
  description: string;
  traits: string[];
  weight: {
    male: string;
    female: string;
  };
  eggProduction?: string;
  milkProduction?: string;
  temperament: string;
  rating: number;
  contributors: number;
  imageUrl: string;
  compliance: {
    ndImmunisation?: boolean;
    pdmaRequirements?: string[];
    exportConsiderations?: string[];
  };
  intelligence: {
    breedingPotential: number;
    marketDemand: 'high' | 'medium' | 'low';
    adaptability: number;
    maintenanceLevel: 'low' | 'medium' | 'high';
  };
  commonHealthConcerns?: string[];
}

const BreedDetailModal: React.FC<{ breed: Breed; onClose: () => void }> = ({ breed, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 sticky top-0 bg-white border-b z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{breed.name}</h2>
              <p className="text-gray-600">{breed.origin}</p>
            </div>
            <Button onClick={onClose} size="icon" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <img
            src={breed.imageUrl}
            alt={breed.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <p className="text-gray-700">{breed.description}</p>

          <Card>
            <CardHeader>
              <CardTitle>Health Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {breed.commonHealthConcerns && breed.commonHealthConcerns.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-1">Common Health Concerns</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {breed.commonHealthConcerns.map(concern => <li key={concern}>{concern}</li>)}
                  </ul>
                </div>
              )}
              {breed.compliance?.ndImmunisation && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">ND Immunisation Required</Badge>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-1">Maintenance Level</h4>
                <p className="text-sm text-gray-600 capitalize">{breed.intelligence.maintenanceLevel}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Adaptability Score</h4>
                <p className="text-sm text-gray-600">{breed.intelligence.adaptability}/100</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

const breeds: Breed[] = [
  {
    id: '1',
    name: 'Rhode Island Red',
    origin: 'United States',
    category: 'chicken',
    description: 'Hardy dual-purpose breed known for excellent egg production and good meat quality.',
    traits: ['Hardy', 'Good Egg Layer', 'Dual Purpose', 'Cold Tolerant'],
    weight: {
      male: '3.9kg',
      female: '2.9kg'
    },
    eggProduction: '250-300 eggs/year',
    temperament: 'Docile',
    rating: 4.8,
    contributors: 34,
    imageUrl: '/placeholder-rhode-island-red.jpg',
    compliance: {
      ndImmunisation: true,
      pdmaRequirements: ['Health certificates', 'Transport permits'],
      exportConsiderations: ['HPAI vaccination', 'Export health certificates']
    },
    intelligence: {
      breedingPotential: 92,
      marketDemand: 'high' as const,
      adaptability: 88,
      maintenanceLevel: 'low' as const
    },
    commonHealthConcerns: ['Marek's Disease', 'Coccidiosis', 'Bumblefoot']
  },
  {
    id: '2',
    name: 'White Leghorn',
    origin: 'Italy',
    category: 'chicken',
    description: 'Excellent white egg layer breed, active and hardy with high feed efficiency.',
    traits: ['Excellent Layer', 'Active', 'Hardy', 'Heat Tolerant'],
    weight: {
      male: '2.7kg',
      female: '2.0kg'
    },
    eggProduction: '280-320 eggs/year',
    temperament: 'Active',
    rating: 4.6,
    contributors: 28,
    imageUrl: '/placeholder-leghorn.jpg',
    commonHealthConcerns: ['Avian Influenza (if in high-risk areas)', 'Egg-binding']
  },
  {
    id: '3',
    name: 'Pekin Duck',
    origin: 'China',
    category: 'duck',
    description: 'Large white duck breed excellent for meat production with calm temperament.',
    traits: ['Fast Growing', 'Good Meat Production', 'Hardy', 'Calm'],
    weight: {
      male: '4.1kg',
      female: '3.6kg'
    },
    eggProduction: '150-200 eggs/year',
    temperament: 'Calm',
    rating: 4.4,
    contributors: 19,
    imageUrl: '/placeholder-pekin-duck.jpg'
  },
  {
    id: '4',
    name: 'Toulouse Goose',
    origin: 'France',
    category: 'goose',
    description: 'Large heritage goose breed known for excellent meat quality and liver production.',
    traits: ['Large Size', 'Excellent Meat', 'Good Forager', 'Docile'],
    weight: {
      male: '12kg',
      female: '10kg'
    },
    eggProduction: '35-40 eggs/year',
    temperament: 'Docile',
    rating: 4.5,
    contributors: 15,
    imageUrl: '/placeholder-toulouse-goose.jpg'
  },
  {
    id: '5',
    name: 'Bronze Turkey',
    origin: 'United States',
    category: 'turkey',
    description: 'Traditional heritage turkey breed with excellent meat quality and natural breeding ability.',
    traits: ['Heritage Breed', 'Natural Breeding', 'Good Meat Quality', 'Hardy'],
    weight: {
      male: '16kg',
      female: '9kg'
    },
    temperament: 'Alert',
    rating: 4.3,
    contributors: 12,
    imageUrl: '/placeholder-bronze-turkey.jpg'
  },
  {
    id: '6',
    name: 'Guinea Fowl',
    origin: 'Africa',
    category: 'guinea-fowl',
    description: 'Hardy bird excellent for pest control, alert and protective of the flock.',
    traits: ['Pest Control', 'Alert', 'Hardy', 'Good Alarm System'],
    weight: {
      male: '1.3kg',
      female: '1.2kg'
    },
    eggProduction: '100-150 eggs/year',
    temperament: 'Alert',
    rating: 4.2,
    contributors: 21,
    imageUrl: '/placeholder-guinea-fowl.jpg'
  },
  {
    id: '7',
    name: 'Hampshire Pig',
    origin: 'United Kingdom',
    category: 'pig',
    description: 'Hardy pig breed known for excellent meat quality, good mothering ability, and lean muscle development.',
    traits: ['Lean Meat', 'Good Mothering', 'Hardy', 'Fast Growing'],
    weight: {
      male: '320kg',
      female: '250kg'
    },
    temperament: 'Docile',
    rating: 4.6,
    contributors: 18,
    imageUrl: '/placeholder-hampshire-pig.jpg'
  },
  {
    id: '8',
    name: 'Large White Pig',
    origin: 'United Kingdom',
    category: 'pig',
    description: 'Popular commercial pig breed with excellent feed conversion and high litter numbers.',
    traits: ['High Fertility', 'Good Feed Conversion', 'Large Litters', 'Hardy'],
    weight: {
      male: '300kg',
      female: '230kg'
    },
    temperament: 'Calm',
    rating: 4.7,
    contributors: 25,
    imageUrl: '/placeholder-large-white-pig.jpg'
  },
  {
    id: '9',
    name: 'Boer Goat',
    origin: 'South Africa',
    category: 'goat',
    description: 'Premium meat goat breed developed in South Africa, known for fast growth and excellent meat quality.',
    traits: ['Fast Growth', 'Excellent Meat', 'Hardy', 'Good Mothers'],
    weight: {
      male: '120kg',
      female: '90kg'
    },
    temperament: 'Docile',
    rating: 4.8,
    contributors: 32,
    imageUrl: '/placeholder-boer-goat.jpg'
  },
  {
    id: '10',
    name: 'Saanen Goat',
    origin: 'Switzerland',
    category: 'goat',
    description: 'World-renowned dairy goat breed with excellent milk production and calm temperament.',
    traits: ['High Milk Production', 'Calm', 'Hardy', 'Heat Tolerant'],
    weight: {
      male: '90kg',
      female: '65kg'
    },
    temperament: 'Calm',
    rating: 4.5,
    contributors: 24,
    imageUrl: '/placeholder-saanen-goat.jpg'
  },
  {
    id: '11',
    name: 'New Zealand White Rabbit',
    origin: 'United States',
    category: 'rabbit',
    description: 'Popular meat rabbit breed with excellent growth rate and feed conversion efficiency.',
    traits: ['Fast Growth', 'Good Feed Conversion', 'Large Litters', 'Docile'],
    weight: {
      male: '5kg',
      female: '4.5kg'
    },
    temperament: 'Docile',
    rating: 4.4,
    contributors: 16,
    imageUrl: '/placeholder-nz-white-rabbit.jpg'
  },
  {
    id: '12',
    name: 'Californian Rabbit',
    origin: 'United States',
    category: 'rabbit',
    description: 'Dual-purpose rabbit breed excellent for both meat and fur production with distinctive markings.',
    traits: ['Dual Purpose', 'Good Meat Quality', 'Hardy', 'Distinctive Markings'],
    weight: {
      male: '4.5kg',
      female: '4kg'
    },
    temperament: 'Calm',
    rating: 4.3,
    contributors: 14,
    imageUrl: '/placeholder-californian-rabbit.jpg'
  }
];

const BreedCard: React.FC<{ breed: Breed; onViewDetails: (breed: Breed) => void }> = ({ breed, onViewDetails }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'chicken': return 'bg-amber-100 text-amber-700';
      case 'duck': return 'bg-blue-100 text-blue-700';
      case 'goose': return 'bg-green-100 text-green-700';
      case 'turkey': return 'bg-red-100 text-red-700';
      case 'guinea-fowl': return 'bg-purple-100 text-purple-700';
      case 'pigeon': return 'bg-gray-100 text-gray-700';
      case 'pig': return 'bg-pink-100 text-pink-700';
      case 'goat': return 'bg-yellow-100 text-yellow-700';
      case 'rabbit': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative rounded-t-xl">
        <img
          src={breed.imageUrl}
          alt={breed.name}
          className="w-full h-full object-cover rounded-t-xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CcmVlZCBJbWFnZTwvdGV4dD48L3N2Zz4=';
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
          <Button size="sm" variant="outline" onClick={() => onViewDetails(breed)}>
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

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
  }, []);

  const handleViewDetails = (breed: Breed) => {
    setSelectedBreedForModal(breed);
    setIsModalOpen(true);
  };

  const filteredBreeds = breeds
    .filter(breed => {
      const matchesSearch = breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           breed.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           breed.traits.some(trait => trait.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || breed.category === selectedCategory;
      const matchesOrigin = selectedOrigin === 'all' || breed.origin === selectedOrigin;
      const matchesTemperament = selectedTemperament === 'all' || breed.temperament === selectedTemperament;
      const matchesTrait = selectedTrait === 'all' || breed.traits.includes(selectedTrait);
      return matchesSearch && matchesCategory && matchesOrigin && matchesTemperament && matchesTrait;
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