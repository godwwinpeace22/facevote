import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from '@/store/store'
import jQuery from 'jquery'
import 'es6-promise/auto'
// eslint-disable-next-line
import firebase from './plugins/firebase'
import router from './router'
import './registerServiceWorker'
import vueHeadful from 'vue-headful'
import Nprogress from 'nprogress'
import Vuex from 'vuex'
import helpers from './helpers/helpers'
import VueQuill from 'vue-quill'
// import VueCountdown from '@chenfengyuan/vue-countdown';
import vueAwesomeCountdown from 'vue-awesome-countdown'

const plugin = {
  install () {
      Vue.helpers = helpers
      Vue.prototype.$helpers = helpers
  }
}

/* OR
Vue.mixin({
  methods: {
    capitalizeFirstLetter: str => str.charAt(0).toUpperCase() + str.slice(1)
  }
})
*/

global.jQuery = jQuery
global.$ = jQuery
global.$NProgress = Nprogress

Vue.prototype.$eventBus = new Vue();
Vue.use(Vuex)
Vue.component('vue-headful', vueHeadful);
// Vue.component(VueCountdown.name, VueCountdown);
Vue.use(vueAwesomeCountdown, 'vac')
Vue.config.productionTip = false
Vue.use(plugin)
Vue.use(VueQuill)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
