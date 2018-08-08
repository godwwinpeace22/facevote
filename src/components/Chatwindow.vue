<template>
  <v-layout row>
    <v-flex d-flex>
      <v-card pa-0 id="chat_space" style="min-height:400px;overflow-y:auto;margin-bottom:1%;padding-bottom:5%;">
        <div class="chat_rectangle " id="speech_bubble" v-for="(msg,i) in $store.getters.getChatMessages" :key="i" :class=" msg.user == $store.getters.getUser.username ? 'reposition':''">
          <div class="chat_avartar"><img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" alt="avartar"></div>
          <div class="chat_content">
            <div style="width:100%;margin-top:0px;margin-bottom:0px;">
              <span class="small title" v-if="msg.user != $store.getters.getUser.username " style="margin-right:5px;">
                <a :href="'/profile/' + msg.user">{{msg.user}}</a>
              </span>
              <span v-else style="margin-right:5px;"><strong>You  </strong></span>
              <span style="font-size:.9em;color:#555;" color="grey lighten-5">  {{ msg.timestamp | moment("h:mm") }}</span>
            </div>
            <div style="width:100%;">{{msg.chat}}</div>
            <!--v-speed-dial v-model="fab" top right direction="left" open-on-hover transition="scale">
              <v-btn slot="activator"  v-model="fab" color="blue darken-2" dark fab>
                <v-icon>account_circle</v-icon>
                <v-icon>close</v-icon>
              </v-btn>
              <v-btn fab dark small color="green">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn fab  dark small color="indigo">
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn fab dark small color="red">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-speed-dial-->
          </div>
          
        </div>
          
      </v-card>
      
      
      <v-footer height="auto" fixed style="margin-left:250px;">
        <v-form @submit.prevent='submit'>
          
            <v-layout row wrap>

              <v-flex xs12>
                <v-text-field
                  v-model="message"
                  :append-icon="message ? 'attach_file' : 'photo_camera'"
                  :append-outer-icon="message ? 'send' : 'mic'"
                  :prepend-icon="icon"
                  outline
                  clear-icon="mdi-close-circle"
                  clearable
                  full-width
                  label="Message"
                  hide-details
                  type="text"
                  @click:append="toggleMarker"
                  @click:append-outer="sendMessage"
                  @click:prepend="changeIcon"
                  @click:clear="clearMessage"
                ></v-text-field>
              </v-flex>

            </v-layout>
        </v-form>
      </v-footer>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props:{
    icons:{
      type:Array
    },
    source:String
  },
data:()=>({
  password: 'Password',
    drawer: null,
    message: 'Hey!',
    msgs:[],
    basemsgs:[],
    marker: true,
    iconIndex: 0,
    menu:false,
    chat:''
    
}),
computed: {
    icon () {
      return this.icons[this.iconIndex]
    },
    
  },

  methods: {
    sameUser(msg){
      return msg.user == this.$store.getters.getUser.username
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
      this.chat.emit('chat_message', { chat:this.message,user:this.$store.getters.getUser.username, timestamp:Date.now(), room:this.$store.state.curRoom.electionId });
      //this.msgs.push({chat:this.message, user:this.$store.getters.getUser.username})
      this.$store.dispatch('saveChatMessage', {chat:this.message, user:this.$store.getters.getUser.username, timestamp:Date.now(), room:this.$store.state.curRoom.electionId})
      this.clearMessage()
    }
  },
  mounted() {
    if(this.$store.state.curRoom != null){
       let chat = io.connect('localhost:3000/chat')
      this.chat = chat // do this in order to access chat in other methods
      chat.on('connect', _=>{
        console.log('connected to server successfully')
        chat.emit('join_room', this.$store.state.curRoom.electionId)
      })
      chat.on('update_chat', (messagesFromDb) =>{ // update chat from db
        //console.log('messagesFromDb... ')
        //console.log(messagesFromDb.chat_messages)
        this.$store.dispatch('updateFromDb', messagesFromDb.chat_messages)
      })
      chat.on('chat_response', (data)=> {
        //console.log(data);
        //console.log(this.msgs)
        this.$store.dispatch('saveChatMessage', data)
      });

      
    }
    let chat_space = document.getElementById('chat_space')
    let speech_bubble = document.getElementById('speech_bubble')
    speech_bubble.scrollTop = chat_space.scrollHeight
    //console.log(chat_space)
  },
components:{
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
  ...VForm
}
}
import io from 'socket.io-client';
import api from '@/services/api'
import Settings from '@/components/Settings'
import Users from '@/components/Users'
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
</script>
<style lang="scss" scoped>
.chat_home{
  background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  //background-color: #00aabb;
}
.chat_avartar{
  width:5%;
  height: 40px;
  border-radius:5px;
  //float:left;
  //display:inline-block;
  margin-right:1%;
  float:left;
  img{
    width:100%;
    height:100%;
    border-radius:5px;
  }
}
.chat_content{
  display:inline-block;
  //background:yellow;
  width:90%;
  min-height: 40px;
}
.chat_rectangle {
  padding:5px 15px;
  margin-bottom: 5px;
	//position: relative;
	//background: #00aabb;
	text-align: left;
  text-overflow:wrap;
  width:100%;
  &:hover{
    background-color:rgb(241, 241, 241);
  }
  a{
    text-decoration:none;
    color:#00aabb;
  }
}
.speech-bubbl:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 25px solid transparent;
	border-right-color: #00aabb;
	border-left: 0;
	border-bottom: 0;
	margin-top: -12.5px;
	margin-left: -25px;
}
</style>