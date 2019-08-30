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

      <v-toolbar slot="extended_nav" color="teal" dark flat
        v-if="breakpoint.smAndDown" style='background-color:#29648a;' dense>
        <v-tabs v-model="model" color="teal" slider-color="yellow">
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

    <v-navigation-drawer fixed v-model="drawerRight" v-if="breakpoint.mdAndUp" 
      :mobile-break-point="960" style="overflow:hidden;"
      right hide-overlay clipped app width="300" class='user_presence_sidebar navdrawr pr-1'>
      
      <v-divider></v-divider>
      <router-view :members='members' v-if="ready" :thisGroup='this_group' :suspended="suspended"></router-view>
      
    </v-navigation-drawer>

    <loading-bar v-if="!ready">
      <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
    </loading-bar>

    <v-tabs-items v-model="model" class="" style="background:#fff;" v-if="ready">
      <v-tab-item value="Chat" :style="styleForTabs">
        <chatwindow :members='members' :room='this_group.electionId' :thisGroup='this_group' :loading_messages="loading_messages"></chatwindow>
        <!-- Textarea -->
        <div v-show="model == 'Chat'" v-if="ready" :style="styleInput" style="display:;">
          <div class="chat_input white--text" id="chat_input" style='width:100%;background:#fff;z-index:0;'>
        
            <v-form style="margin-left:px;background:#fff;" class="px-2">
              <v-textarea v-model="message" v-on:keyup.enter="sendMessage" color="deep-purple" 
                @keyup.shift.50="mention_dialog = true" 
                 id="form" :disabled="!canSendMessages"
                :label="canSendMessages ? 'Type a message' : text_label" outline 
                rows="1" auto-grow hide-details
              >
              <v-tooltip top slot="append" v-show="!message.trim()">
                <v-btn icon slot="activator" @click='$helpers.trigFileSelector'>
                  <v-icon color="success">mdi-camera</v-icon>
                </v-btn>
                <span>Send a photo</span>
              </v-tooltip>
              
              <v-tooltip top slot="append-outer" v-if="message.trim()">
                <v-btn icon slot="activator" @click="sendMessage">
                  <v-icon color="teal">{{message.trim() ? 'mdi-send' : '' }}</v-icon>
                </v-btn>
                <span>Send message</span>
              </v-tooltip>

              <!-- EMOJIS DIALOG-->
              <v-menu max-width="300" :close-on-content-click='false'
                slot="prepend-inner" max-height="" top offset-y>

                <v-btn slot="activator" icon >
                  <v-icon color="success">mdi-emoticon-outline</v-icon>
                </v-btn>
                
                  <emoji-picker @append-emoji="appendEmoji"/>
                
              </v-menu>

              <!-- MENTION MEMBER -->
              <v-menu width="500"  :close-on-content-click='false' 
               id="mention"  max-height="500" slot="append"
                left top offset-y v-model="mention_dialog">

                <v-tooltip top slot="activator">
                  <v-btn icon slot="activator">
                    <span color="success" style="color:green;margin-top:-3px;font-size:18px;">@</span>
                  </v-btn>
                  <span>Mention someone</span>
                </v-tooltip>

                <v-card class="pa-0" flat>
                  <v-toolbar flat dense color="cyan" dark>Mention Someone</v-toolbar>
                  <div :style="styleMention" class="navdrawr my-1">
                    <v-list subheader dense>
                      <v-subheader v-show="members.length == 0">No results found</v-subheader>
                      <v-list-tile v-for="member in members" :key="member.uid" avatar @click="appendUser(member)">
                        
                        <v-list-tile-avatar size="38"  :color="$helpers.colorMinder(member.name.charAt(0))">
                          <img :src="member.photoURL" v-if="member.photoURL">
                          <span v-else  class="white--text" >
                            {{member.name.charAt(0)}}
                          </span>
                          
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
              
            </v-form>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item value="Members" v-if="breakpoint.smAndDown" :style="styleForTabs">
        <router-view :members='members'  :thisGroup='this_group'></router-view>
      </v-tab-item>
      <v-tab-item value="Media" v-if="breakpoint.smAndDown" class="" :style="styleForTabs2">
        <chat-media></chat-media>
      </v-tab-item>
    </v-tabs-items>
 

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
            <v-layout row wrap>
              <v-flex xs3 v-for="(blob_url,i) in blob_urls" :key="i">
                <v-card height="100" class="mb-1">
                  <v-img :src='blob_url' height="100"></v-img>
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
    regElec: [],
    members: [],
    members2: [],
    suspended: [], // suspended voters and contestants
    this_group: [], // the current group
    contestants: [],
    toshow: 0,
    someoneistyping: false,
    timeDistance: 0,
    show_imojis: false,
    members_dialog: false,
    updateRef: '', // stop listening for updates
    membersRef: '', // stop listening for updates
    cloudinary: {
      cloud_name: 'unplugged',
      upload_preset: 'pe4iolek'
    },
  }),
  watch: {
    
    curRoom: function(){
      this.loading_messages = true
      this.setCurrRoom()
    },
    'suspended.voters': function(to, from){
      
      this.members = this.members.filter(member => !to.find(memberId => memberId == member.uid))
    },
    members: function(to, from){
      if(this.suspended.voters){
        this.members2 = to
        .filter(member => !this.suspended.voters.find(memberId => memberId == member.uid))
      }
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'curRoom',
      'curRoomId',
      'isSuperUser',
      'uploadProgress'
    ]),
    title(){
      return `Forum | ${this.$appName}`
    },
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    canSendMessages(){
      // check if current user can send messages to current group

      let enrolled = this.getUserInfo.enrolled ? 
        this.getUserInfo.enrolled.find(electionId => electionId == this.this_group.electionId) : false

      let banned = this.suspended.voters && !!this.suspended.voters.find(memberId => memberId == this.getUser.uid)

      !enrolled ? this.text_label = 'Enroll to join the conversation' : ''
      return enrolled && !banned ? true : false
       
    },
    styleInput(){
      if(this.breakpoint.smAndDown){
        return {position:'fixed',bottom:'5px',width:'100%'}
      }else{
        return {position:'fixed',bottom:'5px',width:'calc(100% - 530px)'}
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
    styleForTabs(){
      if(this.breakpoint.smAndDown){
        return {height:'calc(100vh - 113px)'}
      }
      else{
        return {height:'calc(100vh - 91px)'}
      }
    },
    styleForTabs2(){
      if(this.breakpoint.smAndDown){
        return {height:'calc(100vh - 113px)', overflowY: 'auto'}
      }
      else{
        return {height:'calc(100vh - 91px)'}
      }
    }
    
  },

  methods: {
    
    retrieveMembers(){
      return new Promise((resolve,reject)=>{
        this.membersRef = db.collection('moreUserInfo')
        .where('enrolled','array-contains', this.this_group.electionId)
        .limit(15)
        .onSnapshot(querySnapshot=>{
          this.members = []
          querySnapshot.forEach(doc=>{
            this.members.push(doc.data())
          })
          resolve(this.members)
        },err=>{
          reject(err)
        })
      })
    },
    async getCurRoom(){
      return db.collection('elections').doc(this.curRoomId)
      .get().then(doc => {
        this.this_group = doc.data()
      })
    },
    async setCurrRoom(){
      
      if(this.curRoom){
        this.this_group = this.curRoom 
        this.chatUpdate()

        this.retrieveMembers().then(members=>{

          this.getSuspended()
          this.ready = true;
        }).catch(error=> {})

      }
      else if(this.$store.state.loading_rooms) {

      }
      else{
        this.$router.push('/home')
      }
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
        this.submit(this.$sanitize(this.message), null)
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
        let docRef = db.collection('chat_messages').doc()
        let {name, photoURL = false, email, sch=false, fac=false, dept=false, uid, is_student} = this.getUserInfo
        let onr = {
            name,
            photoURL,
            email,
            sch,
            fac,
            dept,
            uid,
            is_student
          }

        let data = {
          onr: onr,
          tstamp: Date.now(),
          body: this.$sanitize(message.trim()),
          imgs: images, // this is for the uploaded image
          docId: docRef.id,
          elecRef: this.this_group.electionId,
          reactions:{
            like: 0,
            love: 0,
            wow: 0,
            excited: 0,
            haha: 0,
            angry: 0,
          }
        }
        
        // this.$store.dispatch('saveChatMessage', data)
        
        docRef.set(data)

        this.scrollChat()
        this.clearMessage()
        // this.$eventBus.$emit('Scroll_Chat', 'data')
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
    chatUpdate(){
      
      if(this.curRoom){
        this.updateRef = db.collection('chat_messages')
        .where('elecRef','==',this.curRoom.electionId)
        .orderBy('tstamp', 'desc')
        .limit(5)
        .onSnapshot(snapshot=>{
          let msgs = []
          
          snapshot.docChanges().forEach(change =>{
            if (change.type === "added") {
                // console.log("New", change.doc.data());
                msgs.push(change.doc.data())
            }
        })

          this.offset = snapshot.docs[snapshot.docs.length - 1]

          this.$store.dispatch('updateFromDb', msgs).then(()=>{
            
            this.loading_messages = false

            setTimeout(() => {
              this.scrollChat()
            }, 1000);
          })
        })
      }
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

    
  },
  created() {
    
    this.setCurrRoom()

    this.$eventBus.$on('Toggle_drawerRight', data=>{
      this.drawerRight = data
      this.model = 'Members'
    })

  },
  beforeDestroy(){
    // console.log('before destroy')
  },
  destroyed(){
    this.updateRef ? this.updateRef() : ''
    this.membersRef ? this.membersRef() : ''
  },
  components:{
    'chatwindow': Chatwindow,
    'users': ForumUsers,
    Navigation,
    ChatMedia,
    LoadingBar,
    EmojiPicker
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
  import {firebase, db, database} from '@/plugins/firebase'
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

// .v-dialog--fullscreen{
//   background:#fff !important;
// }
.chat_home{
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  //background-color: #00aabb;
}
nav{
  margin-top:48px;
}
.v-menu>div{
  right:10px !important;
  left:initial !important;
}

.nudgeup .v-btn__content{
  margin-top:-12px;
}

/* --scrollbar --*/
.navdrawr::-webkit-scrollbar, .emoji-mart-scroll::-webkit-scrollbar {
    width: 8px;
    background-color: #87899c ;
    @include borderRadius(10px)
  }
.navdrawr::-webkit-scrollbar-track, .emoji-mart-scroll::-webkit-scrollbar-track {
  
  background-color: #ffff ;
  // @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>

