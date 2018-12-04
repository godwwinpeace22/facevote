<template>
  <v-stepper v-model="e1" >
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Create</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="e1 > 2" step="2">Select template</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3">Edit template</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;"  flat tile>
          <v-card-text>Create manifesto page</v-card-text>
          <v-container>
            <v-layout row>
              <v-flex xs6>
                
              </v-flex>
            </v-layout>
          </v-container>
          
        </v-card>

        <v-btn color="primary" @click="e1 = 2">Upgrade account</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-5" color="grey lighten-5"  style="min-height:200px;" flat tile>
          <v-card-text >
            <span class="subheading">Select from a variety of templates</span>
            <v-divider></v-divider>
          </v-card-text>
          <v-container>
            <v-layout row wrap>
              <v-flex xs2 v-for="i in 7" :key="i" mr-3 mb-3>
                <v-card height="100" :to="'?template='+i">
                  
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <v-container>
            <v-layout row>
              <v-flex xs6>
                <v-select required small v-model="selectedElection"
                  :items="elections"
                  item-text="title" item-value="electionId"
                  return-object hint='you can contest in only elections you have enrolled in'
                  persistent-hint
                  label="select election"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-btn flat @click="e1 = 1">Previous</v-btn>
        <v-btn color="primary" @click="e1 = 3" :disabled="!selectedElection">Next</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;" flat tile>
  
          <v-card-text >
            
            <template-index :template="$route.query.template" :selectedElection='selectedElection'></template-index>

          </v-card-text>
        </v-card>

        <!--v-btn flat @click="e1 = 2">Previous</v-btn>
        <v-btn color="primary" @click="e1=4"> Next</v-->
      </v-stepper-content>
      <!--v-stepper-content step="4">
        <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;" flat tile>
  
          <v-card-text v-html="html">
            
          </v-card-text>
        </v-card>

        <v-btn flat @click="e1 = 3">Previous</v-btn>
        <v-btn color="primary" @click.stop="finish"> Finish</v-btn>
      </v-stepper-content-->
    </v-stepper-items>
  </v-stepper>
</template>
<script>
export default {
  data:()=>({
    e1:1,
    selectedElection:null,
    elections:[],
    html:'<v-container><v-layout><v-flex xs12 dflex v-for="i in 4">Flexing</v-flex></v-layout></v-container>'
  }),
  methods:{
    async finish(){
      
      
    },
    async getEnrolled(){ // this actually gets the election instead of just the id
      try {
        let elec = await api().post(`dashboard/getElections/${this.$store.getters.getUser.username}`, {
          token:this.$store.getters.getToken
        })
        this.elections = elec.data.enrolled
      } catch (error) {
        console.log(error.response)
        console.log(error)
      }
    },
  },
  mounted(){
    this.getEnrolled()
    /*this.$eventBus.$on('Template_Saved', data=>{
      console.log(data)
      
    })*/
    this.$eventBus.$on('prev', data=>{
      console.log(data)
      this.e1 = data
    })
    this.$eventBus.$on('next', data=>{
      console.log(data)
      this.e1 = data
    })
  },
  components:{
    TemplateIndex,
  }
}
import api from '@/services/api'
  import TemplateIndex from '@/templates/TemplateIndex'
  import { promisfy } from "@/helpers/promisify";
</script>
<style lang="scss" scoped>
  .v-stepper{
    min-height:100vh;
  }
</style>
