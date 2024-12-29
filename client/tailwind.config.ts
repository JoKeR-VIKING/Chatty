export default {
  important: true,
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['Pacifico', 'sans-serif'],
        chivo: ['Chivo', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans'],
      },
      colors: {
        'primary-dark': '#005353',
        primary: 'darkcyan',
        offwhite: '#f5f5f5',
        softblack: '#414a4c',
      },
    },
    plugins: [],
  },
};
