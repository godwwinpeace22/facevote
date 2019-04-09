<template>
  <div>
    <v-container grid-list-md :px-2="$vuetify.breakpoint.xsOnly">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card height="" class="round_top" style="border-top: 4px solid gold">
            <v-toolbar class="white" flat card dense>
              <v-subheader>Contestants Insight</v-subheader>
              <v-spacer></v-spacer>
              <v-icon color="#FFC107">bookmark</v-icon>
              <span>Premium</span>
            </v-toolbar>
            <v-container grid-list-lg pt-3 v-if="curRoom">
              <v-layout row wrap>
                <v-flex xs12 sm4>
                  <v-card flat>
                    <bar-chart v-if="spyReady" :chart-data="chartdata" :chartOptions="chartOptions2"></bar-chart>
                  </v-card>
                </v-flex>

                <!-- YOUR OPPONENTS -->
                <v-flex xs12 sm4 d-flex>
                  <v-card flat class="round_top" style="border: 1px solid #eee;">
                    <v-toolbar flat card dense light color="grey lighten-3">
                      <v-subheader class="pl-0 font-weight-bold black--text">Your Opponents</v-subheader>
                    </v-toolbar>
                    <v-card-text class="pa-0" style="height: 300px; overflow:auto;">
                      <v-list two-line>
                        <v-subheader v-if="myOpponents.length == 0">No opponents</v-subheader>
                        <template v-for="(item, index) in myOpponents">
                          <v-list-tile avatar :key="index + 'opponent'" @click="$eventBus.$emit('ViewProfile', item)">
                            <v-list-tile-avatar :color="$helpers.colorMinder(item.name.charAt(0))">
                              <img :src="item.photoURL" v-if="item.photoURL">
                              <span v-else class="white--text">{{item.name.charAt(0)}}</span>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title v-text="item.name"></v-list-tile-title>
                              <v-list-tile-sub-title >
                                <span class="online_badge" :class="item.online ? 'success' : 'orange'"></span>
                                {{item.online ? 'online' : 'offline'}}
                              </v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                        </template>
                      </v-list>
                    </v-card-text>
                    
                  </v-card>
                </v-flex>

                <!-- OTHER CONTESTANTS -->
                <v-flex xs12 sm4 d-flex mb-5>
                  <v-card height="300" class="round_top" flat style="border: 1px solid #eee;">
                    <v-toolbar flat card dense light color="grey lighten-3">
                      <v-subheader class="pl-0 font-weight-bold black--text">Other Contestants</v-subheader>
                    </v-toolbar>
                    <v-card-text class="pa-0" style="height: 300px; overflow:auto;">
                      <v-list two-line dense>
                        <v-subheader v-if="otherContestants.length == 0">No contestants</v-subheader>
                        <template v-for="(item, index) in otherContestants" v-else>
                          <v-list-tile avatar :key="index" @click="$eventBus.$emit('ViewProfile', item)">
                            <v-list-tile-avatar :color="$helpers.colorMinder(item.name.charAt(0))">
                              <img :src="item.photoURL" v-if="item.photoURL">
                              <span v-else class="white--text">{{item.name.charAt(0)}}</span>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title >
                                {{item.name}}
                                <span class="online_badge" :class="item.online ? 'success' : 'orange'"></span>
                              </v-list-tile-title>
                              <v-list-tile-sub-title>{{item.role}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                        </template>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex sm12 d-flex>
                  <div class="mt-3 text-xs-center text-sm-left">
                    <v-progress-circular
                      :value="100" class="mr-3"
                      size="60"
                      color="success"
                    ></v-progress-circular>

                    <v-progress-circular
                      :value="80" size="60" class="mr-3"
                      color="purple lighten-2"
                    ></v-progress-circular>

                    <v-progress-circular
                      :value="60" size="60"
                      color="teal" class="mr-3"
                    ></v-progress-circular>
                  </div>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () =>({
    regVoters: [],
    contestants: [],
    meAndMyOpponents: '',
    postsByPersons: [],
    followersByPersons: [],
    profileViewsByPersons: [],
    postViewsByPersons: [],
    chartdata: {
      labels: ['posts','followers','profile views','post views'],
    
      datasets: []
    },
    chartOptions:{
      responsive: true, maintainAspectRatio: false
    },
    chartOptions2:{
      responsive: true, maintainAspectRatio: false,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true,
            }
          }],
          xAxes: [{
            ticks: {
                beginAtZero: true,
                autoSkip:false,
            }
          }]
      }
    },
    spyReady: false,
    
  }),
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom'
    ]),
    myOpponents(){
      
      let myRole = this.getRole(this.getUserInfo)
      let opponents = this.contestantsByRoles.filter(cont =>{
        return myRole ? cont.role == myRole && cont.uid != this.getUser.uid : []
      })
      return opponents
    },
    otherContestants(){
      return this.contestantsByRoles.filter(cont =>{
        return cont.role != this.getRole(this.getUserInfo)
      })
    },
    contestantsByRoles(){
      let contestantsByRoles = []

      this.contestants.forEach(cont =>{
        contestantsByRoles.push({
          ...cont,
          role: this.getRole(cont)
        }) 
      })
      return contestantsByRoles
    }
  },
  methods: {
    getRole(contestant){
      // console.log(contestant)
      if(contestant.contestants){

        let ref = contestant.contestsRef
        .find(item=>item.electionRef == this.curRoom.electionId)
        let found = this.curRoom.roles.find(role=>role.value == ref.role)
        return found ? found.title : false
      }
      else{ return false}
    },
    getVoters(){
      // get registered voters
      this.moreUserInfoRef = db.collection('moreUserInfo')
      .where('enrolled','array-contains', this.curRoom.electionId)
      .onSnapshot(async querySnapshot=>{
        this.regVoters = []
        querySnapshot.forEach(doc=>{
          //console.log(doc.id, " => ", doc.data());
          this.regVoters.push(doc.data())
        })
        await this.allContestants()
        
      }, function(err){
       
        console.log(err)
      })
    },
    async allContestants(){
      // get contestants
      return new Promise((resolve, reject)=>{
        let contestants = []
        db.collection('moreUserInfo')
          .where('contests', 'array-contains', this.curRoom.electionId)
          .get().then(docs =>{

            docs.forEach(doc =>{
              contestants.push(doc.data())
            })

            this.contestants = contestants
            console.log(this.contestants)
            resolve(contestants)
          }).catch(err => console.log(err))
      })
      

      // show only contestants that are not suspended. therefore they can't be voted for
      //contestants = contestants.data.filter(item => item.suspended == false)
      
    },
    async getAllPosts(){

      this.meAndMyOpponents.forEach(person =>{
        // get each person's posts
        
        db.collection('posts').where('createdBy','==',person.uid)
        .where('group', '==', this.curRoom.electionId)
        .get().then(docs =>{
          let personPosts = []
          docs.forEach(doc => personPosts.push(doc.data()))
          this.postsByPersons[person.uid] = personPosts.length
        })
      })
    },
    async getAllFollowers(){

      this.meAndMyOpponents.forEach(person =>{
        // get each person's posts
        
        db.collection('followers').where('following', '==', person.uid)
        .get().then(docs =>{
          let personFollowers = []
          docs.forEach(doc => personPosts.push(doc.data()))
          this.followersByPersons[person.uid] = personFollowers.length
        })
      })
    },
    async getAllProfileViews(){

      this.meAndMyOpponents.forEach(person =>{
        // get each person's posts
        
        db.collection('profileViews').where('viewee','==',person.uid)
        .get().then(docs =>{
          let views = []
          docs.forEach(doc => views.push(doc.data()))
          this.profileViewsByPersons[person.uid] = views.length
        })
      })
    },
    async getAllPostViews(){

      this.meAndMyOpponents.forEach(person =>{
        // get each person's posts
        
        db.collection('postViews').where('viewee', '==', person.uid)
        .get().then(docs =>{
          let views = []
          docs.forEach(doc => views.push(doc.data()))
          this.postViewsByPersons[person.uid] = views.length
        })
      })
    },
    async setContestantMonitor(){
      try{
        // console.log(this.meAndMyOpponents)

        this.allContestants().then(contestants =>{

          let myRole = this.getRole(this.getUserInfo)

          this.contestantsByRoles.filter(cont =>{
            return cont.role == myRole
          })

          .forEach(person =>{
            console.log(person)
            let random1 = Math.floor(Math.random() * Math.floor(255))
            let random2 = Math.floor(Math.random() * Math.floor(255))
            let random3 = Math.floor(Math.random() * Math.floor(255))

            this.chartdata.datasets.push({
              label: person.uid == this.getUser.uid ? 'You' : person.name,
              backgroundColor: `rgba(${random1}, ${random2},  ${random3}, 0.6)`,
              data: [
                person.posts ? person.posts : 0,
                person.followers ? person.followers : 0,
                person.profile_views ? person.profile_views : 0,
                person.followers ? person.followers : 0
              ]
            
            })

            console.log(this.chartdata)
          })
          this.spyReady = true
        })
        .catch(err => console.log(err))
      }
      catch(err){
        console.log(err)
      }
      


    }
  },
  mounted(){
    this.curRoom ? this.setContestantMonitor() : ''
  },
  created(){
    
  },
  components: {
    RadarChart,
    BarChart
  }
}
import RadarChart from '@/charts/radar'
import BarChart from '@/charts/barchart'
import { mapState, mapGetters } from 'vuex';
import { constants } from 'fs';
</script>
