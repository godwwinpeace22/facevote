<template>
  <v-card flat tile :style="styleObj" height="500" style="overflow-y: hidden;">

    <v-toolbar color="cyan" dark dense card flat>
      <v-toolbar-side-icon @click="drawer = !drawer" v-if="!read && $vuetify.breakpoint.smAndDown"></v-toolbar-side-icon>
      <v-btn flat icon
        v-if="read && $vuetify.breakpoint.smAndDown"
        @click="read = false">
        <v-icon>
          chevron_left
        </v-icon>
      </v-btn>
      <v-toolbar-title>Inbox</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$eventBus.$emit('ToggleInboxDialog', false)">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    

    <v-navigation-drawer v-if="$vuetify.breakpoint.smAndDown" v-model="drawer" hide-overlay absolute left class="mt-5" width="150">
     <v-btn color="secondary lighten-2" depressed @click="$eventBus.$emit('Toggle_New_Broadcast', true)">
       <v-icon class="mr-2">add</v-icon>
       Compose</v-btn>

      <v-list dense class="pt-0">
        <v-list-tile v-for="item in items" :key="item.title" @click="switchMode(item.title)">
          <v-list-tile-action>
            <v-icon :color="mode == item.title ? 'orange' : ''">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    
    <v-container grid-list-xs class="pa-0 px-1">
      <v-layout row wrap>
        <v-flex sm1 shrink class="grey lighten-4" v-if="$vuetify.breakpoint.mdAndUp">
          
          <v-btn small color="ml-3 success lighten-2" icon @click="$eventBus.$emit('Toggle_New_Broadcast', true)">
            <v-icon class="">add</v-icon>
          </v-btn>

            <v-list dense class="ml-1 pt-0 grey lighten-4">
              <v-list-tile v-for="(item, i) in items" :key="'item' + i" @click="switchMode(item.title)">
                <v-list-tile-action>
                  <v-icon :color="mode == item.title ? 'orange' : ''">{{ item.icon }}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile avatar>
                <v-list-tile-title>{{mode}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
        </v-flex>
        
        <!-- LIST -->
        <v-flex xs12 sm12 md4 
          style="border-right: 1px solid #eee;" 
          :class="{'hidden-sm-and-down': read}"
        >
          <v-text-field class="px-2" solo flat style="border-bottom: 1px solid #eee"
            name="name" color="secondary"
            label="Search"
            hide-details
          ></v-text-field>
          <v-card flat tile :height="$vuetify.breakpoint.smAndUp ? '400' : ''">
            
            <v-list two-line dense >
              <v-subheader v-if="getRecentBroadcasts[mode] && getRecentBroadcasts[mode].length == 0">
                {{mode == 'inbox' ? 'No recent messages' : 'No Messages'}}
              </v-subheader>
              
              <template v-if="mode == 'inbox'">

                <template v-for="(item,index) in getRecentBroadcasts.inbox">
                  <v-list-tile :class="{'selected': selected.onr == item.onr}" ripple  avatar @click="selectItem(item)" :key="index + 'inbox'">
                    <v-list-tile-avatar :color="item.onr.photoURL ? '' : $helpers.colorMinder(item.onr.name.charAt(0))">
                      <img :src="item.onr.photoURL" v-if="item.onr.photoURL">
                      <span v-else class="white--text">{{item.onr.name.charAt(0)}}</span>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title class="text-capitalize">{{item.onr.name}}</v-list-tile-title>
                    
                      <v-list-tile-sub-title>
                        <span v-for="(msg, i) in item.msgs" :key="i + 'msg'">{{msg.body}}. </span>
                      </v-list-tile-sub-title>

                    </v-list-tile-content>
                    <v-list-tile-action v-if="item.unread.length > 0 && mode == 'inbox'">
                      <v-badge color="success" left>
                        <span slot="badge" class="">{{item.unread.length}}</span>
                      </v-badge>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider :key="index + 'dividr'"></v-divider>
                </template>

              </template>

              <template v-if="mode == 'sent'">

                <template v-for="(item,index) in getRecentBroadcasts.sent">
                  <v-list-tile :class="{'selected': selected == item}" ripple  avatar @click="selectItem(item)" :key="index + 'sent'">
                    <v-list-tile-avatar :color="item.onr.photoURL ? '' : $helpers.colorMinder(item.onr.name.charAt(0))">
                      <img :src="item.onr.photoURL" v-if="item.onr.photoURL">
                      <span v-else class="white--text">{{item.onr.name.charAt(0)}}</span>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title class="text-capitalize">{{item.onr.name}}</v-list-tile-title>
                    
                      <v-list-tile-sub-title>
                        <span >{{item.body}}</span>
                      </v-list-tile-sub-title>

                    </v-list-tile-content>

                  </v-list-tile>
                  <v-divider :key="index + 'dv'"></v-divider>
                </template>

              </template>
            </v-list>
          </v-card>
        </v-flex>

        <!-- MAIN -->
        <v-flex sm12 md7 :class="{'hidden-sm-and-down': !read}">
          <v-card flat tile style="overflow: auto;" :height="$vuetify.breakpoint.smAndUp ? '450' : ''">
            <v-subheader v-if="!selected">Select a message</v-subheader>

            <template v-if="selected">
              <v-list two-line dense>
                <v-list-tile avatar @click="$eventBus.$emit('ViewProfile', selected.onr)">
                  <v-list-tile-avatar :color="selected.onr.photoURL ? '' : $helpers.colorMinder(selected.onr.name.charAt(0))">
                    <img :src="selected.onr.photoURL" v-if="selected.onr.photoURL">
                    <span v-else class="white--text">{{selected.onr.name.charAt(0)}}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title class="text-capitalize"> {{selected.onr.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>Dept. of {{selected.onr.dept}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-divider></v-divider>

              <v-card-text>
                
                <template v-if="mode == 'sent'">
                  <v-card class="round my-3 grey lighten-4" flat>
                    <v-card-text>
                      {{selected.body}}
                      <div class="font-weight-light">{{$helpers.parseDate(selected.tstamp)}}</div>
                    </v-card-text>
                  </v-card>
                </template>

                <template v-if="mode == 'inbox'">

                  <div v-for="(msg, i) in selected.msgs" :key="i + 'selectd'">
                    <div v-if="divide(msg.tstamp, selected.msgs[i-1])" class="time_divider">
                      {{divide(msg.tstamp, selected.msgs[i-1])}}
                    </div>
                    <v-card class="round my-3 grey lighten-4" flat>
                      <v-card-text>
                        {{msg.body}}
                        <div class="font-weight-light">{{$helpers.parseDate(msg.tstamp)}}</div>
                      </v-card-text>
                    </v-card>
                  </div>
                </template>

              </v-card-text>
            </template>
          </v-card>
          
        </v-flex>

      </v-layout>
    </v-container>

  </v-card>
</template>
<script>
export default {
  data:()=>({
    drawer: null,
    read: false,
    selected: '',
    mode: 'inbox'
  }),
  computed:{
    styleObj(){
      if(this.$vuetify.breakpoint.smAndDown){
        return {
          height:'100vh'
        }
      }
    },
    items(){
      return [
        {icon: 'inbox', title: 'inbox', color: 'purple'},
        {icon: 'send', title: 'sent', color: 'success'},
        {icon: 'star', title: 'Stared', color: 'purple'},
      ]
    },
    ...mapState([
      'curRoom',
      'isSuperUser'
    ]),
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getRecentBroadcasts'
    ])
  },
  methods:{
    selectItem(item){
      this.selected = item
      // console.log(this.selected)
      this.read = true
      this.$store.dispatch('setLastReadTime', item.onr.uid)
    },
    switchMode(mode){
      this.mode = mode
      // console.log(mode,this.mode)
    },
    divide(timestamp,prev){
      timestamp = typeof timestamp == 'object' ? timestamp.toMillis() : timestamp
      let options = {year: 'numeric', month: 'numeric', day: 'numeric' };
      let then = new Date(timestamp)
      let that_day = then.toLocaleString("en-US",options)
      let that_day2 = then.toLocaleString('en-Us', {
          year:'numeric', month:'short', weekday:'short', day:'numeric'
        })

      if(prev && prev.tstamp){
        // for msg other than the first. If the previous date is same as the cur date return false
        if((new Date(prev.tstamp)).toLocaleString("en-US", options) == that_day){
          return false
        }
        else{
          // else return true (the previous date is different from the cur date, hence its another day)
          let today = new Date()
          if((new Date()).toLocaleString('en-Us',options) == that_day){
            return 'Today'
          }
          // showing 'yesterday'
          else if(Date.now() - timestamp <= 2* 24 * 60 * 60 * 1000){
            return 'Yesterday'
          }
          // showing other days
          else{
            return that_day2
          }
          
          
        }
      }
      else{ // for the very first msg
        // if today's date is same with message's date return 'today' else show that date
        return (new Date()).toLocaleString('en-Us',options) == that_day ? 'Today' : that_day2
      }
    },
    openPrivateChatWindow(item){
      this.$eventBus.$emit('Open_Private_Chat_Window', {
        user: item.user,
        msgs: item.msgs,
        // last_msg_status: item.msgs[item.msgs.length-1].status
      })
    },
  },
  components:{
    //LoadingBar,
    //PrivateChatWindow,
  },
  mounted(){
    // console.log(this.getRecentBroadcasts, 1 > undefined)
    //this.items = this.sortMsg()
    // console.log(this.items)
  }
}
//import LoadingBar from '@/spinners/LoadingBar'
import {mapState, mapGetters} from 'vuex'
</script>
<style>
  .selected {
    border-left: 3px solid orange;
  }
  .broadcast_msg{
    background: aliceblue;
    padding: 5px;
  }
</style>
