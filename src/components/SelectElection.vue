<template>
  <div>
    <navigation>
      <span slot="title">Dashboard</span>
      <h1 slot="extended_nav">Watch</h1>
    </navigation>
    <v-container grid-list-xl>
      <vue-headful
        :title="title"
      />
      <v-subheader>Select an election to watch</v-subheader>

      <v-card class="round pa-5 elevation-2">
        <v-layout row wrap :justify-center='!data_available'>
          <v-subheader v-if="elections.length == 0 && data_available">Nothing here. To watch an election, either create one, contest or enroll to vote</v-subheader>
          <v-progress-circular class="mt-3" v-if="!data_available" indeterminate color="grey lighten-1"></v-progress-circular>

          <v-flex xs12 sm6 md4 d-flex v-for='election in elections' :key="election._id" >
            
            <v-card color="" dark class="py-3" height="" :to="'/elections/watch/' + election.electionId">
              <v-layout row>
                <v-flex xs12>
                  <v-card-title primary-title>
                    <div>
                      <div class=""><strong>{{election.title}}</strong></div>
                      
                    </div>
                  </v-card-title>
                </v-flex>
              </v-layout>
              <v-divider light></v-divider>
              <v-card-actions class="pa-3">
                {{election.regVoters.length}} | Registerd voters
                <v-spacer></v-spacer>
                {{election.followers.length}} | Followers
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Select Election | Facevote',
    //elections:[],
    data_available:false,
  }),
  computed:{
    elections(){
      let elect = [...this.$store.getters.getMyCreated, ...this.$store.getters.getMyEnrolled]
      let myArr = []
      elect.forEach(election =>{
        console.log(election)
        if(!myArr.find(item => item.electionId == election.electionId)){
          myArr.push(election)
        }
      })
      return myArr
    }
  },
  components:{
    Navigation
  },
  methods:{
    setCurElection(election){
      this.$router.push()
      this.$store.dispatch('setCurrElection', election)
    },
    async getMyCreated(user){
      let elecRef = db.collection('elections')
      let myArr = []
      elecRef.where('admin','==',user.email).get().then(doc=>{
        myArr = []
        doc.forEach(item=>{
          console.log(item.id, " => ", item.data());
          myArr.push(item.data())
        })
        this.$store.dispatch('setMyCreated', myArr)
        return myArr
      })
      
    },
    async getMyEnrolled(user){
      let elecRef = db.collection('elections')
      let myArr = []
      elecRef.where('regVoters','array-contains',user.uid).get().then(doc=>{
        myArr = []
        doc.forEach(item=>{
          console.log(item.id, " => ", item.data());
          myArr.push(item.data())
        })

        this.$store.dispatch('setMyEnrolled', myArr)
        return myArr
      })
      
    },
  },
  async mounted(){
    try {
      
      firebase.auth().onAuthStateChanged(async (user)=>{
        if (user) {
          this.$store.getters.getMyCreated && 
          this.$store.getters.getMyEnrolled ? 
          this.data_available = true : ''

          // get election user created
          await this.getMyCreated(user)
          // get elections user enrolled in
          await this.getMyEnrolled(user)
          
          this.data_available = true
          
        } else {
          console.log('No user is signed in.')
        }
      });
      // since 'created' and 'enrolled' might contain same election
      // its best to filter them to prevent duplicates
      
      
      
      
      
    } catch (error) {
      console.log(error)
      
    }
  },
}

import api from '@/services/api'
import Navigation from '@/components/Navigation'
</script>
<style lang="scss">
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  .round{
    @include borderRadius(15px)
  }
</style>

