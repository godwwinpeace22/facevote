<template>
  <v-container grid-list-xl>
    <v-slide-y-transition mode="out-in">
      <v-layout v-bind="binding">
      <v-flex d-block xs12 sm4 md4 xl4 justify-center >
        <v-card >
          <v-card-text>
            <v-flex d-flex xs6 offset-xs3 >
              <v-avatar slot="activator" size="100px">
                <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" alt="Avatar">
              </v-avatar>
            </v-flex>
              <v-card-text>
                <p class="text-xs-center blue--text">Mark Bezos</p>
                <v-divider></v-divider>
                <v-subheader>About</v-subheader>
                <p class="text-xs-left">Lorem ipsum dolor sit aque maiores rem nulla ipsa facilis officiis mollitia nisi sapie</p>
                
              </v-card-text>
              <v-divider></v-divider>
              <v-flex xs12 sm4 text-xs-left>
                
              </v-flex>
              
              <v-navigation-drawer stateless value="true">
                <v-list>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Profile</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile href='#'>
                    <v-list-tile-action>
                      <v-icon>messages</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Messages</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile href='#'>
                    <v-list-tile-action>
                      <v-icon>menu</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Notifications</v-list-tile-title>
                  </v-list-tile>

                  <v-list-group prepend-icon="settings" value="true" >
                    <v-list-tile slot="activator">
                      <v-list-tile-title>Settings</v-list-tile-title>
                    </v-list-tile>

                    <v-list-group no-action sub-group value="true">
                      <v-list-tile slot="activator" >
                        <v-list-tile-title>Account</v-list-tile-title>
                      </v-list-tile>

                      <v-list-tile v-for="(admin, i) in admins" :key="i" @click="" >
                        
                        <v-list-tile-action>
                          <v-icon v-text="admin[1]"></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                      </v-list-tile>
                    </v-list-group>

                    <v-list-group sub-group no-action>
                      <v-list-tile slot="activator">
                        <v-list-tile-title>Billing</v-list-tile-title>
                      </v-list-tile>

                      <v-list-tile v-for="(crud, i) in cruds" :key="i" @click="" >
                        <v-list-tile-action>
                          <v-icon v-text="crud[1]" left></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title v-text="crud[0]"></v-list-tile-title>
                      </v-list-tile>
                    </v-list-group>
                  </v-list-group>

                  <v-list-tile href='#'>
                    <v-list-tile-action>
                      <v-icon>question</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Help</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-navigation-drawer>
              <v-spacer></v-spacer>
          </v-card-text>
        </v-card>
      </v-flex>
      

      <!-- tabs section-->
      <v-flex d-block xs12 sm8 md8 xl8>
        <v-card>
          <v-tabs color="grey darken-1" dark class="menu_tabs">
            <v-tabs-slider color="orange"></v-tabs-slider>
            <v-tab href="#tab-1">Feed</v-tab>
            <v-tab href="#tab-2">News</v-tab>

            <v-tab href="#tab-3">Forum</v-tab>

            <v-tab href="#tab-4">Enroll</v-tab>
            <v-tab href="#tab-5">Contest</v-tab>
            <v-tab href="#tab-6">Watch</v-tab>
            <v-tab href="#tab-7" >Vote</v-tab>
            <v-menu bottom class="v-tabs__div" left offset-y transition="slide-y-transition">
              <a slot="activator" class="v-tabs__item white--text">
                Elections
                <v-icon>arrow_drop_down</v-icon>
              </a>

              <v-list >
                <v-list-tile >
                  <v-tab href='#tab-8'>{{more[0]}}</v-tab>
                </v-list-tile>
                <v-list-tile href="#tab-9">
                  <v-tab>{{more[1]}}</v-tab>
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-tab-item v-for="i in 7" :id="'tab-' + i" :key="i">
              <v-card flat>
                <v-card-text>{{ text + i}}</v-card-text>
                <div style="height:1000px;background:cyan;"></div>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tab-8">
              <v-card flat>
                <v-card-text>{{ text}}</v-card-text>
                <div style="height:1000px;background:orange;"></div>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
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
      text:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur veritatis quidem, iste sequi magni recusandae eligendi voluptas ratione totam excepturi vitae expedita laboriosam vel harum, ipsam suscipit cumque reprehenderit maiores!'
  }),
  props: {
    msg: String
  },
  components:{
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
  background:#efefef;
}

</style>
