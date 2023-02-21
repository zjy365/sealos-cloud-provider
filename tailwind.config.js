/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    colors: {
      blue: {
        100: '#E7EEFB',
        200: '#CFDDF8',
        300: '#9EBBF0',
        400: '#6E99E9',
        500: '#3D77E1',
        600: '#0D55DA',
        700: '#0A44AE',
        800: '#083383',
        900: '#052257',
        1000: '#03112C'
      },
      black: {
        200: '#CFCFD6',
        300: '#9A999D',
        400: '#6F6F85',
        500: '#3F3F5D',
        600: '#0F0F34',
        700: '#0C0C2A',
        800: '#09091F',
        900: '#060615'
      },
      grey: {
        100: '#FAFAFC',
        200: '#F4F6FA',
        300: '#E9EDF5',
        400: '#DEE3EF',
        600: '#FCFDFE'
      },
      gray: {
        600: '#0F0F34'
      }
    }
  },
  plugins: [],
}
