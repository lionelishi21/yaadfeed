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
        logo: {
          primary: '#15803d',
          secondary: '#eab308',
          accent: '#dc2626',
          light: '#f0fdf4',
          dark: '#14532d',
          muted: '#fefce8',
        },
      },
    },
  },
  plugins: [],
}
