<template>
  <div id="vote_target">

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
                v-for="contestant in contestantsByRoles[roles[i-1].token]"
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
    stepper_step: 1,
    steps: 5,
    showUi: false,
    no_contestants: false,
    myVote: {},
    roles: [],
    contestants: [],
    contestantsByRoles: {},
    disabled: true,
    snackbar: {},
    message: '',
    //disabled: true,
    loading: false
  }),
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
      
      let contestants = []
      this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .map()
        .on(async (data,key) => {
          console.log({data,key})

          let role = await this.getRole(key)
          let author = await this.getPerson(key)
          data.author = author;
          data.role = role;
          data.username = author.username
          contestants.push(data)
        })

        // console.log({contestants})
      // this.contestants = uniqBy(contestants, 'username')
      this.contestants = contestants

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
      return await this.$gun
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

      // vote
      try{
        
        let votes = {
          choices: this.myVote,
          date_created: Date.now(),
          sch: this.getUser.sch,
          fac: this.getUser.fac,
          dept: this.getUser.dept
        }

        let v = this.$gun.user()
          .get('votes')
          .get(this.electionId)
          .put(votes)

        let vote = this.$gun.get('elections')
          .get(this.electionId)
          .get('votes')
          .set(v)

        // console.log(this.myVote)
        this.$eventBus.$emit('Snackbar', {
          show:true,
          message:'You have voted successfully',
          color:'purple'
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
  
    },
    initialize(){

      // console.log('initialized')
      this.steps = this.roles.length
      this.contestantsByRoles = {}

      if(this.contestants.length > 0){
        // sort contestants by their roles

        this.getUniques(this.contestants, 'username').forEach(contestant=>{
          console.log(contestant)
          this.contestantsByRoles[contestant.role.value] ? '' : 
          this.contestantsByRoles[contestant.role.value] = []
        
          this.contestantsByRoles[contestant.role.value].push(contestant)
          this.showUi = true
        })
        console.log(this.contestantsByRoles)
      }
      else{
        this.no_contestants = true
      }
    }
  },
  
  async mounted(){
    this.setRoles()
    this.getContestants()

    // console.log(this.roles)

    this.initialize()
    
    
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
