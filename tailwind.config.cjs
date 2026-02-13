module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#8B6F47',
        'primary-50': '#f5f2ed',
        'primary-400': '#a8937d',
        'primary-500': '#9d8672',
        'primary-600': '#8B6F47',
        'primary-700': '#6d5835',
        'background-light': '#f8f8f6',
        'background-dark': '#221d10'
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      }
    }
  },
  plugins: []
}
