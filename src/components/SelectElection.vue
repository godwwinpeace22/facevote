<template>
  <v-container grid-list-xl>
    <vue-headful
      :title="title"
    />
    <v-subheader>Select an election to watch</v-subheader>
    <v-layout row wrap >
      <v-flex xs6 sm4 d-flex v-for='election in elections' :key="election._id" >
        <v-card color="" class="" height="" :to="'/elections/watch/' + election.electionId">
          <v-layout row>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div class=""><strong>{{election.title}}</strong></div>
                  <div>Registerd voters:</div>
                  <div>({{election.regVoters.length}})</div>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs5>
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                height="125px"
                contain
              ></v-img>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-3">
            Follow this election
            <v-spacer></v-spacer>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data:()=>({
    title:'Select Election | Facevote',
    elections:[],
  }),
  methods:{
    setCurElection(election){
      this.$router.push()
      this.$store.dispatch('setCurrElection', election)
    }
  },
  async mounted(){
    try {
        
      let res = await api().post(`dashboard/getMyEnrolled/${this.$store.getters.getUser.username}`, {token:this.$store.getters.getToken})
      this.elections = res.data
      console.log(res)
      //this.$eventBus.$emit('Change_Title', this.$store.state.curRoom.title);
      //console.log('wow')
      
    } catch (error) {
      console.log(error)
      console.log(error.response)
      if(error.response && error.response.status == 401){
        // if the auth token is invalid, log user out(if possible) and redirect to login page
        this.$store.dispatch('logout')
        this.$router.push('/login')
      }
    }
  },
  components:{
  }
}

import api from '@/services/api'
</script>
