/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0d0f0e',
          raised: '#141816',
          overlay: '#1a1f1c',
          border: '#2a332e',
        },
        accent: {
          DEFAULT: '#c8a84b',
          hover: '#dbb95a',
          muted: '#8a7340',
        },
        danger: '#c0392b',
        success: '#27ae60',
        warning: '#e67e22',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(180deg, rgba(13,15,14,0.4) 0%, rgba(13,15,14,0.95) 100%), url('/hero-bg.jpg')",
      },
    },
  },
  plugins: [],
}
