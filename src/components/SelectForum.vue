<template>
  <div>
    <navigation>
      <span slot="title">Dashboard</span>
      <h1 slot="extended_nav">Your Groups</h1>
    </navigation>

    <vue-headful
      :title="title"
    />

    
    <intro v-if="ready && elections.length == 0" :text='no_forum_text'></intro>
     <v-container grid-list-lg>
       <v-card class="round">
        <loading-bar v-if="!ready" height="50vh"><div slot="loading_info">Loading groups...</div></loading-bar>
       </v-card>
     </v-container>

    <v-container grid-list-xl v-if="ready && elections.length > 0" :pa-5='$vuetify.breakpoint.mdAndUp' class="greyish_background">
      <v-subheader>Your connected groups</v-subheader>

      <v-card class=" round elevation-2 pa-4" :class="{'pa-5':$vuetify.breakpoint.mdAndUp}">
        <v-layout row wrap>

          <v-flex xs12 sm6 md4 d-flex v-for='election in elections' :key="election._id" mb-2>
            <v-card dark class="py-3" :to="'/forum/' + election.electionId">
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
    title:'Your connected groups | Facevote',
    ready:false,
    no_forum_text:{data:'Enrolled,Perferendis cumq corp quos aliquid, praes inventore assumenda kkd opre perkj sf jkdd mond',action:{text:'Enroll',action_link:'/enroll'}}
  }),
  computed:{
    shouldPad(){
      return this.$vuetify.breakpoint.xsOnly ? false : true
    },
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
    },
    randomColor(){
      let random = Math.floor(Math.random() * 6)
      let indexArr = []
      let colors = [
      'cyan','success','secondary','primary','purple'
      ]
      if(indexArr[indexArr.length -1] != random){
        indexArr.push(random)
        return colors[random]
      }else{
        this.randomColor()
      }
      
    }
  },
  methods:{
    getMyCreated(user){
      return new Promise((resolve,reject)=>{
        let elecRef = db.collection('elections')
        let myArr = []
        elecRef.where('admin','==',user.email).get().then(doc=>{
          myArr = []
          doc.forEach(item=>{
            console.log(item.id, " => ", item.data());
            myArr.push(item.data())
          })
          this.$store.dispatch('setMyCreated', myArr)
          resolve(myArr)
        }).catch(err=>{
          reject(err)
        })
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
        }).catch(err=>{
          reject(err)
        })
      })
      
    }
  },
  created(){
    firebase.auth().onAuthStateChanged(async (user)=>{
      if (user) { 
        
        this.$store.getters.getMyEnrolled.length > 0 && 
        this.$store.getters.getMyCreated.length > 0 ? 
        this.ready = true : ''

        // get elections user enrolled in or created
        this.getMyEnrolled(user).then(myenrolled=>{
          this.getMyCreated(user).then(mycreated=>{
            this.ready = true;
            console.log(mycreated)
          })
        })
        
      } else {
        console.log('No user is signed in.')
      }
    })
  },
  components:{
    Navigation,
    LoadingBar,
    Intro,
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
