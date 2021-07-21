module.exports = {
  purge: [],
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: [   "Consolas",  '"Liberation Mono"','"Courier New"', "monospace","ui-monospace","SFMono-Regular", "Menlo", "Monaco",  ]
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
