<template>
  <div>
    <v-toolbar style="background:#042943;"  flat dark>
      <v-toolbar-title class="white--text" >FaceVote</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat to="/login">Login</v-btn> 
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn flat to="/signup">Sign Up</v-btn> 
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>
<script> 
import Nav from '@/components/Nav'
export default {
  data:()=>({

  }),
  components:{
    'toolbar':Nav
  }
}
</script>
