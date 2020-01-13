<template>
  <div id="vote_target">
    <transition name="fade">
      <v-overlay v-if="!showUi"
        :absolute="true" opacity=".3"
        :value="!showUi"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <div v-if="showUi">
        <v-subheader v-if="no_contestants">No contestants</v-subheader>
        
        <v-stepper v-model="stepper_step" 
          vertical style="background:#fff;box-shadow:none;" 
          class="d-block" v-if="showUi">
          
          <span v-for="i in steps" :key="i">

            <v-stepper-step 
              :complete="stepper_step > i" 
              :step="i" editable>

              {{roles[i-1] ? roles[i-1].title : ''}}

              <small>
                Click to select your choice candidate for 
                {{roles[i-1] ? roles[i-1].title : ''}}
              </small>
            </v-stepper-step>

            <v-divider vertical
              v-if="i !== steps"
              :key="i"
            ></v-divider>

            <v-stepper-content :step="i">
              <v-card color="grey lighten-4" outlined
                class="mb-5" style="min-height:200px;" 
                v-if="contestants.length > 0 && 
                  contestantsByRoles[roles[i-1].value] && 
                  contestantsByRoles[roles[i-1].value].length > 0">

                <v-row class="mt-4">
                  <v-col sm="4" 
                    md="3" class="pb-4"
                    v-for="contestant in contestantsByRoles[roles[i-1].value]"
                    @click.stop="select(contestant,$event,roles[i-1].title)" 
                    :class="roles[i-1].title" 
                    :ref="contestant.author.username" 
                    :key="contestant.author.username" 
                    style="min-height:200px;">
                    
                    <v-tooltip top>
                      <template v-slot:activator="{on}">
                        <v-card  class=" mt-4 mx-4" 
                          outlined hover 
                          :id="contestant.author.name" v-on="on">
                          <v-img
                            :src="contestant.author.photoURL || 
                            `https://ui-avatars.com/api/?size=300&name=${contestant.author.name}`"
                            height="140px"
                          ></v-img>

                          <v-card-title>
                            <div>
                              <h4 class="title mb-0" style='text-transform:capitalize;'>{{contestant.author.name}}</h4>
                            </div>
                          </v-card-title>
                        </v-card>
                      </template>
                      <span>Click to select</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-card>

              <v-subheader v-else class="title">No contestant for this role</v-subheader>

              <v-btn text color="primary" 
                @click="previousStep(i)" v-if="i > 1" 
                :disabled="loading">Previous
              </v-btn>

              <v-btn color="primary" 
                @click="nextStep(i)" 
                depressed :disabled="loading" 
                v-if="i < steps">Next</v-btn>

              <v-btn color="primary" 
                @click="vote" :loading="loading" 
                :disabled="disabled" depressed v-else>
                Submit Vote
              </v-btn>
            </v-stepper-content>
          </span>
        </v-stepper>

      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data:()=>({
    stepper_step: 1,
    // steps: 5,
    showUi: false,
    no_contestants: false,
    myVote: {},
    roles: [],
    approved_list: [],
    contestants: [],
    hasVoted: false,
    disabled: true,
    snackbar: {},
    message: '',
    loading: false
  }),
  props: ['status','currElection'],
  watch: {
    steps (val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    },
    roles(to,from){
      console.log({to,from})
      this.initialize()
    }
  },
  computed:{
    ...mapGetters([
      'getUser'
    ]),
    electionId(){
      return this.$route.params.electionId
    },
    steps(){
      return this.roles.length
    },
    contestantsByRoles(){
      let contestantsByRoles = {}

      this.getUniques(this.contestants, 'username').forEach(contestant=>{
        // console.log(contestant)
        contestantsByRoles[contestant.role.value] ? '' : 
        contestantsByRoles[contestant.role.value] = []
      
        contestantsByRoles[contestant.role.value].push(contestant)
        // this.showUi = true
      })

      return contestantsByRoles
    }
  },
  methods:{
    nextStep (n) {
      if (n === this.steps) {
        
      } else {
        this.stepper_step = n + 1
      }
    },
    previousStep(n){
      if(n === 1){

      }else{
        this.stepper_step = n - 1
      }
    },
    getUniques(arr, str){
      return uniqBy(arr, str)
    },
    async getContestants(){
      // get contestants
      
      this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .map()
        .once(async (data,key) => {
          console.log({data,key})

          let role = await this.getRole(key)
          let author = await this.getPerson(key)

          let cont = Object.assign({}, data)
          cont.author = author;
          cont.role = role;
          cont.username = author.username

          this.contestants.find(c => c.author.username == data.author['#']) ? '' : 
          this.contestants.push(cont)
          // console.log(this.contestants)
        })

    },
    async getRole(username){

      // get the role of a contestant
      return await this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .get(username)
        .get('role')
        .then()
          
    },
    async getPerson(username){
      return await this.$gun.get('users')
        .get(username)
        .then()
    },
    async setRoles(){
      
      let roles = []
      return await this.$gun.get('elections')
        .get(this.electionId)
        .get('roles')
        .map()
        .once(r => {
          // console.log({r})
          this.roles.push(r)
        })
      // console.log({roles})

      // this.roles = roles
      // this.steps = roles.length
      // return roles
    },
    select(contestant,event,role){
      // console.log(contestant)
      let elems = document.getElementsByClassName(role)
      if(this.$refs[contestant.author.username][0].style.backgroundColor == 'yellow'){
        
        // remove the vote
        delete this.myVote[role]
        
        for(var i= 0; i<elems.length;i++){
          elems[i].style.backgroundColor = ''
        }

        // disable vote submissin if voter has not voted for all roles
        // but first, filter out the roles that don't have contestants
        let arr = Object.keys(this.contestantsByRoles) // contains all the roles that have contestants

        this.disabled = Object.keys(this.myVote).length < arr.length ? true : false
        

        this.$refs[contestant.author.username][0].style.backgroundColor = ''
      }
      else{
        for(var i= 0; i<elems.length;i++){
          elems[i].style.backgroundColor = ''
        }
        this.$refs[contestant.author.username][0].style.backgroundColor = 'yellow'

        this.myVote[role] = contestant.author.username

        // disable vote submision if voter has not voted for all roles
        // but first, filter the roles that have contestants
        let arr = Object.keys(this.contestantsByRoles) // contains all the roles that have contestants
        
        this.disabled = Object.keys(this.myVote).length < arr.length ? true : false

      }
    },
    async vote(){
      this.loading = true
      
      
      /* Check that:

        - is same sch, fac or dept for sch elec
        - voter has enrolled and has not voted
        - voting has started and has not ended
        - voter is not suspended

      */

     // vote
      let proceedToVote = () => {

        try{
          
          let votes = {
            choices: this.myVote,
            date_created: this.$Gun.state(),
            sch: this.getUser.sch,
            fac: this.getUser.fac,
            dept: this.getUser.dept
          }

          let v

          if(this.currElection.allow_multiple_voting){
            v = this.$gUser
              .get('votes')
              .get(this.electionId)
              .get(this.$helpers.getRandomString())
              .put(votes)
              // ENCRYPT THE VOTES
          }
          else {
            v = this.$gUser
              .get('votes')
              .get(this.electionId)
              .put(votes)
              // ENCRYPT THE VOTES
          }
  
  
          let elecRef = this.$gun.get('elections')
            .get(this.electionId)
            .get('votes')
  
          elecRef.set(v)

          this.$gun.get('elections')
            .get(this.electionId)
            .get('voters_count')
            .put(this.currElection.voters_count * 1 + 1)
  
          // console.log(v, elecRef, votes)
  
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'You have voted successfully',
            color: 'purple'
          })
  
          setTimeout(() => {
            // close the voting dialog after voting and prevent more voting attempts
            this.$eventBus.$emit('Close_Voting_Dialog', true)
          }, 3000);
                
            
            
        }
        catch(err){
          console.log(err)
          
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Something went wrong, try again',
            color: 'err'
          })
  
          this.loading = false
        }
      }

      if(this.status.election_ended || this.status.inprogress){
        // election not started

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: "Sorry, enrollement has ended",
          color: 'error'
        })
      }

      else if(this.hasVoted && !this.currElection.allow_multiple_voting){
        
        // Voter has already voted

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'You have already voted in this election',
          color: 'error'
        })

        setTimeout(() => {
          this.$eventBus.$emit('Close_Voting_Dialog', true)
        }, 3000);
      }

      else if(!this.hasEnrolled){
        
        // Voter is not enrolled

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'You need to enroll to vote in this election',
          color: 'error'
        })
      }

      // else if(this.currElection.who_can_vote == 'anyone_with_access'){
      //   // the election requires access token. Check whether suplied token 
      //   // matches with the election voters_token
      // }
      else if(this.currElection.who_can_vote == 'manual'){
        // check if the voter is in the approved voters list
        let isApproved = !!this.approved_list.find(u => u.username == this.getUser.username)

        if(!isApproved){
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Sorry, You are not allowed to vote in this election',
            color: 'error'
          })

          setTimeout(() => {
            this.$eventBus.$emit('Close_Voting_Dialog', true)
          }, 3000);
        }
      }

      else {

        // check if is same sch, fac, dept corresponding to election level

        let is_same_sch = this.currElection.sch == this.getUser.sch;
        let is_same_fac = this.currElection.fac == this.getUser.fac;
        let is_same_dept = this.currElection.dept == this.getUser.dept;
        let is_sch_election = this.currElection.type == 'School'
        let election_level = this.currElection.level

        if(is_sch_election){
          if(!is_same_sch){

            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'You can only vote in your school',
              color: 'error'
            })

            setTimeout(() => {
              this.$eventBus.$emit('Close_Voting_Dialog', true)
            }, 3000);
          }

          else if(election_level == 'Faculty' && !is_same_fac){

            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'You can only vote in your faculty',
              color: 'error'
            })

            setTimeout(() => {
              this.$eventBus.$emit('Close_Voting_Dialog', true)
            }, 3000);
          }

          else if(election_level == 'Department' && !is_same_dept){

            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'You can only vote in your department',
              color: 'error'
            })

            setTimeout(() => {
              this.$eventBus.$emit('Close_Voting_Dialog', true)
            }, 3000);
          }

          else {
            proceedToVote()
            console.log('Is school election. Other conditions met')
          }
        }

        else {
          proceedToVote()
          console.log('Not a school election')
        }

      }

      
  
    },
    hasEnrolled(){
      let enrolled = 
      this.getMyEnrolled.find(election => {
        return election.electionId == this.electionId
      })

      // console.log(!!enrolled)
      return !!enrolled
    },
    checkVoted(){
      this.$gUser
        .get('votes')
        .get(this.electionId)
        .on(v => {
          // console.log({v})
          this.hasVoted = v ? true : false
        })
    },
    initialize(){

      if(this.contestants.length > 0){
        // sort contestants by their roles
        this.showUi = true

        // get approved list
				this.$gun.get('elections').get(this.electionId)
					.get('approved_list').map().on(l => {
						
						this.approved_list.find(i => i.username == l.username) ? '' :
						this.approved_list.push(l)
          })
          
        this.checkVoted()

      }
      else{
        this.no_contestants = true
      }
    },
    
  },
  
  async mounted(){
    try {
      
      this.setRoles()
      this.getContestants()
  
      this.$helpers.sleep(1000).then(() => {
  
        this.initialize()
      })
    } catch (error) {
      console.log(error)
    }

    
    
  },
  destroyed(){
    document.title = `Vote | ${this.$appName}`
  },
  components:{
    LoadingBar
  },
}


import LoadingBar from '@/spinners/LoadingBar'
import { mapGetters } from 'vuex'
import { uniqBy } from "lodash";
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
  
</style>
