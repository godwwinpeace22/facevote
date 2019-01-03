//import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from '@/store/store'
import jQuery from 'jquery'
import 'es6-promise/auto'
import router from './router'
import './registerServiceWorker'
import vueHeadful from 'vue-headful';
import Nprogress from 'nprogress'
global.jQuery = jQuery
global.$ = jQuery


Vue.prototype.$eventBus = new Vue();



import Vuex from 'vuex'
Vue.use(Vuex)

global.$NProgress = Nprogress

Vue.component('vue-headful', vueHeadful);


Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
