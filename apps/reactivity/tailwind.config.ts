import tailwindcssAnimate from 'tailwindcss-animate';
import tailwindcssAspectRatio from '@tailwindcss/aspect-ratio';
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    screens: {
      sm: '740px',
      md: '1000px',
      lg: '1200px',
      xl: '1400px',
      '2xl': '1600px',
      '3xl': '1800px',
    },
    extend: {},
  },
  plugins: [tailwindcssAspectRatio, tailwindcssAnimate],
} satisfies Config;
