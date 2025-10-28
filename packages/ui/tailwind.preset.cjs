/** Tailwind preset for MunLink shared tokens and utilities */
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    extend: {
      screens: {
        xxs: '320px',
        xs: '480px',
      },
      colors: {
        ocean: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#002d4a',
        },
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        forest: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
        },
        sunset: {
          500: '#f59e0b',
          600: '#d97706',
        },
        purple: colors.violet,
        yellow: colors.amber,
        zambales: {
          green: '#1B5E20',
          gold: '#F57F17',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          md: '2rem',
        },
        screens: {
          '2xl': '1280px',
        },
      },
      boxShadow: {
        card: '0 10px 25px -10px rgba(0,0,0,0.15)',
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
        'forest-gradient': 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        shimmer: 'shimmer 2s infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
    },
  },
}


