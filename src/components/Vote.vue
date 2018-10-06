<template>
  <div class="navdrawr">

    <v-snackbar v-model="snackbar" color="warning" :timeout="30000" top>
      {{ message }}
      <v-btn dark flat @click="snackbar = null"> Close</v-btn>
    </v-snackbar>

    <v-stepper v-model="e6" vertical >
      <span v-for="i in steps" :key="i">
        <v-stepper-step :complete="e6 > i" :step="i" editable>
          {{roles[i-1]}}
          <small>Select your candidate for {{roles[i-1]}}</small>
        </v-stepper-step>
        <v-divider vertical
          v-if="i !== steps"
          :key="i"
        ></v-divider>

        <v-stepper-content :step="i">
          <v-card color="grey lighten-3" class="mb-5" style="min-height:300px;">
            <v-layout row wrap mt-3>
              <v-flex xs4 v-for="contestant in $store.state.currElectionContestants" @click.stop="vote(contestant,$event)" :class="roles[i-1]" :ref="contestant.userId.username" :key="contestant._id" v-if="contestant.role == roles[i-1]" style="min-height:200px;">
                <v-tooltip top>
                  <v-card  class=" mt-4 mx-4" hover :id="contestant.userId.username" slot="activator">
                    <v-img
                      :src="'https://api.adorable.io/avatars/285/' + contestant.userId.username + '@adorable.png'"
                      height="140px"
                    ></v-img>

                    <v-card-title primary-title>
                      <div>
                        <h4 class=" mb-0" style='text-transform:capitalize;'>{{contestant.userId.name}}</h4>
                      </div>
                    </v-card-title>

                    <!--v-card-actions>
                      <v-btn flat color="orange" >Select</v-btn>
                    </v-card-actions-->
                  </v-card>
                  <span>Click to select</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-card>
          <v-btn flat color="primary" @click="previousStep(i)" v-if="i > 1">Previous</v-btn>
          <v-btn color="primary" @click="nextStep(i)" v-if="i < steps">Next</v-btn>
          <v-btn color="primary" @click="submit" v-else>
            <loading-bar v-show="show_spinner"></loading-bar>
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
    roles:'',
    myVote:{},
    snackbar:false,
    message:'',
    show_spinner:false
  }),
  watch: {
    steps (val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    }
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
    vote(contestant,event){

      console.log(this.$refs[contestant.userId.username][0])
      let elems = document.getElementsByClassName(contestant.role)
      if(this.$refs[contestant.userId.username][0].style.backgroundColor == 'yellow'){
        
        for(var i= 0; i<elems.length;i++){
          elems[i].style.backgroundColor = ''
          elems[i].style.paddingBottom = ''
        }
        this.$refs[contestant.userId.username][0].style.backgroundColor = ''
        this.$refs[contestant.userId.username][0].style.paddingBottom = '23px'
      }
      else{
        for(var i= 0; i<elems.length;i++){
          elems[i].style.backgroundColor = ''
          elems[i].style.paddingBottom = ''
        }
        this.$refs[contestant.userId.username][0].style.backgroundColor = 'yellow'
        this.$refs[contestant.userId.username][0].style.paddingBottom = '23px'
      }
      
      this.myVote[contestant.role] = contestant._id
      this.$eventBus.$emit('Someone_Is_Voting', {user:this.$store.getters.getUser, room:this.$store.state.curRoom.electionId})
      //console.log(this.myVote);
    },
    async submit(){
      try {
        this.show_spinner = true

        this.$eventBus.$emit('Submit_Vote', {myVote:this.myVote,user:this.$store.getters.getUser, room:this.$store.state.curRoom})
        
        this.show_spinner = false
      } catch (error) {
        console.log(error.response)
        alert('Sorry, an error occured')
      }
    },
  },
  mounted(){
    //console.log(this.$store.state.currElection)
    this.roles = this.$store.state.currElection.roles
    this.steps = this.roles.length
    console.log(this.$store.state.currElectionContestants)
    //this.$eventBus.$emit('Someone_Is_Voting', {user:this.$store.state.user, room:this.$store.state.curRoom.electionId})
  },
  components:{
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu,
    ...VList,
    ...VBtn,
    ...VStepper,
    ...VImg,
    ...VSnackbar,
    LoadingBar
  },
}

import api from '@/services/api'
  import LoadingBar from '@/spinners/LoadingBar'
  import * as VCard from 'vuetify/es5/components/VCard'
  import * as VAvatar from 'vuetify/es5/components/VAvatar'
  import * as VSubheader from 'vuetify/es5/components/VSubheader'
  import * as VDivider from 'vuetify/es5/components/VDivider'
  import * as VTabs from 'vuetify/es5/components/VTabs'
  import * as VMenu from 'vuetify/es5/components/VMenu'
  import * as VTooltip from 'vuetify/es5/components/VTooltip'
  import * as VList from 'vuetify/es5/components/VList'
  import * as VBtn from 'vuetify/es5/components/VBtn'
  import * as VStepper from 'vuetify/es5/components/VStepper'
  import * as VImg from 'vuetify/es5/components/VImg'
  import * as VSnackbar from 'vuetify/es5/components/VSnackbar'
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
