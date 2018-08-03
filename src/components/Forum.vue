<template>
<v-app>
  <v-card>
    <!--v-btn flat icon @click.stop="drawer = !drawer"><v-icon>menu</v-icon></v-btn-->
  
    <v-toolbar color="cyan" dark flat dense>
      <v-btn dark icon v-show="toshow > 0" @click="toshow--">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>{{toolbarStatus}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!--v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon-->
      <v-menu bottom left transition="slide-y-transition">
        <v-btn slot="activator" dark icon>
          <v-icon>menu</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile @click="toshow = 2">
            <v-list-tile-title>Group info</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="toshow = 3">
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
      <v-container fluid fill-height v-show="toshow == 0 || toshow == 1" style="min-height:400px" justify-start>
        <v-layout v-if='toshow == 0'>
          
          <v-flex xs12 >
            <p>Your connected groups</p>
            <v-list>
              <v-list-tile @click="toshow = 1; openchat(contest.electionRef)" v-for='contest in rooms' :key="contest._id">
                <v-list-tile-title>{{contest.electionRef.title}}</v-list-tile-title>
              </v-list-tile>
              
            </v-list>
            
          </v-flex>
        </v-layout>
        <chatwindow  v-if="toshow != 0" v-show="toshow == 1" :icons='icons'></chatwindow>
      </v-container>
      <v-container fluid  v-show="toshow == 2">
        <users></users>
      </v-container>
      <v-container v-show="toshow == 3">
        <settings></settings>
      </v-container>
    <v-footer color="cyan" >
      <v-spacer></v-spacer>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
    </v-card>
  </v-app>
</template>
<script>
export default {
  data:()=>({
    password: 'Password',
      drawer: null,
      marker: true,
      iconIndex: 0,
      menu:false,
      regElec:[],
      rooms:[],
      toshow:0,
      icons: [
      'mood',
      'mood_bad',
      'sentiment_satisfied',
      'sentiment_dissatisfied',
      'sentiment_very_dissatisfied',
      'sentiment_very_satisfied',
      'sentiment_neutral'
    ],
  }),
  props:{
    source:String
  },
  computed: {
      toolbarStatus(){
        return this.toshow == 2 ? '42 participants' : 
        this.toshow == 3 ? 'Settings': 
        this.toshow == 1 ? this.$store.state.curRoom.title : 'Your groups'
      }
      
    },

    methods: {
      // opens the chat window on select
      openchat(room){
        //store the roomId
        console.log(room)
        this.$store.dispatch('curRoom', room) // roomId same as the selected election electionId
        // then open up the chat
        this.toshow = 1
      },
      backbutton(){
        
      }
    },
    async mounted() {
      
      
      // get the elections the user registered for(this doesn't actually get that for now. it will be implemented when enroll is completed)
      // its like the chat is for only those who have contested in elections before
      try {
        let res = await api().get(`dashboard/getElections/${this.$store.getters.getUser._id}/${this.$store.getters.getToken}`)
        this.rooms = res.data.contested
        //res.data.created.forEach(arr=>{
          //this.items.push(arr.electionId)
        //})
        console.log(res)
      } catch (error) {
        console.log(error)
      }
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
    ...VForm
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
import ChatwindowVue from './Chatwindow.vue';
</script>
<style lang="scss" scoped>
.chat_home{
  background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  //background-color: #00aabb;
}
</style>

