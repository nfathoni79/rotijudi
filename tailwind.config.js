/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme")

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        ultra: ["Ultra", ...fontFamily.serif],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
