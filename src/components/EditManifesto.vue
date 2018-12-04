<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;"  flat tile v-if="!manifesto">
          <v-card-text>Select the election you want to create manifesto for below</v-card-text>
          <v-layout style="">
            <!--v-flex xs3 d-flex px-2 v-for='election in elections' :key="election._id" @click="fetchManifesto(election)">
              <v-card :to="'?electionId=' + election.electionId"  height="200" hover >
                <v-card-title>
                  {{election.title}}
                </v-card-title>
              </v-card>
            </v-flex-->

            <v-flex xs4 v-for='election in elections' :key="election._id" @click="fetchManifesto(election)" mb-2 px-2>
              <v-card color="" class="" height="200" :to="'?electionId=' + election.electionId">
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
        </v-card>
        <v-card v-else>
          <v-toolbar dense>
            <v-toolbar dense>
              <v-toolbar-title>Edit this manifesto</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn color="success" @click.native="dialog = true">Change template</v-btn>
              </v-toolbar-items>
            </v-toolbar>
          </v-toolbar>
          
          <template-index :template="manifesto.template_name" :manifestoData='manifesto'></template-index>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row justify-center>
      <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
        <v-card>
          <v-toolbar dark color="teal">
            <v-btn icon @click.native="dialog = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Select a template</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="dialog = false">Continue</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          
          <v-divider></v-divider>
          <v-container>
            <v-layout row wrap>
              <v-flex xs2 v-for="i in 7" :key="i" mr-3 mb-3>
                <v-card height="100" :to="'?template='+i">
                  
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>
    </v-layout>


  </v-container>
</template>
<script>
export default {
  data:()=>({
    manifesto:null,
    elections:[],
    dialog:false,
  }),
  methods:{
    async fetchManifesto(election){
      try{
        console.log('fetchmanifesto')
        let res = await api().post(`dashboard/getManifesto/${election._id}`, {
          token:this.$store.getters.getToken,
          username:this.$store.getters.getUser.username
        })
        if(res.data.length == 0 || res.data == null){
          prompt('You have not created a manifesto for this election. Create one ?')
        }
        else{
          this.manifesto = res.data
        }
        
        console.log(this.manifesto)
      }
      catch(err){
        console.log(err)
      }
    },
    async fetchElection(){
      try {
        let elec = await api().post(`dashboard/getElections/${this.$store.getters.getUser.username}`, {
          token:this.$store.getters.getToken
        })
        this.elections = elec.data.enrolled
        if(this.$route.query.electionId){
          let filtr = this.elections.filter(election=> election.electionId == this.$route.query.electionId)
          filtr.length > 0 ? this.fetchManifesto(filtr[0]) : ''
        }
      } catch (error) {
        
      }
    }
  },
  mounted(){
    this.fetchElection()
  },
  components:{
    TemplateIndex,
  }
}
import api from '@/services/api'
  import TemplateIndex from '@/templates/TemplateIndex'
</script>

