<template id="contest">
  <div>
    <vue-headful
      :title="title"
    />

    <navigation>
      <span slot="title">Contest</span>
    </navigation>

    <v-snackbar v-model="snackbar.show" :timeout="10000" :color="snackbar.color" top right>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

      <v-container grid-list-lg v-if="!ready" :pa-0="$vuetify.breakpoint.xsOnly">
        <v-card :class="{round:$vuetify.breakpoint.smAndUp}" :style="style2">
        <loading-bar :height="$vuetify.breakpoint.xsOnly ? '70vh' : '50vh'"><div slot="loading_info">Loading...</div></loading-bar>
        </v-card>
      </v-container>

    <transition name="fade">

      <v-container v-if="ready"
        grid-list-sm :pa-0="$vuetify.breakpoint.xsOnly">
        
        <v-card class="contest_main_card" :class="{round:$vuetify.breakpoint.smAndUp}">
          <v-stepper v-model="e5" class="white">
            <v-stepper-header :class="{teal: $vuetify.breakpoint.xsOnly}">
              <v-stepper-step :complete="e5 > 1" step="1" color="secondary" >Select election</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e5 > 2" step="2" color="secondary">Choose a position</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e5 > 3" step="3" color="secondary">Submit</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e5 > 4" step="4" color="secondary">Finish</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items :style="style1">
              <v-stepper-content step="1">
                <v-card class="" light color="grey lighten-5" style="min-height:240px;"  flat tile>
                  <v-card-text>Select the election you want to contest in to continue</v-card-text>
                  <v-container>
                    <v-layout row>
                      <v-flex xs12 sm6>
                        <v-select required small v-model="selectedElection"
                          :items="elections" color="secondary" outline
                          item-text="title" :loading="loading_elections"
                          no-data-text="No elections"
                          return-object hint='you can contest in only elections you have enrolled in'
                          persistent-hint
                          label="select election"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  
                </v-card>

                <v-btn color="secondary" dark depressed @click="e5 = 2" v-if="selectedElection.admin">
                  Next
                  <v-icon small>chevron_right</v-icon>
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-5" light color="grey lighten-5"  style="min-height:250px;" flat tile>
                  <v-card-text >
                    <span class="subheading">Contest: {{selectedElection.title}}</span>
                    <v-divider></v-divider>
                  </v-card-text>
                  
                  <v-spacer></v-spacer>
                  <v-container>
                    <v-layout row wrap>
                      <v-flex xs12 sm6>
                        <v-select :items="selectedElection.roles" outline label="Select role" color="secondary" 
                          v-model="selectedRole" item-text="title" return-object>
                        </v-select>
                        <span class="d-block my-4">If you are authorized to contest, you will be given a token by the election admin. Provide the token below</span>
                        <v-text-field label="token" v-model="contestant.acstoken" outline color="secondary"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>

                <v-btn flat @click="e5 = 1" dark color="grey">
                  <v-icon small>chevron_left</v-icon>
                  Previous
                </v-btn>
                <v-btn color="secondary" dark depressed @click="e5 = 3" v-if="!disabled">
                  Next
                  <v-icon small>chevron_right</v-icon>
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card class="mb-5" light color="grey lighten-5" style="min-height:250px;" flat tile>
                  <v-card-text >
                    <span class="subheading">Contest: {{truncateText(selectedElection.title)}}</span>
                    <v-divider></v-divider>
                    </v-card-text>
                    <v-spacer></v-spacer>
                  <v-card-text>
                    <p>You are applying to contest for the position of the <strong> {{selectedRole.title}} </strong>in this election</p>
                    <p>Make sure you complete your profile info as this will be used to complete your application</p>
                  
                  </v-card-text>
                </v-card>

                <v-btn flat @click="e5 = 2" color="grey" :disabled="loading">
                  <v-icon small>chevron_left</v-icon>
                  Previous
                </v-btn>
                <v-btn color="secondary" @click="contest" :loading="loading"> Finish</v-btn>
              </v-stepper-content>

              <v-stepper-content step="4">
                <v-card class="mb-5" light color="grey lighten-5" style="min-height:200px;" flat tile>
                  <v-card-text >
                    <span class="subheading font-weight-bold">Application successful!</span>
                    
                    </v-card-text>
                    <v-spacer></v-spacer>
                  <v-card-text>
                    <p>What next?</p>
                  </v-card-text>
                  <v-card-actions :class="{'d-block': $vuetify.breakpoint.xsOnly}">

                    <!-- <v-btn color="secondary" @click="$store.dispatch('curRoom', election)"
                      v-if="getMyEnrolled.find(elec => elec.electionId == selectedElection.electionId)"
                      :block="$vuetify.breakpoint.xsOnly" :class="[{'mb-2': $vuetify.breakpoint.xsOnly}]">
                      Switch current election
                    </v-btn> -->
                    <template>
                      <v-btn color="success" to="/forum" :block="$vuetify.breakpoint.xsOnly" :class="[{'mb-2 ml-0': $vuetify.breakpoint.xsOnly}]">Join the conversation</v-btn>
                      <v-btn color="success" to="/elections/vote" :block="$vuetify.breakpoint.xsOnly" :class="[{'mb-2 ml-0': $vuetify.breakpoint.xsOnly}]">Vote</v-btn>
                    </template>

                  </v-card-actions>
                </v-card>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-container>

    </transition>
    
    <!-- APPLICATION FOR CONTESTANT DIALOG -->
    <v-dialog
      v-model="loading"
      persistent
      width="300"
    >
      <v-card color="secondary" dark flat>
        <v-card-text>
          Application in progress
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Contest | Voteryte',
    e5: 1,
    snackbar: false,
    loading: false,
    ready: false,
    electionId: null,
    selectedElection: {},
    selectedRole: {},
    elections: [],
    loading_elections: true,
    no_elections_text: {data:'You have not enrolled in any election yet. You need to enroll in an election before you can contest',action:{text:'Enroll',action_link:'/enroll'}},
    election: {},
    contestant: {
      acstoken: '',
      role: ''
    }
  }),
  watch: {
    'getUserInfo': function(){
      this.getEnrolled()
    },
  },
  computed:{
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom',
    ]),
    style1(){
      if(this.$vuetify.breakpoint.xsOnly){
        return {
          "min-height": 'calc(100vh - 128px) !important'
        }
      }
    },
    style2(){
      if(this.$vuetify.breakpoint.xsOnly){
        return {
          "min-height": 'calc(100vh - 56px) !important'
        }
      }
    },
    disabled(){
      return !this.contestant.acstoken  || !this.selectedRole || !this.selectedElection
    }
  },
  methods:{
    async contest(){
      let has_contested = this.getUserInfo.contests && 
        !!this.getUserInfo.contests.find(eId => eId == this.selectedElection.electionId)

      // console.log(this.getUserInfo, has_contested)
      if(this.contestant.acstoken != this.selectedRole.value){
        
        this.snackbar = {
          show: true, message: 'Sorry, the token your provided is invalid', color: 'error'
        }
      }
      else if(has_contested){
        this.snackbar = {
          show: true, message:'Sorry, you are already a contestant in this election', color: 'error'
        }
      }
      else{
        this.loading = true
        firebase.auth().currentUser.getIdToken().then((token)=>{
          api().post('contest', {
            idToken: token,
            electionId: this.selectedElection.electionId,
            selectedRole: this.selectedRole.value
          }).then(resp=>{
            this.snackbar = {
              show: true,
              message: resp.data.message,
              color: 'success'
            }

            this.$store.dispatch('curRoom', this.selectedElection)
            this.loading = false
            this.e5 = 4
          }).catch(error=>{

            this.loading = false
            $Nprogress.done()

            if(error.response){
              // console.log(error.response)
              this.snackbar = {
                show: true,
                message: error.response.data.message,
                color: 'error'
              }
            }
            else{
              // probably network error
              this.snackbar = {
                show: true,
                message: 'Something went wrong. Please check your internet connection',
                color: 'error'
              }
            }
          })
        })

      }
    },
    async getEnrolled() {
      let arr = []
      if(this.getUserInfo.enrolled) {

        this.getUserInfo.enrolled.forEach(async electionId => {
          let doc = await db.collection('elections').doc(electionId).get()
          doc.exists ? arr.push(doc.data()) : ''
          this.elections = arr
          this.loading_elections = false
        })
      }
      else {
        this.loading_elections = false
      }
    },
    truncateText(text){
      // console.log(text)
      return text ? text.replace(/(.{50})..+/, "$1...") : ''
    },
  },
  created(){
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        this.getUserInfo ? this.getEnrolled() : ''
        this.ready = true
        
      } else {
        
      }
    })
  },
  components:{
    Navigation,
    LoadingBar,
  }
}
import api from '@/services/api'
import Navigation from '@/components/Navigation'
import LoadingBar from '@/spinners/LoadingBar'
import { mapGetters, mapState } from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
</script>
<style lang="scss" scoped>
  //.v-stepper{
    //min-height:100vh;
  //}
</style>
