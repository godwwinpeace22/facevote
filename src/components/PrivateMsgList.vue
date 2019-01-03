<template>
  <v-card flat tile :style="styleObj">
    

    <v-list two-line dense>
        <!--v-divider inset></v-divider-->
      <v-subheader v-if="$store.getters.getUnreadPMsgs.length == 0">No recent messages</v-subheader>
      <template v-for="(item,index) in $store.getters.getUnreadPMsgs">
        <v-list-tile   avatar @click="openPrivateChatWindow(item)" :key="item.user">
          <v-list-tile-avatar>
            <img :src="item.imgSrc || `https://ui-avatars.com/api/?name=${item.name}`">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          
            <v-list-tile-sub-title>
              <span v-for="msg in item.msgs" :key="msg.timestamp">{{msg.message}}. </span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-badge color="success" left>
              <span slot="badge" class="">{{item.msgs.length}}</span>
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
    openPrivateChatWindow(user){
      this.$eventBus.$emit('Open_Private_Chat_Window', {
        uid:user.user,
        name:user.name,
        imgSrc:user.imgSrc,
        last_msg_status:user.msgs[user.msgs.length-1].status
      })
    },
  },
  components:{
    //LoadingBar,
    //PrivateChatWindow,
  },
  mounted(){
    console.log(this.$store.getters.getUnreadPMsgs)
    //this.items = this.sortMsg()
    //console.log(this.items)
  }
}
//import LoadingBar from '@/spinners/LoadingBar'
//import PrivateChatWindow from '@/components/PrivateChatWindow'
</script>
