import Vue from 'vue'
import Vuex from 'vuex'
import creatPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins:[creatPersistedState()],
  state: {
    user:null,
    token:null
  },
  mutations: {
    setUser(state,data){
      state.user = data.user
      state.token = data.token
    },
    logout(state){
      state.user = null
      state.token = null
    }
  },
  actions:{
    setUser({commit}, data){
      commit('setUser', data)
    },
    logout({commit}){
      commit('logout')
    }
  },
  getters:{
    isAuthenticated: state => !!state.token,
    getToken:state => state.token
  }
})

//console.log(store.state.count)