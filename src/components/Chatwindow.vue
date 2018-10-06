<template>
  <div>
    <v-container style="background:yello;" class="pa-0 pt-3 chat_home">
      <v-card flat pa-0 id="chat_space" style="height:75vh;margin-top:px;overflow-y:auto;background:ore;">
        <div class="chat_rectangle " id="speech_bubble" v-for="(msg,i) in $store.getters.getChatMessages" :key="i" :class=" msg.user == $store.getters.getUser.username ? 'reposition':''">
          <div class="chat_avartar"><img :src="'https://api.adorable.io/avatars/285/' + msg.user + '@adorable.png'" alt="avartar"></div>
          <div class="chat_content">
            <div style="width:100%;margin-top:0px;margin-bottom:0px;">
              <span class="small title" v-if="msg.user != $store.getters.getUser.username " style="margin-right:5px;">
                <a :href="'/#/dashboard/forum/profile/' + msg.user">{{msg.user}}</a>
              </span>
              <span v-else style="margin-right:5px;"><strong>You  </strong></span>
              <span style="font-size:.9em;color:#555;" color="grey lighten-5">  {{ msg.timestamp | moment("h:mm") }}</span>
            </div>
            <div style="width:100%;">{{msg.chat}}</div>
          </div>
          
        </div>
          
      </v-card>
    </v-container>
  </div>
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
    chat:'',
    fab:true
    
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
    
    
  },
  mounted() {
    
      
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
  ...VForm,
  ...VTextarea,
  ...VSpeedDial
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
import * as VTextarea from 'vuetify/es5/components/VTextarea'
import * as VSpeedDial from 'vuetify/es5/components/VSpeedDial'
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
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  //background-color: #00aabb;
}
.chat_avartar{
  width:40px;
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
  word-wrap: break-word;
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

/* --scrollbar --*/
.chat_home::-webkit-scrollbar {
    width: 10px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }
.chat_home::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: $mainBgColor;
  @include borderRadius(10px)
}
.chat_home::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>