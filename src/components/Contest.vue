<template id="contest">
  <div>
    <vue-headful
      :title="title"
    />

    <navigation>
      <span slot="title">Dashboard</span>
      <h1 slot="extended_nav">Contest</h1>
    </navigation>

    <intro v-if="elections.length == 0" :text='no_elections_text'></intro>
    <v-container grid-list-sm v-else>
      <v-card class="round">
        <v-stepper v-model="e5" dark class="white">

          <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" top>
            {{snackbar.message}} 
            <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
          </v-snackbar>

          <v-stepper-header class="grey">
            <v-stepper-step :complete="e5 > 1" step="1">Select election</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e5 > 2" step="2">Choose a position</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Submit</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="4">Finish</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card class="" light color="grey lighten-5" style="min-height:200px;"  flat tile>
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

              <v-btn color="secondary" dark depressed @click="e5 = 2" :disabled="!selectedElection.admin">Next</v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card class="mb-5" light color="grey lighten-5"  style="min-height:200px;" flat tile>
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
              <v-card class="mb-5" light color="grey lighten-5" style="min-height:200px;" flat tile>
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

              <v-btn flat @click="e5 = 2" :disabled="loading">Previous</v-btn>
              <v-btn color="secondary" @click="contest" :loading="loading"> Finish</v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card class="mb-5" light color="grey lighten-5" style="min-height:200px;" flat tile>
                <v-card-text >
                  <span class="subheading">Contesting successful</span>
                  
                  </v-card-text>
                  <v-spacer></v-spacer>
                <v-card-text>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic vitae architecto id veritatis deserunt molestiae eum iste porro, distinctio tenetur doloribus repellat! Soluta ex ad nesciunt ab impedit? Velit, mollitia?</p>
                </v-card-text>
              </v-card>

              <v-btn flat :to="`/watch/${selectedElection.electionId}`">Vote</v-btn>
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
            election:this.selectedElection,
            selectedRole:this.selectedRole
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
    }
  },
  mounted(){
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
  }
}
import api from '@/services/api'
import Navigation from '@/components/Navigation'
import Intro from '@/components/Intro'
</script>
<style lang="scss" scoped>
  //.v-stepper{
    //min-height:100vh;
  //}
</style>
