<template>
  <div id="vote_target">

    <v-snackbar v-model="snackbar.show" dark :color="snackbar.color" 
      :timeout="5000" :vertical="$vuetify.breakpoint.xsOnly" top right>
      {{ snackbar.message }}
      <v-btn dark flat color="white" @click="snackbar = null"> Close</v-btn>
    </v-snackbar>
    <v-subheader v-if="no_contestants">No contestants</v-subheader>
    <v-stepper v-model="e6" vertical style="background:#fff;box-shadow:none;" class="d-block" v-if="showUi">
      <span v-for="i in steps" :key="i">
        <v-stepper-step :complete="e6 > i" :step="i" editable>
          {{roles[i-1] ? roles[i-1].title : ''}}
          <small>Click to select your choice candidate for {{roles[i-1] ? roles[i-1].title : ''}}</small>
        </v-stepper-step>
        <v-divider vertical
          v-if="i !== steps"
          :key="i"
        ></v-divider>

        <v-stepper-content :step="i">
          <v-card color="grey lighten-3" class="mb-5" style="min-height:200px;" 
            v-if="contestants.length > 0 && contestantsByRoles[roles[i-1].value] && contestantsByRoles[roles[i-1].value].length > 0">
            <v-layout row wrap mt-3>
              <v-flex sm4 md3 v-for="contestant in contestantsByRoles[roles[i-1].token]"  class="pb-4"
                @click.stop="vote(contestant,$event,roles[i-1].title)" :class="roles[i-1].title" 
                :ref="contestant.uid" :key="contestant.uid" style="min-height:200px;">
                
                <v-tooltip top>
                  <v-card  class=" mt-4 mx-4" hover :id="contestant.name" slot="activator">
                    <v-img
                      :src="contestant.photoURL || `https://ui-avatars.com/api/?size=300&name=${contestant.name}`"
                      height="140px"
                    ></v-img>

                    <v-card-title primary-title>
                      <div>
                        <h4 class=" mb-0" style='text-transform:capitalize;'>{{contestant.name}}</h4>
                      </div>
                    </v-card-title>
                  </v-card>
                  <span>Click to select</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-card>
          <v-subheader v-else class="title">No contestant for this role</v-subheader>
          <v-btn flat color="primary" @click="previousStep(i)" v-if="i > 1" :disabled="loading">Previous</v-btn>
          <v-btn color="primary" @click="nextStep(i)" depressed :disabled="loading" v-if="i < steps">Next</v-btn>
          <v-btn color="primary" @click="submit" :loading="loading" 
            :disabled="disabled" depressed v-else>
            Finish
          </v-btn>
        </v-stepper-content>
      </span>
    </v-stepper>
  </div>
</template>
<script>
export default {
  data:()=>({
    e6:1,
    steps: 5,
    showUi: false,
    no_contestants: false,
    roles:'',
    myVote:{},
    contestantsByRoles:{},
    disabled:true,
    snackbar:{},
    message:'',
    //disabled:true,
    loading:false
  }),
  props:['currElection','contestants','rawVotes'],
  watch: {
    steps (val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    }
  },
  computed:{
  },
  methods:{
    nextStep (n) {
      if (n === this.steps) {
        
      } else {
        this.e6 = n + 1
      }
    },
    previousStep(n){
      if(n === 1){

      }else{
        this.e6 = n - 1
      }
    },
    getRole(contestant){
      let ref = contestant.contestsRef
      .find(item=>item.electionRef == this.currElection.electionId)
      
      let found = this.currElection.roles.find(role=>role.value == ref.role)
      return found ? found.title : '' 
    },
    vote(contestant,event,role){
      
      let elems = document.getElementsByClassName(role)
      if(this.$refs[contestant.uid][0].style.backgroundColor == 'yellow'){
        
        // remove the vote
        delete this.myVote[role]
        
        for(var i= 0; i<elems.length;i++){
          elems[i].style.backgroundColor = ''
          // elems[i].style.paddingBottom = ''
        }

        // disable vote submissin if voter has not voted for all roles
        // but first, filter out the roles that don't have contestants
        let arr = Object.keys(this.contestantsByRoles) // contains all the roles that have contestants

        this.disabled = Object.keys(this.myVote).length < arr.length ? true : false
        

        this.$refs[contestant.uid][0].style.backgroundColor = ''
        // this.$refs[contestant.uid][0].style.paddingBottom = '23px'
      }
      else{
        for(var i= 0; i<elems.length;i++){
          elems[i].style.backgroundColor = ''
          // elems[i].style.paddingBottom = ''
        }
        this.$refs[contestant.uid][0].style.backgroundColor = 'yellow'
        // this.$refs[contestant.uid][0].style.paddingBottom = '23px'

        this.myVote[role] = contestant.uid
        //this.$eventBus.$emit('Someone_Is_Voting', {user:this.$store.getters.getUser, room:this.currElection.electionId})

        // disable vote submissin if voter has not voted for all roles
        // but first, filter the roles that have contestants
        let arr = Object.keys(this.contestantsByRoles) // contains all the roles that have contestants
        
        this.disabled = Object.keys(this.myVote).length < arr.length ? true : false

      }
      //console.log(this.myVote);
      //console.log(Object.keys(this.myVote).length);
    },
    async submit(){
      this.loading = true

      // Prevent multiple voting
     /* if(this.currElection.votes.find(voterId => voterId == this.$store.getters.getUser.uid)){
        
        this.snackbar = {
          show:true,
          message:'Sorry, you have already voted for this election',
          color:'error'
        }

        setTimeout(() => {
          // close the voting dialog after voting and prevent more voting attempts
          this.$eventBus.$emit('Close_Voting_Dialog', true)
        }, 3000);

      }
      else{*/

        // vote
        firebase.auth().currentUser.getIdToken().then((token)=>{
          let myVote = btoa(JSON.stringify(this.myVote))
          // console.log(myVote)
          api().post('dashboard/vote', {
            electionId:this.currElection.electionId,
            idToken:token,
            myVote:myVote
          }).then(result=>{
            // console.log(result)
            
            this.snackbar = {
              show:true,
              message:'You have voted successfully',
              color:'purple'
            }
            setTimeout(() => {
              // close the voting dialog after voting and prevent more voting attempts
              this.$eventBus.$emit('Close_Voting_Dialog', true)
            }, 3000);
            
            }).catch(err=>{
            this.loading = false
            if(err.response){
              // console.log(err.response)
              
              this.snackbar = {
                show:true,
                message:err.response.data.message,
                color:'error'
              }
              setTimeout(() => {
                // close the voting dialog and prevent more voting attempts
                this.$eventBus.$emit('Close_Voting_Dialog', true)
              }, 3000);
            }
            else{
              $NProgress.done()
              // console.log(err)
              
              this.snackbar = {
                show:true,
                message:'Voting failed, check your internet connection and try again',
                color:'error'
              }
            }
            
          })

          
        }).catch(err=>{
          // console.log(err)
          //console.log(err.response)
          this.snackbar = {
            show:true,
            message:'Something went wrong, try again',
            color:'err'
          }
          this.loading = false
        })
      //}
    },
  },
  
  mounted(){
    this.roles = this.currElection.roles
    this.steps = this.currElection.roles.length
    // console.log(this.roles)
    // console.log(this.contestants)
    if(this.contestants.length > 0){

      this.contestants.forEach(contestant=>{
      
        let thisContest = contestant.contestsRef.find(contest => contest.electionRef == this.currElection.electionId)
        this.contestantsByRoles[thisContest.role] ? '' : this.contestantsByRoles[thisContest.role] = []
      
        this.contestantsByRoles[thisContest.role].push(contestant)
        this.showUi = true
      })
      // console.log(this.contestantsByRoles)
    }
    else{
      this.no_contestants = true
    }
    
  },
  destroyed(){
    document.title = 'Vote | Facevote'
  },
  components:{
    LoadingBar
  },
}

import api from '@/services/api'
  import LoadingBar from '@/spinners/LoadingBar'
</script>
<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;
  .v-stepper--vertical .v-stepper__content{
    border-left: 1px solid rgba(0,0,0,0.12);
  }
  .v-stepper--vertical span:last-of-type .v-stepper__content{
    border-left: 1px solid rgba(0,0,0,0.12);
  }
  //.v-stepper{
    //height:-webkit-fill-available;
  //}
  
  /* --scrollbar --*/
.navdrawr::-webkit-scrollbar {
    width: 10px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }
.navdrawr::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: $mainBgColor;
  @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>
