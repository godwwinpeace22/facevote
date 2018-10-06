import Vue from 'vue'
import Vuex from 'vuex'
import creatPersistedState from 'vuex-persistedstate'
import createMutationsSharer from 'vuex-shared-mutations'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins:[
    creatPersistedState(),
    createMutationsSharer({ predicate: 
      ['logout', 'setUser', 'curRoom','saveChatMessages','updateFromDb','setCurrElection','setCurrElectionContestants','updateThoseOnline','allVotes'] })
  ],
  state: {
    user:null,
    token:null,
    curRoom:null,
    chat_messages:[],
    currElection:{},
    currElectionContestants:[],
    those_online:[],
    allVotes:[],
    curr_right_sidebar:null,
    show_right_sidebar:false
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
    },
    setCurrElection(state,data){
      state.currElection = data
    },
    setCurrElectionContestants(state,data){
      state.currElectionContestants = data
    },
    updateThoseOnline(state,data){
      state.those_online = data
    },
    showRightSidebar(state,data){
      state.show_right_bar = true
    },
    setCurrRightSidebar(state, data){
      state.curr_right_sidebar = data
    },
    allVotes(state,data){
      state.allVotes = data
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
    },
    setCurrElection({commit},data){
      commit('setCurrElection', data)
    },
    setCurrElectionContestants({commit},data){
      commit('setCurrElectionContestants', data)
    },
    updateThoseOnline({commit}, data){
      commit('updateThoseOnline',data)
    },
    showRightSidebar({commit},data){
      commit('showRightSidebar', data)
    },
    setCurrRightSidebar({commit}, data){
      commit('setCurrRightSidebar', data)
    },
    allVotes({commit}, data){
      commit('allVotes', data)
      console.log('allvotes action')
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