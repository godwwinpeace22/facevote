<template>
  <div>
    <vue-headful title="Not Found"/>
    <navigation/>
    <v-container fluid fill-height id="notfound" style="min-height:84.6vh;">

      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <h1 class="text-xs-center mb-3" style="color:#333;" >Page Not Found</h1>
          <v-btn color="success" class="d-block" style="line-height:2.5" depressed
            to="/">
            Take me out of here
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>

    <footr></footr>
  </div>
</template>
<script>
export default {
  components:{
    Navigation,
    footr:Footer
  },
}
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
</script>

<style>
  #notfound{
    /*background:#042943;*/
    min-height:84vh;
    background:url('../assets/fogg-no-comments.png');
    background-size: cover;
    background-position: center;
    background-repeat:no-repeat;
  }
</style>