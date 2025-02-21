/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html", // For your main index.html
      "./src/**/*.{js,ts,jsx,tsx}", // For all files in src folder and subfolders
    ],
    theme: {
      extend: {
           colors: {
              'primary': '#3490dc',
              'secondary': '#ffed4a',
              'accent': '#38c172',
              'custom-grey': '#f7fafc', // added custom grey color
            },
          },
    },
    plugins: [],
