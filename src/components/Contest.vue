<template id="contest">
  <v-stepper v-model="e5" >
    <vue-headful
      :title="title"
    />
    <v-stepper-header>
      <v-stepper-step :complete="e5 > 1" step="1">Select election</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="e5 > 2" step="2">Choose a position</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3">Finish</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;"  flat tile>
          <v-card-text>Select the election you want to contest for below</v-card-text>
          <v-container>
            <v-layout row>
              <v-flex xs6>
                <v-select required small v-model="selectedElection"
                  :items="elections" color="pink"
                  item-text="title" item-value="electionId"
                  return-object hint='you can contest in only elections you have enrolled in'
                  persistent-hint
                  label="select election"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          
        </v-card>

        <v-btn color="primary" @click="e5 = 2">Next</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-5" color="grey lighten-5"  style="min-height:200px;" flat tile>
          <v-card-text >
            <span class="subheading">{{selectedElection.title}}</span>
            <v-divider></v-divider>
          </v-card-text>
          
          <v-spacer></v-spacer>
          <v-container>
            <v-layout row wrap>
              <v-flex xs6>
                <v-select :items="selectedElection.roles" label="Select role" v-model="contestant.role"></v-select>
                <span>If you are authorized to contest, you will be given a token, provide the token below</span>
                <v-text-field label="token"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-btn flat @click="e5 = 1">Previous</v-btn>
        <v-btn color="primary" @click="e5 = 3">Next</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;" flat tile>
          <v-card-text >
            <span class="subheading">{{selectedElection.title}}</span>
            <v-divider></v-divider>
            </v-card-text>
            <v-spacer></v-spacer>
          <v-card-text>
            <p>You are applying to contest for the position of the <strong> {{contestant.role}} </strong>in this election</p>
            <p>Make sure you complete your profile info as this will be used to complete your application</p>
          
          </v-card-text>
        </v-card>

        <v-btn flat @click="e5 = 2">Previous</v-btn>
        <v-btn color="primary" @click="contest"> Finish</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
export default {
  data:()=>({
    title:'Contest | Facevote',
    e5:1,
    electionId:null,
    selectedElection:{},
    elections:[],
    election:{},
    contestant:{
      acstoken:'',
      role:''
    }
  }),
  methods:{
    async getEnrolled(){ // this actually gets the election instead of just the id
      try {
        let elec = await api().post(`dashboard/getElections/${this.$store.getters.getUser.username}`, {
          token:this.$store.getters.getToken
        })
        this.elections = elec.data.enrolled
      } catch (error) {
        console.log(error.response)
      }
    },
    async contest(){
      try {
        let contestant = {
          ...this.contestant, username:this.$store.getters.getUser.username,
          electionRef:this.selectedElection._id,token:this.$store.getters.getToken}
        console.log(contestant)
        let res =await api().post(`dashboard/addcontestant/${this.selectedElection.electionId}`, contestant)
        console.log(res)
        alert('Success!')
        
      } catch (err) {
        console.log(err.response)
        if(err.response && err.response.data.success == false){
          alert('You have already contested for this election')
        }

      }
    }
  },
  mounted(){
    this.getEnrolled()
  }
}
import api from '@/services/api'
import { promisfy } from "@/helpers/promisify";
</script>
<style lang="scss" scoped>
  .v-stepper{
    min-height:100vh;
  }
</style>
