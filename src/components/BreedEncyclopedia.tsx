import React, { useState, useMemo } from 'react';
import { Search, Star, Plus, Eye, Users, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { LIVESTOCK_DATA } from '../lib/livestock-data';

// Generic type for any breed from our data
type Breed = typeof LIVESTOCK_DATA[keyof typeof LIVESTOCK_DATA]['breeds'][keyof any][number];

const SpiderChart: React.FC<{ data: Record<string, number>; size?: number }> = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (2 * Math.PI) / Object.keys(data).length;

  const points = Object.entries(data).map(([key, value], index) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      label: key,
      value
    };
  });

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} className="spider-chart">
      {[20, 40, 60, 80, 100].map(level => (
        <circle
          key={level}
          cx={center}
          cy={center}
          r={(level / 100) * radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
      ))}

      {Object.entries(data).map(([key], index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);
        const labelX = center + (radius + 20) * Math.cos(angle);
        const labelY = center + (radius + 20) * Math.sin(angle);

        return (
          <g key={key}>
            <line x1={center} y1={center} x2={x2} y2={y2} stroke="#E5E7EB" strokeWidth="1" />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-600 font-medium capitalize"
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </text>
          </g>
        );
      })}

      <polygon points={polygonPoints} fill="#10B98133" stroke="#10B981" strokeWidth="2" />

      {points.map((point, index) => (
        <circle key={index} cx={point.x} cy={point.y} r="4" fill="#10B981">
          <title>{`${point.label}: ${point.value}%`}</title>
        </circle>
      ))}
    </svg>
  );
};

const BreedCard: React.FC<{
  breed: Breed;
  isExpanded: boolean;
  onToggleExpand: () => void;
  livestockType: string;
}> = ({ breed, isExpanded, onToggleExpand, livestockType }) => {
  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'poultry': return 'bg-amber-100 text-amber-700';
      case 'cattle': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const characteristics = breed.characteristics as any;
  const traits = breed.traits as any;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{breed.name}</CardTitle>
            <p className="text-sm text-gray-600 capitalize">{breed.subcategory}</p>
          </div>
          <Badge className={`text-xs ${getCategoryColor(livestockType)}`}>
            {livestockType.charAt(0).toUpperCase() + livestockType.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Temperament:</span>
            <span className="font-medium">{traits.temperament}</span>
          </div>
          {characteristics.henWeight && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Hen Weight:</span>
              <span className="font-medium">{characteristics.henWeight}</span>
            </div>
          )}
          {characteristics.annualEggs && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Eggs/Year:</span>
              <span className="font-medium">{characteristics.annualEggs}</span>
            </div>
          )}
           {characteristics.cowWeight && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cow Weight:</span>
              <span className="font-medium">{characteristics.cowWeight}</span>
            </div>
          )}
          {characteristics.annualMilkYield && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Milk/Year:</span>
              <span className="font-medium">{characteristics.annualMilkYield}</span>
            </div>
          )}
        </div>

        <div
          className="flex items-center justify-between text-sm text-green-600 font-medium cursor-pointer"
          onClick={onToggleExpand}
        >
          <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
          <ChevronRight className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {breed.performance && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2 text-center">Performance Profile</h4>
                <div className="flex justify-center">
                  <SpiderChart data={breed.performance} size={220} />
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(characteristics).map(([key, value]) => (
                 <div key={key}>
                   <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                   <span className="ml-2 font-medium">{value}</span>
                 </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export const BreedEncyclopedia: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLivestock, setSelectedLivestock] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedBreed, setExpandedBreed] = useState<string | null>(null);

  const breeds = useMemo(() => {
    let allBreeds: (Breed & {livestockType: string})[] = [];
    for (const livestockType in LIVESTOCK_DATA) {
        const typeData = LIVESTOCK_DATA[livestockType as keyof typeof LIVESTOCK_DATA];
        const breeds = Object.values(typeData.breeds).flat().map(b => ({...b, livestockType}));
        allBreeds = [...allBreeds, ...breeds];
    }
    return allBreeds;
  }, []);

  const filteredBreeds = useMemo(() => {
    return breeds.filter(breed => {
      const livestockFilter = selectedLivestock === 'all' || breed.livestockType === selectedLivestock;
      const categoryFilter = selectedCategory === 'all' || breed.category === selectedCategory;
      const searchFilter = searchTerm === '' || breed.name.toLowerCase().includes(searchTerm.toLowerCase());
      return livestockFilter && categoryFilter && searchFilter;
    });
  }, [breeds, selectedLivestock, selectedCategory, searchTerm]);

  const livestockTypes = ['all', ...Object.keys(LIVESTOCK_DATA)];
  const categories = useMemo(() => {
    if (selectedLivestock === 'all') return ['all'];
    const typeData = LIVESTOCK_DATA[selectedLivestock as keyof typeof LIVESTOCK_DATA];
    return ['all', ...Object.keys(typeData.categories)];
  }, [selectedLivestock]);

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
          <Input
            placeholder="Search breeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <select
            value={selectedLivestock}
            onChange={(e) => {
              setSelectedLivestock(e.target.value);
              setSelectedCategory('all');
            }}
            className="w-full lg:w-48 h-9 px-3 py-1 border border-gray-200 rounded-md text-sm"
          >
            {livestockTypes.map(type => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full lg:w-48 h-9 px-3 py-1 border border-gray-200 rounded-md text-sm"
            disabled={selectedLivestock === 'all'}
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize">{cat}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBreeds.map(breed => (
          <BreedCard
            key={breed.id}
            breed={breed}
            isExpanded={expandedBreed === breed.id}
            onToggleExpand={() => setExpandedBreed(expandedBreed === breed.id ? null : breed.id)}
            livestockType={breed.livestockType}
          />
        ))}
      </div>
    </div>
  );
};