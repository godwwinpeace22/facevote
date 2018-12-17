<template id="contest">
  <v-stepper v-model="e5" >
    <vue-headful
      :title="title"
    />

    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" top>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

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
                  item-text="title"
                  return-object hint='you can contest in only elections you have enrolled in'
                  persistent-hint
                  label="select election"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          
        </v-card>

        <v-btn color="secondary" depressed @click="e5 = 2" :disabled="!this.selectedElection._id">Next</v-btn>
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
                <v-select :items="selectedElection.roles" label="Select role" 
                  v-model="selectedRole" item-text="title" return-object>
                </v-select>
                <span>If you are authorized to contest, you will be given a token, provide the token below</span>
                <v-text-field label="token" v-model="contestant.acstoken"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-btn flat @click="e5 = 1">Previous</v-btn>
        <v-btn color="secondary" depressed @click="e5 = 3" :disabled="disabled">Next</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;" flat tile>
          <v-card-text >
            <span class="subheading">{{selectedElection.title}}</span>
            <v-divider></v-divider>
            </v-card-text>
            <v-spacer></v-spacer>
          <v-card-text>
            <p>You are applying to contest for the position of the <strong> {{selectedRole.title}} </strong>in this election</p>
            <p>Make sure you complete your profile info as this will be used to complete your application</p>
          
          </v-card-text>
        </v-card>

        <v-btn flat @click="e5 = 2">Previous</v-btn>
        <v-btn color="secondary" depressed @click="contest" :loading="loading"> Finish</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
export default {
  data:()=>({
    title:'Contest | Facevote',
    e5:1,
    snackbar:false,
    loading:false,
    electionId:null,
    selectedElection:{},
    selectedRole:{},
    elections:[],
    election:{},
    contestant:{
      acstoken:'',
      role:''
    }
  }),
  computed:{
    
    disabled(){
      return !this.contestant.acstoken  || !this.selectedRole || !this.selectedElection
    }
  },
  methods:{
    async getEnrolled(){ // this actually gets the election instead of just the id
      try {
        let elec = await api().post(`dashboard/getElections/${this.$store.getters.getUser.username}`, {
          token:this.$store.getters.getToken
        })
        this.elections = elec.data.enrolled
        console.log(this.elections)
      } catch (error) {
        console.log(error.response)
      }
    },
    async contest(){
      try {
        if(this.contestant.acstoken != this.selectedRole.value){
          
          this.snackbar = {
            show:true,message:'Sorry, the token your provided is invalid',color:'error'
          }
        }
        else{
          this.loading = true
          this.contestant.role = this.selectedRole.title
          let contestant = {
            ...this.contestant, 
            userId:this.$store.getters.getUser._id,
            electionRef:this.selectedElection._id,token:this.$store.getters.getToken}
          console.log(contestant)

          
          let res =await api().post(`dashboard/addcontestant/${this.selectedElection.electionId}`, contestant)
          console.log(res)
          this.snackbar = {
            show:true,message:'Success! You are now a contestant in this election',color:'success'
          }
          this.loading = false
          this.e5 = 1
        }
      } catch (err) {
        console.log(err)
        console.log(err.response)
        if(err.response){
          this.snackbar = {
            show:true,message:err.response.data.message,color:'error'
          }
          this.loading = false
          $NProgress.done()
        }

      }
    }
  },
  mounted(){
    this.getEnrolled()
  }
}
import api from '@/services/api'
</script>
<style lang="scss" scoped>
  .v-stepper{
    min-height:100vh;
  }
</style>
