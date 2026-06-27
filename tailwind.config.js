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
          dark: '#0A0A0A',
          gold: '#E8B84B',
          gray: '#0f0f0f',
          lightgray: '#1a1a1a',
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
      fontFamily: {
        bebas: ['var(--font-bebas-neue)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
