/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6997CF',
          50: '#EFF4FB',
          100: '#D9E6F5',
          200: '#B3CCEB',
          300: '#8DB3E0',
          400: '#6997CF',
          500: '#4D7DBF',
          600: '#3A63A0',
          700: '#2D4E80',
          800: '#203960',
          900: '#142540'
        },
        danger: {
          DEFAULT: '#FE000D',
          50: '#FFF0F0',
          100: '#FFD6D7',
          200: '#FFADAF',
          300: '#FF8487',
          400: '#FE5B5F',
          500: '#FE000D',
          600: '#D6000B',
          700: '#AE0009',
          800: '#860007',
          900: '#5E0005'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
}
