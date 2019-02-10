<template>
  <div>
    <vue-headful :title="title"/>

    <navigation>
      <span slot="title">Feed</span>
    </navigation>

    <v-container grid-list-xl dark :class="{'px-2':$vuetify.breakpoint.smAndDown}">
      <v-card class="round black--text">
        <v-stepper v-model="e1" color="secondary">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">Info</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2">Select template</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Edit template</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card class="" color="grey lighten-5" style="min-height:200px;"  flat tile>
                <v-card-text>Create manifesto page
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo asperiores fugiat 
                  labore quia qui culpa explicabo in ullam, doloremque provident dolorem temporibus 
                  ad blanditiis. Consequuntur optio accusamus possimus temporibus excepturi.
                </v-card-text>
                
              </v-card>

              <v-btn color="secondary" @click="e1 = 2">Proceed <v-icon>chevron_right</v-icon></v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card class="" color="grey lighten-5"  style="min-height:200px;" flat tile>
                <v-card-text >
                  <span class="subheading">Select from a variety of templates</span>
                  
                </v-card-text>
                <v-container grid-list-md>
                  <v-layout row wrap>
                    <v-flex xs6 sm4 md2 v-for="i in ['default','sleek']" :key="i" mb-3>
                      <v-card height="150" :to="'?template='+i" :class="{'secondary':$route.query.template == i}">
                        
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-container>
                  <v-layout row>
                    <v-flex xs6>
                      <v-select required small v-model="selectedElection"
                        :items="myContests" outline
                        item-text="title" item-value="electionId"
                        return-object
                        label="Select an election to create for"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>

              <v-btn flat @click="e1 = 1">Previous</v-btn>
              <v-btn color="secondary" @click="e1 = 3" :disabled="!selectedElection">Next</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="" color="grey lighten-5" style="min-height:200px;" flat tile>
        
                <v-card-text >
                  
                  <template-index :template="$route.query.template" :selectedElection='selectedElection'></template-index>

                </v-card-text>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Home | Facevote',
    e1:1,
    selectedElection:null,
    elections:[],
    html:'<v-container><v-layout><v-flex xs12 dflex v-for="i in 4">Flexing</v-flex></v-layout></v-container>'
  }),
  computed:{
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getMyEnrolled'
    ]),
    myContests(){
      if(this.getMyEnrolled){
        let contests = []
        this.getMyEnrolled.forEach(item=>{

          item.contestants.find(uid => uid == this.getUser.uid) ? contests.push(item) : ''
        })
        return contests
      }
      else{return []}
    }
  },
  methods:{
    async finish(){
      
      
    },
    getEnrolled(user){
      return new Promise((resolve,reject)=>{
        db.collection('elections').where('regVoters','array-contains',user.uid)
        .get().then(docs=>{
          let myArr = []
          docs.forEach(doc=>{
            myArr.push(doc.data())
          })
          this.$store.dispatch('setMyEnrolled',myArr)
          //console.log(this.getMyEnrolled)
        })
      })
    },
  },
  mounted(){

    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        // User is signed in.
        !this.getMyEnrolled ? this.getEnrolled(user) : ''
      } else {
        console.log('No user is signed in.')
      }
    });

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
    Navigation
  }
}
import api from '@/services/api'
  import {mapGetters} from 'vuex'
  import TemplateIndex from '@/templates/TemplateIndex'
  import Navigation from '@/components/Navigation'
</script>
<style lang="scss" scoped>
  
</style>
