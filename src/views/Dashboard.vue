<template>
  <v-app>
    <v-content>
      <HelloWorld/>
    </v-content>
  </v-app>
  
</template>
<script>
import io from 'socket.io-client';
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
    ],
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
    },
  },
  mounted(){
    //this.run()
  }
  
}
</script>
