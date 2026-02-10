module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#ecb613',
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
