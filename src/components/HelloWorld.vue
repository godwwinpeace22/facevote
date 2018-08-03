<template>
  <v-container grid-list-xl>
    <v-slide-y-transition mode="out-in">
      <v-layout  v-bind="binding" mt-3>
        <v-card  style="margin-top:10px; max-height:750px;">
          <v-navigation-drawer  stateless value="true" :mini-variant="mini" width="400" >
            <v-btn icon @click.stop="mini = !mini" v-if="!mini" style="position:relative;left:240px;">
              <v-icon>menu</v-icon>
            </v-btn>
              <v-flex d-flex xs6 offset-xs3 v-if="!mini">
                <v-avatar slot="activator" size="100px">
                  <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" alt="Avatar">
                </v-avatar>
              </v-flex>
                <v-card-text v-if="!mini">
                  <p class="text-xs-center blue--text">{{$store.getters.getUser.username || 'Mark Bezos' }} </p>
                  <v-divider></v-divider>
                  <v-subheader>About</v-subheader>
                  <p class="text-xs-left">Lorem ipsum dolor sit aque maiores rem nulla ipsa facilis officiis mollitia nisi sapie</p>
                  
                </v-card-text>
                <v-divider></v-divider>  
                  <v-list>
                    <v-list-tile v-if="mini" @click.stop="mini = !mini">
                      <v-list-tile-action>
                        <v-icon>chevron_right</v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile avatar v-if="mini">
                      <v-list-tile-avatar>
                        <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460">
                      </v-list-tile-avatar>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-icon>home</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Profile</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile to='#5'>
                      <v-list-tile-action>
                        <v-icon>messages</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Messages</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile to='#4'>
                      <v-list-tile-action>
                        <v-icon>notifications</v-icon>
                      </v-list-tile-action >
                      <v-list-tile-title>Notifications</v-list-tile-title>
                    </v-list-tile>

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
        </v-card>
      <!-- tabs section-->
      <v-flex d-block xs12 sm12>
        <v-card>
          <v-tabs color="grey darken-1" dark class="menu_tabs">
            <v-tabs-slider color="orange"></v-tabs-slider>
            <v-tab to="/dashboard/feed">Feed</v-tab>
            <v-tab to="/dashboard/news">News</v-tab>

            <v-tab to="/dashboard/forum">Forum</v-tab>

            <v-tab to="/dashboard/enroll">Enroll</v-tab>
            <v-tab to="/dashboard/contest">Contest</v-tab>
            <v-tab to="/dashboard#">Watch</v-tab>
            <v-tab to="/dashboard#" >Vote</v-tab>
            <v-menu bottom class="v-tabs__div" left offset-y transition="slide-y-transition">
              <a slot="activator" class="v-tabs__item white--text">
                Elections
                <v-icon>arrow_drop_down</v-icon>
              </a>

              <v-list >
                <v-list-tile >
                  <v-tab to="/dashboard/elections/create">{{more[0]}}</v-tab>
                </v-list-tile>
                <v-list-tile>
                  <v-tab to="/dashboard/elections/manage">{{more[1]}}</v-tab>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-tabs>
          
        </v-card>
        <!-- views -->
          <router-view/>
      </v-flex>
    </v-layout>
    </v-slide-y-transition>
  </v-container>
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
      admins: [
        ['Management', 'people_outline'],
        ['Settings', 'settings']
      ],
      cruds: [
        ['Create', 'add'],
        ['Read', 'insert_drive_file'],
        ['Update', 'update'],
        ['Delete', 'delete']
      ],
      mini:false,
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
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
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

</style>
