/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DC2626',
        primaryLight: '#EF4444',
        primaryDark: '#B91C1C',
        accent: '#DC2626',
        bgLight: '#F5F7FA',
        textGrey: '#6B7280',
        textDark: '#1F2937',
        success: '#10B981',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 40px -10px rgba(220, 38, 38, 0.2)',
      }
    },
  },
  plugins: [],
}
