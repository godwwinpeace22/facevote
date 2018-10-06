<template>
  <div style="background:gre;height:93vh;" class="navdrawr">
    
    <v-navigation-drawer fixed v-model="drawerRight" right clipped app v-if="$store.state.curRoom" width="300" class='navdrawr'>
      <v-list dense>
        <v-list-tile @click.stop="right = !right">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Open Temporary Drawer</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <router-view></router-view>
      
    </v-navigation-drawer>
    <v-layout v-if='!$store.state.curRoom' style="min-height:400px">
      <v-flex xs12 >
        <p>Your connected groups</p>
        <v-list>
          <v-list-tile @click="setCurrRoom(election)" v-for='election in elections' :key="election._id">
            <v-list-tile-title>{{election.title}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>

    <chatwindow  v-if="$store.state.curRoom" :icons='icons'></chatwindow>
    
    <v-navigation-drawer v-if='$store.state.curRoom' right temporary v-model="right" fixed></v-navigation-drawer>
  <v-container v-if='$store.state.curRoom'>
    <div class="white--text" style='margin-left:px;position:static;width:100%;background:#fff;'>

      <v-form @submit.prevent='submit' style="margin-left:px;background:;">
        <v-textarea v-model="message" box color="deep-purple" @keypress="isTyping"
          label="Message" outline :append-icon="message ? 'attach_file' : 'photo_camera'"
          :append-outer-icon="message ? 'send' : 'mic'"
          @click:append-outer="sendMessage"
          rows="1" auto-grow
        ></v-textarea>
            
      </v-form>
    </div>
  </v-container>
  </div>
</template>
<script>
export default {
  data:()=>({
    password: 'Password',
    drawer: null,
    drawer3:true,
    drawerRight: true,
    right: null,
    left: null,
    right_sidebar:true,
    marker: true,
    iconIndex: 0,
    message:'Hey',
    menu:false,
    regElec:[],
    elections:[], // all the elections user enrolled in
    toshow:0,
    someoneistyping:false,
    timeDistance:0,
    icons: [
      'mood',
      'mood_bad',
      'sentiment_satisfied',
      'sentiment_dissatisfied',
      'sentiment_very_dissatisfied',
      'sentiment_very_satisfied',
      'sentiment_neutral'
    ],
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
  }),
  props:{
    source:String
  },
  computed: {
      toolbarStatus(){
        return this.$store.state.curRoom ? this.$store.state.curRoom.title :  'Your connected groups'
      }
      
    },

    methods: {
      // opens the chat window on select
      setCurrRoom(room){
        //store the roomId
        console.log(room)
        this.$store.dispatch('curRoom', room)
      },
      toggleMarker () {
        this.marker = !this.marker
      },
      sendMessage () {
        this.resetIcon()
        this.submit()
      },
      clearMessage () {
        this.message = ''
      },
      resetIcon () {
        this.iconIndex = 0
      },
      changeIcon () {
        this.iconIndex === this.icons.length - 1
          ? this.iconIndex = 0
          : this.iconIndex++
      },
      submit(){
        //console.log(this.chat)
        this.$eventBus.$emit('Chat_Message', { chat:this.message,user:this.$store.getters.getUser.username, timestamp:Date.now(), room:this.$store.state.curRoom.electionId });
        //this.msgs.push({chat:this.message, user:this.$store.getters.getUser.username})
        this.$store.dispatch('saveChatMessage', {chat:this.message, user:this.$store.getters.getUser.username, timestamp:Date.now(), room:this.$store.state.curRoom.electionId})
        this.clearMessage()
      },
      isTyping(){
        // tell others that this user is typing.
        this.$eventBus.$emit('Someone_Is_Typing',{user:this.$store.getters.getUser.username,room:this.$store.state.curRoom.electionId})
        
      },
      logout(){
        this.$store.dispatch('logout')
        this.$router.push('/')
      },
    },
    async mounted() {
      
      
      // get the elections the user registered for
      try {
        if(!this.$store.state.curRoom){
          let res = await api().get(`dashboard/getElections/${this.$store.getters.getUser._id}/${this.$store.getters.getToken}`)
          this.elections = res.data.enrolled
          console.log(res)
           
        }
        else{

          this.$eventBus.$emit('Change_Title', this.$store.state.curRoom.title);
          console.log('wow')
        }
        
      } catch (error) {
        console.log(error)
        console.log(error.response)
        if(error.response && error.response.status == 401){
          // if the auth token is invalid, log user out(if possible) and redirect to login page
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },
    destroyed(){
      this.$eventBus.$emit('show_right_sidebar',null);
      this.$eventBus.$emit('change_title','FaceVote');
    },
  components:{
    'chatwindow':Chatwindow,
    'settings':Settings,
    'users':Users,
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu,
    ...VTextField,
    ...VSelect,
    ...VSwitch,
    ...VDatePicker,
    ...VTimePicker,
    ...VDialog,
    ...VStepper,
    ...VSlider,
    ...VChip,
    ...VForm,
    ...VTextarea
  }
}
//import io from 'socket.io-client';
import api from '@/services/api'
import Settings from '@/components/Settings'
import Users from '@/components/Users'
import Chatwindow from '@/components/Chatwindow'
import { promisfy } from "@/helpers/promisify";
import * as VCard from 'vuetify/es5/components/VCard'
import * as VAvatar from 'vuetify/es5/components/VAvatar'
import * as VSubheader from 'vuetify/es5/components/VSubheader'
import * as VDivider from 'vuetify/es5/components/VDivider'
import * as VTabs from 'vuetify/es5/components/VTabs'
import * as VMenu from 'vuetify/es5/components/VMenu'
import * as VTooltip from 'vuetify/es5/components/VTooltip'
import * as VTextField from 'vuetify/es5/components/VTextField'
import * as VSelect from 'vuetify/es5/components/VSelect'
import * as VSwitch from 'vuetify/es5/components/VSwitch'
import * as VDatePicker from 'vuetify/es5/components/VDatePicker'
import * as VTimePicker from 'vuetify/es5/components/VTimePicker'
import * as VDialog from 'vuetify/es5/components/VDialog'
import * as VStepper from 'vuetify/es5/components/VStepper'
import * as VSlider from 'vuetify/es5/components/VSlider'
import * as VChip from 'vuetify/es5/components/VChip'
import * as VForm from 'vuetify/es5/components/VForm'
import * as VTextarea from 'vuetify/es5/components/VTextarea'
import ChatwindowVue from './Chatwindow.vue';
</script>
<style lang="scss" scoped>

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;

.chat_home{
  background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  //background-color: #00aabb;
}
nav{
  margin-top:48px;
}

/* --scrollbar --*/
.navdrawr::-webkit-scrollbar {
    width: 10px;
    background-color: #87899c ;
    @include borderRadius(10px)
  }
.navdrawr::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #f5f6fa ;
  @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>

