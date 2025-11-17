import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useErrorHandler } from '@/lib/error-handler';
import {
  Clock,
  Eye,
  Heart,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Shield,
  ShoppingCart,
  Star,
  Truck
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MarketplaceFilters from './MarketplaceFilters';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  category: string;
  breed: string;
  age: string;
  gender: string;
  isVerified: boolean;
  isFavorite: boolean;
  description: string;
  likes?: number;
  promoted?: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Rhode Island Red Hens - Show Quality',
    price: 450,
    currency: 'ZAR',
    image: '/images/rhode-island-red-chickens.jpg',
    location: 'Cape Town, WC',
    rating: 4.8,
    reviews: 24,
    category: 'Poultry',
    breed: 'Rhode Island Red',
    age: '6 months',
    gender: 'Female',
    isVerified: true,
    isFavorite: false,
    description: 'Excellent laying hens with proven bloodlines. Perfect for both egg production and show purposes.'
  },
  {
    id: '2',
    title: 'Boer Goat Breeding Stock',
    price: 2500,
    currency: 'ZAR',
    image: '/images/boer-goat.webp',
    location: 'Pretoria, GP',
    rating: 4.9,
    reviews: 18,
    category: 'Goats',
    breed: 'Boer',
    age: '2 years',
    gender: 'Male',
    isVerified: true,
    isFavorite: true,
    description: 'Premium Boer goat breeding stock with excellent genetics and conformation.'
  },
  {
    id: '3',
    title: 'Large White Piglets',
    price: 800,
    currency: 'ZAR',
    image: '/images/large-white-pigs.jpg',
    location: 'Durban, KZN',
    rating: 4.6,
    reviews: 12,
    category: 'Pigs',
    breed: 'Large White',
    age: '8 weeks',
    gender: 'Mixed',
    isVerified: true,
    isFavorite: false,
    description: 'Healthy Large White piglets ready for weaning. Great for meat production.'
  },
  {
    id: '4',
    title: 'Angora Rabbit Breeding Pair',
    price: 1200,
    currency: 'ZAR',
    image: '/images/angora-rabbit-pair.jpeg',
    location: 'Bloemfontein, FS',
    rating: 4.7,
    reviews: 8,
    category: 'Rabbits',
    breed: 'Angora',
    age: '1 year',
    gender: 'Pair',
    isVerified: true,
    isFavorite: false,
    description: 'Beautiful Angora rabbits with excellent wool quality. Perfect for fiber production.'
  }
];

const categories = ['All', 'Poultry', 'Cattle', 'Goats', 'Sheep', 'Pigs', 'Rabbits', 'Fish', 'Insects', 'Arachnids'];
// sortOptions moved to MarketplaceFilters; keep local state only

export const Shopping: React.FC = () => {
  const { isAuthenticated, showAuthModal } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('Newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const { error, handleError, clearError } = useErrorHandler();
  const searchTimerRef = React.useRef<number | null>(null);
  // (fetch listings effect moved below after all state declarations to avoid TDZ)

  // Derived price bounds from current catalog
  const priceBounds = useMemo(() => {
    if (!products || products.length === 0) {
      return { min: 0, max: 0 };
    }
    const prices = products.map(p => p.price).filter(price => typeof price === 'number' && !isNaN(price));
    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  }, [products]);

  // Filter state
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [ageRange, setAgeRange] = useState<{ min: number; max: number }>({ min: 0, max: 120 });
  const [gender, setGender] = useState<string>('');
  const [breed, setBreed] = useState<string>('');
  // default location empty ("Anywhere")
  const [locationQuery, setLocationQuery] = useState<string>('');

  // Initialize price sliders once bounds are known
  React.useEffect(() => {
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
  }, [priceBounds.min, priceBounds.max]);

  // Distance filtering
  type LatLng = { lat: number; lng: number };
  const cityCoords = useMemo<Record<string, LatLng>>(() => ({
    'cape town, wc': { lat: -33.9249, lng: 18.4241 },
    'pretoria, gp': { lat: -25.7479, lng: 28.2293 },
    'durban, kzn': { lat: -29.8587, lng: 31.0218 },
    'bloemfontein, fs': { lat: -29.0852, lng: 26.1596 },
  }), []);

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 = off until location chosen

  React.useEffect(() => {
    if ('geolocation' in navigator) {
      // Request user permission before accessing location
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Only use location if user granted permission
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (error) => {
          // Handle permission denied or other errors gracefully
          console.log('Geolocation access denied or failed:', error.message);
          setUserLocation(cityCoords['pretoria, gp']);
        },
        { 
          maximumAge: 600000, // 10 minutes
          timeout: 5000,
          enableHighAccuracy: false // Use less accurate but faster location
        }
      );
    } else {
      setUserLocation(cityCoords['pretoria, gp']);
    }
  }, [cityCoords]);

  // Fetch listings from backend (after all state vars are declared)
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    const cat = selectedCategories.size > 0 ? Array.from(selectedCategories)[0] : selectedCategory;
    if (cat && cat !== 'All') params.set('category', cat);
    const defaultMin = priceBounds.min;
    const defaultMax = priceBounds.max;
    if (priceMin > defaultMin) {
      params.set('minPrice', String(priceMin));
    }
    if (defaultMax > 0 && priceMax < defaultMax) {
      params.set('maxPrice', String(priceMax));
    }
    if (minRating) params.set('minRating', String(minRating));
    if (verifiedOnly) params.set('verifiedOnly', 'true');
    if (locationQuery) params.set('city', locationQuery);
    if (userLocation && maxDistanceKm > 0) {
      params.set('lat', String(userLocation.lat));
      params.set('lng', String(userLocation.lng));
      params.set('maxKm', String(maxDistanceKm));
    }
    fetch(`/api/v1/listings?${params.toString()}`, { signal: controller.signal })
  }, [
    searchTerm,
    selectedCategory,
    selectedCategories,
    priceMin,
    priceMax,
    minRating,
    verifiedOnly,
    locationQuery,
    userLocation,
    maxDistanceKm,
    priceBounds.min,
    priceBounds.max,
  ]);
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((json: Product[]) => setProducts(json))
      .catch(() => { /* keep mock on failure */ });
    return () => controller.abort();
  }, [searchTerm, selectedCategory, selectedCategories, priceMin, priceMax, minRating, verifiedOnly, locationQuery, userLocation, maxDistanceKm]);

  const toCoords = React.useCallback((location: string): LatLng | null => {
    const key = location.toLowerCase();
    return cityCoords[key] ?? null;
  }, [cityCoords]);

  const nearestCityLabel = (pos: LatLng): string | null => {
    const best = Object.entries(cityCoords).reduce<{ name: string; d: number } | null>((acc, [name, coords]) => {
      const d = haversineKm(pos, coords);
      if (!acc || d < acc.d) return { name, d };
      return acc;
    }, null);
    if (!best) return null;
    return best.name
      .split(', ')
      .map((part) => part.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
      .join(', ');
  };

  const haversineKm = React.useCallback((a: LatLng, b: LatLng) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const la1 = (a.lat * Math.PI) / 180;
    const la2 = (b.lat * Math.PI) / 180;
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(la1) * Math.cos(la2) * sinDLng * sinDLng));
    return R * c;
  }, []);

  const toggleFavorite = (productId: string) => {
    // allow liking without auth for now; persist to backend
    try {
      // Find the current product to determine the correct delta
      const currentProduct = products.find(p => p.id === productId);
      if (!currentProduct) return;
      
      const delta = currentProduct.isFavorite ? -1 : 1;
      
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, isFavorite: !product.isFavorite, likes: (product.likes || 0) + delta }
          : product
      ));
      fetch(`/api/v1/listings/${productId}/like`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ delta }) })
        .catch(() => {});
      clearError();
    } catch (err) {
      handleError(err as Error);
    }
  };

  const handleContactSeller = (productId: string, contactType: 'email' | 'phone') => {
    if (!isAuthenticated) {
      showAuthModal('signin');
      return;
    }
    
    if (contactType === 'phone') {
      // Phone contact requires membership upgrade
      alert('Phone contact requires membership upgrade. Please upgrade your account to access seller phone numbers.');
      return;
    }
    
    // Email contact is free for all registered users
    try {
      console.log(`Sending email to seller for product ${productId}`);
      alert('Email sent to seller! They will respond within 24 hours.');
    } catch (err) {
      handleError(err as Error);
    }
  };

  const addToCart = (productId: string) => {
    if (!isAuthenticated) {
      showAuthModal('signin');
      return;
    }
    
    try {
      setCart(prev => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1
      }));
    } catch (err) {
      handleError(err as Error);
    }
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.breed.toLowerCase().includes(searchTerm.toLowerCase());
      const useMulti = selectedCategories.size > 0;
      const matchesCategory = useMulti
        ? selectedCategories.has(product.category)
        : (selectedCategory === 'All' || product.category === selectedCategory);
      const matchesPrice = product.price >= priceMin && product.price <= priceMax;
      const matchesRating = product.rating >= minRating;
      const matchesVerified = !verifiedOnly || product.isVerified;
      const matchesAge = !product.age || (() => {
        // Parse age string to extract numeric value in months
        const ageStr = product.age.toLowerCase().trim();
        const ageMatch = ageStr.match(/(\d+(?:\.\d+)?)\s*(year|yr|y|month|mo|m|week|wk|w|day|d)/);
        if (!ageMatch) return true; // If can't parse, don't filter out
        
        const ageValue = parseFloat(ageMatch[1]);
        const unit = ageMatch[2];
        
        // Convert to months
        let ageInMonths: number;
        if (unit.includes('year') || unit.includes('yr') || unit === 'y') {
          ageInMonths = ageValue * 12;
        } else if (unit.includes('month') || unit.includes('mo') || unit === 'm') {
          ageInMonths = ageValue;
        } else if (unit.includes('week') || unit.includes('wk') || unit === 'w') {
          ageInMonths = ageValue / 4.345; // 52/12 weeks per month
        } else if (unit.includes('day') || unit === 'd') {
          ageInMonths = ageValue / 30.436875; // 365.25/12 days per month
        } else {
          return true; // Unknown unit, don't filter out
        }
        
        return ageInMonths >= ageRange.min && ageInMonths <= ageRange.max;
      })();
      const matchesGender = !gender || !product.gender || product.gender.toLowerCase() === gender.toLowerCase();
      const matchesBreed = !breed || !product.breed || product.breed.toLowerCase().includes(breed.toLowerCase());
      const matchesLocation = locationQuery.trim() === '' || product.location.toLowerCase().includes(locationQuery.toLowerCase());
      let matchesDistance = true;
      if (maxDistanceKm > 0 && userLocation) {
        const coords = toCoords(product.location);
        if (coords) {
          const d = haversineKm(userLocation, coords);
          matchesDistance = d <= maxDistanceKm;
        }
      }
      // Distance filter only applies if userLocation is known AND a location (city) is present.
      const enableDistance = (maxDistanceKm > 0) && userLocation && locationQuery.trim() !== '';
      const locationOk = enableDistance ? matchesDistance : matchesLocation;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesVerified && matchesAge && matchesGender && matchesBreed && locationOk;
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedCategories,
    priceMin,
    priceMax,
    minRating,
    verifiedOnly,
    ageRange,
    gender,
    breed,
    locationQuery,
    maxDistanceKm,
    userLocation,
    toCoords,
    haversineKm
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'Price: Low to High':
        return list.sort((a, b) => a.price - b.price);
      case 'Price: High to Low':
        return list.sort((a, b) => b.price - a.price);
      case 'Rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'Distance':
        if (!userLocation) return list;
        return list.sort((a, b) => {
          const ca = toCoords(a.location);
          const cb = toCoords(b.location);
          const da = ca ? haversineKm(userLocation, ca) : Number.POSITIVE_INFINITY;
          const db = cb ? haversineKm(userLocation, cb) : Number.POSITIVE_INFINITY;
          return da - db;
        });
      default:
        return list; // Newest would require createdAt; keep as-is
    }
  }, [filteredProducts, sortBy, userLocation, toCoords, haversineKm]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedCategories(new Set());
    setSearchTerm('');
    setSortBy('Newest');
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
    setMinRating(0);
    setVerifiedOnly(false);
    setLocationQuery('');
    setMaxDistanceKm(0);
  };

  // Save & load filters (localStorage)
  const saveFilters = () => {
    const payload = {
      selectedCategory,
      selectedCategories: Array.from(selectedCategories),
      searchTerm,
      sortBy,
      priceMin,
      priceMax,
      minRating,
      verifiedOnly,
      ageRange,
      gender,
      breed,
      locationQuery,
      maxDistanceKm,
    };
    localStorage.setItem('marketplaceFilters', JSON.stringify(payload));
  };

  const loadFilters = () => {
    const raw = localStorage.getItem('marketplaceFilters');
    if (!raw) return;
    try {
      const f = JSON.parse(raw);
      setSelectedCategory(f.selectedCategory ?? 'All');
      setSelectedCategories(new Set<string>(f.selectedCategories ?? []));
      setSearchTerm(f.searchTerm ?? '');
      setSortBy(f.sortBy ?? 'Newest');
      if (typeof f.priceMin === 'number') setPriceMin(f.priceMin);
      if (typeof f.priceMax === 'number') setPriceMax(f.priceMax);
      if (typeof f.minRating === 'number') setMinRating(f.minRating);
      setVerifiedOnly(!!f.verifiedOnly);
      if (f.ageRange && typeof f.ageRange.min === 'number' && typeof f.ageRange.max === 'number') {
        setAgeRange(f.ageRange);
      }
      setGender(f.gender ?? '');
      setBreed(f.breed ?? '');
      setLocationQuery(f.locationQuery ?? '');
      if (typeof f.maxDistanceKm === 'number') setMaxDistanceKm(f.maxDistanceKm);
    } catch (e) {
      // ignore malformed saved filters
      console.warn('Failed to parse saved filters', e);
    }
  };

  const ProductCard: React.FC<{ 
    product: Product; 
    onAddToCart: (productId: string) => void;
    onContactSeller: (productId: string, contactType: 'email' | 'phone') => void;
    isAuthenticated: boolean;
  }> = ({ product, onAddToCart, onContactSeller, isAuthenticated }) => {
    const createSvgPlaceholder = (label: string) => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'>
        <defs>
          <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
            <stop offset='0%' stop-color='#e5e7eb'/>
            <stop offset='100%' stop-color='#d1d5db'/>
          </linearGradient>
        </defs>
        <rect width='100%' height='100%' fill='url(#g)'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,Segoe UI,Roboto' font-size='28' fill='#374151'>${label}</text>
      </svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    };
    const fallbackSources = useMemo(() => {
      const byCategory: Record<string, string[]> = {
        Poultry: [
          '/images/rhode-island-red.jpg',
          '/images/chicken.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Chickens_2009-02-20.jpg/640px-Chickens_2009-02-20.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Rhode_Island_Red_cock.jpg/640px-Rhode_Island_Red_cock.jpg'
        ],
        Goats: [
          '/images/boer-goat.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Boer_goat_buck.jpg/640px-Boer_goat_buck.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Boer_goat_doe.jpg/640px-Boer_goat_doe.jpg'
        ],
        Pigs: [
          '/images/piglet.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Piglet_at_Hay_on_Wye_show_2010.jpg/640px-Piglet_at_Hay_on_Wye_show_2010.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Piglets.jpg/640px-Piglets.jpg'
        ],
        Rabbits: [
          '/images/angora-rabbit.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Angora_rabbit.jpg/640px-Angora_rabbit.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/English_Angora_rabbit.jpg/640px-English_Angora_rabbit.jpg'
        ]
      };
      const generic = [
        createSvgPlaceholder(product.title),
        createSvgPlaceholder(product.category)
      ];
      return [product.image, ...(byCategory[product.category] || []), ...generic];
    }, [product]);

    const [imgIndex, setImgIndex] = useState(0);
    const imgSrc = fallbackSources[Math.min(imgIndex, fallbackSources.length - 1)];

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative">
          <img 
            src={imgSrc}
            alt={product.title}
            loading="lazy"
            decoding="async"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={() => setImgIndex((i) => i + 1)}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 bg-gray-100"
          />
          <div className="absolute top-3 right-3 flex space-x-2">
          {product.isVerified && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
              product.isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-red-50'
            }`}
            title={product.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-4 w-4 ${product.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {product.promoted && (
          <div className="mb-2">
            <span className="inline-block text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Promoted</span>
          </div>
        )}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          {product.location}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {product.currency} {product.price.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {product.breed} • {product.age} • {product.gender}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button size="sm" className="flex-1" onClick={() => onAddToCart(product.id)}>
            <Plus className="h-4 w-4 mr-2" />
            {isAuthenticated ? 'Add to Cart' : 'Sign In to Add'}
          </Button>
        </div>
        <div className="mt-2 space-y-2">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1" 
              onClick={() => onContactSeller(product.id, 'email')}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isAuthenticated ? 'Email Seller (Free)' : 'Sign In to Email'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1" 
              onClick={() => onContactSeller(product.id, 'phone')}
            >
              <Phone className="h-4 w-4 mr-2" />
              {isAuthenticated ? 'Get Phone' : 'Sign In'}
            </Button>
          </div>
        </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Livestock Marketplace</h1>
          <p className="text-gray-600 mt-1">Find quality livestock from trusted breeders across South Africa</p>
        </div>
        {isAuthenticated && getCartItemCount() > 0 && (
          <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-green-700" />
            <span className="text-sm font-medium text-green-700">
              {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} in cart
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error.message}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearError}
              className="text-red-700 border-red-300 hover:bg-red-50"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Sign in for full access</h3>
                <p className="text-sm text-blue-700">
                  Create an account to contact sellers, save favorites, and access premium features.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => showAuthModal('signin')}
                className="text-blue-700 border-blue-300 hover:bg-blue-50"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => showAuthModal('signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}

      <MarketplaceFilters
        categories={categories}
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          if (searchTimerRef.current != null) {
            window.clearTimeout(searchTimerRef.current);
          }
          const id = window.setTimeout(() => setSearchTerm(v), 200);
          searchTimerRef.current = id;
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedCategories={selectedCategories}
        onToggleCategory={(id) => {
          if (id === 'All') {
            setSelectedCategory('All');
            setSelectedCategories(new Set());
          } else {
            setSelectedCategory('All');
            setSelectedCategories((prev) => {
              const next = new Set(prev);
              if (next.has(id)) next.delete(id); else next.add(id);
              return next;
            });
          }
        }}
        minPrice={priceMin}
        maxPrice={priceMax}
        onPriceChange={(min, max) => {
          setPriceMin(min);
          setPriceMax(max);
        }}
        locationQuery={locationQuery}
        onLocationChange={setLocationQuery}
        onLocate={() => {
          if (userLocation) {
            const label = nearestCityLabel(userLocation);
            if (label) setLocationQuery(label);
            setMaxDistanceKm(250);
          }
        }}
        onClearLocation={() => { setLocationQuery(''); setMaxDistanceKm(0); }}
        distanceKm={maxDistanceKm}
        onDistanceChange={setMaxDistanceKm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewChange={setViewMode}
        minRating={minRating}
        onMinRatingChange={setMinRating}
        verifiedOnly={verifiedOnly}
        onVerifiedOnlyChange={setVerifiedOnly}
        ageRange={ageRange}
        onAgeRangeChange={(min, max) => setAgeRange({ min, max })}
        gender={gender}
        onGenderChange={setGender}
        breed={breed}
        onBreedChange={setBreed}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((s) => !s)}
        onSaveFilters={saveFilters}
        onLoadFilters={loadFilters}
        onClearAll={clearAllFilters}
      />

      {/* Active filter chips */}
      <div className="flex flex-wrap gap-2 mt-1">
        {selectedCategories.size > 0 && (
          <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200">
            {Array.from(selectedCategories).join(', ')}
            <button className="ml-1" onClick={() => setSelectedCategories(new Set())}>✕</button>
          </span>
        )}
        {selectedCategory !== 'All' && selectedCategories.size === 0 && (
          <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200">
            {selectedCategory}
            <button className="ml-1" onClick={() => setSelectedCategory('All')}>✕</button>
          </span>
        )}
        {locationQuery && (
          <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200">
            {locationQuery}
            <button className="ml-1" onClick={() => { setLocationQuery(''); setMaxDistanceKm(0); }}>✕</button>
          </span>
        )}
        {locationQuery && maxDistanceKm > 0 && (
          <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200">
            ≤ {maxDistanceKm} km
            <button className="ml-1" onClick={() => setMaxDistanceKm(0)}>✕</button>
          </span>
        )}
        {verifiedOnly && (
          <span className="inline-flex items-center bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded border border-amber-200">
            Verified only
            <button className="ml-1" onClick={() => setVerifiedOnly(false)}>✕</button>
          </span>
        )}
        {minRating > 0 && (
          <span className="inline-flex items-center bg-purple-50 text-purple-800 text-xs px-2 py-1 rounded border border-purple-200">
            Rating {minRating}+
            <button className="ml-1" onClick={() => setMinRating(0)}>✕</button>
          </span>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Verified Sellers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Safe Transport</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">24/7 Support</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {filteredProducts.length} animals available • {Math.floor(Math.random() * 50) + 100} total listings
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {sortedProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onAddToCart={addToCart}
            onContactSeller={handleContactSeller}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No animals found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or browse different categories.</p>
        </div>
      )}
    </div>
  );
};
