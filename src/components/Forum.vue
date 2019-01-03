<template>
  <div style="background:gre;height:93vh;overflow:hidden;margin-top:;" class="navdrawr">
    <vue-headful
      :title="title"
    />
      <navigation>
        <span slot="title">{{$vuetify.breakpoint.smAndDown ? this_group.title : 'Forum'}}</span>
        <v-toolbar slot="extended_nav" color="teal" dark flat
          style='background-color:#29648a;' dense>
          <v-tabs v-model="model" color="teal" 
            v-if="$vuetify.breakpoint.smAndDown" slider-color="yellow">
            <v-tab
              v-for="item in ['Chat','Members','Media']"
              :key="item"
              :href="`#${item}`"
            >
              {{ item }}
            </v-tab>
          </v-tabs>
          <template v-else>
            <h1>{{this_group.title}}</h1>
            
          </template>
          <v-spacer></v-spacer>
          
          <v-menu offset-y>
            <v-btn icon slot="activator"
              v-show="$vuetify.breakpoint.mdAndUp">
              <v-icon size="30">menu</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click="media_dialog = true">
                <v-list-tile-title>Media files</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          
        </v-toolbar>
      </navigation>
      

    <v-navigation-drawer fixed v-model="drawerRight" v-if="$vuetify.breakpoint.mdAndUp" 
      :mobile-break-point="960"
      right hide-overlay clipped app width="300" class='navdrawr'>
      
      <v-divider></v-divider>
      <router-view :members='members' v-if="ready" :thisGroup='this_group'></router-view>
      
    </v-navigation-drawer>

    <v-tabs-items v-model="model">
      <v-tab-item value="Chat">
        <chatwindow :members='members' :room='this_group.electionId'></chatwindow>
      </v-tab-item>
      <v-tab-item value="Members" v-if="$vuetify.breakpoint.smAndDown">
        <router-view :members='members' v-if="ready" :thisGroup='this_group'></router-view>
      </v-tab-item>
      <v-tab-item value="Media" v-if="$vuetify.breakpoint.smAndDown">
        <chat-media></chat-media>
      </v-tab-item>
    </v-tabs-items>
 

    <!-- Textarea -->
    <div v-show="model == 'Chat'" :style="styleInput">
      <div class="chat_input white--text" id="chat_input" style='width:100%;background:#fff;z-index:0;'>
     
        <v-form @submit.prevent='submit' style="margin-left:px;background:#fff;" class="px-2">
          <v-textarea v-model="message" color="deep-purple" @keyup.shift.50="mention_dialog = true" 
            @keypress="isTyping" id="form"
            label="Type a message" outline 
            rows="1" auto-grow
          >
          <v-tooltip top slot="append" v-show="!message.trim()">
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

          <!-- EMOJIS DIALOG-->
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

          <!-- MENTION MEMBER -->
          <v-menu width="500"  :close-on-content-click='false' 
            attach="chat_input"
            slot="append" max-height="500" left top offset-y v-model="mention_dialog">
            <v-card class="pa-0" flat>
              <v-toolbar flat dense color="cyan"></v-toolbar>
              <div :style="styleMention" class="navdrawr">
                <v-list subheader dense>
                  <v-subheader v-show="members.length == 0">No results found</v-subheader>
                  <v-list-tile v-for="member in members" :key="member.uid" avatar @click="appendUser(member)">
                    
                    <v-list-tile-avatar>
                      <!-- prefer to use loggedin user's info rather than his info from voters list -->
                      <img :src="member.photoURL">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title class="text-capitalize">{{member.name}}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>

                <v-divider></v-divider>
              </div>
            </v-card>
          </v-menu>
          
          </v-textarea>
          <input id="file_input" accept="image/jpeg,image/png" multiple
            type="file" ref="file_input" style="visibility:hidden" @change="triggerFileModal($event)" />
        </v-form>
      </div>
    </div>

    <!-- CHAT MEDIA DIALOG -->
    <v-dialog v-model="media_dialog" fullscreen
      transition="dialog-transition">
      <v-toolbar color="teal" flat dense dark>
        Chat Media
        <v-spacer></v-spacer>
        <v-btn color="" outline @click="media_dialog = false">close</v-btn>
      </v-toolbar>
      <chat-media></chat-media>
    </v-dialog>


    <!-- FILE DIALOG -->
    <v-dialog v-model="file_dialog" style="background:#fff;" 
      max-width="600" hide-overlay :fullscreen="$vuetify.breakpoint.smAndDown">
      <v-toolbar dense flat>
        <v-toolbar-title>Upload a file</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat icon @click="file_dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="white">
        <v-card flat>
          <!-- Selected images preview -->
          <v-container grid-list-sm px-0>
            <v-layout row wrap>
              <v-flex xs3 v-for="(blob_url,i) in blob_urls" :key="i">
                <v-card height="100" class="mb-1">
                  <v-img :src='blob_url' height="100" @click="carousel_dialog = true;"></v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>

          <div class="mt-4">
            <v-textarea v-model="file_message" box color="deep-purple"
              label="Add a caption" outline
              rows="4" auto-grow
            ></v-textarea>
          </div>
          <v-card-actions>
            <v-btn depressed small color="secondary" @click="uploadImages">Upload Images</v-btn>
          </v-card-actions>
          
        </v-card>
      </v-container>
      
    </v-dialog>

    
    <!-- File uplaod progres dialog -->
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
    model:'Chat',
    left: null,
    ready:false,
    emojis:[
      '😀','😂','😁','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😐',
      '😶','😏','😣','😯','😪','😛','😜','😒','😲','😟',
    ],
    message:"",
    file_message:'',
    files:[],
    mention_dialog:false,
    file_dialog:false,
    carousel_dialog:false,
    media_dialog:false,
    progress_dialog:false,
    snackbar:{},
    blob_urls:[],
    menu:false,
    regElec:[],
    members:[],
    this_group:[], // the current group
    contestants:[],
    toshow:0,
    someoneistyping:false,
    timeDistance:0,
    show_imojis:false,
    members_dialog:false,
    cloudinary:{
      cloud_name:'unplugged',
      upload_preset:'pe4iolek'
    },
  }),
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.drawerRight = true
    }
  },
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
    styleInput(){
      if(this.$vuetify.breakpoint.smAndDown){
        return {position:'fixed',bottom:'-20px',width:'100%'}
      }else{
        return {position:'fixed',bottom:'-20px',width:'calc(100% - 520px)'}
      }
    },
    styleMention(){
      if(this.$vuetify.breakpoint.smAndDown){
        return {height:'200px',overflowY:'auto',width:'300px'}
      }else{
        return {height:'200px',overflowY:'auto',width:'400px'}
      }
    }
    
  },

  methods: {
    // opens the chat window on select
    async setCurrRoom(){
      try{
        let groupRef = await db.collection('elections').doc(this.$route.params.electionId).get()
        this.this_group = groupRef.data()
        //this.$store.dispatch('curRoom', this.$route.params.electionId)
        db.collection('moreUserInfo')
        .where('enrolled','array-contains', this.$route.params.electionId)
        .limit(25)
        .get().then(querySnapshot=>{
          this.members = []
          querySnapshot.forEach(doc=>{
            //console.log(doc.id, " => ", doc.data());
            this.members.push(doc.data())
          })
          this.ready = true
        }).catch(err=>{
          console.log(err)
        })
      }catch(error){
        this.dispatchError(error)
      }
      
    },
    triggerFileSelect(){
      //console.log('upload a file')
      document.getElementById('file_input').click()
    },
    triggerFileModal(e){
      let stop = true
      let file_sizes = 0
      for(let file of e.target.files){
        if(file.type == 'image/jpeg' || 
          file.type == 'image/jpg' || file.type == 'image/png'){
            stop = false
          
        }
        else{
          stop = true
          break
        }
        file_sizes += file.size
      }

      // Allow only images
      if(!stop){
        let one_mb = 1000000
        // limit total file upload to 1mb
        if(file_sizes < one_mb){
          //console.log(e.target.files)
          for(let file of e.target.files){
            //console.log(file)
            this.blob_urls.push(URL.createObjectURL(file))
          }
          this.files = e.target.files
          this.file_dialog = true
          //document.getElementById('file_input').value = ''
         
        }
        else{
          alert('Please select an image that is less than 1mb')
        }
      }
      else{
        alert('Only images are allowed!')
        //this.disabled_file_btn = true
      }
    },
    async uploadImages(){
      try {
        this.file_dialog = false
        this.progress_dialog = true
        let clUrl = `https://api.cloudinary.com/v1_1/${this.cloudinary.cloud_name}/upload`
        let formData = new FormData()
        let uploaded = []

        for(let file of this.files){
          formData.append('file', file)
          formData.append('upload_preset',this.cloudinary.upload_preset)

          let response = await api().post( clUrl,
            formData,
            {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
            }
          )

          uploaded.push(response.data.secure_url)
        }

        this.progress_dialog = false
        this.submit(this.file_message,uploaded)
        
      } catch (error) {
        this.progress_dialog = false
        //this.loading = false
        this.snackbar.show = true
        this.snackbar.color = 'error'
        this.snackbar.message = 'Sorry, something went wrong, try again.'
        console.log(error)
        console.log(error.response)
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
    async submit(message,images){
      //console.log(this.$store.getters.getUser)
      let timestamp = Date.now();
      let msgId = btoa(Math.random()).substring(0,12)
      let data = {
        chat:message.trim(),
        sender:this.$store.getters.getUser.uid,
        name:this.$store.getters.getUser.displayName,
        images:images, // this is for the uploaded image
        timestamp:timestamp,
        msgId:msgId,
        reactions:{
          like:[],love:[],wow:[],excited:[],haha:[],angry:[],
        },
        room:this.$route.params.electionId,
        status:'unread'
      }
      
      this.$store.dispatch('saveChatMessage', data)
      db.collection('chat_messages').doc(data.msgId).set(data)
      
      this.clearMessage()
      this.$eventBus.$emit('Scroll_Chat', 'data')
    },
    isTyping(){
      // tell others that this user is typing.
      this.$eventBus.$emit('Someone_Is_Typing',{
        user:this.$store.getters.getUser.username,
        room:this.$route.params.electionId
      })
      
    },
    appendUser(member){
      this.message += ' #' + member.email + ' '
    },
    appendEmoji(emoji){
      this.message += emoji
    },
    
  },
  async mounted() {
    
    this.setCurrRoom()
    console.log(this.$vuetify.breakpoint)
    // hide the forum_users nav onload on small screens, and also show the btn to trigger the it on the navbar
    this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs ? 
    this.$store.dispatch('showRightNav', [false,true]) : ''
    //console.log(this.chat)
    
    this.$eventBus.$on('Toggle_drawerRight', data=>{
      this.drawerRight = data
    })

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
    Navigation,
    ChatMedia
  }
}
//import io from 'socket.io-client';
import api from '@/services/api'
  import {mapGetters} from 'vuex'
  import Settings from '@/components/Settings'
  import ForumUsers from '@/components/ForumUsers'
  import Chatwindow from '@/components/Chatwindow'
  import { promisfy } from "@/helpers/promisify"
  import ChatwindowVue from './Chatwindow.vue'
  import Navigation from '@/components/Navigation'
  import ChatMedia from '@/components/ChatMedia'
  import carousel from 'v-owl-carousel'
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

.v-dialog--fullscreen{
  background:#fff !important;
}
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

