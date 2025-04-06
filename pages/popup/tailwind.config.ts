import baseConfig from '@extension/tailwindcss-config';
import type { Config } from 'tailwindcss';

export default {
  ...baseConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        cwhite: '#f9fafb',
        cpurple: '#4b2aa0',
        cpurpledark: '#3a3166',
        cgrey: '#dddddd',
        cgraydark: '#4b5563',
        cblack: '#2a2a2a',
      },
    },
  },
} as Config;
