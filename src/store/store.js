/* global firebase: false */
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';
import createMutationsSharer from 'vuex-shared-mutations'
// import LogRocket from 'logrocket';
// import createPlugin from 'logrocket-vuex';

// const logrocketPlugin = createPlugin(LogRocket);
// import router from '@/router.js'
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
    // logrocketPlugin,
    vuexLocalStorage.plugin,
    createMutationsSharer({ predicate: 
      ['logout', 'setUser', 'switchTheme','saveFeedFilter','setUserInfo', 'curRoom','saveChatMessages','updateFromDb','updateThoseOnline'] })
  ],
  state: {
    userInfo: null, // additional info for logged in user
    isAuthenticated: false,
    isSuperUser: false,
    is_verified: false,
    theme: 'light',
    timestamp: null,
    curRoom: null,
    curRoomId: null, // current room id
    loading_rooms: true, // tells other components that rooms are still being loaded
    myEnrolled: [],
    broadcasts: [],
    last_read_time: {}, // record of last msg read time, for each user in broadcasts
    chat_messages: [],
    pUnreadMsgs: [],
    curr_right_sidebar: null,
    show_right_sidebar: false,
    private_chat_window: {},
    no_of_unread_msgs: '',
    show_right_nav: true,
    show_right_nav_btn: false,
    feedFilter: null,
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
        state.userInfo = null
        state.isAuthenticated = false
        state.isSuperUser = false
        state.is_verified = false
        state.curRoom = null
        state.myEnrolled = []
        state.broadcasts = []
        state.chat_messages = []
        state.pUnreadMsgs = []
        
        // router.push('/login')
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
      state.loading_rooms = false
    },
    setBroadcasts(state,data){
      state.broadcasts = data
    },
    saveChatMessage(state, data){
      state.chat_messages = [...state.chat_messages, data]
    },
    pUnreadMsgs(state,data){
      state.pUnreadMsgs = data
    },
    updateFromDb(state,data){
      state.chat_messages = [...state.chat_messages, ...data]
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
      
    },
    setVotes(state,data){
      state.votes = data
    },
    subscriberState(state, data){
      state.isSuperUser = data
    },
    verifiedState(state, data){
      state.is_verified = data
    },
    setLastReadTime(state, data){
      // console.log(data,state.last_read_time)
      state.last_read_time[data] = Date.now()
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
    verifiedState({commit}, data){
      commit('verifiedState', data)
    },
    setLastReadTime({commit}, data){
      commit('setLastReadTime', data)
    }
  },
  getters:{
    getUnreadLength: state => {
      let ids = []
      let unread = 0
      state.broadcasts.forEach(msg =>{
        if(!ids.find(id => msg.onr.uid == id)){
          ids.push(msg.onr.uid)
          unread = unread + state.broadcasts.filter(item => {
            let foo = state.last_read_time[item.onr.uid] ? 
            item.tstamp.toMillis() > state.last_read_time[item.onr.uid] : true

            return foo && item.onr.uid != state.userInfo.uid && item.onr.uid == msg.onr.uid 
          }).length
        }
      })
      state.no_of_unread_msgs = unread
      return state.no_of_unread_msgs
    },
    getRecentBroadcasts: state => {
      let sorted = state.broadcasts.sort((a,b)=>a.tstamp.toMillis() - b.tstamp.toMillis())
      // the senders should not recieve their own messages
      // sorted = sorted.filter(msg => msg.sender != state.userInfo.uid)
      let myArr = []
      let track = []

      // state.no_of_unread_msgs = sorted.filter(msg => msg.tstamp.toMillis() > state.last_read_time).length
      // eslint-disable-next-line
      // console.log('getbroadcast runnig', state.no_of_unread_msgs)
      // get the unread private messages from the store and map each user to all his messages
      
      let sent = sorted.filter(msg =>{
        return msg.onr.uid == state.userInfo.uid
      })

      let inbox = sorted.filter(msg=>{
        return msg.onr.uid != state.userInfo.uid
      })

      for(let item of inbox){
        // if user has seen the last msg then he has seen all others
        // let last_msg = msgs.sort((a,b)=> a.timestamp - b.timestamp)[msgs.length -1]
        
        track.indexOf(item.by) == -1 ? myArr.push({
          onr: item.onr,
          msgs: inbox.filter(msg => msg.onr.uid == item.onr.uid),
          unread: inbox.filter(item => item.tstamp.toMillis() > state.last_read_time[item.onr.uid])
        }) : ''
        track.push(item.by)
      }
      
      return {
        sent: sent,
        inbox: myArr
      }
    },
    
    getUser: (state) => {
      return state.isAuthenticated
    },
    getUserInfo: state => state.userInfo, // additional info for user
    getChatMessages: (state)=>{
     let sorted = state.chat_messages.sort((a,b) => a.tstamp - b.tstamp)
     .filter(msg => msg.elecRef == state.curRoom.electionId)

     // remove duplicates caused by push
     return sorted.reduce((acc, cur) => [
        ...acc.filter((msg) => msg.docId !== cur.docId), cur
      ], []);
    },
    getSchools: state => state.schools,
    getContestants: state => state.curElectionContestants,
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
    getFeedFilter: state => state.feedFilter,
  }
})

//console.log(store.state.count)