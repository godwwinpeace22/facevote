<template>
  <div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  data: ()=> ({
    message:'FACEVOTE'
  }),
  mounted(){
    // document.getElementById('welcome_logo').style.display = 'none'
  }
}
</script>
<style lang="scss"> // using material icons offline
//src='@/assets/iconfont/material-icons.css'
// @import url('https://fonts.googleapis.com/css?family=Montserrat');
@import url('https://fonts.googleapis.com/css?family=Material+Icons');
.theme--light.v-text-field--outline .v-input__slot {
  border: 1px solid rgba(115, 114, 114, 0.54) !important;
}

html{
  overflow-y: auto;
}
</style>
