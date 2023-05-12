/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        hover: '#f3f4f6',
        systemNoti: '#fafafa',
        primary: '#000000',
        "primary-hover":"#0284c7",
        "primary-selected":"#0369a1",
        secondery: '#f8fafc',
        "secondery-hover":"#e2e8f0",
        "secondery-selected":"#cbd5e1",
        warning:'#b91c1c',
        "warning-hover":"#7f1d1d",
      }
    },
  },
  plugins: [],
}

