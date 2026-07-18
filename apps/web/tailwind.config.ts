import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#1E2A38',
        turquoise: '#00C2A9',
        action: '#FF7A00'
      }
    }
  },
  plugins: []
};

export default config;
