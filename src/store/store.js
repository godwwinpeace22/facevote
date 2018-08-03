import Vue from 'vue'
import Vuex from 'vuex'
import creatPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins:[creatPersistedState()],
  state: {
    user:null,
    token:null,
    curRoom:null,
    chat_messages:[]
  },
  mutations: {
    setUser(state,data){
      state.user = data.user
      state.token = data.token
    },
    logout(state){
      state.user = null
      state.token = null
    },
    curRoom(state,data){
      state.curRoom = data
    },
    saveChatMessage(state, data){
      state.chat_messages = [...state.chat_messages, data]
    }
  },
  actions:{
    setUser({commit}, data){
      commit('setUser', data)
    },
    logout({commit}){
      commit('logout')
    },
    curRoom({commit}, data){
      commit('curRoom', data)
    },
    saveChatMessage({commit}, data){
      commit('saveChatMessage', data)
    }
  },
  getters:{
    isAuthenticated: state => !!state.token,
    getToken:state => state.token,
    getUser:state => state.user,
    getChatMessages:(state)=>{
     return state.chat_messages.filter(
        msg => msg.room == state.curRoom.electionId
      )
    }
  }
})

//console.log(store.state.count)