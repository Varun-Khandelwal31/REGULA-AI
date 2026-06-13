/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E5EE5',
          dark: '#1448C8',
          light: '#3D7AFF',
        },
        accent: {
          green: '#16A34A',
          amber: '#EF9F27',
          red: '#E24B4A',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          tertiary: '#94A3B8',
        },
        surface: '#F8FAFC',
        navy: {
          DEFAULT: '#0F172A',
          dark: '#0A1628',
          darker: '#060E24',
          darkest: '#030812',
        },
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
