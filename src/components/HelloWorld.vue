<template>
  <v-app>
    <v-navigation-drawer value="true" dark width="250" fixed app v-model="drawer" floating style="background-color:#1c1f35;" class="navdrawr">  
      <v-list dense style="background-color:#1c1f35;color:bfbbbb;">
        <v-list-tile avatar :to="'/profile/' + $store.getters.getUser.username">
          <v-list-tile-avatar>
            <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title style='text-transform:capitalize;'>{{$store.getters.getUser.name || 'Mark Bezos'}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>

        <v-list-tile :to="menu.link" v-for="menu in navmenus" :key="menu.icon">
          <v-list-tile-action>
            <v-icon>{{menu.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{menu.title}}</v-list-tile-title>
        </v-list-tile>
        

        <v-list-group prepend-icon="poll" no-action value="false" >
          <v-list-tile slot="activator">
            <v-list-tile-title>Elections</v-list-tile-title>
          </v-list-tile>
          <v-list-tile  to="/dashboard/elections/create">
            <v-list-tile-action>
              <v-icon>add_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Create new election</v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="/dashboard/elections/manage">
              <v-list-tile-action>
                <v-icon>business_center</v-icon>
              </v-list-tile-action>
            <v-list-tile-title>Manage elections</v-list-tile-title>
          </v-list-tile>
          
        </v-list-group>
        <v-list-group prepend-icon="settings" no-action value="false" >
          <v-list-tile slot="activator">
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile>
          <v-list-tile  to="#3">
            <v-list-tile-action>
              <v-icon>account_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Account</v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="#1">
              <v-list-tile-action>
                <v-icon>payment</v-icon>
              </v-list-tile-action>
            <v-list-tile-title>Billing</v-list-tile-title>
          </v-list-tile>
          
        </v-list-group>

        <v-list-tile to='#2'>
          <v-list-tile-action>
            <v-icon>help</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Help</v-list-tile-title>
        </v-list-tile>
      </v-list>
      <v-spacer></v-spacer>
    </v-navigation-drawer>

    <!-- toolbar-->
    <v-toolbar app fixed flat dense dark style='background-color:#29648a;'>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>FaceVote</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      
      <v-toolbar-items>
        <v-btn flat>Vote</v-btn> 
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn flat >Watch</v-btn> 
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
            :key="item.name"
            @click=""
          >
            <v-icon right color="primary">{{item.icon}}</v-icon>
            <v-list-tile-title v-text="item.name" style="margin-left:5px;"></v-list-tile-title>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile to="#">
            <v-icon right color="primary">help</v-icon>
            <v-list-tile-title style="margin-left:5px;">Help</v-list-tile-title>
          </v-list-tile>
          <v-divider></v-divider>

          <v-list-tile to="#">
            <v-icon right color="primary" >signout</v-icon>
            <v-list-tile-title style="margin-left:5px;" @click="logout">Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <!-- main section-->
    <v-container fluid pa-0>
      <v-layout>
        <v-flex d-flex xs12 sm12>
          <v-card flat>
            
            <!-- views -->
            <router-view/>

          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-footer   dark >
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import CreateElection from '@/components/CreateElection'
import ManageElection from '@/components/ManageElection'
import * as VCard from 'vuetify/es5/components/VCard'
import * as VAvatar from 'vuetify/es5/components/VAvatar'
import * as VSubheader from 'vuetify/es5/components/VSubheader'
import * as VDivider from 'vuetify/es5/components/VDivider'
import * as VTabs from 'vuetify/es5/components/VTabs'
import * as VMenu from 'vuetify/es5/components/VMenu'
import * as VTooltip from 'vuetify/es5/components/VTooltip'
export default {
  name: 'HelloWorld',
  data:()=>({
      more: [
        'Create New Election', 'Manage Elections'
      ],
      navmenus:[
        {title:'Messages', icon:'messages', link:'/dashboard/messages'},
        {title:'Notifications', icon:'notifications', link:'/dashboard/notifications'},
        {title:'Forum', icon:'comment', link:'/dashboard/forum'},
        {title:'Enroll', icon:'camera_alt', link:'/dashboard/enroll'},
        {title:'Contest', icon:'hdr_strong', link:'/dashboard/contest'},
      ],
      toolbar_items: [
        {name:'My profile', icon:'person'},
        {name: 'Settings', icon:'settings'}
      ],
      mini:false,
      drawer:true,
      text:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur veritatis quidem, iste sequi magni recusandae eligendi voluptas ratione totam excepturi vitae expedita laboriosam vel harum, ipsam suscipit cumque reprehenderit maiores!'
  }),
  props: {
    msg: String
  },
  components:{
    'create-election':CreateElection,
    'manage-election':ManageElection,
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu
  },
  computed: {
    binding () {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) binding.column = true

      return binding
    }
  },
  methods:{
    logout(){
      this.$store.dispatch('logout')
      this.$router.push('/')
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.menu_tabs{
  .v-tabs__div{
    text-transform:capitalize
  }
  .v-list__tile{
    font-size: 14px;
  }
}
.v-content{
  background:#f7f7f7;
}
.navdrawr .v-list__tile{
  color:#bfbbbb;
}

/* --scrollbar --*/
.navdrawr::-webkit-scrollbar {
    width: 10px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }
.navdrawr::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: $mainBgColor;
  @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>
