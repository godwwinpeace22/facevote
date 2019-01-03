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
        <v-container grid-list-md class="pa-5">
          <v-subheader class="body-2 pl-0">Elections you created</v-subheader>
          <v-card class="pa-4 round" style="min-height:300px;">
            <v-layout row wrap mt-3 :justify-center='!data_available'>
              <v-subheader v-if="myCreatedElc.length == 0 && data_available" class="warning--text">You have not created any election yet</v-subheader>
              <v-progress-circular class="mt-3" v-if="!data_available" indeterminate color="grey lighten-1"></v-progress-circular>
              <v-flex xs12 sm6 md4 v-for="election in myCreatedElc" :key="election._id" mb-2 px-2>
                <v-card color="" dark class="" height="200" hover>
                  <v-layout row>
                    <v-flex xs7>
                      <v-card-title primary-title>
                        <div>
                          <div class=""><strong>{{election.title}}</strong></div>
                          <div>Registerd voters:</div>
                          <div>({{election.regVoters.length}})</div>
                        </div>
                      </v-card-title>
                    </v-flex>
                    <v-flex xs5>
                      <v-img
                        :src="election.logo || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'"
                        height="125px"
                        contain
                      ></v-img>
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
        <v-container grid-list-sm class="pa-5">
          <v-subheader class="body-2 pl-0">Elections you have enrolled in</v-subheader>
          <v-card class="pa-4 round" style="min-height:300px;">
            <v-layout row wrap mt-3 :justify-center='!data_available'>
              <v-subheader v-if="myEnrolledElc.length == 0 && data_available">You have not enrolled in any elections yet</v-subheader>
              <v-progress-circular class="mt-3" v-if="!data_available" indeterminate color="grey lighten-1"></v-progress-circular>

              <v-flex xs12 sm6 md4 v-for="election in myEnrolledElc" :key="election._id" mb-2 px-2>
                <v-card color="" class="" height="200" hover dark>
                  <v-layout row>
                    <v-flex xs7>
                      <v-card-title primary-title>
                        <div>
                          <div class=""><strong>{{election.title}}</strong></div>
                          <div>Registerd voters:</div>
                          <div>({{election.regVoters.length}})</div>
                        </div>
                      </v-card-title>
                    </v-flex>
                    <v-flex xs5>
                      <v-img
                        :src="election.logo || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'"
                        height="125px"
                        contain
                      ></v-img>
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
        <v-container grid-list-md class="pa-5">
          <v-subheader class="body-2 pl-0">Elections you contested in</v-subheader>
          <v-card class="pa-4 round" style="min-height:300px;">
            <v-layout row wrap mt-3 :justify-center='!data_available'>
              <v-subheader v-if="myContestedElc.length == 0 && data_available">You have not contested in any elections yet</v-subheader>
              <v-progress-circular class="mt-3" v-if="!data_available" indeterminate color="grey lighten-1"></v-progress-circular>

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
export default {
  data:()=>({
    title:'Manage Elections | Facevote',
    text:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio optio quidem, in aliquid laborum non nihil quasi id error, corrupti voluptatem consequatur nostrum blanditiis expedita omnis accusantium vitae veritatis aut?',
    model:'created',
    //myCreatedElc:[], // elections user created
    //myContestedElc:[], // elections user contested in
    //myEnrolledElc:[], // elections user enrolled in
    data_available:false,
  }),
  computed:{
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
    async getMyContests(user){
      let myArr = []
      //console.log(this.myEnrolledElc)
      this.myEnrolledElc.forEach(election=>{
        if(election.contestants.find(userId => userId == user.uid)){
          console.log(election)
          myArr.push(election)
        }
      })
      this.$store.dispatch('setMyContested', myArr)
      return myArr
    }
  },
  async mounted(){

    // get the elections the user created, contested, and voted in
    try {
      this.$store.getters.getMyCreated && this.$store.getters.getMyEnrolled && 
      this.$store.getters.getMyContested ? 
      this.data_available = true : ''
      //let res = await api().post(`dashboard/getElections/${this.$store.getters.getUser.username}`, {token:this.$store.getters.getToken})
      
      firebase.auth().onAuthStateChanged(async (user)=>{
      if (user) {

        // get election user created
        await this.getMyCreated(user)
        // get elections user enrolled in
        await this.getMyEnrolled(user)
        // get elections user contested in
        await this.getMyContests(user)
        this.data_available = true
        
      } else {
        console.log('No user is signed in.')
      }
    });
      
    } catch (error) {
      console.log(error)
    }
  },
  components:{
    Navigation
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
