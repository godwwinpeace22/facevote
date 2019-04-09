import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from 'vuex-persistedstate'
import VuexPersist from 'vuex-persist';
import createMutationsSharer from 'vuex-shared-mutations'
import router from '@/router.js'
//import jwtDecode from 'jwt-decode'
Vue.use(Vuex)

// include states to be persisted in local storage
const vuexLocalStorage = new VuexPersist({
  key:'vuex',
  storage:window.localStorage,
  reducer: state =>({
    //user:state.user,
    theme: state.theme,
    last_read_time: state.last_read_time,
    no_of_unread_msgs: state.no_of_unread_msgs,
    //isAuthenticated:state.isAuthenticated,
    curRoomId: state.curRoomId,
    schools: state.schools,
    //chat_messages:state.chat_messages,
    //those_online:state.those_online,
    curr_right_sidebar: state.curr_right_sidebar,
    show_right_bar: state.show_right_bar,
    // private_chat_window: state.private_chat_window,
  })
})
export default new Vuex.Store({
  plugins:[
    vuexLocalStorage.plugin,
    createMutationsSharer({ predicate: 
      ['logout', 'setUser', 'switchTheme','saveFeedFilter','setUserInfo', 'curRoom','saveChatMessages','updateFromDb','updateThoseOnline'] })
  ],
  state: {
    userInfo:null, // additional info for logged in user
    isAuthenticated: false,
    isSuperUser: false,
    theme: 'light',
    timestamp: null,
    curRoom: null,
    curRoomId: null, // current room id
    broadcasts: [],
    last_read_time: 0, // timestamp for the last broadcast msg
    chat_messages: [],
    pUnreadMsgs: [],
    those_online:[],
    curr_right_sidebar:null,
    show_right_sidebar:false,
    private_chat_window:{},
    no_of_unread_msgs:'',
    show_right_nav:true,
    show_right_nav_btn:false,
    schools:[],
    myEnrolled:[],
    myCreated:[],
    myContested:[],
    votes:[],
    feedFilter:null,
  },
  mutations: {
    setUserInfo(state,data){
      state.userInfo = data
    },
    setUser(state,data){
      state.isAuthenticated = data
      // state.userInfo = null
    },
    logout(state){
      // eslint-disable-next-line
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        state.isAuthenticated = false
        state.userInfo = null
        state.myEnrolled = []
        state.curRoom = null
        state.curRoomId = null
        // delete everything stored in localstorage for 
        // now until find how to delete just one
        window.localStorage.setItem('vuex', null)
        router.push('/login')
        window.location.reload()
      }).catch(function(error) {
        // eslint-disable-next-line
        console.log(error)
      });
    },
    switchTheme(state){
      state.theme == 'dark' ? state.theme = 'light' : state.theme = 'dark'
    },
    saveFeedFilter(state,data){
      state.feedFilter = data
    },
    curRoom(state,data){
      state.curRoom = data
      state.curRoomId = data.electionId
    },
    setBroadcasts(state,data){
      state.broadcasts = data
      state.no_of_unread_msgs = state.broadcasts.filter(msg => msg.timestamp > state.last_read_time).length
    },
    saveChatMessage(state, data){
      state.chat_messages = [...state.chat_messages, data]
    },
    pUnreadMsgs(state,data){
      state.pUnreadMsgs = data
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
    // private_conversations(state,data){
    //   state.private_conversations = data
    // },
    setSchools(state,data){
      state.schools = data
    },
    setMyEnrolled(state,data){
      if(data.merge){
        // e.g new election created or new enrolled
        state.myEnrolled ? 
        state.myEnrolled.unshift(data.election) :
        state.myEnrolled = [data.election]
      }else{
        state.myEnrolled = data
      }
      // eslint-disable-next-line
      console.log('firing setMyEnrolled')
      
    },
    setVotes(state,data){
      state.votes = data
    },
    subscriberState(state, data){
      state.isSuperUser = data
    },
    setLastReadTime(state, data){
      state.last_read_time = data.timestamp
      state.no_of_unread_msgs = state.no_of_unread_msgs - data.read
    }
  },
  actions:{
    setUser({commit}, data){
      commit('setUser', data)
    },
    setUserInfo({commit}, data){
      commit('setUserInfo', data)
    },
    setLoggedInUser({commit}, data){
      commit('setLoggedInUser', data)
    },
    logout({commit}){
      commit('logout')
    },
    saveFeedFilter({commit},data){
      commit('saveFeedFilter',data)
    },
    switchTheme({commit},data){
      commit('switchTheme', data)
    },

    curRoom({commit}, data){
      commit('curRoom', data)
    },
    setBroadcasts({commit}, data){
      commit('setBroadcasts', data)
    },
    // pUnreadMsgs({commit},data){
    //   commit('pUnreadMsgs',data)
    // },
    saveChatMessage({commit}, data){
      commit('saveChatMessage', data)
    },
    private_conversations({commit}, data){
      commit('private_conversations', data)
    },
    updateFromDb({commit},data){
      commit('updateFromDb',data)
    },
    showRightNav({commit},data){
      commit('showRightNav', data)
    },
    setCurrRightSidebar({commit}, data){
      commit('setCurrRightSidebar', data)
    },
    setSchools({commit},data){
      commit('setSchools', data)
    },
    setMyEnrolled({commit}, data){
      commit('setMyEnrolled', data)
    },
    subscriberState({commit}, data){
      commit('subscriberState', data)
    },
    setLastReadTime({commit}, data){
      commit('setLastReadTime', data)
    }
  },
  getters:{
    //isAuthenticated: state => state.isAuthenticated,
    // eslint-disable-next-line
    isLoggedIn:() => firebase.auth().currentUser,
    isAuthenticated:state => state.isAuthenticated,
    getRecentBroadcasts: state => {
      let sorted = state.broadcasts.sort((a,b)=>a.tstamp - b.tstamp)
      // the senders should not recieve their own messages
      // sorted = sorted.filter(msg => msg.sender != state.userInfo.uid)
      let myArr = []
      let track = []

      state.no_of_unread_msgs = sorted.filter(msg => msg.tstamp > state.last_read_time).length
      // eslint-disable-next-line
      console.log('getbroadcast runnig', state.no_of_unread_msgs)
      // get the unread private messages from the store and map each user to all his messages
      for(let item of sorted){
        // all the messages from the sender
        let msgs = sorted.filter(msg=>{
          return msg.by == item.by
        })
        
        // if user has seen the last msg then he has seen all others
        // let last_msg = msgs.sort((a,b)=> a.timestamp - b.timestamp)[msgs.length -1]
        
        track.indexOf(item.by) == -1 ? myArr.push({
          user: item.onr,
          imgSrc:item.onr.photoURL,
          msgs: msgs,
          unread: msgs.filter(item => item.tstamp > state.last_read_time)
        }) : ''
        track.push(item.by)
      }
      
      return myArr
    },
    // getPrivateConversations: state => state.private_conversations
    // .sort((a,b)=>a.timestamp - b.timestamp),
    
    getUser: state => state.isAuthenticated,
    getUserInfo:state => state.userInfo, // additional info for user
    getChatMessages:(state)=>{
     return state.chat_messages.sort((a,b) => a.tstamp - b.tstamp)
    },
    getSchools: state => state.schools,
    getContestants:state => state.curElectionContestants,
    getCurElectionResults: state => state.curElectionResults,
    getCurElectionActivities: state => state.curElectionActivities,
    getMyEnrolled: state => state.myEnrolled,
    getMyCreated: state => state.myCreated,
    getMyContested: state => state.myContested,
    getVotes: state => state.votes,
    getChatMedia: state => {
      let arr = []
      state.chat_messages.forEach(item=>{
        if(item.images){
          arr.push(...item.images)
        }
        
      })
      return arr
    },
    getFeedFilter: state => state.feedFilter
  }
})

//console.log(store.state.count)