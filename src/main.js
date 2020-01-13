import 'babel-polyfill'
import Vue from 'vue'
// import './plugins/vuetify'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import store from '@/store/store'
import 'es6-promise/auto'
import router from './router'
import './registerServiceWorker'
import vueHeadful from 'vue-headful'
// import Nprogress from 'nprogress'
import Vuex from 'vuex'
import helpers from './helpers/helpers'
// import VueQuill from 'vue-quill'
import vueAwesomeCountdown from 'vue-awesome-countdown'
import VueSanitize from "vue-sanitize"
import linkify from 'vue-linkify'
// import checkView from 'vue-check-view'
import LoadingBar from '@/spinners/LoadingBar'
import Navigation from '@/components/Navigation'
import vuelidate from 'vuelidate'
import {gun, Gun} from '@/plugins/gun'
import { userSession } from "@/plugins/userSession";
// import './scss/main.scss';
const uuidv4 = require('uuid/v4');


Vue.prototype.$gun = gun
Vue.prototype.$SEA = Gun.SEA
Vue.prototype.$Gun = Gun
Vue.prototype.$gUser = gun.user()
Vue.prototype.$uuidv4 = uuidv4
Vue.prototype.$userSession = userSession

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

Vue.prototype.$appName = 'Voteryte'
Vue.prototype.$paystackKey = 'pk_test_cd14c065dfe123cd983362a4ed795fe1128ec4e2'

const $eventBus = new Vue();
Vue.prototype.$eventBus = $eventBus
Vue.use(Vuex)
Vue.component('vue-headful', vueHeadful);
Vue.component('v-loading', LoadingBar)
Vue.component('navigation', Navigation)
Vue.use(vueAwesomeCountdown, 'vac')

Vue.config.productionTip = false

Vue.use(plugin)
// Vue.use(VueQuill)
// Vue.use(VueChatScroll)
Vue.use(VueSanitize);
// Vue.use(checkView)
Vue.use(vuelidate)

Vue.directive('linkified', linkify)

const vm = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')

export {vm}