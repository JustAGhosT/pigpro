import React, { useMemo, createContext, useContext, useReducer } from 'react';
import {
  ChevronRight, Search, Target, Heart,
  Home, Book, Users, Layers, BarChart
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { CHICKEN_CATEGORIES, chickenBreedDatabase, ChickenBreed } from '../lib/chicken-breed-data';

interface ChickenState {
  viewMode: string;
  categoryFilter: string;
  expandedBreed: string | null;
  searchTerm: string;
  selectedTraits: Record<string, unknown>;
  isLoading: boolean;
  error: string | null;
}

interface ChickenAction {
  type: string;
  payload: unknown;
}

const ChickenStateContext = createContext<ChickenState | null>(null);
const ChickenDispatchContext = createContext<React.Dispatch<ChickenAction> | null>(null);

const chickenReducer = (state: ChickenState, action: ChickenAction) => {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_CATEGORY_FILTER':
      return { ...state, categoryFilter: action.payload };
    case 'SET_EXPANDED_BREED':
      return { ...state, expandedBreed: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_TRAITS':
      return { ...state, selectedTraits: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialChickenState: ChickenState = {
  viewMode: 'home',
  categoryFilter: 'all',
  expandedBreed: null,
  searchTerm: '',
  selectedTraits: {},
  isLoading: false,
  error: null
};

const useChickenState = () => {
  const context = useContext(ChickenStateContext);
  if (!context) throw new Error('useChickenState must be used within ChickenProvider');
  return context;
};

const useChickenDispatch = () => {
  const context = useContext(ChickenDispatchContext);
  if (!context) throw new Error('useChickenDispatch must be used within ChickenProvider');
  return context;
};

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
              className="text-xs fill-gray-600 font-medium"
            >
              {key}
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

const ChickenNavigationBar: React.FC = () => {
  const state = useChickenState();
  const dispatch = useChickenDispatch();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'breeds', label: 'Breeds', icon: Book },
    { id: 'identifier', label: 'Identifier', icon: Search },
    { id: 'breeding', label: 'Breeding', icon: Target },
    { id: 'comparison', label: 'Compare', icon: BarChart },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'community', label: 'Community', icon: Users }
  ];

  return (
    <nav className="bg-green-700 text-white rounded-lg shadow-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: item.id })}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                state.viewMode === item.id
                  ? 'bg-white text-green-700'
                  : 'hover:bg-green-600'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const ChickenCategoryFilter: React.FC = () => {
  const state = useChickenState();
  const dispatch = useChickenDispatch();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-2">
          <Layers className="text-green-600" size={20} />
          <span className="font-semibold">Filter by Category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => dispatch({ type: 'SET_CATEGORY_FILTER', payload: 'all' })}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              state.categoryFilter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {Object.entries(CHICKEN_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              onClick={() => dispatch({ type: 'SET_CATEGORY_FILTER', payload: key })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                state.categoryFilter === key
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ChickenBreedCard: React.FC<{ breed: ChickenBreed }> = ({ breed }) => {
  const state = useChickenState();
  const dispatch = useChickenDispatch();
  const isExpanded = state.expandedBreed === breed.id;

  const categoryInfo = CHICKEN_CATEGORIES[breed.category];

  return (
    <Card className="hover:shadow-xl transition-all">
      <CardContent className="p-4">
        <div
          className="cursor-pointer"
          onClick={() => dispatch({
            type: 'SET_EXPANDED_BREED',
            payload: isExpanded ? null : breed.id
          })}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold text-green-700">{breed.name}</h3>
              <div className="flex gap-2 mt-1">
                <Badge className="bg-blue-100 text-blue-700">
                  {categoryInfo.label}
                </Badge>
                <Badge className="bg-gray-100 text-gray-700">
                  {breed.subcategory}
                </Badge>
              </div>
            </div>
            <ChevronRight className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Weight:</span>
              <span className="ml-2 font-medium">{breed.characteristics.henWeight}</span>
            </div>
            <div>
              <span className="text-gray-600">Eggs/year:</span>
              <span className="ml-2 font-medium">{breed.characteristics.annualEggs}</span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {breed.performance && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Performance Profile</h4>
                <div className="flex justify-center">
                  <SpiderChart
                    data={{
                      Laying: breed.performance.eggLayingConsistency,
                      Growth: breed.performance.growthRate,
                      Feed: breed.performance.feedConversion,
                      Docility: breed.performance.docility,
                      Foraging: breed.performance.foraging,
                      Hardiness: breed.performance.hardiness
                    }}
                    size={200}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Cold hardiness:</span>
                <span className="ml-2">{breed.characteristics.coldHardiness}</span>
              </div>
              <div>
                <span className="text-gray-600">Heat tolerance:</span>
                <span className="ml-2">{breed.characteristics.heatTolerance}</span>
              </div>
              <div>
                <span className="text-gray-600">Disease resistance:</span>
                <span className="ml-2">{breed.characteristics.diseaseResistance}</span>
              </div>
              <div>
                <span className="text-gray-600">Egg color:</span>
                <span className="ml-2">{breed.traits.eggColor}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ChickenHomePage: React.FC = () => {
  const dispatch = useChickenDispatch();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Welcome to Chicken Breed Intelligence System
          </h2>
          <p className="text-gray-600 mb-6">
            Your comprehensive resource for chicken breed identification, breeding recommendations,
            and flock management across all categories from bantams to commercial layers.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(CHICKEN_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => {
                  dispatch({ type: 'SET_CATEGORY_FILTER', payload: key });
                  dispatch({ type: 'SET_VIEW_MODE', payload: 'breeds' });
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-lg transition-all text-left"
              >
                <h3 className="font-bold text-green-700 mb-2">{category.label}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="text-gray-500">Avg Weight:</span>
                    <span className="ml-2 font-medium">{category.avgWeight}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Eggs:</span>
                    <span className="ml-2 font-medium">{category.avgEggs}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(chickenBreedDatabase).flat().length}
              </div>
              <div className="text-sm text-gray-600">Total Breeds</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(CHICKEN_CATEGORIES).length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">50-330</div>
              <div className="text-sm text-gray-600">Egg Range/Year</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">250g-5kg</div>
              <div className="text-sm text-gray-600">Weight Range</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ChickenBreedsView: React.FC = () => {
  const state = useChickenState();
  const dispatch = useChickenDispatch();

  const filteredBreeds = useMemo(() => {
    let breeds = Object.values(chickenBreedDatabase).flat();

    if (state.categoryFilter !== 'all') {
      breeds = breeds.filter(breed => breed.category === state.categoryFilter);
    }

    if (state.searchTerm) {
      breeds = breeds.filter(breed =>
        breed.name.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    return breeds;
  }, [state.categoryFilter, state.searchTerm]);

  return (
    <div className="space-y-6">
      <ChickenCategoryFilter />

      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Browse All Chicken Breeds
              {state.categoryFilter !== 'all' && (
                <span className="ml-2 text-lg font-normal text-gray-600">
                  ({CHICKEN_CATEGORIES[state.categoryFilter as keyof typeof CHICKEN_CATEGORIES].label})
                </span>
              )}
            </h2>

            <div className="relative">
              <Input
                type="text"
                placeholder="Search breeds..."
                value={state.searchTerm}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredBreeds.map(breed => (
              <ChickenBreedCard key={breed.id} breed={breed} />
            ))}
          </div>

          {filteredBreeds.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No breeds found</p>
              <p className="text-sm mt-2">Try adjusting your filters or search term</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ChickenComparisonView: React.FC = () => {
  const state = useChickenState();

  const breeds = state.categoryFilter === 'all'
    ? Object.values(chickenBreedDatabase).flat()
    : chickenBreedDatabase[state.categoryFilter as keyof typeof chickenBreedDatabase] || [];

  return (
    <div className="space-y-6">
      <ChickenCategoryFilter />

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Chicken Breed Comparison Table
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-100">
                  <th className="p-2 text-left">Breed</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2">Weight</th>
                  <th className="p-2">Eggs/Year</th>
                  <th className="p-2">Cold Hardy</th>
                  <th className="p-2">Heat Tolerance</th>
                  <th className="p-2">Disease Res.</th>
                </tr>
              </thead>
              <tbody>
                {breeds.map(breed => (
                  <tr key={breed.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{breed.name}</td>
                    <td className="p-2">
                      <Badge className="bg-gray-100 text-gray-700">
                        {CHICKEN_CATEGORIES[breed.category].label}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">{breed.characteristics.henWeight}</td>
                    <td className="p-2 text-center">{breed.characteristics.annualEggs}</td>
                    <td className="p-2 text-center">
                      <Badge className={`text-xs ${
                        breed.characteristics.coldHardiness === 'excellent' ? 'bg-green-100 text-green-700' :
                        breed.characteristics.coldHardiness === 'good' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {breed.characteristics.coldHardiness}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <Badge className={`text-xs ${
                        breed.characteristics.heatTolerance === 'excellent' ? 'bg-green-100 text-green-700' :
                        breed.characteristics.heatTolerance === 'good' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {breed.characteristics.heatTolerance}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">{breed.characteristics.diseaseResistance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ChickenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chickenReducer, initialChickenState);

  return (
    <ChickenStateContext.Provider value={state}>
      <ChickenDispatchContext.Provider value={dispatch}>
        {children}
      </ChickenDispatchContext.Provider>
    </ChickenStateContext.Provider>
  );
};

export const ChickenBreedIntelligence: React.FC = () => {
  const state = useChickenState();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-700">
          Chicken Breed Intelligence System
        </h1>
        <p className="text-gray-600 mt-1">
          Comprehensive breed database and analytics for all chicken categories
        </p>
      </div>

      <ChickenNavigationBar />

      <main>
        {state.viewMode === 'home' && <ChickenHomePage />}
        {state.viewMode === 'breeds' && <ChickenBreedsView />}
        {state.viewMode === 'comparison' && <ChickenComparisonView />}

        {state.viewMode === 'identifier' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4">Breed Identifier</h2>
              <p className="text-gray-600">Visual identification system coming soon for all chicken categories.</p>
            </CardContent>
          </Card>
        )}

        {state.viewMode === 'breeding' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4">Breeding Advisor</h2>
              <p className="text-gray-600">Advanced breeding recommendations across all categories.</p>
            </CardContent>
          </Card>
        )}

        {state.viewMode === 'health' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4">Health Management</h2>
              <p className="text-gray-600">Health profiles and management guides for all breeds.</p>
            </CardContent>
          </Card>
        )}

        {state.viewMode === 'community' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4">Community</h2>
              <p className="text-gray-600">Connect with other chicken enthusiasts and breeders.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

const ChickenBreedIntelligenceWithProvider: React.FC = () => {
  return (
    <ChickenProvider>
      <ChickenBreedIntelligence />
    </ChickenProvider>
  );
};

export default ChickenBreedIntelligenceWithProvider;