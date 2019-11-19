<template>
  <div>
    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi" height="40vh">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>
      
      <v-card flat style="" v-else>
        <v-card-text >
          
          <v-row row wrap justify="center" align="center">
            <v-col cols="12" sm="4" v-for="stat in stats" :key="stat.title">
              <v-card class="text-center" flat style="border: 1px solid #eee;" height="90">
                
                <v-list>
                  <v-list-item>
                    
                    <v-list-item-content>
                      <v-list-item-subtitle class="font-weight-bold">{{stat.title}}</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold">{{stat.value}}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-avatar >
                      <v-icon large :color="stat.iconColor">{{stat.icon}}</v-icon>
                    </v-list-item-avatar>
                  </v-list-item>
                  
                </v-list>
              </v-card>
              
            </v-col>
          </v-row>
          <v-row row wrap>
            
          <!-- ELECTIONS -->
          <v-col cols="12" sm="10">
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
                          <v-list-item :key="election.electionId  + i" @click="'manage_dialog = true; managing = election.electionId'">
                            <v-list-item-content>
                              <v-list-item-title>{{election.title}}</v-list-item-title>
                              <v-list-item-subtitle>
                                <span class="online_badge" :class="[electionStatus(election)[1]]"></span>
                                {{electionStatus(election)[0]}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider :key="election.electionId  + i + 5" v-if="i + 1 != myCreated.length"></v-divider>
                        </template>
                      </v-list>
                    </v-card>
                  </v-tab-item>

                  <v-tab-item value="tab-2">
                    <v-subheader v-if="myContests.length == 0">No contests</v-subheader>
                    <v-list two-line dense>
                      <template v-for="(election, i) in myContests" >
                        <v-list-item :key="election.electionId  + i" @click="''">
                          <v-list-item-content>
                            <v-list-item-title>{{election.title}}</v-list-item-title>
                            <v-list-item-subtitle>
                              <span class="online_badge" :class="[electionStatus(election)[1]]"></span>
                              {{electionStatus(election)[0]}}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider :key="election.electionId  + i + myContests.length" v-if="i + 1 != myContests.length"></v-divider>
                      </template>
                    </v-list>
                  </v-tab-item>

                  <v-tab-item value="tab-3">
                    <v-subheader v-if="getMyEnrolled && getMyEnrolled.length == 0">
                      You have not enrolled any election yet
                    </v-subheader>

                    <v-list two-line dense>
                      <template v-for="(election,i) in getMyEnrolled">
                        <v-list-item @click="''" :key="election.electionId + 'df'">
                          <v-list-item-content>
                            <v-list-item-title>{{election.title}}</v-list-item-title>
                            <v-list-item-subtitle>
                              <span class="online_badge" :class="[electionStatus(election)[1]]"></span>
                              {{electionStatus(election)[0]}}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider :key="election.electionId  + 'as'" v-if="i + 1 != getMyEnrolled.length"></v-divider>
                      </template>
                    </v-list>
                  </v-tab-item>
                </v-tabs>
              </v-card>
            </div>
          </v-col>

        </v-row>
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
  }),
  props: {
    username: {
      type: String,
    }
  },
  watch: {
    'user'(to,from){
      
      //this.getManifestos()
    }
  },
  computed:{
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
      'curProfile',
    ]),
    user(){
      return this.curProfile
    },
    isSameUser(){
      return this.getUser.username == this.username
    },
    stats(){
      return [
        {title:'Posts', value: this.user.posts ? this.user.posts.toLocaleString() : 0, icon: 'mdi-equalizer', iconColor: 'cyan'},
        // {title:'Followers', value: this.user.followers ? this.user.followers.toLocaleString() : 0, icon: 'mdi-account-group',iconColor:'secondary'},
        {title:'Contests', value: this.myContests.length.toLocaleString(), icon:'mdi-trophy', iconColor:'orange'},
        {title:'Elections', value: this.myCreated.length.toLocaleString(), icon: 'mdi-vote', iconColor:'success'},
      ]
    },
  },
  methods: {
    async getCreated(){
      // election user created or is managing (is admin)
      let arr = []
      this.$gun.get(this.getUser.username)
        .get('created')
        .map()
        .once(es => {
          console.log(es)
          arr.push(es)
        })
      this.myCreated = arr
    
    },
    async getContested(){
      let arr = []
      this.$gun.get(this.getUser.username)
        .get('contests')
        .map()
        .once(es => {
          this.$gun.get('elections')
            .get(es.electionId)
            .once(election => {

              console.log('contested: ', election)
              arr.push(election)
            })
        })
      
      this.myContests = arr.sort((a,b) => b.date_created - a.date_created)
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
          [this.getCreated(), this.getContested(),]
        ).then(done => {
          this.showUi = true
        }).catch(err => console.log(err))
      }

      else {
        this.$router.push(`/users/${this.username}/`)
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
