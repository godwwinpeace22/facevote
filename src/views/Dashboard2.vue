<template>
  <v-app>
    <v-content>
      <!--vue-headful
        :title="title"
        :description="description"
      /-->
      <HelloWorld/>
    </v-content>
  </v-app>
  
</template>
<script>
import io from 'socket.io-client';
//import HelloWorld from '@/components/HelloWorld.vue'
export default {
  name:'dashboard',
  data: ()=>({
    title:'Dashboard | Facevote',
    description:'',
    clipped: false,
    fixed:false,
    toolbar_items: [
      'My profile', 'Settings'
    ],
  }),
  components:{
    //HelloWorld
  },
  methods:{
    logout(){
      this.$store.dispatch('logout')
      this.$router.push('/')
    },
  },
  mounted(){
    //this.run()
  },
  
}
</script>
