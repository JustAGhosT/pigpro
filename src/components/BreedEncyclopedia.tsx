import React, { useMemo, useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { LIVESTOCK_DATA } from '../lib/livestock-data';

/** ===== Types (UI-normalized) ===== */
type PerfRecord = Record<string, number>;
type Characteristics = Record<string, string | number>;

interface UIBreed {
  id: string;
  name: string;
  livestockType: string;     // e.g., "poultry", "cattle", etc.
  category?: string;         // category within livestockType (e.g., "chicken")
  subcategory?: string;
  origin?: string;
  description?: string;
  temperament?: string;
  traits?: string[] | Record<string, unknown>;
  characteristics?: Characteristics; // e.g., henWeight, annualEggs, cowWeight, annualMilkYield
  performance?: PerfRecord;          // keys 0..100 for SpiderChart
  rating?: number;
  contributors?: number;
  imageUrl?: string;
}

/** ===== Spider / Radar Chart (safe for empty data) ===== */
const SpiderChart: React.FC<{ data?: PerfRecord; size?: number }> = ({ data, size = 200 }) => {
  const entries = Object.entries(data ?? {});
  if (!entries.length) {
    return <div className="text-xs text-gray-500 text-center">No performance data</div>;
  }

  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (2 * Math.PI) / entries.length;

  const points = entries.map(([key, value], index) => {
    const angle = index * angleStep - Math.PI / 2;
    const clamped = Math.max(0, Math.min(100, Number(value) || 0));
    const r = (clamped / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      label: key,
      value: clamped,
      angle,
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

      {points.map((p, index) => {
        const x2 = center + radius * Math.cos(p.angle);
        const y2 = center + radius * Math.sin(p.angle);
        const labelX = center + (radius + 20) * Math.cos(p.angle);
        const labelY = center + (radius + 20) * Math.sin(p.angle);
        return (
          <g key={index}>
            <line x1={center} y1={center} x2={x2} y2={y2} stroke="#E5E7EB" strokeWidth="1" />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-600 font-medium capitalize"
            >
              {p.label.replace(/([A-Z])/g, ' $1').trim()}
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

/** ===== Breed Card ===== */
const getCategoryColor = (livestockType: string) => {
  switch (livestockType) {
    case 'poultry':
    case 'chicken':
      return 'bg-amber-100 text-amber-700';
    case 'duck':
      return 'bg-blue-100 text-blue-700';
    case 'goose':
      return 'bg-green-100 text-green-700';
    case 'turkey':
      return 'bg-red-100 text-red-700';
    case 'guinea-fowl':
      return 'bg-purple-100 text-purple-700';
    case 'pigeon':
      return 'bg-gray-100 text-gray-700';
    case 'cattle':
      return 'bg-sky-100 text-sky-700';
    case 'goat':
    case 'goats':
      return 'bg-yellow-100 text-yellow-700';
    case 'sheep':
      return 'bg-lime-100 text-lime-700';
    case 'pig':
    case 'pigs':
      return 'bg-pink-100 text-pink-700';
    case 'rabbit':
    case 'rabbits':
      return 'bg-indigo-100 text-indigo-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const BreedCard: React.FC<{
  breed: UIBreed;
  isExpanded: boolean;
  onToggleExpand: () => void;
}> = ({ breed, isExpanded, onToggleExpand }) => {
  const characteristics: Characteristics = breed.characteristics ?? {};
  const temperament =
    breed.temperament ??
    (Array.isArray(breed.traits) ? undefined : (breed.traits as Record<string, unknown>)?.['temperament'] as string | undefined);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold">{breed.name}</CardTitle>
            <p className="text-sm text-gray-600 capitalize">
              {(breed.subcategory ?? breed.category ?? '').toString()}
            </p>
          </div>
          <Badge className={`text-xs capitalize ${getCategoryColor(breed.livestockType)}`}>
            {breed.livestockType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Temperament:</span>
            <span className="font-medium">{temperament ?? '—'}</span>
          </div>

          {'henWeight' in characteristics && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Hen Weight:</span>
              <span className="font-medium">{String(characteristics['henWeight'])}</span>
            </div>
          )}

          {'annualEggs' in characteristics && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Eggs/Year:</span>
              <span className="font-medium">{String(characteristics['annualEggs'])}</span>
            </div>
          )}

          {'cowWeight' in characteristics && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cow Weight:</span>
              <span className="font-medium">{String(characteristics['cowWeight'])}</span>
            </div>
          )}

          {'annualMilkYield' in characteristics && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Milk/Year:</span>
              <span className="font-medium">{String(characteristics['annualMilkYield'])}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-between text-sm text-green-700 font-medium cursor-pointer select-none"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
          <ChevronRight className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>

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

            {Object.keys(characteristics).length > 0 ? (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(characteristics).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-2">
                    <span className="text-gray-600 capitalize whitespace-nowrap">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="font-medium text-right">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center">No additional characteristics</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

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
  const [expandedBreed, setExpandedBreed] = useState<string | null>(null);

  const allBreeds: UIBreed[] = useMemo(() => {
    const result: UIBreed[] = [];
    for (const [livestockType, typeData] of Object.entries(LIVESTOCK_DATA as Record<string, any>)) {
      const breedsMap = typeData?.breeds ?? {};
      for (const [category, list] of Object.entries(breedsMap as Record<string, any[]>)) {
        (list ?? []).forEach((raw, idx) => {
          result.push(normalizeBreed(raw, livestockType, category, idx));
        });
      }
    }
    return result;
  }, []);

  const livestockTypes = useMemo(() => ['all', ...Object.keys(LIVESTOCK_DATA)], []);

  const categories = useMemo(() => {
    if (selectedLivestock === 'all') return ['all'];
    const typeData: any = (LIVESTOCK_DATA as any)[selectedLivestock];
    const fromCategories = typeData?.categories ? Object.keys(typeData.categories) : [];
    const fromBreeds = typeData?.breeds ? Object.keys(typeData.breeds) : [];
    return ['all', ...Array.from(new Set([...fromCategories, ...fromBreeds]))];
  }, [selectedLivestock]);

  const filteredBreeds = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allBreeds.filter(b => {
      const livestockOk = selectedLivestock === 'all' || b.livestockType === selectedLivestock;
      const categoryOk = selectedCategory === 'all' || b.category === selectedCategory;

      const haystack = [
        b.name,
        b.description,
        b.category,
        b.subcategory,
        b.origin,
        b.temperament,
        ...(
          Array.isArray(b.traits)
            ? (b.traits as string[])
            : Object.values((b.traits as Record<string, unknown> ?? {})).map(v => String(v))
        ),
        ...Object.entries(b.characteristics ?? {}).map(([k, v]) => `${k} ${v}`),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const searchOk = term === '' || haystack.includes(term);
      return livestockOk && categoryOk && searchOk;
    });
  }, [allBreeds, selectedLivestock, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Livestock Encyclopedia</h1>
        <p className="text-gray-600 mt-1">
          Comprehensive database of {allBreeds.length} livestock breeds with detailed information.
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
        Showing {filteredBreeds.length} of {allBreeds.length} breeds
      </div>
    </div>
  );
};
