<template>
  <v-toolbar color="teal" dark flat app clipped-right style='background-color:#29648a;'>
    <v-toolbar-side-icon @click.stop="$eventBus.$emit('Toggle_Left_Drawer')"></v-toolbar-side-icon>
    <v-toolbar-title v-show="$vuetify.breakpoint.width > 344">
      <slot name='title'></slot>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    
    <slot name="nav_item"></slot>

    <v-btn outline icon :to="curRoom ? `/elections/vote` : ''" 
      dark class="hidden-xs-only" exact>
      <v-icon>how_to_vote</v-icon>
    </v-btn>

    <v-divider inset vertical class="mr-2"></v-divider>

    <v-menu transition="slide-y-transition" offset-y v-if="isAuthenticated">
      <v-toolbar-title slot="activator">
        <template v-if="$vuetify.breakpoint.smAndUp">
          <v-avatar size="36" color="grey lighten-4">
            <img v-if="getUserInfo && getUserInfo.photoURL" :src="getUserInfo.photoURL" alt="avatar">
            <img v-else-if="getUser.photoURL"  :src="getUser.photoURL" alt="avatar">
            <v-avatar v-else color="success" size="38">
              <span class="white--text headline">{{getUser.displayName.charAt(0)}}</span>
            </v-avatar>
          </v-avatar>
          <v-icon dark>arrow_drop_down</v-icon>
        </template>
        <v-icon v-else>more_vert</v-icon>
      </v-toolbar-title>
      
      <v-list dense>
        <v-list-tile :to="`/users/${getUser.email}`">
          <v-icon color="success">person</v-icon>
          <v-list-tile-title style="margin-left:5px;">My Profile</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="settings_dialog = !settings_dialog" >
          <v-icon color="success">settings</v-icon>
          <v-list-tile-title style="margin-left:5px;">'Settings</v-list-tile-title>
        </v-list-tile>

        <v-divider></v-divider>

        <v-list-tile to="#">
          <v-icon color="primary">help</v-icon>
          <v-list-tile-title style="margin-left:5px;">Help</v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>

        <v-list-tile @click="logout">
            <v-icon color="error">exit_to_app</v-icon>
          <v-list-tile-title style="margin-left:5px;">Logout</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <slot name="extended_nav" slot="extension"></slot>

    <!-- SETTINGS DIALOG -->
    <v-dialog v-model="settings_dialog" lazy scrollable fullscreen hide-overlay :transition="$vuetify.breakpoint.xsOnly ? 'slide-x-transition' : 'dialog-bottom-transition'">
      <profile-settings :dialog='settings_dialog' v-if="settings_dialog"></profile-settings>
    </v-dialog>

  </v-toolbar>
</template>
<script>
export default {
  data:()=>({
    settings_dialog:false
  }),
  methods:{
    logout(){
      this.$store.dispatch('logout')
    },
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'getToken',
      'getUser',
      'getUserInfo',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ]),
    
  },
  components:{
    ProfileSettings,
  },
   mounted(){
     this.$eventBus.$on('hide_profile_settings', ()=>{
      this.settings_dialog = false
    })
    this.$eventBus.$on('show_profile_settings', ()=>{
      this.settings_dialog = true
    })
   }
}
import { mapGetters, mapState } from 'vuex'
import ProfileSettings from '@/components/ProfileSettings'
</script>
<style lang="sass" scoped>
  
</style>
