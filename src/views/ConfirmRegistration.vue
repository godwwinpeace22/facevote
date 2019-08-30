<template>
  <div>
    <v-container grid-list-xs>
      <v-layout row wrap justify-center fill-height>
        <v-flex xs12>
          {{message}}
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data:()=>({
    message:''
  }),
  async mounted(){
    try {
      let res = await api().post(`/users/confirmUser/${this.$route.params.confirmationHash}`)
      // console.log(res)
      this.message = 'Account activation successfull. You can now login'
      this.$store.dispatch('setUser', {user:res.data.user,token:res.data.token})
      //this.$store.dispatch('setLoggedInUser', res.data.user)
      this.$router.push('/')
    } catch (error) {
      //alert(error)
      this.message = 'Invalid confirmation link'
      // console.log(error)
    }
  }
}
import api from '@/services/api'
</script>
