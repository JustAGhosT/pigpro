/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'poultry': {
          'primary': '#2D5016', // Deep Forest Green
          'secondary': '#F4A460', // Sandy Brown
          'accent': '#D4AF37', // Golden
          'neutral': '#F5F5DC', // Beige
        },
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'opensans': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
