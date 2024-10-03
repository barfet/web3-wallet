/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            600: '#9333ea',
            700: '#7e22ce',
            900: '#4c1d95',
          },
          gray: {
            700: '#374151',
            800: '#1f2937',
          },
        },
        gradientColorStops: theme => ({
          ...theme('colors'),
        }),
      },
    },
    plugins: [],
};