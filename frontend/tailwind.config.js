/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "spotify-black": "#000000",
        "spotify-dark": "#121212",
        "spotify-light": "#181818",
        "spotify-grey": "#242424",
        "spotify-green": "#1DB954",
        "spotify-text-muted": "#b3b3b3",
      },
    },
  },
  plugins: [],
}

