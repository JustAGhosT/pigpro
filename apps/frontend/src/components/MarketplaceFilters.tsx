import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Filter, Grid3X3, List, LocateFixed, Search, X } from 'lucide-react';
import React from 'react';

type Props = {
  categories: string[];
  // search
  searchTerm: string;
  onSearchChange: (v: string) => void;
  // category
  selectedCategory: string;
  onCategoryChange: (v: string) => void;
  // animal toggles
  selectedCategories: Set<string>;
  onToggleCategory: (id: string) => void;
  // location & distance
  locationQuery: string;
  onLocationChange: (v: string) => void;
  onLocate: () => void;
  onClearLocation: () => void;
  distanceKm: number;
  onDistanceChange: (v: number) => void;
  // sort & view
  sortBy: string;
  onSortChange: (v: string) => void;
  viewMode: 'grid' | 'list';
  onViewChange: (v: 'grid' | 'list') => void;
  // advanced
  minRating: number;
  onMinRatingChange: (n: number) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (b: boolean) => void;
  // actions
  showFilters: boolean;
  onToggleFilters: () => void;
  onSaveFilters: () => void;
  onLoadFilters: () => void;
  onClearAll: () => void;
};

export const MarketplaceFilters: React.FC<Props> = ({
  categories,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCategories,
  onToggleCategory,
  locationQuery,
  onLocationChange,
  onLocate,
  onClearLocation,
  distanceKm,
  onDistanceChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewChange,
  minRating,
  onMinRatingChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  showFilters,
  onToggleFilters,
  onSaveFilters,
  onLoadFilters,
  onClearAll,
}) => {
  const animalCats = [
    { id: 'All', emoji: '🌍' },
    { id: 'Poultry', emoji: '🐔' },
    { id: 'Cattle', emoji: '🐄' },
    { id: 'Goats', emoji: '🐐' },
    { id: 'Pigs', emoji: '🐖' },
    { id: 'Rabbits', emoji: '🐇' },
    { id: 'Sheep', emoji: '🐑' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 sm:px-6 sm:py-4 sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="space-y-2">
        {/* Primary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Marketplace</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for livestock, breeds, or location..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              title="Filter by category"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Location:</label>
            <div className="relative">
              <input
                value={locationQuery}
                onChange={(e) => onLocationChange(e.target.value)}
                className="px-3 py-2 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="City/Province"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={onLocate}
                  className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center border border-gray-200"
                  title="Use current location"
                  aria-label="Use current location"
                >
                  <LocateFixed className="h-4 w-4 text-gray-600" />
                </button>
                {locationQuery && (
                  <button
                    type="button"
                    onClick={onClearLocation}
                    className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center border border-gray-200"
                    title="Clear location"
                    aria-label="Clear location"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Distance:</label>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={distanceKm}
              onChange={(e) => onDistanceChange(Number(e.target.value))}
              className="w-40"
              title="Filter by distance"
              aria-label="Distance in kilometers"
            />
            <span className="text-sm text-gray-600 min-w-[60px] text-right">
              {locationQuery.trim() === '' ? '—' : `≤ ${distanceKm} km`}
            </span>
          </div>
        </div>

        {/* Utility Row */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-1 order-2 lg:order-1">
            {animalCats.map((cat) => {
              const pressed = selectedCategories.has(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => onToggleCategory(cat.id)}
                  className={`px-2 py-1 rounded border text-xl leading-none ${
                    cat.id === 'All'
                      ? selectedCategories.size === 0 && selectedCategory === 'All'
                        ? 'bg-green-100 border-green-400'
                        : 'hover:bg-gray-50 border-gray-200'
                      : pressed
                        ? 'bg-green-100 border-green-400'
                        : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  aria-pressed={String(cat.id === 'All' ? (selectedCategories.size === 0 && selectedCategory === 'All') : pressed)}
                  title={cat.id === 'All' ? 'Show all categories' : `Toggle ${cat.id}`}
                >
                  <span>{cat.emoji}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 order-1 lg:order-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              title="Sort by"
            >
              {["Newest", "Price: Low to High", "Price: High to Low", "Rating", "Distance"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 order-3 ml-auto">
            <Button variant="outline" onClick={onToggleFilters} className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => onViewChange('grid')}
                className={`p-2 px-3 ${viewMode === 'grid' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                title="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`p-2 px-3 ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onLoadFilters} title="Load saved filters">
                Load
              </Button>
              <Button variant="outline" onClick={onSaveFilters} title="Save current filters">
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Minimum rating</label>
              <select className="mt-2 px-3 py-2 border rounded w-full" value={minRating} onChange={(e)=>onMinRatingChange(Number(e.target.value))} title="Select minimum rating">
                {[0,3,3.5,4,4.5].map(r => (
                  <option key={r} value={r}>{r === 0 ? 'Any' : `${r}+`}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center mt-6 space-x-2">
              <input id="verified" type="checkbox" className="h-4 w-4" checked={verifiedOnly} onChange={(e)=>onVerifiedOnlyChange(e.target.checked)} />
              <label htmlFor="verified" className="text-sm font-medium text-gray-700">Verified sellers only</label>
            </div>
            <div className="flex items-center mt-6">
              <Button variant="outline" onClick={onClearAll}>Clear filters</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceFilters;


