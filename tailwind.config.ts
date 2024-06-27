import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      textColor: {
        primary: '#171717',
        'primary-hover': '#0a0a0a',
        'primary-invert': '#fff',
        secondary: '#525252',
        tertiary: '#737373',
        brand: '#4338ca',
        disabled: '#a3a3a3',
        error: '#dc2626',
        'error-emphasize': '#991b1b',
        success: '#15803d',
        warning: '#a16207',
      },
    },
  },
  plugins: [],
};
export default config;
