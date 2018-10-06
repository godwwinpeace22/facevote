<template>
  <v-layout>
      <v-flex xs12>
        <v-card>
          <v-img :src="'https://api.adorable.io/avatars/285/' + user.username + '@adorable.png'" height="200" aspect-ratio="2.75"></v-img>

          <v-card-title primary-title>
            <div>
              <h3 class="title mb-0 text-capitalize">{{user.name}}</h3>
            </div>
          </v-card-title>
          
          <v-card-actions>
            <v-btn flat outline small color="teal" dark @click="dialog = true" v-if='$store.getters.getUser.username == user.username ? true : false'>Edit Profile</v-btn>
            <v-btn flat outline small color="teal" v-else>Message</v-btn>
            <v-btn flat outline small color="teal">Explore</v-btn>
          </v-card-actions>
          <v-list dense>
            <v-list-tile v-for="i in 3" :key="i">
              <v-list-tile-content>{{user.name}}</v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <profile-settings :dialog='dialog'></profile-settings>
          </v-dialog>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>
</template>
<script>
export default {
  data: ()=>({
    dialog:false
  }),
  props:['user'],
  components:{
    ProfileSettings,
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
    this.$eventBus.$on('hide_profile_settings', _=>{
      this.dialog = false
    })
  }
}

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

