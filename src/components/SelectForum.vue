<template>
  <div>
    <navigation>
      <span slot="title">Dashboard</span>
      <h1 slot="extended_nav">Your Groups</h1>
    </navigation>

    <vue-headful
      :title="title"
    />

    <loading-bar v-if="show_loading_bar"></loading-bar>
    
    <intro v-if="!show_loading_bar && $store.getters.getMyEnrolled.length == 0" :text='no_forum_text'></intro>
    <v-container grid-list-xl :pa-5='$vuetify.breakpoint.mdAndUp' class="greyish_background" v-if="$store.getters.getMyEnrolled.length > 0">
      <v-subheader>Your connected groups</v-subheader>
      <v-card class=" round elevation-2 pa-4" :class="{'pa-5':$vuetify.breakpoint.mdAndUp}">
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 d-flex v-for='election in $store.getters.getMyEnrolled' :key="election._id" mb-2>
            <v-card color="randomColor" dark class="py-3" :to="'/forum/' + election.electionId">
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
    elections:[],
    show_loading_bar:true,
    no_forum_text:{data:'Enrolled,Perferendis cumq corp quos aliquid, praes inventore assumenda kkd opre perkj sf jkdd mond',action:{text:'Enroll',action_link:'/enroll'}}
  }),
  computed:{
    shouldPad(){
      return this.$vuetify.breakpoint.xsOnly ? false : true
    },
    randomColor(){
      let random = Math.floor(Math.random() * 10)
      let colors = [
      'cyan','success','secondary','primary','purple'
      ]
      return colors[random]
    }
  },
  methods:{
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
          
          this.$store.getters.getMyEnrolled ? 
          this.show_loading_bar = false : ''

          // get elections user enrolled in
          await this.getMyEnrolled(user)
          
          this.show_loading_bar = false
          
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
