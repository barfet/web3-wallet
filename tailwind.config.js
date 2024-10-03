/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          purple: {
            600: '#9333ea',
            700: '#7e22ce',
            900: '#4c1d95',
          },
        },
        gradientColorStops: theme => ({
          ...theme('colors'),
        }),
      },
    },
    plugins: [],
};