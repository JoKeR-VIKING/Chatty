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
        primary: '#1e90ff',
      },
    },
    plugins: [],
  },
};
