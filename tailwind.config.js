/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        indigo: {
          accent: '#4F46E5',
          glow: 'rgba(79, 70, 229, 0.25)',
        },
        emerald: {
          cyber: '#10B981',
          glow: 'rgba(16, 185, 129, 0.2)',
        },
        crimson: {
          alert: '#EF4444',
          glow: 'rgba(239, 68, 68, 0.2)',
        },
        amber: {
          warning: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.2)',
        },
        slate: {
          dark: '#0F172A',
          card: '#1E293B',
          border: '#334155',
          lightbg: '#F8FAFC',
          lightcard: '#FFFFFF',
          lightborder: '#E2E8F0',
        }
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'Cabinet Grotesk', 'sans-serif'],
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow-indigo': '0 0 20px rgba(79, 70, 229, 0.35)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-crimson': '0 0 20px rgba(239, 68, 68, 0.35)',
        'soft-xl': '0 20px 30px -10px rgba(0, 0, 0, 0.07)',
      }
    },
  },
  plugins: [],
}
