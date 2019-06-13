import 'babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from '@/store/store'
import 'es6-promise/auto'
import router from './router'
import './registerServiceWorker'
import vueHeadful from 'vue-headful'
import Nprogress from 'nprogress'
import Vuex from 'vuex'
import helpers from './helpers/helpers'
import VueQuill from 'vue-quill'
import vueAwesomeCountdown from 'vue-awesome-countdown'
import LogRocket from 'logrocket';

LogRocket.init('8zkged/voteryte');

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

Vue.prototype.$Nprogress = Nprogress
Vue.prototype.$appName = 'Voteryte'
Vue.prototype.$LogRocket = LogRocket
// global.$LogRocket = LogRocket

Vue.prototype.$eventBus = new Vue();
Vue.use(Vuex)
Vue.component('vue-headful', vueHeadful);
Vue.use(vueAwesomeCountdown, 'vac')
Vue.config.productionTip = false
Vue.use(plugin)
Vue.use(VueQuill)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
