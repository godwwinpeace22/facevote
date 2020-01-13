<template>
  <div style="overflow:hidden;" class="navdrawr">
    <vue-headful
      :title="title"
    />
    <navigation>
      <span slot="title">{{'Forum'}}</span>

      <v-spacer></v-spacer>

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

    <loading-bar v-if="!showUi">
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
              <chatwindow 
                :members='members' 
                :loading_messages="loading_messages">
              </chatwindow>
              <!-- Textarea -->

            </div>

          </v-col>
          <v-col cols="12" class="py-0">
            <div v-if="showUi" >
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

                  <v-btn icon @click="imageDialog = true"
                    v-show="!message" slot="prepend-inner">
                    <v-icon color="success">mdi-camera</v-icon>
                  </v-btn>

                    <v-dialog
                      v-model="imageDialog"
                      persistent :overlay="false"
                      max-width="500px" slot="prepend-inner"
                      transition="dialog-transition"
                    >

                      <v-card flat>
                        <v-card-title >
                          Upload image
                        </v-card-title>
                        <v-card-text>
                          <v-file-input
                            v-model="files"
                            color="deep-purple accent-4"
                            counter accept="image/png,image/jpeg,image/jpg,image/gif"
                            label="File input" multiple
                            placeholder="Select your files"
                            prepend-icon="" :disabled="uploading"
                            append-icon="mdi-paperclip"
                            outlined :show-size="1000"
                          >
                            <template v-slot:selection="{ index, text }">
                              <v-chip
                                v-if="index < 2"
                                color="deep-purple accent-4"
                                dark label small
                              >
                                {{ text }}
                              </v-chip>

                              <span
                                v-else-if="index === 2"
                                class="overline grey--text text--darken-3 mx-2"
                              >
                                +{{ files.length - 2 }} File(s)
                              </span>
                            </template>
                          </v-file-input>
                          <v-text-field
                            name="images_caption"
                            label="Write a caption"
                            v-model="images_caption"
                          ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="" :disabled="uploading" 
                            depressed @click="imageDialog = false">
                            Cancel</v-btn>
                          <v-btn color="primary" depressed 
                            @click="uploadImages" :loading="uploading"
                            :disabled="!files">
                            Upload</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  
                
                  <!-- EMOJIS DIALOG-->
                  <v-menu max-width="300" :close-on-content-click='false'
                    slot="prepend-inner" max-height="500" top offset-y v-model="emoji_dialog">
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
                        <span color="success" tooltip
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
      </v-col>

      <v-col md="3"
        v-if="$vuetify.breakpoint.mdAndUp">
        <router-view 
          :members='members' 
          v-if="showUi" 
        >
        </router-view>
      </v-col>
    </v-row>

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
    showUi: false,
    loading_messages: true,
    message: "",
    imageDialog: false,
    images_caption: '',
    files: null,
    uploading: false,
    mention_dialog: false,
    emoji_dialog: false,
    file_dialog: false,
    carousel_dialog: false,
    snackbar: {},
    blob_urls: [],
    menu: false,
    members: [],
    members2: [],
    suspended: [], // suspended voters and contestants
    updateRef: '', // stop listening for updates
    membersRfef: '', // stop listening for updates
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

        this.loading_messages = false

        setTimeout(() => {
          this.scrollChat()
        }, 1000);

        await this.retrieveMembers()

        // this.getSuspended()
        this.showUi = true;
        

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
        .on(async (data, k) => {
          
          console.log({data, k})

          let m = await this.$gun.get('users').get(k).then()
          // console.log({m})
          members.push(data)
          
          // members.push(data)
        })

      // console.log({members})
      this.members = members
    },
    async uploadImages(){
      try {

        this.uploading = true
        // let uploaded = await this.$helpers.uploadImage(this.files, this.cloudinary)
        let uploaded = await this.$helpers.uploadMedia({
          files: this.files
        })

        this.uploading = false
        this.imageDialog = false
        this.submit(this.$sanitize(this.images_caption), uploaded)
        
      } catch (error) {
        this.imageDialog = false
        this.uploading = false
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
      this.images_caption = ''
      this.file = null
      this.imgSrc = ''
    },
    async submit(message,images){
      try{

        console.log('forumId: ', this.forumId)

        let body = down(message)
        let docId = this.$uuidv4()

        let chat_data = {
          author: this.getUser.username,
          date_created: Date.now(),
          body: body,
          docId: docId,
          elecRef: this.forumId,
          reactions:{}
        }

        let chat_message = this.$gun.get('chat_messages')
          .get(this.forumId)
          .get(docId)
          .put(chat_data)

        if(images && images.length > 0){
          
          // add images
          images.forEach(u => {
            
            chat_message.get('imgs').set(u)
            
          })
        }
        
        this.scrollChat()
        this.clearMessage()

      }
      catch(err){
        // console.log(err)
      }
    },
    appendUser(member){
      // console.log(member)
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
      // get suspended members
      
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
    LoadingBar,
    EmojiPicker,
    Conversations
    // Picker,
  }
}

import {mapGetters, mapState} from 'vuex'
  import ForumUsers from '@/components/forum/ForumUsers'
  import Chatwindow from '@/components/forum/Chatwindow'
  import Navigation from '@/components/Navigation'
  import LoadingBar from '@/spinners/LoadingBar'
  import EmojiPicker from '@/components/emojis/EmojiPicker'
  import Conversations from "@/components/forum/Conversations";
  import down from 'msgdown'
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

