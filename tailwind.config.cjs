module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1E3B6E',
        'primary-50': '#eff6ff',
        'primary-400': '#3b82f6',
        'primary-500': '#2563eb',
        'primary-600': '#1E3B6E',
        'primary-700': '#1e3a8a',
        'background-light': '#f8fafc',
        'background-dark': '#0f172a'
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
