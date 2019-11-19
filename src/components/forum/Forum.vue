<template>
  <div style="overflow:hidden;" class="navdrawr">
    <vue-headful
      :title="title"
    />
    <navigation>
      <span slot="title">{{this_group.title}}</span><br>
      <span>ElectionId: {{this_group.electionId}}</span>

      <v-spacer></v-spacer>
      <v-btn icon slot="nav_item" @click="media_dialog = true"
        v-if="breakpoint.mdAndUp">
        <v-icon color="">mdi-image-multiple</v-icon>
      </v-btn>

      <v-toolbar slot="extended_nav" color="teal" flat
        v-if="breakpoint.smAndDown" style='' dense>
        <v-tabs v-model="model" background-color="teal" slider-color="yellow">
          <v-tab
            v-for="item in ['Chat','Members','Media']"
            :key="item"
            :href="`#${item}`"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-toolbar>
    </navigation>

    <!-- <v-navigation-drawer fixed v-model="drawerRight" v-if="breakpoint.mdAndUp" 
      :mobile-break-point="960" style="overflow:hidden;"
      right hide-overlay clipped app width="300" class='user_presence_sidebar navdrawr pr-1'>
      
      <v-divider></v-divider>
      
      
    </v-navigation-drawer> -->

    <loading-bar v-if="!ready">
      <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
    </loading-bar>

    <v-row no-gutters>
      <v-col md="3"
        v-if="$vuetify.breakpoint.mdAndUp">
        <conversations></conversations>
      </v-col>
    
      <v-col class="white chat-area" sm="12" md="6">
        <v-row>
          <v-col cols="12" class="pb-0" id="style-2">
            <div :style="styleChat">
              <chatwindow :members='members' 
                :room='this_group.electionId' 
                :thisGroup='this_group' 
                :loading_messages="loading_messages">
              </chatwindow>
              <!-- Textarea -->

            </div>

          </v-col>
          <v-col cols="12" class="py-0">
            <div v-if="ready" >
              <div class="white--text" v-show="forumId != 'd'"
                style='width:100%;background:#fff;z-index:0;'>
            
                <v-form style="margin-left:px;background:#fff;" class="px-2">
                  <v-textarea v-model.trim="message" outlined
                    v-on:keyup.enter="sendMessage" color="deep-purple" 
                    @keyup.shift.50="mention_dialog = true" 
                    id="form" :disabled="!canSendMessages"
                    :label="canSendMessages ? 'Type a message' : text_label" outline 
                    rows="1" auto-grow hide-details
                  >

                  <!-- <v-btn icon 
                    @click='$helpers.trigFileSelector' 
                    v-show="!message">
                    <v-icon color="success">mdi-camera</v-icon>
                  </v-btn> -->
                
                  <!-- EMOJIS DIALOG-->
                  <v-menu max-width="300" :close-on-content-click='false'
                    slot="prepend-inner" max-height="" top offset-y>
                    <template v-slot:activator="{on}">
                      <v-btn icon v-on="on">
                        <v-icon color="success">mdi-emoticon-outline</v-icon>
                      </v-btn>
                    </template>
                    
                      <emoji-picker @append-emoji="appendEmoji"/>
                    
                  </v-menu>

                  <!-- MENTION MEMBER -->
                  <v-menu width="500"  :close-on-content-click='false' 
                    id="mention"  max-height="500" slot="append"
                    left top offset-y v-model="mention_dialog">

                    <template v-slot:activator="{on}">
                      <v-btn icon v-on="on">
                        <span color="success" 
                          style="color:green;margin-top:-3px;font-size:18px;">
                          @
                        </span>
                      </v-btn>
                    </template>


                    <v-card class="pa-0" flat>
                      <v-toolbar flat dense color="cyan" dark>Mention Someone</v-toolbar>
                      <div :style="styleMention" class="navdrawr my-1">
                        <v-list subheader dense>
                          <v-subheader v-show="members.length == 0">No results found</v-subheader>
                          <v-list-item v-for="member in members" 
                            :key="member.username"
                            @click="appendUser(member)">
                            
                            <v-list-item-avatar size="38"  :color="$helpers.colorMinder(member.name.charAt(0))">
                              <img :src="member.photoURL" v-if="member.photoURL">
                              <span v-else  class="white--text" >
                                {{member.name.charAt(0)}}
                              </span>
                              
                            </v-list-item-avatar>

                            <v-list-item-content>
                              <v-list-item-title class="text-capitalize">{{member.name}}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>

                        <v-divider></v-divider>
                      </div>
                    </v-card>
                  </v-menu>

                  <v-btn icon  
                    @click="sendMessage" 
                    v-show="message"
                    slot="append">
                    <v-icon color="teal">
                      mdi-send
                    </v-icon>
                  </v-btn>

                  </v-textarea>
                  
                </v-form>
              </div>
            </div>

          </v-col>
        </v-row>


        <!-- <v-tabs-items v-model="model" class="" style="background:#fff;" v-if="ready">
          <v-tab-item value="Chat" :style="styleForTabs">
            
          </v-tab-item>
          <v-tab-item value="Members" v-if="breakpoint.smAndDown" :style="styleForTabs">
            <router-view :members='members'  :thisGroup='this_group'></router-view>
          </v-tab-item>
          <v-tab-item value="Media" v-if="breakpoint.smAndDown" class="" :style="styleForTabs2">
            <chat-media></chat-media>
          </v-tab-item>
        </v-tabs-items> -->
      </v-col>

      <v-col md="3"
        v-if="$vuetify.breakpoint.mdAndUp">
        <router-view 
          :members='members' 
          v-if="ready" 
          :thisGroup='this_group' 
          :suspended="suspended">
        </router-view>
      </v-col>
    </v-row>
 

    <!-- CHAT MEDIA DIALOG -->
    <v-dialog v-model="media_dialog" scrollable fullscreen
      transition="dialog-transition" style="background:#fff;">
      <v-card>
        <v-toolbar card color="teal" flat dense dark>
          Chat Media
          <v-spacer></v-spacer>
          <v-btn color="" outline @click="media_dialog = false">close</v-btn>
        </v-toolbar>
        <v-card-text> 
          <chat-media></chat-media>
        </v-card-text>
      </v-card>
    </v-dialog>


    <!-- FILE DIALOG -->
    <v-dialog v-model="file_dialog" style="background:#fff;" :persistent="progress_dialog"
      max-width="600" hide-overlay :fullscreen="breakpoint.xsOnly">
      <v-toolbar dense flat>
        <v-toolbar-title>Upload images</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat icon @click="file_dialog = false" :disabled="progress_dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="white">
        <v-card flat>
          <!-- Selected images preview -->
          <v-container grid-list-sm px-0>
            <v-row row wrap>
              <v-col cols="3" v-for="(blob_url,i) in blob_urls" :key="i">
                <v-card height="100" class="mb-1">
                  <v-img :src='blob_url' height="100"></v-img>
                </v-card>
              </v-col>
            </v-row>
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
          {{uploadProgress}}%
        </v-card>
      </v-container>
      
    </v-dialog>

    
    <!-- File uplaod progres dialog -->
    <v-dialog v-model="progress_dialog" max-width="300" persistent>
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat icon>
            <v-icon @click="progress_dialog = false" :disabled="progress_dialog">mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-container class="mt-0">
          <v-subheader >Uploading images</v-subheader>
          <v-progress-linear indeterminate ></v-progress-linear>
        </v-container>
        {{uploadProgress.no_uploaded || 0}}/{{uploadProgress.no_of_files}} &nbsp; {{uploadProgress.progress || 0}}%
      </v-card>
    </v-dialog>

  </div>
</template>
<script>
export default {
  data: ()=>({
    password: 'Password',
    drawerRight: true,
    model: 'Chat',
    text_label: 'You cannot send messages in this forum',
    left: null,
    ready: false,
    loading_messages: true,
    message: "",
    file_message: '',
    files: [],
    mention_dialog: false,
    file_dialog: false,
    carousel_dialog: false,
    media_dialog: false,
    progress_dialog: false,
    snackbar: {},
    blob_urls: [],
    menu: false,
    members: [],
    members2: [],
    suspended: [], // suspended voters and contestants
    this_group: [], // the current group
    updateRef: '', // stop listening for updates
    membersRfef: '', // stop listening for updates
    cloudinary: {
      cloud_name: 'unplugged',
      upload_preset: 'pe4iolek'
    },
  }),
  watch: {
    
    forumId: function(to,from){
      this.loading_messages = true
      this.initialize()
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'uploadProgress'
    ]),
    title(){
      return `Forum | ${this.$appName}`
    },
    forumId(){
      return this.$route.params.forumId
    },
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    canSendMessages(){
      // check if current user can send messages to current group

      // let enrolled = this.getUser.enrolled ? 
      //   this.getUser.enrolled.find(electionId => electionId == this.this_group.electionId) : false

      // let banned = this.suspended.voters && !!this.suspended.voters.find(memberId => memberId == this.getUser.uid)

      // !enrolled ? this.text_label = 'Enroll to join the conversation' : ''
      // return enrolled && !banned ? true : false
       return true
    },
    styleChat(){
      if(this.breakpoint.smAndDown){
        return {height: 'calc(100vh - 182px)', overflowY: 'auto', overflowX: 'hidden'}
      }else{
        return {height: 'calc(100vh - 140px)', overflowY: 'auto', overflowX: 'hidden'}
      }
    },
    styleMention(){
      if(this.breakpoint.xsOnly){
        return {height:'200px',overflowY:'auto',width:'270px'}
      }
      else if(this.breakpoint.smAndDown){
        return {height:'200px',overflowY:'auto',width:'300px'}
      }
      else{
        return {height:'200px',overflowY:'auto',width:'400px'}
      }
    },
    
  },

  methods: {
    
    async initialize(){
      
      if(this.forumId){

        this.this_group = this.curRoom
        this.loading_messages = false

        setTimeout(() => {
          this.scrollChat()
        }, 1000);

        await this.retrieveMembers()

        // this.getSuspended()
        this.ready = true;
        

      }
      else{
        // this.$router.push('/home')
      }
    },
    retrieveMembers(){
      // get all voters in an election
      let members = []
      this.$gun.get('elections')
        .get(this.forumId)
        .get('voters')
        .map()
        .on((data) => {
          members.push(data)
        })

      // console.log({members})
      this.members = members
    },
    async uploadImages(){
      try {

        this.progress_dialog = true
        // let uploaded = await this.$helpers.uploadImage(this.files, this.cloudinary)
        let uploaded = await this.$helpers.upload({
          files: this.files,
          path: `forums/${this.curRoom.electionId}`
        })

        this.progress_dialog = false
        this.file_dialog = false
        this.submit(this.file_message, uploaded)
        
      } catch (error) {
        this.progress_dialog = false
        this.file_dialog = false
        //this.loading = false
        this.$eventBus.$emit('Snackbar', {
          show: true,
          color: 'error',
          message: 'Sorry, something went wrong, try again.'
        })
        // eslint-disable-next-line
        // console.log(error)
      }
      
    },
    sendMessage () {
      if(this.message.trim() && this.canSendMessages){
        this.submit(this.$sanitize(this.message), false)
      }
    },
    clearMessage () {
      this.message = ''
      this.file_message = ''
      this.file = null
      this.imgSrc = ''
    },
    async submit(message,images){
      try{
        
        let body = this.$sanitize(message.trim())
        let docId = this.$uuidv4()

        let chat_data = {
          author: this.getUser.username,
          date_created: Date.now(),
          body: body,
          imgs: images, // this is for the uploaded image
          docId: docId,
          elecRef: this.forumId,
          reactions:{
            like: 0,
            love: 0,
            wow: 0,
            excited: 0,
            haha: 0,
            angry: 0,
          }
        }

        let chat_message = this.$gun.get('chat_messages')
          .get(this.forumId)
          .get(docId)
          .put(chat_data)
        
        this.scrollChat()
        this.clearMessage()

      }
      catch(err){
        // console.log(err)
      }
    },
    appendUser(member){
      this.message += ' @' + member.username + ' '
    },
    appendEmoji(emoji){
      this.message += emoji
    },
    scrollChat(){
       let doc = document.getElementById('chat_space_content')
      doc ? doc.scroll({
        top: doc.scrollHeight,
        behavior: 'smooth'
      }) : ''
    },
    
    async getSuspended(){
      // get suspended voters and contestants
      
			db.collection('suspended').doc(this.this_group.electionId)
			.onSnapshot(doc => {
				
				this.suspended = doc.data()
			})
    },
    
    
  },
  mounted(){
    this.$eventBus.$on('Selected_Files', data=>{
      this.file_dialog = true
			this.files = data.selected_files,
			this.blob_urls = data.imgSrc
    })

    this.$eventBus.$emit('Toggle_Left_Drawer')
    
  },
  created() {
    
    this.initialize()

    this.$eventBus.$on('Toggle_drawerRight', data=>{
      this.drawerRight = data
      this.model = 'Members'
    })

  },
  beforeDestroy(){
    
  },
  destroyed(){
    
  },
  components:{
    'chatwindow': Chatwindow,
    'users': ForumUsers,
    Navigation,
    ChatMedia,
    LoadingBar,
    EmojiPicker,
    Conversations
    // Picker,
  }
}
//import io from 'socket.io-client';
// import api from '@/services/api'
  import {mapGetters, mapState} from 'vuex'
  // import uuid from 'uuid/v4'
  import ForumUsers from '@/components/forum/ForumUsers'
  import Chatwindow from '@/components/forum/Chatwindow'
  // import ChatwindowVue from '@/components/Chatwindow.vue'
  import Navigation from '@/components/Navigation'
  import ChatMedia from '@/components/forum/ChatMedia'
  import LoadingBar from '@/spinners/LoadingBar'
  import EmojiPicker from '@/components/emojis/EmojiPicker'
  import Conversations from "@/components/forum/Conversations";
  // import { Picker } from 'emoji-mart-vue'
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
  background-size: cover;
  background-position: center;
  //background-color: #00aabb;
}


</style>

