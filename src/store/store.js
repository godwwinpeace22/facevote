import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from 'vuex-persistedstate'
import VuexPersist from 'vuex-persist';
import createMutationsSharer from 'vuex-shared-mutations'
Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key:'vuex',
  storage:window.localStorage,
  reducer: state =>({
    user:state.user,
    token:state.token,
    curRoom:state.curRoom,
    //chat_messages:state.chat_messages,
    //those_online:state.those_online,
    //allVotes:state.allVotes,
    curr_right_sidebar:state.curr_right_sidebar,
    show_right_bar:state.show_right_bar,
    private_chat_window:state.private_chat_window,
    //private_chat_messages:state.private_chat_messages,
    //recent_private_messages:state.recent_private_messages
  })
})
export default new Vuex.Store({
  plugins:[
    vuexLocalStorage.plugin,
    createMutationsSharer({ predicate: 
      ['logout', 'setUser', 'curRoom','saveChatMessages','updateFromDb','updateThoseOnline','allVotes'] })
  ],
  state: {
    user:null, // loggedin user, persisted in localstored but with limited info for security reasons.
    logged_in_user:null, // this is the same as user but is not persisted in local storage.
    token:null,
    timestamp:null,
    curRoom:null,
    chat_messages:[],
    currElection:{},
    currElectionContestants:[],
    those_online:[],
    allVotes:[],
    curr_right_sidebar:null,
    show_right_sidebar:false,
    private_chat_window:{},
    private_chat_messages:[],
    recent_private_messages:[],
    no_of_unread_msgs:'',
    show_right_nav:true,
    show_right_nav_btn:false
  },
  mutations: {
    setUser(state,data){
      state.user = {
        name:data.user.name,
        username:data.user.username,
        imgSrc:data.user.imgSrc,
      }
      state.token = data.token
      state.timestamp = Date.now()
    },
    setLoggedInUser(state,data){
      state.logged_in_user = data
    },
    logout(state){
      state.user = null
      state.token = null
      state.logged_in_user = null
    },
    setChat(state,data){
      state.chat = data
    },
    curRoom(state,data){
      state.curRoom = data
    },
    saveChatMessage(state, data){
      state.chat_messages = [...state.chat_messages, data]
    },
    savePrivateChatMessage(state, data){
      state.recent_private_messages = data
      let filtd = state.recent_private_messages.filter(
        msg => msg.status == 'unread'
      )
      setTimeout(()=>{
        state.no_of_unread_msgs = filtd.length
      }, 2000)
    },
    updateFromDb(state,data){
      //if(state.chat_messages.length != 0){
        //let lastUpdateTime = state.chat_messages[state.chat_messages.length-1].timestamp // get the last chat time
        //console.log(lastUpdateTime)
        //let newMessages = data.filter(function(each){
         // return each.timestamp > lastUpdateTime // get all the chats that were made after the last chat stored in the state
        //})
        //console.log(newMessages)
       // state.chat_messages = [...state.chat_messages, ...newMessages] // add the newest messages to the state
      //}else{
        state.chat_messages = data
      //}
      
    },
    UpdatePrivateMsgFromDb(state,data){
      if(state.private_chat_messages.length != 0){
        let lastUpdate = state.private_chat_messages[state.private_chat_messages.length-1].timestamp // get the last chat time
        //console.log(lastUpdate)
        let newPMessages = data.filter(function(each){
          return each.timestamp > lastUpdate // get all the chats that were made after the last chat stored in the state
        })
        //console.log(newMessages)
        state.chat_messages = [...state.private_chat_messages, ...newPMessages] // add the newest messages to the state
      }
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
    showRightNav(state,data){
      state.show_right_nav = data[0]
      state.show_right_nav_btn = data[1]
    },
    setCurrRightSidebar(state, data){
      state.curr_right_sidebar = data
    },
    allVotes(state,data){
      state.allVotes = data
    },
    openPrivateChatWindow(state,data){
      //console.log('dispatched')
      state.private_chat_window = data
    },
    recentPrivateMsgs(state,data){
      state.recent_private_messages = [...state.recent_private_messages, ...data]
      let filtd = state.recent_private_messages.filter(
        msg => msg.status == 'unread'
      )
      setTimeout(()=>{
        state.no_of_unread_msgs = filtd.length
      }, 2000)
    }
  },
  actions:{
    setUser({commit}, data){
      commit('setUser', data)
    },
    setLoggedInUser({commit}, data){
      commit('setLoggedInUser', data)
    },
    logout({commit}){
      commit('logout')
    },
    curRoom({commit}, data){
      commit('curRoom', data)
    },
    setChat({commit},data){
      commit('setChat', data)
    },
    saveChatMessage({commit}, data){
      commit('saveChatMessage', data)
    },
    savePrivateChatMessage({commit}, data){
      commit('savePrivateChatMessage', data)
    },
    updateFromDb({commit},data){
      commit('updateFromDb',data)
    },
    UpdatePrivateMsgFromDb({commit},data){
      commit('UpdatePrivateMsgFromDb',data)
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
    showRightNav({commit},data){
      commit('showRightNav', data)
    },
    setCurrRightSidebar({commit}, data){
      commit('setCurrRightSidebar', data)
    },
    allVotes({commit}, data){
      commit('allVotes', data)
      console.log('allvotes action')
    },
    openPrivateChatWindow({commit},data){
      console.log('dispatched')
      commit('openPrivateChatWindow', data)
    },
    recentPrivateMsgs({commit},data){
      commit('recentPrivateMsgs', data)
    }
  },
  getters:{
    isAuthenticated: state => !!state.token,
    getToken:state => state.token,
    getUser:state => state.user,
    getChatMessages:(state)=>{
     return state.chat_messages.filter(
        msg => msg.room == state.curRoom
      )
    }
  }
})

//console.log(store.state.count)