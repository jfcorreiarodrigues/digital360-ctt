/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ctt: {
          red: '#DF0024',
          'red-dark': '#B8001E',
          'red-light': '#FF1A3A',
          black: '#000000',
          white: '#FFFFFF',
          'gray-50': '#F9FAFB',
          'gray-100': '#F3F4F6',
          'gray-200': '#E5E7EB',
          'gray-300': '#D1D5DB',
          'gray-400': '#9CA3AF',
          'gray-600': '#4B5563',
          'gray-700': '#374151',
          'gray-900': '#111827',
        },
        status: {
          draft: '#9CA3AF',
          review: '#F59E0B',
          ready: '#10B981',
          presented: '#3B82F6',
        },
        variation: {
          up: '#10B981',
          down: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'ctt': '0 4px 24px rgba(223, 0, 36, 0.12)',
        'card': '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}
