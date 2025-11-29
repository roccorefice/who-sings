/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mmx-bg': '#131313',
        'mmx-card': '#1F1F1F',
        'mmx-orange': '#FC532E',
      },
    },
  },
  plugins: [],
};
