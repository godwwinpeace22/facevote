<template>
  <div style="background:gre;height:93vh;overflow:hidden;margin-top:;" class="navdrawr">
    <vue-headful
      :title="title"
    />
      <v-toolbar color="teal" dark flat v-show="$vuetify.breakpoint.smAndDown"
        style='background-color:#29648a;' dense>
        <v-toolbar-title>{{elections.title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn  @click="drawerRight = true;" large icon tile color="primary"
          style="position:absolute;right:-5px;top:50px;">
          <v-icon size="30">chevron_left</v-icon>
          
        </v-btn>
        
      </v-toolbar>
    <v-navigation-drawer fixed v-model="drawerRight"  :mobile-break-point="960"
      :disable-route-watcher='$vuetify.breakpoint.smAndDown'
      right hide-overlay clipped app width="300" class='navdrawr'>
      
      <v-divider></v-divider>
      <router-view :regVoters='elections.regVoters' :contestants='contestants'></router-view>
      
    </v-navigation-drawer>

    <chatwindow :regVoters='elections.regVoters'></chatwindow>
  <v-container>
    <div class="chat_input white--text" id="chat_input" style='margin-left:px;position:static;width:100%;background:r;z-index:0;'>
      

      <v-form @submit.prevent='submit' style="margin-left:px;background:;" >
        <v-textarea v-model="message" color="deep-purple" @keyup.shift.50="mention_dialog = true" 
          @keypress="isTyping" id="form"
          label="Type a message" outline 
          rows="1" auto-grow
        >
        <v-tooltip top slot="append">
          <v-btn icon slot="activator" @click='triggerFileSelect'>
            <v-icon color="success">photo_camera</v-icon>
          </v-btn>
          <span>Send a photo</span>
        </v-tooltip>
        <v-tooltip top slot="append">
          <v-btn icon slot="activator" @click='mention_dialog = true'>
            <span color="success" style="color:green;margin-top:-3px;font-size:18px;">@</span>
          </v-btn>
          <span>Mention someone</span>
        </v-tooltip>
        <v-tooltip top slot="append-outer" v-if="message.trim()">
          <v-btn icon slot="activator" @click="sendMessage">
            <v-icon color="teal">{{message.trim() ? 'send' : '' }}</v-icon>
          </v-btn>
          <span>Send message</span>
        </v-tooltip>

        <v-menu max-width="300" :close-on-content-click='false'
          slot="prepend-inner" max-height="300" top offset-y>

          <v-btn slot="activator" icon >
            <v-icon color="success">mood</v-icon>
          </v-btn>
          <v-card class="pa-0">
            <v-card-text >
              <v-btn small flat color="primary" icon v-for="(emoji,i) in emojis" :key="i" @click="appendEmoji(emoji)">
                <span style="font-size:30px;display:block;margin-top:-7px;">{{emoji}}</span>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-menu width="500"  :close-on-content-click='false' 
           attach="chat_input"
          slot="append" max-height="500" left top offset-y v-model="mention_dialog">
          <!--v-btn slot="activator" icon class="nudgeup">
            <span  style="margin-top:-3px;color:green;font-size:18px;">@</span>
          </v-btn-->
          <v-card class="pa-0" flat>
            <v-toolbar flat dense></v-toolbar>
            <div style="height:200px;overflow-y:auto;width:400px;" class="navdrawr">
              <v-list subheader dense>
                <v-subheader v-show="elections.regVoters.length == 0">No results found</v-subheader>
                <v-list-tile v-for="voter in regVoters" :key="voter._id" avatar @click="appendUser(voter)">
                  
                  <v-list-tile-avatar>
                    <!-- prefer to use loggedin user's info rather than his info from voters list -->
                    <img :src="getSrc(voter)">
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title class="text-capitalize">{{getName(voter)}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-divider></v-divider>
            </div>
          </v-card>
        </v-menu>
        
        </v-textarea>
        <input id="file_input" type="file" ref="file_input" style="visibility:hidden" @change="triggerFileModal($event)" />
      </v-form>
    </div>
  </v-container>

  <v-dialog v-model="file_dialog" max-width="400" hide-overlay style="">
    <v-container style="background:#fff;">
      <h3 class="mb-2">Upload a file</h3>
      <v-img :src="imgSrc" max-height='200' max-width='400'></v-img>
      <!--div style="min-height:200px;"></div-->
      <div class="mt-4">
        <v-textarea v-model="file_message" box color="deep-purple"
          label="Add a message about the file" outline
          rows="4" auto-grow
        ></v-textarea>
      </div>
      <v-spacer></v-spacer>
      <v-btn flat small color="primary" @click="uploadFile">Upload file</v-btn>
    </v-container>
    
  </v-dialog>

  <v-dialog v-model="progress_dialog" hide-overlay max-width="300">
    <v-card>
      <v-container class="mt-0">
        <v-subheader >Uploading file</v-subheader>
        <v-progress-linear :indeterminate="true" ></v-progress-linear>
      </v-container>
    </v-card>
  </v-dialog>
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Forum | Facevote',
    password: 'Password',
    drawerRight: true,
    left: null,
    emojis:[
      '😀','😂','😁','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😐',
      '😶','😏','😣','😯','😪','😛','😜','😒','😲','😟',
    ],
    message:"",
    file_message:'',
    file:null,
    mention_dialog:false,
    file_dialog:false,
    progress_dialog:false,
    imgSrc:'',
    menu:false,
    regElec:[],
    regVoters:[],
    elections:[], // all the elections user enrolled in
    contestants:[],
    toshow:0,
    someoneistyping:false,
    timeDistance:0,
    show_imojis:false,
    members_dialog:false,
    cloudinary: {
      uploadPreset: 'r9tlxvid',
      cloudName: 'unplugged'
    },
  }),
  computed: {
    toolbarStatus(){
      return 'Your connected groups'
    },
    // Mix your getter(s) into computed with the object spread operator
    ...mapGetters([
      'isAuthenticated',
      'token',
      'getUser'
    ]),
    
  },

  methods: {
    // opens the chat window on select
    async setCurrRoom(){
      try{
        let elections =  await api().post(`dashboard/getId/${this.$route.params.electionId}`, {token:this.$store.getters.getToken})
        this.elections = elections.data
        this.regVoters = elections.data.regVoters
        //this.joinRoom();
        //this.$store.dispatch('curRoom', this.$route.params.electionId)
        let contestants = await api().post(
          `dashboard/getContestants/${this.elections._id}`,
          {token:this.$store.getters.getToken}
        )
        this.contestants = contestants.data
      }catch(error){
        this.dispatchError(error)
      }
      
    },
    triggerFileSelect(){
      //console.log('upload a file')
      document.getElementById('file_input').click()
    },
    triggerFileModal(e){
      //console.log(e.target.files)
      this.file = e.target.files[0]
      this.imgSrc = URL.createObjectURL(e.target.files[0])
      this.file_dialog = true
      //console.log(e.target.files)
      document.getElementById('file_input').value = ''
    },
    async uploadFile(){
      // Make sure to restrict upload file types
      this.file_dialog = false
      this.progress_dialog = true
      let formData = new FormData()
      formData.append('file', this.file);
      formData.append('file_message', this.file_message)
      formData.append('upload_preset', this.cloudinary.uploadPreset);

      // first upload image to cloudinary and retrieve the url
      try{
        let res = await api().post(`https://api.cloudinary.com/v1_1/${this.cloudinary.cloudName}/upload`, formData)
        console.log(res.data)
        
        this.submit(this.file.file_message,res.data.secure_url)
        this.progress_dialog = false
        
      }
      catch(err){
        this.dispatchError(err)
        console.log(err)
        this.progress_dialog = false
        alert('Upload failed')
        this.clearMessage()
      }
    },
    getSrc(voter){
      // doing this so that when there is a profile update, the reactive user data will be updated here
      return voter.username == this.getUser.username ? this.getUser.imgSrc : 
      voter.imgSrc || `https://ui-avatars.com/api/?name=${voter.name}`
    },
    getName(voter){
      // doing this so that when there is a profile update, the reactive user data will be updated here
      let me = this.getUser
      return voter.username == me.username ? me.name : voter.name
    },
    sendMessage () {
      this.submit(this.message, null)
    },
    clearMessage () {
      this.message = ''
      this.file_message = ''
      this.file = null
      this.imgSrc = ''
    },
    submit(message,imgSrc){
      //console.log(this.chat)
      let timestamp = Date.now();
      let msgId = Date.now() * 1 + 1000 * Math.floor(Math.random() * (999999 - 999)) + 999;
      this.$eventBus.$emit('Chat_Message', {
        chat:message.trim(),
        user:this.$store.getters.getUser.username,
        name:this.$store.getters.getUser.name,
        imgSrc:imgSrc, // this is for the uploaded image
        timestamp:timestamp,
        msgId:msgId,
        reactions:{
          like:[],love:[],wow:[],excited:[],haha:[],angry:[],
        },
        room:this.$route.params.electionId,
        status:'unread'
      });
      console.log(this.$route.params.electionId)
      //this.msgs.push({chat:this.message, user:this.$store.getters.getUser.username})
      
      /*this.$store.dispatch('saveChatMessage', {
        chat:message,
        user:this.$store.getters.getUser.username,
        name:this.$store.getters.getUser.name,
        imgSrc:imgSrc,
        timestamp,
        msgId,
        reactions:{
          like:[],love:[],wow:[],excited:[],haha:[],angry:[],
        },
        room:this.$route.params.electionId,
        status:'unread'
      })*/
      this.clearMessage()
      this.$eventBus.$emit('Scroll_Chat', 'data')
    },
    isTyping(){
      // tell others that this user is typing.
      this.$eventBus.$emit('Someone_Is_Typing',{user:this.$store.getters.getUser.username,room:this.$route.params.electionId})
      
    },
    appendUser(voter){
      this.message += ' @' + voter.username + ' '
    },
    appendEmoji(emoji){
      this.message += emoji
    },
    logout(){
      this.$store.dispatch('logout')
      this.$router.push('/')
    },
    dispatchError(error){
      if(error.response && error.response.status == 401){
        // if the auth token is invalid, log user out(if possible) and redirect to login page
        this.$store.dispatch('logout')
        this.$router.push('/login')
      }
    },
    
  },
    async mounted() {
      
      this.setCurrRoom()
      console.log(this.$vuetify.breakpoint)
      // hide the forum_users nav onload on small screens, and also show the btn to trigger the it on the navbar
      this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs ? 
      this.$store.dispatch('showRightNav', [false,true]) : ''
      console.log(this.chat)
      
    },
    destroyed(){
      //this.$eventBus.$emit('show_right_sidebar',null);
      // hide the nav, hide the btn trigger [nav,btn]
      this.$store.dispatch('showRightNav', [false,false])
      this.$eventBus.$emit('change_title','FaceVote');
    },
  components:{
    'chatwindow':Chatwindow,
    'settings':Settings,
    'users':ForumUsers,
  }
}
//import io from 'socket.io-client';
import api from '@/services/api'
  import {mapGetters} from 'vuex'
  import Settings from '@/components/Settings'
  import ForumUsers from '@/components/ForumUsers'
  import Chatwindow from '@/components/Chatwindow'
  import { promisfy } from "@/helpers/promisify";
  import ChatwindowVue from './Chatwindow.vue';
</script>
<style lang="scss" scoped>
.v-content{
  padding-top:0 !important;
}
@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;

.chat_home{
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  //background-color: #00aabb;
}
nav{
  margin-top:48px;
}

.nudgeup .v-btn__content{
  margin-top:-12px;
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

