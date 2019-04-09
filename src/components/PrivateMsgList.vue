<template>
  <v-card flat tile :style="styleObj">
    

    <v-list two-line dense>
        <!--v-divider inset></v-divider-->
      <v-subheader v-if="$store.getters.getRecentBroadcasts.length == 0">No recent messages</v-subheader>
      <template v-for="(item,index) in $store.getters.getRecentBroadcasts">
        <v-list-tile   avatar @click="openPrivateChatWindow(item)" :key="item.user.uid">
          <v-list-tile-avatar>
            <img :src="item.imgSrc" v-if="item.user.photoURL">
            <span v-else>{{item.user.name.charAt(0)}}</span>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{item.user.name}}</v-list-tile-title>
          
            <v-list-tile-sub-title>
              <span v-for="msg in item.msgs" :key="msg.tstamp">{{msg.body}}. </span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="item.unread.length > 0">
            <v-badge color="success" left>
              <span slot="badge" class="">{{item.unread.length}}</span>
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
  computed:{
    styleObj(){
      if(this.$vuetify.breakpoint.smAndDown){
        return {
          height:'100vh'
        }
      }
    }
  },
  methods:{
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
    console.log(this.$store.getters.getRecentBroadcasts)
    //this.items = this.sortMsg()
    console.log(this.items)
  }
}
//import LoadingBar from '@/spinners/LoadingBar'
//import PrivateChatWindow from '@/components/PrivateChatWindow'
</script>
