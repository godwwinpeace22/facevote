<template>
  <div>
    <v-toolbar dense flat>
      <v-btn icon to="/dashboard/forum">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout>
      <v-flex xs12 px-2>
        <v-card flat>
          <v-img :src="'https://api.adorable.io/avatars/285/' + user.username + '@adorable.png'" height="200" aspect-ratio="2.75"></v-img>

          <v-card-title primary-title>
            <div>
              <h3 class="title mb-0 text-capitalize">{{user.name}}</h3>
            </div>
          </v-card-title>
          
          <v-card-actions>
            <v-btn flat outline small color="teal" dark @click="dialog = true" v-if='$store.getters.getUser.username == this.username ? true : false'>Edit Profile</v-btn>
            <v-btn flat outline small color="teal" v-else>Message</v-btn>
            <v-btn flat outline small color="teal">Explore</v-btn>
          </v-card-actions>
          <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <profile-settings :dialog='dialog'></profile-settings>
          </v-dialog>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  data:()=>({
    drawerRight: true,
    right: null,
    left: null,
    right_sidebar:true,
    user:'',
    dialog:false,
    notifications: false,
    sound: true,
    widgets: false,
  }),
  props:['username'],
  methods:{
    extractUser(username){ // lets the get this user from the list of regVoters
      let users = this.$store.state.curRoom.regVoters
      let user = users.filter(item=> item.username == username)
      this.user = user[0]
    },
    isAccOwner(){
      return this.$store.getters.getUser.username == this.username ? true : false
    }
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.extractUser(to.params.username)
    }
  },
  components:{
    'profile-settings':ProfileSettings,
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu,
    ...VImg,
    ...VDialog
  },
  mounted(){
    //let username = this.$route.params
    this.extractUser(this.username)
    this.$eventBus.$on('hide_profile_settings', _=>{
      this.dialog = false
    })
  }
}

import CreateElection from '@/components/CreateElection'
import ManageElection from '@/components/ManageElection'
import Settings from '@/components/Settings'
import Users from '@/components/Users'
import Profile from '@/components/Profile'
import ProfileSettings from '@/components/ProfileSettings'
import * as VCard from 'vuetify/es5/components/VCard'
import * as VAvatar from 'vuetify/es5/components/VAvatar'
import * as VSubheader from 'vuetify/es5/components/VSubheader'
import * as VDivider from 'vuetify/es5/components/VDivider'
import * as VTabs from 'vuetify/es5/components/VTabs'
import * as VMenu from 'vuetify/es5/components/VMenu'
import * as VTooltip from 'vuetify/es5/components/VTooltip'
import * as VImg from 'vuetify/es5/components/VImg'
import * as VDialog from 'vuetify/es5/components/VDialog'
</script>
<style lang="scss" scoped>

</style>

