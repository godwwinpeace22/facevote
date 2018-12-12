//import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'


//import 'font-awesome/css/font-awesome.min.css'
import store from '@/store/store'
import jQuery from 'jquery'
//global.jQuery = jQuery
//global.$ = jQuery


Vue.prototype.$eventBus = new Vue();

//Vue.use(require('vue-moment'));
//import '@mdi/font/css/materialdesignicons.css'

//import Vuetify from 'vuetify'


import Vuex from 'vuex'
Vue.use(Vuex)
import 'es6-promise/auto'
import router from './router'
import './registerServiceWorker'
import vueHeadful from 'vue-headful';
import Nprogress from 'nprogress'
global.$NProgress = Nprogress
/*import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000',
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  }
}))*/
//import VueSocketio from 'vue-socket.io-extended';
//import io from 'socket.io-client';

Vue.component('vue-headful', vueHeadful);
/*const socket = io('http://localhost:3000', {
   autoConnect: false
});

Vue.use(VueSocketio, socket);
*/


Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
