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
  })
}
</script>
<style lang="scss" src='@/assets/iconfont/material-icons.css'> // using material icons offline
//src='@/assets/iconfont/material-icons.css'
.theme--light.v-text-field--outline .v-input__slot {
  border: 1px solid rgba(115, 114, 114, 0.54) !important;
}
</style>
