<template>
  <v-app id="inspire">
    <v-content>
      <v-toolbar color="teal" dark flat fixed app clipped-right style='background-color:#29648a;'>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title v-show="$vuetify.breakpoint.width > 344">Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        
        <v-toolbar-items v-if="isAuthenticated && $vuetify.breakpoint.width > 350">
           
        </v-toolbar-items>
        <v-btn outline to="/elections/watch" dark>Vote</v-btn>

        <v-divider inset vertical class="mr-2"></v-divider>

        <v-menu transition="slide-y-transition" offset-y v-if="isAuthenticated">
          <v-toolbar-title slot="activator">
            <template v-if="$vuetify.breakpoint.smAndUp">
              <v-avatar size="36" color="grey lighten-4">
                <img :src="getUser.imgThumb || `https://ui-avatars.com/api/?name=${getUser.name}`" alt="avatar">
              </v-avatar>
              <v-icon dark>arrow_drop_down</v-icon>
            </template>
            <v-icon v-else>more_vert</v-icon>
          </v-toolbar-title>
          
          <v-list dense>
            <v-list-tile :to="`/users/${getUser.username}`" >
              <v-icon color="success">person</v-icon>
              <v-list-tile-title style="margin-left:5px;">My Profile</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="settings_dialog = !settings_dialog" >
              <v-icon color="success">settings</v-icon>
              <v-list-tile-title style="margin-left:5px;">Settings</v-list-tile-title>
            </v-list-tile>

            <v-divider></v-divider>

            <v-list-tile to="#">
              <v-icon color="primary">help</v-icon>
              <v-list-tile-title style="margin-left:5px;">Help</v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>

            <v-list-tile @click="logout">
                <v-icon color="error">exit_to_app</v-icon>
              <v-list-tile-title style="margin-left:5px;">Logout</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>

      <v-layout>
        <v-flex>
          <vue-headful
            :title="title"
          />

          <v-navigation-drawer fixed v-model="drawer" app dark width="220" class='navdrawr' 
            style="background-color:#1c1f35;color:bfbbbb;" >
            <v-toolbar flat tile style="background-color:#1c1f35;color:#fff;">
              <v-toolbar-title>Contestr</v-toolbar-title>
            </v-toolbar>
            <v-list dense style="background-color:#1c1f35;color:bfbbbb;" v-if="isAuthenticated" class="home_list">
            
              <v-list-group no-action class="mb-5 pt-1">
                <v-list-tile slot="activator">
                  <v-list-tile-avatar color="grey lighten-4">
                    <img :src="getUser.imgThumb || `https://ui-avatars.com/api/?name=${getUser.name}`">
                  </v-list-tile-avatar>
                  <v-list-tile-title class="text-capitalize">{{getUser.name}}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile  :to="`/users/${getUser.username}`">
                  <v-list-tile-action>
                    <v-icon color="success">account_box</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>My Profile</v-list-tile-title>
                  <!--profile-settings :dialog='settings_dialog'></profile-settings-->
                </v-list-tile>
                <v-list-tile @click="settings_dialog = !settings_dialog">
                    <v-list-tile-action>
                      <v-icon color="success">settings</v-icon>
                    </v-list-tile-action>
                  <v-list-tile-title>Edit profile</v-list-tile-title>
                </v-list-tile>
                <!--v-tooltip top>
                  <v-list-tile slot="activator" to="/dashboard/verify" v-if="!$store.getters.getUser.isVerified">
                    <v-list-tile-action style="">
                      <v-icon color="error">error</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content style="color:red;">
                      Verify account
                    </v-list-tile-content>
                  </v-list-tile>
                  <span>Verify your account to participate in elections</span>
                </v-tooltip-->
              </v-list-group>

              <v-menu v-model="menu" v-if="menu" :position-x="40" :position-y="50">
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
                <v-list-tile-action v-if="$store.state.no_of_unread_msgs > 0">
                  <v-badge right color="success">
                    <span class="caption" slot="badge">{{$store.state.no_of_unread_msgs}}</span>
                  </v-badge>
                </v-list-tile-action>
              </v-list-tile>


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

              <v-dialog v-model="show_private_chat_window" hide-overlay max-width="300" 
                :fullscreen="$vuetify.breakpoint.smAndDown">
                <private-chat-window v-if="show_private_chat_window" :user='chat_user'></private-chat-window>
              </v-dialog>


              <v-list-tile :to="menu.link" exact v-for="menu in navmenus" :key="menu.icon">
                <v-list-tile-action>
                  <v-icon>{{menu.icon}}</v-icon>
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
          <v-snackbar v-model="snackbar.show" :timeout="10000" :color="snackbar.color" top>
            {{snackbar.message}} 
            <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
          </v-snackbar>

          <v-dialog v-model="settings_dialog" v-if="settings_dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <profile-settings :dialog='settings_dialog'></profile-settings>
          </v-dialog>


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

          <router-view v-show="!show_loading_bar" :chat='chat'></router-view>
          <loading-bar v-show="show_loading_bar"></loading-bar>
        </v-flex>
      </v-layout>

      <v-navigation-drawer right temporary v-model="right" fixed></v-navigation-drawer>
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
    snackbar:{},
    navmenus:[
      {title:'Notifications', icon:'notifications', link:'/notifications'},
      {title:'Forum', icon:'forum', link:'/forum'},
      {title:'Enroll', icon:'fingerprint', link:'/enroll'},
    ],
    toolbar_items: [
      {name:'My profile', icon:'person', link:''},
      {name: 'Settings', icon:'settings', link:''}
    ],
    mini:false,
    drawer:true,
    drawer2:false,
    drawerRight: true,
    right: null,
    left: null,
    right_sidebar:null,
    settings_dialog:false,
    chat:'',
    someoneistyping:false,
  }),
  components:{
    ProfileSettings,
    ViewProfile,
    LoadingBar,
    PrivateMsgList,
    PrivateChatWindow,
  },
  computed: {
    // Mix your getter(s) into computed with the object spread operator
    ...mapGetters([
      'isAuthenticated',
      'getToken',
      'getUser'
    ]),
  },
  
  methods:{
    showRightNav(){
      if(this.$store.state.show_right_nav){
        this.$store.dispatch('showRightNav', [false,true])
      }
      else{
        this.$store.dispatch('showRightNav', [true,true])
      }
    },
    logout(){
      //this.chat.disconnect()
      //this.$router.push('/login')
      this.$store.dispatch('logout')
    },
  },
  async mounted(){

    //this.$store.state.logged_in_user ? this.$socket.open() : ''
    console.log(this.getUser)
    this.$eventBus.$on('hide_profile_settings', ()=>{
      this.settings_dialog = false
    })
    this.$eventBus.$on('show_profile_settings', ()=>{
      this.settings_dialog = true
    })
    
    this.$eventBus.$on('Close_Private_Chat_Window', ()=>{
      this.show_private_chat_window = false
    })
    
    
    // show loading animation for some seconds
    setTimeout(() => {
      this.show_loading_bar = false
    }, 2500);


    // if loggedin user
    if(this.$store.getters.getToken){

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
        console.log('messagesFromDb: ', messagesFromDb)
      })
      
      chat.on('recent_private_msg', data=>{ // client recieves recent private msgs when he just connected
        this.$store.dispatch('savePrivateChatMessage', data) // save this msgs temporarily in the store
        console.log('recentPmsgs: ', data)
      })
      
      
      
      chat.on('chat_response', (data)=> { // the chat emitted by server
        console.log('chat resp1: ', data)
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
        console.log(data)
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
  },
  async created(){
    this.$vuetify.breakpoint.smAndDown ? this.drawer = false : this.drawer = true
    console.log(this.$vuetify.breakpoint.smAndDown)
    this.$eventBus.$on('Change_Title', (data)=>{
      //console.log('changing the title')
      this.title = data
    })

  }
}

import io from 'socket.io-client';
  import { mapGetters } from 'vuex'
  import api from '@/services/api'
  import ProfileSettings from '@/components/ProfileSettings'
  import ViewProfile from '@/components/ViewProfile'
  import LoadingBar from '@/spinners/LoadingBar'
  import PrivateMsgList from '@/components/PrivateMsgList'
  import PrivateChatWindow from '@/components/PrivateChatWindow'
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
  background:#f7f7f7;
}

/* --scrollbar --*/
.navdrawr::-webkit-scrollbar {
    width: 10px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }
.navdrawr::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: $mainBgColor;
  @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>
