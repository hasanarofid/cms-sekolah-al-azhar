/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Softer green (emerald-500)
          600: '#059669', // Softer green (emerald-600)
          700: '#047857', // Softer green (emerald-700)
          800: '#065f46', // Softer green (emerald-800)
          900: '#064e3b', // Softer green (emerald-900)
        },
      },
    },
  },
  plugins: [],
}
