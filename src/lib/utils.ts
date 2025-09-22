import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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