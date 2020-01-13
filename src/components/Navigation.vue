<template>
  <v-app-bar dark dense  
    flat app clipped-right
    :color="color"
    :src="extension_img"
    :shrink-on-scroll="prominent"
    :prominent="prominent"
    fade-img-on-scroll
    style='background-color:#29648a;' 
    :extension-height="extension_height"
    :hide-on-scroll="show_extension">

    <v-btn icon @click.native="$eventBus.$emit('Toggle_Left_Drawer')">
      <v-icon >mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title v-show="$vuetify.breakpoint.width > 344">
      <slot name='title'>{{$appName}}</slot>
    </v-toolbar-title>
    <slot name="extension" slot="extension"></slot>
    <v-spacer></v-spacer>
    
    <slot name="nav_item"></slot>
    
    <!-- <v-btn color="warning" to="/campaign-pages/3">Campaign page</v-btn> -->

    <v-btn color="success" class="mt-1 mr-2"
      v-if="$vuetify.breakpoint.smAndUp && !isSuperUser" 
      @click="$router.push('/upgrade')">
      Upgrade
    </v-btn>

    <v-btn depressed color="teal lighten-2" 
      :icon="$vuetify.breakpoint.xsOnly" class="text-capitalize mt-1"
      :to="curRoom ? `/elections/${curRoom.electionId}` : ''" 
      dark exact>
      <v-icon color="" class="mr-sm-2">mdi-vote-outline</v-icon>
      <span class="hidden-xs-only">Vote</span>
    </v-btn>

    <v-menu transition="slide-y-transition" offset-y v-if="getUser">
      <template v-slot:activator="{on}">
        <v-btn text v-on="on" class="mt-1">
          <template v-if="$vuetify.breakpoint.smAndUp">
            <v-avatar size="36" :color="$helpers.colorMinder(getUser.name.charAt(0))">
              <img v-if="getUser && getUser.photoURL" :src="getUser.photoURL" alt="avatar">
              <img v-else-if="getUser.photoURL"  :src="getUser.photoURL" alt="avatar">
              <span v-else class="white--text headline text-capitalize">{{getUser.name.charAt(0)}}</span>
            </v-avatar>
            <v-icon dark>mdi-menu-down</v-icon>
          </template>
          <v-icon v-else>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      
      <v-list dense>
        <v-list-item :to="`/users/${getUser.username}`">
          <v-icon color="success">mdi-account</v-icon>
          <v-list-item-title style="margin-left:5px;">My Profile</v-list-item-title>
        </v-list-item>
        <v-list-item to="/settings">
          <v-icon color="cyan">mdi-settings</v-icon>
          <v-list-item-title style="margin-left:5px;">Settings</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="logout">
            <v-icon color="error">mdi-logout</v-icon>
          <v-list-item-title style="margin-left:5px;">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <slot name="extended_nav" slot="extension"></slot>

  </v-app-bar>
</template>
<script>
export default {
  data:()=>({
    settings_dialog: false
  }),
  props: {
    show_extension: {
      default: false,
    },
    color: {
      default: 'teal'
    },
    extension_img: {
      default: '',
    },
    shrink_on_scroll: {
      default: false,
    },
    prominent: {
      default: false,
    },
    extension_height: {
      default: '150'
    }
  },
  methods:{
    logout(){
      this.$store.dispatch('logout')
    },
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ]),
    height(){
      if(this.show_extension){

        return this.$vuetify.breakpoint.xsOnly ? '150' : '230'
      }
      else {
        return this.extension_height
      }
    }
    
  },
  components:{
    
  },
   mounted(){
    //  console.log(this.getUser)
     this.$eventBus.$on('hide_profile_settings', ()=>{
      this.settings_dialog = false
    })
    this.$eventBus.$on('show_profile_settings', ()=>{
      this.settings_dialog = true
    })
   }
}
import { mapGetters, mapState } from 'vuex'
</script>
<style lang="sass" scoped>
  
</style>
