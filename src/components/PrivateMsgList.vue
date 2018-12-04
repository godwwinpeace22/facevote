<template>
  <v-card flat tile>
    <v-toolbar color="cyan" dark dense>
      <!--v-toolbar-side-icon></v-toolbar-side-icon-->

      <v-toolbar-title>Inbox</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list two-line dense>
        <!--v-divider inset></v-divider-->
      <v-subheader v-if="items.length == 0">No recent messages</v-subheader>
      <template v-for="(item,index) in items">
        <v-list-tile   avatar @click="openPrivateChatWindow(item)" :key="item.user">
          <v-list-tile-avatar>
            <img :src="item.imgSrc || `https://ui-avatars.com/api/?name=${item.name}`">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{item.name || item.user}}</v-list-tile-title>
          
            <v-list-tile-sub-title>
              <span v-for="msg in item.msgs" :key="msg.timestamp">{{msg.message}}. </span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-badge color="success" left>
              <span slot="badge" class="">{{getUnreadMsgLength(item)}}</span>
            </v-badge>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider inset :key="index "></v-divider>
      </template>
    </v-list>
  </v-card>
</template>
<script>
export default {
  data:()=>({
    items: [],
  }),
  methods:{
    openPrivateChatWindow(user){
      this.$eventBus.$emit('Open_Private_Chat_Window', {
        username:user.user,
        name:user.name,
        imgSrc:user.imgSrc,
        last_msg_status:user.msgs[user.msgs.length-1].status
      })
    },
    getUnreadMsgLength(item){ // returns the number of unread msgs for each user's msg
      return item.msgs ? item.msgs.filter(
        msg => msg.status == 'unread'
      ).length : ''
    },
    sortMsg(){
      let myArr = []
      let track = []

      // get the recent_private_messages from the store and map each user to all his messages
      for(let item of this.$store.state.recent_private_messages){
        let msgs = this.$store.state.recent_private_messages.filter(msg=>{
          return msg.from == item.from
        })
        track.indexOf(item.from) == -1 ? myArr.push({
          user:item.from,
          name:item.name,
          imgSrc:item.imgSrc,
          msgs:msgs
        }) : ''
        track.push(item.from)
      }
      return myArr
    }
  },
  components:{
    LoadingBar,
    PrivateChatWindow,
  },
  mounted(){
    //console.log(this.sortMsg())
    this.items = this.sortMsg()
    console.log(this.items)
  }
}
import LoadingBar from '@/spinners/LoadingBar'
import PrivateChatWindow from '@/components/PrivateChatWindow'
</script>
