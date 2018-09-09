import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

import {
  Vuetify,
  VApp,
  VAlert,
  VAutocomplete,
  VAvatar,
  VBadge,
  VBottomNav,
  VBottomSheet,
  VBreadcrumbs,
  VCard,
  transitions
} from 'vuetify';
import directives from 'vuetify/es5/directives';
import 'font-awesome/css/font-awesome.min.css'
import store from '@/store/store'
import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery

//global.kairos = kairos


Vue.use(Vuetify, {
  components: {
    VApp,
    VAlert,
    VAutocomplete,
    VAvatar,
    VBadge,
    VBottomNav,
    VBottomSheet,
    VBreadcrumbs,
    VCard,
    transitions
  },
  directives
});

Vue.prototype.$eventBus = new Vue();

Vue.use(require('vue-moment'));

import Vuex from 'vuex'
Vue.use(Vuex)
import 'es6-promise/auto'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
