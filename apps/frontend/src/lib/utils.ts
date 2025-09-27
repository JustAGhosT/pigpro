import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to format labels (e.g., 'egg_count' -> 'Egg Count')
export const formatLabel = (str: string): string => {
  if (!str) return '';
  const spaced = str.replaceAll('_', ' ');
  return spaced.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const colors = {
  primary: '#2D5016', // Deep Forest Green - Represents agriculture and nature
  secondary: '#F4A460', // Sandy Brown - Represents poultry and earth
  accent: '#D4AF37', // Golden - Represents quality and prestige
  neutral: '#F5F5DC', // Beige - Clean, agricultural backdrop
  background: '#FFFFFF',
  text: '#333333',
  border: '#E5E7EB'
};

export const typography = {
  headings: 'Montserrat, sans-serif', // Modern, clean, professional
  body: 'Open Sans, sans-serif', // Highly readable, good for South African audiences
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  }
};

export const performanceConfig = {
  imageOptimization: {
    formats: ['webp', 'jpeg'],
    compression: 'aggressive',
    lazyLoading: true,
    cdn: 'south-africa-region'
  },
  caching: {
    browser: 'long-term',
    cdn: 'edge-caching',
    database: 'redis-layer'
  },
  loading: {
    criticalCss: 'inline',
    javascript: 'deferred',
    fonts: 'preload'
  }
};

export const getCategoryColor = (category: string) => {
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