<template>
  <div>
    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi" height="40vh">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>
      
      <v-card flat style="" v-else>
        <v-card-text >
          
          <v-layout row wrap justify-center align-center>
            <v-flex xs6 sm3 v-for="stat in stats" :key="stat.title">
              <v-card class="text-xs-center" flat style="border: 1px solid #eee;" height="90">
                
                <v-list two-line class="">
                  <v-list-tile avatar>
                    
                    <v-list-tile-content>
                      <v-list-tile-sub-title class="font-weight-bold">{{stat.title}}</v-list-tile-sub-title>
                      <v-list-tile-title class="font-weight-bold">{{stat.value}}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-avatar >
                      <v-icon large :color="stat.iconColor">{{stat.icon}}</v-icon>
                    </v-list-tile-avatar>
                  </v-list-tile>
                  
                </v-list>
              </v-card>
              
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            
          <!-- ELECTIONS -->
          <v-flex xs12 sm10 d-flex>
            <div>
              <v-subheader>Your Elections</v-subheader>
              <v-card flat style="border: 1px solid #eee;">
                <v-tabs color="" class="" show-arrows slider-color="secondary">

                  <v-tab href="#tab-1" class="text-capitalize" v-if="isSameUser"> Managing </v-tab>

                  <v-tab href="#tab-2" class="text-capitalize"> Contested </v-tab>

                  <v-tab href="#tab-3" class="text-capitalize"> Enrolled</v-tab>

                  <v-tab-item value="tab-1" v-if="isSameUser">
                    <v-subheader v-if="myCreated.length == 0">You have not created any election yet</v-subheader>
                    <v-card flat>
                      <v-list two-line dense>
                        <template v-for="(election, i) in myCreated">
                          <v-list-tile avatar :key="election.electionId  + i" @click="'manage_dialog = true; managing = election.electionId'">
                            <v-list-tile-content>
                              <v-list-tile-title>{{election.title}}</v-list-tile-title>
                              <v-list-tile-sub-title>
                                <span class="online_badge" :class="[electionStatus(election)[1]]"></span>
                                {{electionStatus(election)[0]}}
                              </v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-divider :key="election.electionId  + i + 5" v-if="i + 1 != myCreated.length"></v-divider>
                        </template>
                      </v-list>
                    </v-card>
                  </v-tab-item>

                  <v-tab-item value="tab-2">
                    <v-subheader v-if="myContests.length == 0">No contests</v-subheader>
                    <v-list two-line dense>
                      <template v-for="(election, i) in myContests" >
                        <v-list-tile avatar :key="election.electionId  + i" @click="''">
                          <v-list-tile-content>
                            <v-list-tile-title>{{election.title}}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              <span class="online_badge" :class="[electionStatus(election)[1]]"></span>
                              {{electionStatus(election)[0]}}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider :key="election.electionId  + i + myContests.length" v-if="i + 1 != myContests.length"></v-divider>
                      </template>
                    </v-list>
                  </v-tab-item>

                  <v-tab-item value="tab-3">
                    <v-subheader v-if="myEnrolled.length == 0">You have not enrolled any election yet</v-subheader>
                    <v-list two-line dense>
                      <template v-for="(election,i) in myEnrolled">
                        <v-list-tile avatar @click="''" :key="election.electionId + 'df'">
                          <v-list-tile-content>
                            <v-list-tile-title>{{election.title}}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              <span class="online_badge" :class="[electionStatus(election)[1]]"></span>
                              {{electionStatus(election)[0]}}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider :key="election.electionId  + 'as'" v-if="i + 1 != myEnrolled.length"></v-divider>
                      </template>
                    </v-list>
                  </v-tab-item>
                </v-tabs>
              </v-card>
            </div>
          </v-flex>

        </v-layout>
        </v-card-text>
      </v-card>
    </transition>
  </div>
</template>
<script>
export default {
  data: () => ({
    showUi: false,
    myCreated:[],
    myContests:[],
    myEnrolled:[],
  }),
  props: {
    userId: {
      type: String,
    }
  },
  watch: {
    'user'(to,from){
      
      this.getManifestos()
    }
  },
  computed:{
    ...mapGetters([
      'getUser',
      'getUserInfo',
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
      'curProfile'
    ]),
    user(){
      return this.curProfile
    },
    isSameUser(){
      return this.getUser.uid == this.user.uid
    },
    stats(){
      return [
        {title:'Followers', value: this.user.followers ? this.user.followers.toLocaleString() : 0, icon: 'mdi-account-group',iconColor:'secondary'},
        {title:'Contests', value: this.myContests.length.toLocaleString(), icon:'mdi-trophy', iconColor:'orange'},
        {title:'Elections', value: this.myCreated.length.toLocaleString(), icon: 'mdi-vote', iconColor:'success'},
        {title:'Posts', value: this.user.posts ? this.user.posts.toLocaleString() : 0, icon: 'mdi-equalizer', iconColor: 'cyan'}
      ]
    },
  },
  methods: {
    async getCreated(){
      // election user created or is managing (is admin)
      let elecRef = db.collection('elections')
      let myArr = []
      elecRef.where('admins','array-contains',this.user.uid)
      .get().then(doc=>{
        myArr = []
        doc.forEach(item=>{
          //console.log(item.id, " => ", item.data());
          myArr.push(item.data())
        })
        this.myCreated = myArr
      })
    },
    async getContested(){
      let elecs = []
      // console.log(this.user)
      if(this.user.contests){

        this.user.contests.forEach(async contest =>{
          let doc  = await db.collection('elections').doc(contest).get()
          doc.exists ? elecs.push(doc.data()) : ''
        })
      }
      
      this.myContests = elecs.sort((a,b) => b.dateCreated.toMillis() - a.dateCreated.toMillis())
    },
    async getEnrolled(){
    
      let arr = []
      if(this.user.enrolled){

        for(const electionId of this.user.enrolled){
          // console.log(electionId)
          let doc = await db.collection('elections').doc(electionId).get()
          doc.exists ? arr.push(doc.data()) : ''
        }
      }
      this.myEnrolled = arr.sort((a,b) => b.dateCreated.toMillis() - a.dateCreated.toMillis())
    },
    electionStatus(election){
      // BEWARE THIS FUNCTION USES LOCAL TIME, WHICH MIGHT BE INACCURATE

      let start = new Date(election.startDate + ' ' + election.startTime).getTime();
      let one_hour = 1000 * 60 * 60
      if(start > Date.now()){
        return ['Not Started', 'secondary'] // not started
      }
      else if(start + election.duration * one_hour > Date.now()){
        return ['In Progress', 'success'] // in progress
      }
      else{
        return ['Ended','error'] // ended
      }
      
    },
    initialize(){
      if(this.isSameUser){
        Promise.all(
          [this.getCreated(), this.getContested(), this.getEnrolled()]
        ).then(done => {
          this.showUi = true
        }).catch(err => console.log(err))
      }
      
    }
  },
  mounted(){
    this.user ? this.initialize() : ''
    
  }
}
import { mapGetters, mapState } from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
</script>
