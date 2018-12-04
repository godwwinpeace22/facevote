<template>
  <v-card flat>
    <vue-headful
      :title="title"
    />
    <v-container grid-list-md>
      <span class="body-2 ">Elections you created</span>
      <v-divider ></v-divider>
      <v-layout row wrap mt-3>
        <v-subheader v-if="myCreatedElc.length == 0" class="warning--text">You have not created any election yet</v-subheader>
        <v-flex xs12 sm6 md4 v-for="election in myCreatedElc" :key="election._id" mb-2 px-2>
          <v-card color="" class="" height="200" hover>
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
                  :src="election.logo || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'"
                  height="125px"
                  contain
                ></v-img>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3">
              <v-spacer></v-spacer>
              <v-btn flat color="orange" :to="'/dashboard/elections/watch/' + election.electionId">Explore</v-btn>
              <v-btn flat color="orange" :to="'/dashboard/elections/manage/' + election.electionId">Manage</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon >
                <v-icon>share</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    
    <v-container grid-list-sm>
      <span class="body-2">Elections you have enrolled in</span>
      <v-divider ></v-divider>
      <v-layout row wrap mt-3>
        <v-subheader v-if="myEnrolledElc.length == 0">You have not enrolled in any elections yet</v-subheader>
        <v-flex xs12 sm6 md4 v-for="election in myEnrolledElc" :key="election._id" mb-2 px-2>
          <v-card color="" class="" height="200" hover dark>
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
                  :src="election.logo || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'"
                  height="125px"
                  contain
                ></v-img>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3">
              <v-btn flat color="orange" :to="'/dashboard/elections/watch/' + election.electionId">Explore</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon >
                <v-icon>share</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container grid-list-md>
      <span class="body-2">Elections you contested in</span>
      <v-divider ></v-divider>
      <v-layout row wrap mt-3>
        <v-subheader v-if="myContestedElc.length == 0">You have not contested in any elections yet</v-subheader>
        <v-flex xs12 sm6 md4 v-for="contest in myContestedElc" :key="contest._id" mb-2 px-2 v-if="contest.electionRef">
          <v-card color="" class="" height="200" hover >
            <v-layout row>
              <v-flex xs7>
                <v-card-title primary-title>
                  <div>
                    <div class=""><strong>{{contest.electionRef.title}}</strong></div>
                    <div>Registerd voters:</div>
                    <div>({{contest.electionRef.regVoters.length}})</div>
                  </div>
                </v-card-title>
              </v-flex>
              <v-flex xs5>
                <v-img
                  :src="contest.electionRef.logo || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'"
                  height="125px"
                  contain
                ></v-img>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3">
              <v-btn flat color="primary" class="text-capitalize" :to="'/dashboard/elections/watch/' + contest.electionRef.electionId">Explore</v-btn>
              <v-btn flat color="primary" class="text-capitalize" to="/dashboard/manifesto/create">Create manifesto</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
import api from '@/services/api'
export default {
  data:()=>({
    title:'Manage Elections | Facevote',
    text:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio optio quidem, in aliquid laborum non nihil quasi id error, corrupti voluptatem consequatur nostrum blanditiis expedita omnis accusantium vitae veritatis aut?',
    myCreatedElc:[], // elections user created
    myContestedElc:[], // elections user contested in
    myEnrolledElc:[], // elections user enrolled in
  }),
  methods:{
    async deleteElection(electionId){
      try {
        //let resp = await api().post(`dashboard/deleteElection/${electionId}`, {token:this.$store.getters.getToken})
        //console.log(resp.data)
        //filter out the election deleted from the mycreated list
      } catch (error) {
        
      }
    }
  },
  async mounted(){
    
    // get the elections the user created, contested, and voted in
    try {
      let res = await api().post(`dashboard/getElections/${this.$store.getters.getUser.username}`, {token:this.$store.getters.getToken})
      
      this.myCreatedElc = res.data.created
      this.myContestedElc = res.data.contested
      this.myEnrolledElc = res.data.enrolled
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  },
  components:{
  },
}
</script>
