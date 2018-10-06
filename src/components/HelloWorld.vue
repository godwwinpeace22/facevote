<template>
<div>
  <v-app id="inspire">
    
    <v-toolbar color="blue-grey" dark dense flat fixed app clipped-right style='background-color:#29648a;'>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!--v-toolbar-items>
        <v-btn flat to="/dashboard/elections/vote">Vote</v-btn> 
      </v-toolbar-items-->
      <v-toolbar-items>
        <v-btn flat to="/dashboard/elections/watch">Vote</v-btn> 
      </v-toolbar-items>

      <v-menu transition="slide-y-transition" offset-y>
        <v-toolbar-title slot="activator">
          <v-avatar size="36" color="grey lighten-4">
            <img :src="'https://api.adorable.io/avatars/285/' + $store.state.user.username + '@adorable.png'" alt="avatar">
          </v-avatar>
          <v-icon dark>arrow_drop_down</v-icon>
        </v-toolbar-title>
        
        <v-list>
          <v-list-tile
            v-for="item in toolbar_items"
            :key="item.name"
            to="#"
          >
            <v-icon right color="primary">{{item.icon}}</v-icon>
            <v-list-tile-title v-text="item.name" style="margin-left:5px;"></v-list-tile-title>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile to="#">
            <v-icon right color="primary">help</v-icon>
            <v-list-tile-title style="margin-left:5px;">Help</v-list-tile-title>
          </v-list-tile>
          <v-divider></v-divider>

          <v-list-tile to="#">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-title style="margin-left:5px;" @click="logout">Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu bottom left transition="slide-y-transition" v-if="right_sidebar">
        <v-btn slot="activator" dark icon>
          <v-icon>more_vert</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile @click="toshow = 2">
            <v-list-tile-title>Group info</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="$store.dispatch('curRoom', null)">
            <v-list-tile-title>Switch rooms</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-toolbar-side-icon @click.stop="drawerRight = !drawerRight"></v-toolbar-side-icon>
    </v-toolbar>
    <v-navigation-drawer fixed v-model="drawer" app dark width="220" class='navdrawr' style="background-color:#1c1f35;color:bfbbbb;">
      <v-list dense style="background-color:#1c1f35;color:bfbbbb;">
        
        <v-list-tile @click="openmenu">
          <v-list-tile-avatar>
            <img :src="'https://api.adorable.io/avatars/285/' + $store.state.user.username + '@adorable.png'">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title style='text-transform:capitalize;'>{{$store.getters.getUser.name || 'Mark Bezos'}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-menu v-model="menu" :close-on-content-click="false">
          <view-profile :user='$store.state.user'></view-profile>
        </v-menu>
        
        <v-divider></v-divider>

        <v-list-tile @click.stop="left = !left">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Open Temporary Drawer</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="menu.link" exact v-for="menu in navmenus" :key="menu.icon">
          <v-list-tile-action>
            <v-icon>{{menu.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{menu.title}}</v-list-tile-title>
        </v-list-tile>
        

        <v-list-group prepend-icon="poll" no-action value="false" >
          <v-list-tile slot="activator">
            <v-list-tile-title>Elections</v-list-tile-title>
          </v-list-tile>
          <v-list-tile  to="/dashboard/elections/create">
            <v-list-tile-action>
              <v-icon>add_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Create new election</v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="/dashboard/elections/manage">
              <v-list-tile-action>
                <v-icon>business_center</v-icon>
              </v-list-tile-action>
            <v-list-tile-title>Manage elections</v-list-tile-title>
          </v-list-tile>
          
        </v-list-group>
        <v-list-group prepend-icon="settings" no-action value="false" >
          <v-list-tile slot="activator">
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile>
          <v-list-tile  @click="settings_dialog = !settings_dialog">
            <v-list-tile-action>
              <v-icon>account_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Account</v-list-tile-title>
            <settings :dialog='settings_dialog'></settings>
          </v-list-tile>
          <v-list-tile to="#1">
              <v-list-tile-action>
                <v-icon>payment</v-icon>
              </v-list-tile-action>
            <v-list-tile-title>Billing</v-list-tile-title>
          </v-list-tile>
          
        </v-list-group>

        <v-list-tile to='#2'>
          <v-list-tile-action>
            <v-icon>help</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Help</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer temporary v-model="left" fixed></v-navigation-drawer>
    <v-layout>
      <v-flex>
        <v-snackbar v-model="snackbar.show" :timeout="10000" :color="snackbar.color" top>
          {{snackbar.message}} 
          <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
        </v-snackbar>
        <router-view></router-view>
      </v-flex>
    </v-layout>
    <v-navigation-drawer right temporary v-model="right" fixed></v-navigation-drawer>
    
  </v-app>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data:()=>({
      menu:true,
      more: [
        'Create New Election', 'Manage Elections'
      ],
      snackbar:{},
      navmenus:[
        {title:'Home', icon:'home', link:'/dashboard'},
        {title:'Messages', icon:'messages', link:'/dashboard/messages'},
        {title:'Notifications', icon:'notifications', link:'/dashboard/notifications'},
        {title:'Forum', icon:'comment', link:'/dashboard/forum'},
        {title:'Enroll', icon:'camera_alt', link:'/dashboard/enroll'},
        {title:'Contest', icon:'hdr_strong', link:'/dashboard/contest'},
      ],
      toolbar_items: [
        {name:'My profile', icon:'person'},
        {name: 'Settings', icon:'settings'}
      ],
      mini:false,
      drawer:true,
      drawer2:false,
      drawerRight: true,
      right: null,
      left: null,
      right_sidebar:null,
      settings_dialog:false,
      title:'FaceVote',
      someoneistyping:false,
      chat:'',
      text:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur veritatis quidem, iste sequi magni recusandae eligendi voluptas ratione totam excepturi vitae expedita laboriosam vel harum, ipsam suscipit cumque reprehenderit maiores!'
  }),
  props: {
    msg: String
  },
  components:{
    'create-election':CreateElection,
    'manage-election':ManageElection,
    'settings':Settings,
    users:Users,
    profile:Profile,
    ViewProfile,
    LoadingBar,
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu,
    ...VSnackbar
  },
  computed: {
    binding () {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) binding.column = true

      return binding
    }
  },
  methods:{
    logout(){
      this.$store.dispatch('logout')
      this.$store.dispatch('setUser', {user:null,token:null})
      this.chat.disconnect()
      this.$router.push('/')
    },
    openmenu(){
      console.log('ok o')
      this.menu = true
    }
  },
  mounted(){
    this.$eventBus.$on('hide_settings', ()=>{
      this.settings_dialog = false
    })
    
    let chat = io.connect('localhost:3000/chat')
    this.chat = chat // do this in order to access chat in other methods
    chat.on('connect', _=>{
      console.log('connected to server successfully')
      chat.emit('join_room', {user:this.$store.getters.getUser, room:this.$store.state.curRoom.electionId})
    })
    chat.on('update_chat', (messagesFromDb) =>{ // update chat from db
      // Don't update on empty mesages
      //console.log('mfdb')
      //console.log(messagesFromDb)
      messagesFromDb.length != 0 ? this.$store.dispatch('updateFromDb', messagesFromDb) : ''
    })
    
    chat.on('chat_response', (data)=> {
      
      this.$store.dispatch('saveChatMessage', data)
    });

    this.$eventBus.$on('Chat_Message', data=>{
      chat.emit('chat_message', data)
    })

    //listen when server broadcasts that some one is online
    chat.on('those_online', (data)=>{
      console.log(data)
      this.$store.dispatch('updateThoseOnline',data)
      //this.$eventBus.$emit('update_those_online', data)
    })

    

    
     
    this.$eventBus.$on('Someone_Is_Typing', (data)=>{
      chat.emit('is_typing', data)
    })
    chat.on('is_typing', data=>{
      this.$eventBus.$emit('Update_Typing_Status', data)
    })

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
      data.user.username == this.$store.getters.getUser.username ? alert('you have successfuly vote.') : ''
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
  },
  created(){
    
    this.$eventBus.$on('Change_Title', (data)=>{
      console.log('changing the title')
      this.title = data
    })
  }
}

import io from 'socket.io-client';
  import CreateElection from '@/components/CreateElection'
  import ManageElection from '@/components/ManageElection'
  import Settings from '@/components/Settings'
  import Users from '@/components/Users'
  import Profile from '@/components/Profile'
  import ViewProfile from '@/components/ViewProfile'
  import LoadingBar from '@/spinners/LoadingBar'
  import * as VCard from 'vuetify/es5/components/VCard'
  import * as VAvatar from 'vuetify/es5/components/VAvatar'
  import * as VSubheader from 'vuetify/es5/components/VSubheader'
  import * as VDivider from 'vuetify/es5/components/VDivider'
  import * as VTabs from 'vuetify/es5/components/VTabs'
  import * as VMenu from 'vuetify/es5/components/VMenu'
  import * as VTooltip from 'vuetify/es5/components/VTooltip'
  import * as VSnackbar from 'vuetify/es5/components/VSnackbar'
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;

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
.navdrawr{
  .v-list__tile__action, .v-list__group__header .v-list__group__header__prepend-icon{
    min-width:35px;
  }
  .v-icon{
    color:#adabab;
  }
  .v-list__tile{
    color:#bfbbbb;
  }
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
