/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        yard: {
          dark: '#050505',
          gold: '#D4AF37',
          gray: '#121212',
          lightgray: '#1C1C1C',
          accent: '#0A331E', // deep emerald
        },
        logo: {
          primary: '#15803d',
          secondary: '#eab308',
          accent: '#dc2626',
          light: '#f0fdf4',
          dark: '#14532d',
          muted: '#fefce8',
        },
      },
      borderRadius: {
        'none': '0px',
        'sm': '0px',
        DEFAULT: '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'full': '9999px',
      },
      boxShadow: {
        sm: '0 2px 8px -2px rgba(0, 0, 0, 0.02), 0 1px 4px -1px rgba(0, 0, 0, 0.01)',
        DEFAULT: '0 4px 12px -2px rgba(0, 0, 0, 0.03), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        md: '0 8px 20px -3px rgba(0, 0, 0, 0.04), 0 4px 10px -2px rgba(0, 0, 0, 0.02)',
        lg: '0 12px 28px -4px rgba(0, 0, 0, 0.05), 0 6px 14px -3px rgba(0, 0, 0, 0.03)',
        xl: '0 20px 40px -5px rgba(0, 0, 0, 0.06), 0 10px 20px -4px rgba(0, 0, 0, 0.04)',
        '2xl': '0 30px 60px -8px rgba(0, 0, 0, 0.08), 0 15px 30px -6px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        bebas: ['var(--font-bebas-neue)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      animation: {
        'ken-burns': 'kenBurns 20s ease-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)' },
        },
      }
    },
  },
  plugins: [],
}
