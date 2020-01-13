import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    // dark: true,
    // default: 'dark',
    themes: {
      light: {
        primary: '#3f51b5',
        secondary: '#ffffff',
        accent: '#8c9eff',
        error: '#b71c1c',
        dark: '#0e2439',
        bgd: '#eceff1',
      },
      dark: {
        primary: '#3f51b5',
        secondary: '#0e2439',
        accent: '#8c9eff',
        error: '#b71c1c',
        dark: '#0e2439',
        bgd: '#0e2439',
      },
    },
  }
});
