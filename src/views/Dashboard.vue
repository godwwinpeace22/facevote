<template>
  <v-app>
    <v-toolbar app dark flat class="blue darken-2">
      <v-toolbar-side-icon></v-toolbar-side-icon>

      <v-toolbar-title class="white--text">FaceVote</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      
      <v-toolbar-items>
        <v-btn flat>Link Two</v-btn> 
      </v-toolbar-items>

      <v-menu transition="slide-y-transition" offset-y>
        <v-toolbar-title slot="activator">
          <v-avatar size="36" color="grey lighten-4">
            <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" alt="avatar">
          </v-avatar>
          <v-icon dark>arrow_drop_down</v-icon>
        </v-toolbar-title>
        
        <v-list>
          <v-list-tile
            v-for="item in toolbar_items"
            :key="item"
            @click=""
          >
            <v-icon right color="primary">search</v-icon>
            <v-list-tile-title v-text="item" style="margin-left:5px;"></v-list-tile-title>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile to="#">
            <v-icon right color="primary">search</v-icon>
            <v-list-tile-title style="margin-left:5px;">Help</v-list-tile-title>
          </v-list-tile>
          <v-divider></v-divider>

          <v-list-tile to="#">
            <v-icon right color="primary" >search</v-icon>
            <v-list-tile-title style="margin-left:5px;" @click="logout">Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <router-view/>
      <HelloWorld/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
  
</template>
<script>
import HelloWorld from '@/components/HelloWorld.vue'
import * as VMenu from 'vuetify/es5/components/VMenu'
import * as VCard from 'vuetify/es5/components/VCard'
import * as VAvatar from 'vuetify/es5/components/VAvatar'
import * as VDivider from 'vuetify/es5/components/VDivider'
export default {
  name:'dashboard',
  data: ()=>({
    clipped: false,
    fixed:false,
    toolbar_items: [
      'My profile', 'Settings'
    ]
  }),
  components:{
    ...VCard,
    ...VMenu,
    ...VAvatar,
    ...VDivider,
    HelloWorld
  },
  methods:{
    logout(){
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}
</script>
