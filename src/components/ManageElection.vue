<template>
  <v-card flat tile style="background:#eee;">
    <navigation >
      <v-tabs
        slot="extended_nav"
        v-model="model"
        color="teal"
        slider-color="yellow"
      >
        <v-tab
          v-for="item in ['created','enrolled','contested']"
          :key="item"
          :href="`#${item}`"
        >
          {{ item }}
        </v-tab>
      </v-tabs>
    </navigation>

    <vue-headful
      :title="title"
    />

    <v-tabs-items v-model="model">

      <v-tab-item value="created">
        <intro v-if="created_ready && no_created" :text='no_created_text'></intro>
        <loading-bar v-if="!created_ready"><div slot="loading_info">Loading elections...</div></loading-bar>
        <v-container grid-list-md :class="{'pa-5':$vuetify.breakpoint.mdAndUp}" v-if="created_ready && !no_created">
          <v-subheader class="body-2 pl-0">Elections you created</v-subheader>
          <v-card class="pa-4 round" style="min-height:300px;">
            <v-layout row wrap mt-3 >
              <v-flex xs12 sm6 md4 v-for="election in myCreatedElc" :key="election._id" mb-2 px-2>
                <v-card color="" dark class="purple" height="200" hover>
                  <v-layout row>
                    <v-flex xs12>
                      <v-card-title primary-title>
                        <div>
                          <div class=""><strong>{{election.title}}</strong></div>
                          <div>{{election.regVoters.length}} | Registerd voters</div>
                        </div>
                      </v-card-title>
                    </v-flex>
                  </v-layout>
                  <v-divider light></v-divider>
                  <v-card-actions class="pa-3">
                    <v-spacer></v-spacer>
                    <v-btn flat color="orange" :to="'/elections/watch/' + election.electionId">Explore</v-btn>
                    <v-btn flat color="orange" :to="'/elections/manage/' + election.electionId">Manage</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon >
                      <v-icon>share</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card>
        </v-container>
      </v-tab-item>

      <v-tab-item value="enrolled">
        <intro v-if="enrolled_ready && no_enrolled" :text='no_enrolled_text'></intro>
        <loading-bar v-if="!enrolled_ready"><div slot="loading_info">Loading elections...</div></loading-bar>
        <v-container grid-list-sm :class="{'pa-5':$vuetify.breakpoint.mdAndUp}" v-if="enrolled_ready && !no_enrolled">
          <v-subheader class="body-2 pl-0">Elections you have enrolled in</v-subheader>
          <v-card class="pa-4 round" style="min-height:300px;">
            <v-layout row wrap mt-3 >
              <v-flex xs12 sm6 md4 v-for="election in myEnrolledElc" :key="election._id" mb-2 px-2>
                <v-card color="" class="secondary" height="200" hover dark>
                  <v-layout row>
                    <v-flex xs12>
                      <v-card-title primary-title>
                        <div>
                          <div class=""><strong>{{election.title}}</strong></div>
                          <div>{{election.regVoters.length}} | Registerd voters</div>
                        </div>
                      </v-card-title>
                    </v-flex>
                  </v-layout>
                  <v-divider light></v-divider>
                  <v-card-actions class="pa-3">
                    <v-btn flat color="orange" :to="'/elections/watch/' + election.electionId">Explore</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon >
                      <v-icon>share</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card>
        </v-container>
      </v-tab-item>

      <v-tab-item value="contested">
        <intro v-if="contests_ready && no_contested" :text='no_contested_text'></intro>
        <loading-bar v-if="!contests_ready"><div slot="loading_info">Loading elections...</div></loading-bar>
        <v-container grid-list-sm :class="{'pa-5':$vuetify.breakpoint.mdAndUp}" v-if="contests_ready && !no_contested">
          <v-subheader class="body-2 pl-0">Elections you contested in</v-subheader>
          <v-card class="pa-4 round" style="min-height:300px;">
            <v-layout row wrap mt-3 >
              <v-flex xs12 sm6 md4 v-for="(contest,index) in myContestedElc" :key="index" mb-2 px-2 v-if="contest">
                <v-card color="" class="" dark height="200" hover >
                  <v-layout row>
                    <v-flex xs12>
                      <v-card-title primary-title>
                        <div>
                          <div class=""><strong>{{contest.title}}</strong></div>
                          <div>{{contest.regVoters.length}} | Registerd voters</div>
                          
                        </div>
                      </v-card-title>
                    </v-flex>
                  </v-layout>
                  <v-divider light></v-divider>
                  <v-card-actions class="pa-3">
                    <v-btn flat color="primary" class="text-capitalize" :to="'/elections/watch/' + contest.electionId">Explore</v-btn>
                    <v-btn flat color="primary" class="text-capitalize" to="/manifesto/create">Create manifesto</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card>
        </v-container>
      </v-tab-item>

    </v-tabs-items>
  
  </v-card>
</template>
<script>
import api from '@/services/api'
import Navigation from '@/components/Navigation'
import Intro from '@/components/Intro'
import LoadingBar from '@/spinners/LoadingBar'
export default {
  data:()=>({
    title:'Manage Elections | Facevote',
    no_created_text:{data:'Created, Perferendis cumq corp quos aliquid, praes inventore assumenda kkd opre perkj sf jkdd mond',action:{text:'Create Election',action_link:'/elections/create'}},
    no_contested_text:{data:'Contested, Perferendis cumq corp quos aliquid, praes inventore assumenda kkd opre perkj sf jkdd mond',action:{text:'Contest',action_link:'/contest'}},
    no_enrolled_text:{data:'Enrolled,Perferendis cumq corp quos aliquid, praes inventore assumenda kkd opre perkj sf jkdd mond',action:{text:'Enroll',action_link:'/enroll'}},
    text:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio optio quidem, in aliquid laborum non nihil quasi id error, corrupti voluptatem consequatur nostrum blanditiis expedita omnis accusantium vitae veritatis aut?',
    model:'created',
    created_ready:false,
    contests_ready:false,
    enrolled_ready:false,
  }),
  computed:{
    no_created(){
      return this.myCreatedElc.length > 0 ?
      false : true
    },
    no_contested(){
      return this.myContestedElc.length > 0 ?
      false : true
    },
    no_enrolled(){
      return this.myEnrolledElc.length > 0 ?
      false : true
    },
    myEnrolledElc(){
      return this.$store.getters.getMyEnrolled
    },
    myCreatedElc(){
      return this.$store.getters.getMyCreated
    },
    myContestedElc(){
      return this.$store.getters.getMyContested
    },
  },
  methods:{
    getMyCreated(user){
      return new Promise((resolve,reject)=>{
        let elecRef = db.collection('elections')
        let myArr = []
        elecRef.where('admin','==',user.uid).get().then(doc=>{
          myArr = []
          doc.forEach(item=>{
            console.log(item.id, " => ", item.data());
            myArr.push(item.data())
          })
          this.$store.dispatch('setMyCreated', myArr)
          resolve(myArr)
        }).catch(err=>reject(err))
      })
      
    },
    getMyEnrolled(user){
      return new Promise((resolve,reject)=>{
        let elecRef = db.collection('elections')
        let myArr = []
        elecRef.where('regVoters','array-contains',user.uid).get().then(doc=>{
          myArr = []
          doc.forEach(item=>{
            console.log(item.id, " => ", item.data());
            myArr.push(item.data())
          })

          this.$store.dispatch('setMyEnrolled', myArr)
          resolve(myArr)
        }).catch(err=>reject(err))
      })
      
    },
    getMyContests(user){
      return new Promise((resolve,reject)=>{
        let myArr = []
        this.myEnrolledElc.forEach(election=>{
          if(election.contestants.find(userId => userId == user.uid)){
            console.log(election)
            myArr.push(election)
          }
        })
        this.$store.dispatch('setMyContested', myArr)
        resolve(myArr)
      }).catch(err=> reject(err))
      
    }
  },
  created(){

    // get the elections the user created, contested, and voted in
    try {
      this.$store.getters.getMyCreated.length > 0 ?
      this.created_ready = true : ''
      
      this.$store.getters.getMyEnrolled.length > 0 ?
      this.enrolled_ready = true : ''
      this.$store.getters.getMyContested.length > 0 ?
      this.contests_ready = true : ''
      
      firebase.auth().onAuthStateChanged(async (user)=>{
      if (user) {

        // get election user created
        this.getMyCreated(user).then(d=>{
          console.log(d)
          this.created_ready = true
          this.getMyEnrolled(user).then(e=>{
            console.log(e)
            this.enrolled_ready = true
            this.getMyContests(user).then(done=>{
              this.contests_ready = true
              console.log(done)
            })
          })
        })
        
      } else {
        console.log('No user is signed in.')
      }
    });
      
    } catch (error) {
      console.log(error)
    }
  },
  components:{
    Navigation,
    LoadingBar,
    Intro,
  },
}
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
