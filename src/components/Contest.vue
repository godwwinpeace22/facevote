<template id="contest">
  <div>
    <vue-headful
      :title="title"
    />

    <navigation>
      <span slot="title">Dashboard</span>
      <h1 slot="extended_nav">Contest</h1>
    </navigation>

    <v-snackbar v-model="snackbar.show" :timeout="10000" :color="snackbar.color" top right>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <v-container grid-list-lg>
      <v-card class="round">
      <loading-bar v-if="!ready" height="50vh"><div slot="loading_info">Loading...</div></loading-bar>
      </v-card>
    </v-container>

    <intro v-if="ready && elections.length == 0" :text='no_elections_text'></intro>

    <v-container v-if="ready && elections.length > 0" grid-list-sm>
      <v-card class="round">
        <v-stepper v-model="e5" dark class="white">
          <v-stepper-header class="grey">
            <v-stepper-step :complete="e5 > 1" step="1">Select election</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e5 > 2" step="2">Choose a position</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e5 > 3" step="3">Submit</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e5 > 4" step="4">Finish</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card class="" light color="grey lighten-5" style="min-height:250px;"  flat tile>
                <v-card-text>Select the election you want to contest in to continue</v-card-text>
                <v-container>
                  <v-layout row>
                    <v-flex xs12 sm6>
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
                      <v-select :items="selectedElection.roles" label="Select role" 
                        v-model="selectedRole" item-text="title" return-object>
                      </v-select>
                      <span class="d-block my-4">If you are authorized to contest, you will be given a token, provide the token below</span>
                      <v-text-field label="token" v-model="contestant.acstoken"></v-text-field>
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
                  <span class="subheading">Application successful!</span>
                  
                  </v-card-text>
                  <v-spacer></v-spacer>
                <v-card-text>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic vitae architecto id veritatis deserunt molestiae eum iste porro, distinctio tenetur doloribus repellat! Soluta ex ad nesciunt ab impedit? Velit, mollitia?</p>
                </v-card-text>
              </v-card>

              <v-btn color="success" :to="`/watch/${selectedElection.electionId}`">Create Manifesto</v-btn>
              <v-btn color="secondary" :to="`/forum/${selectedElection.electionId}`">Forum</v-btn>
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
    title:'Contest | Facevote',
    e5:1,
    snackbar:false,
    loading:false,
    ready:false,
    electionId:null,
    selectedElection:{},
    selectedRole:{},
    elections:[],
    no_elections_text:{data:'Enrolled,Perferendis cumq corp quos aliquid, praes inventore assumenda kkd opre perkj sf jkdd mond',action:{text:'Enroll',action_link:'/enroll'}},
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
    getEnrolled(user){
      
      db.collection("elections").where('regVoters', 'array-contains',user.uid)
      .get()
      .then(querySnapshot=>{
        let myArr = []
          querySnapshot.forEach((doc)=>{
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              myArr.push(doc.data())
          });
          this.elections = myArr
          this.ready = true
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
    },
    async contest(){
  
      if(this.contestant.acstoken != this.selectedRole.value){
        
        this.snackbar = {
          show:true,message:'Sorry, the token your provided is invalid',color:'error'
        }
      }
      else{
        this.loading = true
        firebase.auth().currentUser.getIdToken().then((token)=>{
          api().post('dashboard/contest', {
            idToken:token,
            electionId:this.selectedElection.electionId,
            selectedRole:this.selectedRole.value
          }).then(resp=>{
            this.snackbar = {
              show:true,message:resp.data.message,color:'success'
            }
            this.loading = false
            this.e5 = 4
          }).catch(error=>{

            this.loading = false
            $NProgress.done()

            if(error.response){
              console.log(error.response)
              this.snackbar = {
                show:true,message:error.response.data.message,color:'error'
              }
            }
            else{
              // probably network error
              this.snackbar = {
                show:true,message:'Something went wrong. Please check your internet connection',color:'error'
              }
            }
          })
        })

      }
    },
    truncateText(text){
      console.log(text)
      return text ? text.replace(/(.{50})..+/, "$1...") : ''
    },
  },
  created(){
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        // User is signed in.
        console.log(user)
        this.getEnrolled(user)
        
      } else {
        console.log('No user is signed in.')
      }
    })
  },
  components:{
    Navigation,
    Intro,
    LoadingBar,
  }
}
import api from '@/services/api'
import Navigation from '@/components/Navigation'
import Intro from '@/components/Intro'
import LoadingBar from '@/spinners/LoadingBar'
</script>
<style lang="scss" scoped>
  //.v-stepper{
    //min-height:100vh;
  //}
</style>
