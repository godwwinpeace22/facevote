<template>
  <v-app id="inspire">
    <v-content>
      <v-layout>
        <v-flex>
          <vue-headful :title="title"/>

          <v-navigation-drawer fixed v-model="drawer" app dark width="220" class='navdrawr' 
            style="background-color:#1c1f35;color:bfbbbb;z-index:20" >
            <v-toolbar flat tile class="mb-3" style="background-color:rgba(51, 54, 78, 0.9);color:#fff;">
              <v-toolbar-title>Facevote</v-toolbar-title>
            </v-toolbar>
            <v-list dense style="background-color:#1c1f35;color:bfbbbb;padding-top:0;" v-if="isAuthenticated" class="home_list">
            
              <!--v-list-group no-action class="mb-5 pt-1">
                <v-list-tile slot="activator">
                  <v-list-tile-avatar color="grey lighten-4">
                    <img v-if="getUserInfo && getUserInfo.photoURL" :src="getUserInfo.photoURL">
                    <img v-else-if="getUser.photoURL" :src="getUser.photoURL">
                    <v-avatar v-else color="success" size="40">
                      <span class="white--text headline">{{getUser.displayName.charAt(0)}}</span>
                    </v-avatar>
                  </v-list-tile-avatar>
                  <v-list-tile-title class="text-capitalize">{{getUser.displayName}}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile  :to="`/users/${getUser.email}`">
                  <v-list-tile-action>
                    <v-icon color="success">account_box</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>My Profile</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="settings_dialog = !settings_dialog">
                    <v-list-tile-action>
                      <v-icon color="success">settings</v-icon>
                    </v-list-tile-action>
                  <v-list-tile-title>Edit profile</v-list-tile-title>
                </v-list-tile>
              </v-list-group-->


              <!--v-list-group no-action class="mb-3" style="background:rgba(51, 54, 78, 0.9);border-bottom:1px solid rgba(76, 79, 105, 0.9); border-top:1px solid rgba(76, 79, 105, 0.9);">
                <v-list-tile slot="activator">
                  <v-list-tile-action>
                    <v-icon color="">swap_horiz</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title class="text-capitalize">Switch Elections</v-list-tile-title>
                </v-list-tile>

                <v-list-tile  @click="''">
                  <v-list-tile-title>Election 1</v-list-tile-title>
                </v-list-tile>

                <v-list-tile @click="''">
                  <v-list-tile-title>Election 2</v-list-tile-title>
                </v-list-tile>
              </v-list-group-->

              <v-menu v-model="menu" lazy :position-x="40" :position-y="50">
                <view-profile :user='getUser'></view-profile>
              </v-menu>

              <v-list-tile to="/" exact >
                <v-list-tile-action>
                  <v-icon>home</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>Home</v-list-tile-title>
              </v-list-tile>

              <v-list-tile @click="show_private_msg_list = true">
                <v-list-tile-action>
                  <v-icon small color="grey lighten-1">messages</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>
                  Messages
                </v-list-tile-title>
                <v-list-tile-action v-if="getUnreadPMsgs.length > 0">
                  <v-badge right color="success">
                    <span class="caption" slot="badge">{{getUnreadPMsgs.length}}</span>
                  </v-badge>
                </v-list-tile-action>
              </v-list-tile>

              <v-menu offset-y offset-x open-on-hover close-on-click class="d-block" min-width="200" max-width="250" dark content-class="round">
                <loading-bar v-if="fetching_enrolled" background="dark" spinnerType="circle" height="10px"></loading-bar>
                <v-subheader v-if="!fetching_enrolled && getMyEnrolled.length == 0">No groups to show</v-subheader>
                
                <v-list-tile slot="activator" v-else>
                  <v-list-tile-action>
                    <v-icon>forum</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>Forum</v-list-tile-title>
                </v-list-tile>
                <v-list dense>
                  <v-list-tile v-for="election in getMyEnrolled" :key="election.electionId"
                  :to="`/forum/${election.electionId}`" exact>
                    <v-list-tile-title class="text-truncate">{{election.title}}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              

              <v-list-tile :to="menu.link" exact v-for="menu in navmenus" :key="menu.icon">
                <v-list-tile-action>
                  <v-icon :color="menu.icon_color">{{menu.icon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>{{menu.title}}</v-list-tile-title>
              </v-list-tile>

              <v-list-group prepend-icon="hdr_strong" no-action color="success">
                <v-list-tile slot="activator">
                  <v-list-tile-title>Contest</v-list-tile-title>
                </v-list-tile>
                <v-list-tile  to="/contest">
                  <v-list-tile-action>
                    <v-icon color="success">hdr_strong</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>Contest</v-list-tile-title>
                </v-list-tile>
                <v-list-tile to="/manifesto/create">
                    <v-list-tile-action>
                      <v-icon color="success">add_box</v-icon>
                    </v-list-tile-action>
                  <v-list-tile-title>Create manifesto</v-list-tile-title>
                </v-list-tile>
                <v-list-tile to="/manifesto/edit">
                    <v-list-tile-action>
                      <v-icon color="success">business_center</v-icon>
                    </v-list-tile-action>
                  <v-list-tile-title>Edit manifesto</v-list-tile-title>
                </v-list-tile>
              </v-list-group>

              <v-list-group prepend-icon="poll" no-action>
                <v-list-tile slot="activator">
                  <v-list-tile-title>Elections</v-list-tile-title>
                </v-list-tile>
                <v-list-tile  to="/elections/create">
                  <v-list-tile-action>
                    <v-icon color="success">add_box</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>Create new election</v-list-tile-title>
                </v-list-tile>
                <v-list-tile to="/elections/manage">
                    <v-list-tile-action>
                      <v-icon color="success">business_center</v-icon>
                    </v-list-tile-action>
                  <v-list-tile-title>My elections</v-list-tile-title>
                </v-list-tile>
                <v-list-tile to="/elections/watch">
                    <v-list-tile-action>
                      <v-icon color="success">business_center</v-icon>
                    </v-list-tile-action>
                  <v-list-tile-title>Vote</v-list-tile-title>
                </v-list-tile>
                
              </v-list-group>

              <v-list-group prepend-icon="settings" no-action value="false" >
                <v-list-tile slot="activator">
                  <v-list-tile-title>Settings</v-list-tile-title>
                </v-list-tile>
                <v-list-tile  @click="settings_dialog = !settings_dialog">
                  <v-list-tile-action>
                    <v-icon color="success">account_box</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>Account</v-list-tile-title>
                  <!--profile-settings :dialog='settings_dialog'></profile-settings-->
                </v-list-tile>
                <v-list-tile to="#1">
                    <v-list-tile-action>
                      <v-icon color="success">payment</v-icon>
                    </v-list-tile-action>
                  <v-list-tile-title>Billing</v-list-tile-title>
                </v-list-tile>
                
              </v-list-group>

              <v-list-tile to='#2'>
                <v-list-tile-action>
                  <v-icon color="success">help</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>Help</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-navigation-drawer>
          <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" top>
            {{snackbar.message}} 
            <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
          </v-snackbar>


          <!--v-speed-dial v-model="fab" fixed bottom
            right direction="top" open-on-hover
            transition="slide-y-reverse-transition">
            <v-btn slot="activator" v-model="fab"
              color="blue darken-2" dark fab>
              <v-icon>account_circle</v-icon>
              <v-icon>close</v-icon>
            </v-btn>
            <v-btn fab dark small color="green">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn fab dark small color="indigo">
              <v-icon>add</v-icon>
            </v-btn>
            <v-btn fab dark small color="red">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-speed-dial-->

          <router-view v-if="!show_loading_bar"></router-view>
          <loading-bar v-if="show_loading_bar"></loading-bar>
        </v-flex>
      </v-layout>
      
      <!-- PRIVATE MESSAGE LIST -->
      <v-dialog v-model="show_private_msg_list" max-width="500" min-width="300" 
        :fullscreen="$vuetify.breakpoint.smAndDown">
        <v-toolbar color="teal" dark dense>
          <v-toolbar-title>Inbox</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="show_private_msg_list = !show_private_msg_list">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <private-msg-list v-if="show_private_msg_list" style="min-height:300px;background:#fff;"></private-msg-list>
      </v-dialog>

      <!-- PRIVATE CHAT WINDOW -->
      <v-dialog v-model="show_private_chat_window" hide-overlay :max-width="$vuetify.breakpoint.smOnly ? 500 : 400" 
        :fullscreen="$vuetify.breakpoint.xsOnly">
        <private-chat-window v-if="show_private_chat_window" :user='chat_user'></private-chat-window>
      </v-dialog>
      <!--v-navigation-drawer right temporary v-model="right" fixed></v-navigation-drawer-->
    </v-content>
  </v-app>
</template>

<script>
export default {
  data:()=>({
    title:'Dashboard | Facevote',
    fab:false,
    menu:true,
    show_loading_bar:true,
    show_private_chat_window:false,
    show_private_msg_list:false,
    fetching_enrolled:true,
    snackbar:{},
    navmenus:[
      //{title:'Notifications', icon:'notifications', link:"#"},
      //{title:'Forum', icon:'forum', link:'/forum'},
      {title:'Enroll', icon:'fingerprint', link:'/enroll'},
      {title:'Verify Account', icon:'verified_user', link:'/verify',icon_color:'success'},
    ],
    toolbar_items: [
      {name:'My profile', icon:'person', link:''},
      {name: 'Settings', icon:'settings', link:''}
    ],
    drawer:true,
    settings_dialog:false,
    someoneistyping:false,
  }),
  components:{
    //ProfileSettings,
    ViewProfile,
    LoadingBar,
    PrivateMsgList,
    PrivateChatWindow,
    Navigation
  },
  computed: {
    // Mix your getter(s) into computed with the object spread operator
    ...mapGetters([
      'isAuthenticated',
      'getToken',
      'getUser',
      'getUserInfo',
      'getUnreadPMsgs',
      'getMyEnrolled',
    ]),
  },
  
  methods:{
    logout(){
      this.$store.dispatch('logout')
    },
    presenceWatcher(){
      // Fetch the current user's ID from Firebase Authentication.
      let userId = this.getUser.uid;

      const usersRef = db.collection('moreUserInfo'); // Get a reference to the Users collection;
      const onlineRef = database.ref('.info/connected'); // Get a reference to the list of connections

      onlineRef.on('value', snapshot => {
        
        database
          .ref(`/status/${userId}`)
          .onDisconnect() // Set up the disconnect hook
          .set('offline') // The value to be set for this key when the client disconnects
          .then(() => {
              // Set the Firestore User's online status to true
              usersRef
                .doc(this.getUser.uid)
                .set({
                  online: true,
                }, { merge: true});  

              // Let's also create a key in our real-time database
              // The value is set to 'online'
              database.ref(`/status/${userId}`).set('online');
          });
        
      });
    },
    pUnreadMsgs(){
      db.collection('private_conversations')
      .where('reciever','==',this.getUser.uid).where('status','==','unread')
      .onSnapshot(snapshot=>{
        let msgs = []
        snapshot.forEach(doc=>{
          msgs.push(doc.data())
        })
      
        this.$store.dispatch('pUnreadMsgs', msgs)
        //console.log(msgs)
      })
    },
    myEnrolled(user){
      this.fetching_enrolled = true
      return new Promise((resolve,reject)=>{
        db.collection('elections').where('regVoters','array-contains',user.uid)
        .get().then(docs=>{
          let myArr = []
          docs.forEach(doc=>{
            myArr.push(doc.data())
          })
          this.$store.dispatch('setMyEnrolled',myArr)
          this.fetching_enrolled = false
          console.log(this.getMyEnrolled)
        })
      })
    },
    /*pSystem(){
      // Fetch the current user's ID from Firebase Authentication.
      var uid = firebase.auth().currentUser.uid;

      // Create a reference to this user's specific status node.
      // This is where we will store data about being online/offline.
      var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

      // We'll create two constants which we will write to
      // the Realtime database when this device is offline
      // or online.
      var isOfflineForDatabase = {
          state: 'offline',
          last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      var isOnlineForDatabase = {
          state: 'online',
          last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      // Create a reference to the special '.info/connected' path in
      // Realtime Database. This path returns `true` when connected
      // and `false` when disconnected.
      firebase.database().ref('.info/connected').on('value', function(snapshot) {
          // If we're not currently connected, don't do anything.
          if (snapshot.val() == false) {
              return;
          };

          // If we are currently connected, then use the 'onDisconnect()'
          // method to add a set which will only trigger once this
          // client has disconnected by closing the app,
          // losing internet, or any other means.
          userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
              // The promise returned from .onDisconnect().set() will
              // resolve as soon as the server acknowledges the onDisconnect()
              // request, NOT once we've actually disconnected:
              // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

              // We can now safely set ourselves as 'online' knowing that the
              // server will mark us as offline once we lose connection.
              userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });


      // ...
      var userStatusFirestoreRef = firebase.firestore().doc('/status/' + uid);

      // Firestore uses a different server timestamp value, so we'll
      // create two more constants for Firestore state.
      var isOfflineForFirestore = {
          state: 'offline',
          last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      };

      var isOnlineForFirestore = {
          state: 'online',
          last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      };

      firebase.database().ref('.info/connected').on('value', function(snapshot) {
          if (snapshot.val() == false) {
              // Instead of simply returning, we'll also set Firestore's state
              // to 'offline'. This ensures that our Firestore cache is aware
              // of the switch to 'offline.'
              userStatusFirestoreRef.set(isOfflineForFirestore);
              return;
          };

          userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
              userStatusDatabaseRef.set(isOnlineForDatabase);

              // We'll also add Firestore set here for when we come online.
              userStatusFirestoreRef.set(isOnlineForFirestore);
          });
      });
    }*/
  },
  async mounted(){
    //console.log(firebase.firestore.FieldValue.serverTimestamp().seconds)
    document.getElementById('welcome_logo').style.display = 'none'
    this.$eventBus.$on('Toggle_Left_Drawer', data=>{
      this.drawer = !this.drawer
    })
    
    
    this.$eventBus.$on('Open_Private_Chat_Window', (data)=>{
      this.chat_user = data
      this.show_private_chat_window = true
      this.show_private_msg_list = false
    })
    this.$eventBus.$on('Close_Private_Chat_Window', ()=>{
      this.show_private_chat_window = false
    })
    
    
    // show loading animation for some seconds
    setTimeout(() => {
      this.show_loading_bar = false
    }, 2500);

   
    // if loggedin user
    /*if(this.$store.getters.getToken){

      //let chat = io.connect('localhost:3000/chat')
      let chat = io.connect('securepoll.herokuapp.com/chat')
      this.chat = chat // do this in order to access chat in other methods
      //this.$store.dispatch('setChat', chat);
      chat.once('connect', _=>{
        console.log('connected to server successfully')
        chat.emit('introduction',{
          username:this.$store.getters.getUser.username,
          userId:this.$store.getters.getUser._id
        })
        chat.emit('send_recent_private_msg', {username:this.$store.getters.getUser.username})
      })
      

      // update client with latest messages 
      chat.on('update_chat', (messagesFromDb) =>{ // update chat from db
        // Don't update on empty mesages
        messagesFromDb.length != 0 ? this.$store.dispatch('updateFromDb', messagesFromDb) : ''
        //console.log('messagesFromDb: ', messagesFromDb)
      })
      
      chat.on('recent_private_msg', data=>{ // client recieves recent private msgs when he just connected
        this.$store.dispatch('savePrivateChatMessage', data) // save this msgs temporarily in the store
        //console.log('recentPmsgs: ', data)
      })
      
      
      
      chat.on('chat_response', (data)=> { // the chat emitted by server
        //console.log('chat resp1: ', data)
        this.$store.dispatch('saveChatMessage', data)
        console.log('chat resp2: ', data)
      });

      this.$eventBus.$on('Chat_Message', data=>{ // when forum conponent sends a chat msg
        console.log('ChatMsg: ', data)
        chat.emit('chat_message', data)
      })

      // Add reactions to msgs
      this.$eventBus.$on('Add_Reaction', data=>{
        console.log('helloworld:Add_Rxn ', data)
        chat.emit('add_reaction', data)
      })


      //listen when server broadcasts that some one is online
      chat.on('those_online', (data)=>{
        //console.log(data)
        this.$store.dispatch('updateThoseOnline',data)
      })

      


      this.$eventBus.$on('Open_Private_Chat_Window', data=>{
        this.show_private_chat_window = true
        this.chat_user = data

        // mark all the msgs sent to 'to'(cur user) by 'from' as read only if the last msg is not read
        // if the last_msg_status is 'read' then all the user's msgs to this cllient have been read
        data.last_msg_status == 'read' ? '' :
        chat.emit('mark_msgs_as_read', {to:this.getUser.username, from:data.username})
      })





      chat.on('mark_msgs_as_read_resp', data=>{
        this.$store.dispatch('savePrivateChatMessage', data)
        //console.log('recentPCM: ', data)
        //console.log('from store: ', this.$store.state.recent_private_messages)
      })

      

      // === TYPING ====
      this.$eventBus.$on('Someone_Is_Typing', (data)=>{
        chat.emit('is_typing', data)
      })
      chat.on('is_typing', data=>{
        this.$eventBus.$emit('Update_Typing_Status', data)
      })



      // ==== PRIVATE CHAT MESSAGES ====
      this.$eventBus.$on('PrivateChatMsg', data=>{ // emit a private chat event
        console.log('data: ', data)
        chat.emit('private_chat_msg', data)
      })
      chat.on('private_chat_resp', data=>{ // recieve the private chat event
        console.log('privt resp ', data)
        this.$eventBus.$emit('PrivateChatMsgResp', data)
        if(data.from != this.$store.state.user.username){
          this.$store.dispatch('recentPrivateMsgs', [data])
        }
      })

      this.$eventBus.$on('Get_Conversation_History', data=>{ // get conversation history between two users
        chat.emit('conversation_history', data)
      })
      chat.on('conversation_history_resp', data=>{ // the conversation history response from server
        this.$eventBus.$emit('Conversation_History', data)
      })
      


      //==== VOTING =====
      this.$eventBus.$on('Someone_Is_Voting', data=>{
        chat.emit('is_voting', data) // emit someone is voting to server
        console.log('emited is_voting')
      })
      chat.on('voting', data=>{
        this.$eventBus.$emit('Update_Voting_Status', data)
        console.log(data.user.username + ' is voting')
      })
      this.$eventBus.$on('Submit_Vote', data=>{
        chat.emit('submit_vote', data)
      })
      chat.on('submit_vote_resp', data=>{
        this.$store.dispatch('allVotes', data.results.finalScores) // update after voting
        this.$store.dispatch('setVotes', data.results.votes) // update after voting
        this.$eventBus.$emit('All_Votes', data.results.votes)

        // show this alert to only the person that just voted
        data.user.username == this.$store.getters.getUser.username ? alert('you have successfuly voted.') : ''
        //console.log(data)
        console.log('someone voted')
      })
      
      this.$eventBus.$on('Update_Votes', data=>{
        console.log('update votes')
        chat.emit('update_votes', data)
      })
      chat.on('vote_updates', data=>{ // initial update when in the /watch view
        this.$store.dispatch('allVotes', data.results.finalScores)
        this.$store.dispatch('setVotes', data.results.votes)

        this.$eventBus.$emit('All_Votes', data.results.votes)
        console.log(data.results.finalScores)
        console.log('vote updates')
      })
      chat.on('errorMsg', data=>{
        
        this.snackbar = {show:true, message:data,color:'error'}
      })

      this.$eventBus.$on('Create_Broadcast', data=>{
        console.log(data)
        chat.emit('create_broadcast', data)
      })
      chat.on('create_broadcast_resp', data=>{
        console.log('broadcast_resp: ', data)
        this.$eventBus.$emit('Create_Broadcast_Resp', data)
      })

      
      this.$eventBus.$on('Show_Snackbar', data=>{
        this.snackbar = data
      })
    } // ==> end if
    */


  },
  async created(){
    //console.log(firebase.auth().currentUser)
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        // User is signed in.
        this.$store.dispatch('setUser', user)
        this.myEnrolled(user)
        this.presenceWatcher()
        this.pUnreadMsgs()
      } else {
        console.log('No user is signed in.')
      }
    });

    firebase.auth().currentUser.getIdTokenResult()
    .then((idTokenResult) => {
      
      //console.log(idTokenResult.claims)
    })
    .catch((error) => {
      console.log(error);
    });
    this.$vuetify.breakpoint.smAndDown ? this.drawer = false : this.drawer = true
    
    this.$eventBus.$on('Change_Title', (data)=>{
      //console.log('changing the title')
      this.title = data
    })

  }
}

import { mapGetters } from 'vuex'
  //import api from '@/services/api'
  import ViewProfile from '@/components/ViewProfile'
  import LoadingBar from '@/spinners/LoadingBar'
  import PrivateMsgList from '@/components/PrivateMsgList'
  import PrivateChatWindow from '@/components/PrivateChatWindow'
  import Navigation from '@/components/Navigation'
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' >

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;

[v-cloak] {
  display: none;
}

.v-dialog--fullscreen{
  background:#fff !important;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.menu_tabs{
  .v-tabs__div{
    text-transform:capitalize
  }
  .v-list__tile{
    font-size: 14px;
  }
}
.v-list__group__header .v-list__group__header__prepend-icon{
  min-width: 35px;
}
.home_list{
  .v-list__tile__action, .v-list__group__header .v-list__group__header__prepend-icon{
    min-width:35px;
  }
  .v-icon{
    color:#adabab;
  }
  .v-list__tile{
    //color:#bfbbbb;
    color:#fff;
  }
}

.theme--light.v-text-field--outline .v-input__slot {
  border: 1px solid rgba(115, 114, 114, 0.54) !important;
}
.v-content{
  background:#eceff1;
}

/* --scrollbar --*/
.navdrawr::-webkit-scrollbar {
    width: 10px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }
.navdrawr::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px #eae6e6;
  -webkit-box-shadow: inset 0 0 6px #eae6e6;
  -moz-box-shadow: inset 0 0 6px #eae6e6;
  -o-box-shadow: inset 0 0 6px #eae6e6;
  background-color: $mainBgColor;
  @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>
