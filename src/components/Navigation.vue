<template>
  <v-toolbar color="teal" dark flat app clipped-right style='background-color:#29648a;'>
    <v-toolbar-side-icon @click.stop="$eventBus.$emit('Toggle_Left_Drawer')"></v-toolbar-side-icon>
    <v-toolbar-title v-show="$vuetify.breakpoint.width > 344">
      <slot name='title'></slot>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn outline to="/elections/watch" dark>Vote</v-btn>

    <v-divider inset vertical class="mr-2"></v-divider>

    <v-menu transition="slide-y-transition" offset-y v-if="isAuthenticated">
      <v-toolbar-title slot="activator">
        <template v-if="$vuetify.breakpoint.smAndUp">
          <v-avatar size="36" color="grey lighten-4">
            <img v-if="getUserInfo" :src="getUserInfo.photoURL || `https://ui-avatars.com/api/?name=${getUser.displayName}`" alt="avatar">
            <img v-else  :src="getUser.photoURL || `https://ui-avatars.com/api/?name=${getUser.displayName}`" alt="avatar">
          </v-avatar>
          <v-icon dark>arrow_drop_down</v-icon>
        </template>
        <v-icon v-else>more_vert</v-icon>
      </v-toolbar-title>
      
      <v-list dense>
        <v-list-tile :to="`/users/${getUser.email}`" >
          <v-icon color="success">person</v-icon>
          <v-list-tile-title style="margin-left:5px;">My Profile</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="settings_dialog = !settings_dialog" >
          <v-icon color="success">settings</v-icon>
          <v-list-tile-title style="margin-left:5px;">Settings</v-list-tile-title>
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
    ]),
  },
}
import { mapGetters } from 'vuex'
</script>
