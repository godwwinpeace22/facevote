<template>
  <div>
    <vue-headful
      :title="title"
    />

    <navigation>
      <span slot="title">Dashboard</span>
      <h1 slot="extended_nav">Watch</h1>
    </navigation>

    <intro v-if="ready && elections.length == 0" :text='no_election_text'></intro>
    <v-container grid-list-lg>
      <v-card class="round">
        <loading-bar v-if="!ready" height="50vh"><div slot="loading_info">Loading elections...</div></loading-bar>
      </v-card>
    </v-container>

    <v-container grid-list-xl v-if="ready && elections.length > 0">
      
      <v-subheader>Select an election</v-subheader>

      <v-card class="round pa-4 grey lighten-4 elevation-2" :class="{'pa-5':$vuetify.breakpoint.mdAndUp}">
        <v-layout row wrap >
          
          <v-flex v-if="ready && elections.length > 0" xs12 sm6 md4 d-flex v-for='election in elections' :key="election.id">
            
            <v-card color="" dark class="round py-3"  height="" :to="'/elections/watch/' + election.electionId">
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
    ready:false,
    no_election_text:{data:'Nothing here. To watch an election, either create one, contest or enroll to vote',action:{text:'Enroll',action_link:'/enroll'}},
  }),
  computed:{
    elections(){
      let elect = [...this.$store.getters.getMyCreated, ...this.$store.getters.getMyEnrolled]
      let myArr = []
      elect.sort((a,b)=>a.dateCreated - b.dateCreated)
      .forEach(election =>{
        // make sure no election is duplicated
        if(!myArr.find(item => item.electionId == election.electionId)){
          myArr.push(election)
        }
      })
      return myArr
    }
  },
  components:{
    Navigation,
    LoadingBar,
    Intro,
  },
  methods:{
    setCurElection(election){
      this.$router.push()
      this.$store.dispatch('setCurrElection', election)
    },
    getMyCreated(user){
      return new Promise((resolve,reject)=>{
        let elecRef = db.collection('elections')
        let myArr = []
        elecRef.where('admin','==',user.email).get().then(doc=>{
          myArr = []
          doc.forEach(item=>{
            //console.log(item.id, " => ", item.data());
            myArr.push(item.data())
          })
          this.$store.dispatch('setMyCreated', myArr)
          resolve(myArr)
        })
      })
      
    },
    getMyEnrolled: function(user){
      return new Promise((resolve,reject)=>{

        let elecRef = db.collection('elections')
        let myArr = []

        elecRef.where('regVoters','array-contains',user.uid)
        .get().then(doc=>{
          myArr = []
          doc.forEach(item=>{
            //console.log(item.id, " => ", item.data());
            myArr.push(item.data())
          })

          this.$store.dispatch('setMyEnrolled', myArr)
          resolve(myArr)
        })
      })
      
    },
    
  },
  created(){
      
    firebase.auth().onAuthStateChanged(async (user)=>{
      if (user) {
        this.$store.getters.getMyCreated.length > 0 && 
        this.$store.getters.getMyEnrolled.length > 0 ? 
        this.ready = true : ''

        // get election user created
        this.getMyCreated(user).then(res=>{
          console.log('res: ', res)
          this.getMyEnrolled(user).then(res2=>{
            console.log('res2: ', res2)
            this.ready = true
          })
        }).catch(err=>{console.log(err)})
        
        
      } else {
        console.log('No user is signed in.')
      }
    });
  },
}

import api from '@/services/api'
import Navigation from '@/components/Navigation'
import LoadingBar from '@/spinners/LoadingBar'
import Intro from '@/components/Intro'
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

