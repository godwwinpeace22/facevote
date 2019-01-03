import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from 'vuex-persistedstate'
import VuexPersist from 'vuex-persist';
import createMutationsSharer from 'vuex-shared-mutations'
import router from '@/router.js'
//import jwtDecode from 'jwt-decode'
Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key:'vuex',
  storage:window.localStorage,
  reducer: state =>({
    //user:state.user,
    token:state.token,
    //isAuthenticated:state.isAuthenticated,
    curRoom:state.curRoom,
    //chat_messages:state.chat_messages,
    //those_online:state.those_online,
    //allVotes:state.allVotes,
    curr_right_sidebar:state.curr_right_sidebar,
    show_right_bar:state.show_right_bar,
    private_chat_window:state.private_chat_window,
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
    isAuthenticated:false,
    timestamp:null,
    curRoom:null,
    chat_messages:[],
    pUnreadMsgs:[],
    private_conversations:[],
    curElection:{},
    curElectionContestants:[],
    curElectionResults:[],
    curElectionActivities:[],
    those_online:[],
    allVotes:[],
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
  },
  mutations: {
    setUser(state,data){
      state.token = data.token
      state.isAuthenticated = data
      state.timestamp = Date.now()
    },
    logout(state){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        state.isAuthenticated = false
        router.push('/login')
        //window.location.reload()
      }).catch(function(error) {
        console.log(error)
      });
    },
    curRoom(state,data){
      state.curRoom = data
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
    setCurElection(state,data){
      state.curElection = data
    },
    setCurElectionContestants(state,data){
      state.curElectionContestants = data
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
    private_conversations(state,data){
      state.private_conversations = data
    },
    setSchools(state,data){
      state.schools = data
    },
    setCurElectionActivities(state,data){
      state.curElectionActivities = data
    },
    setCurElectionResults(state,data){
      state.curElectionResults = data
    },
    setMyEnrolled(state,data){
      state.myEnrolled = data
    },
    setMyCreated(state,data){
      state.myCreated = data
    },
    setMyContested(state,data){
      state.myContested = data
    },
    setVotes(state,data){
      state.votes = data
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
    pUnreadMsgs({commit},data){
      commit('pUnreadMsgs',data)
    },
    saveChatMessage({commit}, data){
      commit('saveChatMessage', data)
    },
    private_conversations({commit}, data){
      commit('private_conversations', data)
    },
    updateFromDb({commit},data){
      commit('updateFromDb',data)
    },
    setCurElection({commit},data){
      commit('setCurElection', data)
    },
    setCurElectionContestants({commit},data){
      commit('setCurElectionContestants', data)
    },
    showRightNav({commit},data){
      commit('showRightNav', data)
    },
    setCurrRightSidebar({commit}, data){
      commit('setCurrRightSidebar', data)
    },
    allVotes({commit}, data){
      commit('allVotes', data)
      //console.log('allvotes action')
    },
    setVotes({commit}, data){
      commit('setVotes', data)
      //console.log('allvotes action')
    },
    openPrivateChatWindow({commit},data){
      //console.log('dispatched')
      commit('openPrivateChatWindow', data)
    },
    setSchools({commit},data){
      commit('setSchools', data)
    },
    setCurElectionResults({commit},data){
      commit('setCurElectionResults',data)
    },
    setCurElectionActivities({commit},data){
      commit('setCurElectionActivities',data)
    },
    setMyEnrolled({commit}, data){
      commit('setMyEnrolled', data)
    },
    setMyCreated({commit}, data){
      commit('setMyCreated', data)
    },
    setMyContested({commit}, data){
      commit('setMyContested', data)
    }
  },
  getters:{
    //isAuthenticated: state => state.isAuthenticated,
    isLoggedIn:() => firebase.auth().currentUser,
    isAuthenticated:state => state.isAuthenticated,
    getToken: state => state.token,
    getUnreadPMsgs: state => {
      let sorted = state.pUnreadMsgs.sort((a,b)=>a.timestamp - b.timestamp)
      let myArr = []
      let track = []

      // get the unread private messages from the store and map each user to all his messages
      for(let item of sorted){
        // all the messages from the sender
        let msgs = sorted.filter(msg=>{
          return msg.sender == item.sender
        })
        
        // if user has seen the last msg then he has seen all others
        let last_msg = msgs.sort((a,b)=> a.timestamp - b.timestamp)[msgs.length -1]
        track.indexOf(item.sender) == -1 && last_msg.status == 'unread' ? myArr.push({
          user:item.sender,
          name:item.name,
          imgSrc:item.imgSrc,
          msgs:msgs
        }) : ''
        track.push(item.sender)
      }
      
      return myArr
    },
    getPrivateConversations: state => state.private_conversations
    .sort((a,b)=>a.timestamp - b.timestamp),
    
    getUser: state => state.isAuthenticated,
    getChatMessages:(state)=>{
     return state.chat_messages.sort((a,b) => a.timestamp - b.timestamp)
    },
    getSchools: state => state.schools,
    getContestants:state => state.curElectionContestants,
    getCurElection: state => state.curElection,
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
    }
  }
})

//console.log(store.state.count)