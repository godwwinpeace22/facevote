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
    },
    updateFromDb(state,data){
      let lastUpdateTime = state.chat_messages[state.chat_messages.length-1].timestamp // get the last chat time
      //console.log(lastUpdateTime)
      let newMessages = data.filter(function(each){
        return each.timestamp > lastUpdateTime // get all the chats that were made after the last chat stored in the state
      })
      //console.log(newMessages)
      state.chat_messages = [...state.chat_messages, ...newMessages] // add the newest messages to the state
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
    },
    updateFromDb({commit},data){
      commit('updateFromDb',data)
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