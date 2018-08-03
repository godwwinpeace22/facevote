<template>
  <v-layout justify-center>
    <v-flex text-xs-right >
      <v-container style="height:400px;overflow-y:auto;background:grey;margin-bottom:40px;">
        <div class="speech-bubble white--text" v-for="(msg,i) in $store.getters.getChatMessages" :key="i" :class=" msg.user == $store.getters.getUser.username ? 'reposition':''">
          <span class="small" v-if=" msg.user != $store.getters.getUser.username">
            <a :href="'/profile/' + msg.user">~{{msg.user}}</a>
          </span>
          <p >{{msg.chat}}</p>
          <span>{{msg.time}}</span>
        </div>
      </v-container>
      
      
      <v-footer height="auto" absolute>
        <v-form @submit.prevent='submit'>
          <v-container>
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
          </v-container>
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
      this.chat.emit('chat_message', { chat:this.message,user:this.$store.getters.getUser.username,time:this.$moment().format("dddd, h:mm a"), room:this.$store.state.curRoom.electionId });
      //this.msgs.push({chat:this.message, user:this.$store.getters.getUser.username})
      this.$store.dispatch('saveChatMessage', {chat:this.message, user:this.$store.getters.getUser.username, time:this.$moment().format("dddd, h:mm a"), room:this.$store.state.curRoom.electionId})
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

      chat.on('chat_response', (data)=> {
        console.log(data);
        //console.log(this.msgs)
        this.$store.dispatch('saveChatMessage', data)
      });

      chat.on('a message', (data) =>{
        console.log(data)
      })
    }
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
.reposition{
  position: relative !important;
  left:370px !important;
}
.reposition:after {
	content: '' !important;
	position: absolute !important;
	right: 0 !important;
	top: 50% !important;
	width: 0 !important;
	height: 0 !important;
	border: 20px solid transparent !important;
	border-left-color: #00aabb !important;
	border-right: 0 !important;
	border-bottom: 0 !important;
	margin-top: -10px !important;
	margin-right: -20px !important;
}
.speech-bubble {
  //height: 100px;
  width:150px;
  border-radius: 10px !important;
  position:relative;
  top: 5%;
  left:5%;
  margin-bottom: 5px;
	position: relative;
	background: #00aabb;
	text-align: left;
  text-overflow:wrap;
}
.speech-bubble:after {
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