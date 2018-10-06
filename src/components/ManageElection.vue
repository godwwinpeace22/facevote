<template>
  <v-card flat>
    <v-container v-bind="{ '[grid-list-sm]': true }">
      <span class="body-2 ">Elections you created</span>
      <v-divider ></v-divider>
      <v-layout row wrap mt-3>
        <span v-if="myCreatedElc.length == 0">You have not contested in any elections yet</span>
        <v-flex xs4 v-for="election in myCreatedElc" px-2 :key="election._id" style="min-height:200px;">
          <v-card hover tile >
            <v-card-title primary-title><h4 class="subheading">{{election.title}}</h4></v-card-title>
            <v-card-actions>
              <v-btn flat color="orange" :to="'/dashboard/elections/watch/id/' + election.electionId">Explore</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon >
                <v-icon>share</v-icon>
              </v-btn>
              <v-btn icon @click="deleteElection(election.electionId)">
                <v-icon >delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
          
        </v-flex>
      </v-layout>
    </v-container>

    
    <v-container v-bind="{ '[grid-list-sm]': true }">
      <span class="body-2">Elections you have enrolled in</span>
      <v-divider ></v-divider>
      <v-layout row wrap mt-3>
        <span v-if="myEnrolledElc.length == 0">You have not enrolled in any elections yet</span>
        <v-flex xs4 v-for="election in myEnrolledElc" px-2 :key="election._id" style="min-height:200px;">
          <v-card hover  dark >
            <v-card-title primary-title><h4 class="subheading">{{election.title}}</h4></v-card-title>
            <v-card-actions>
              <v-btn flat color="orange" :to="'/dashboard/elections/watch/id/' +election.electionId">Explore</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon >
                <v-icon>share</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon >delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container v-bind="{ '[grid-list-sm]': true }">
      <span class="body-2">Elections you contested in</span>
      <v-divider ></v-divider>
      <v-layout row wrap mt-3>
        <span v-if="myContestedElc.length == 0">You have not contested in any elections yet</span>
        <v-flex xs4 v-for="contest in myContestedElc" px-2 :key="contest._id" v-if="contest.electionRef" style="min-height:200px;">
          <v-card hover  dark >
            <v-card-title primary-title><h4 class="subheading">{{contest.electionRef.title}}</h4></v-card-title>
            <v-card-actions>
              <v-btn flat color="orange" :to="'/dashboard/elections/watch/id/' +contest.electionRef.electionId">Explore</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon >
                <v-icon>share</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon >delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
import api from '@/services/api'
import * as VCard from 'vuetify/es5/components/VCard'
import * as VAvatar from 'vuetify/es5/components/VAvatar'
import * as VSubheader from 'vuetify/es5/components/VSubheader'
import * as VDivider from 'vuetify/es5/components/VDivider'
import * as VTabs from 'vuetify/es5/components/VTabs'
import * as VMenu from 'vuetify/es5/components/VMenu'
import * as VTooltip from 'vuetify/es5/components/VTooltip'
export default {
  data:()=>({
    text:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio optio quidem, in aliquid laborum non nihil quasi id error, corrupti voluptatem consequatur nostrum blanditiis expedita omnis accusantium vitae veritatis aut?',
    myCreatedElc:[], // elections user created
    myContestedElc:[], // elections user contested in
    myEnrolledElc:[], // elections user enrolled in
  }),
  methods:{
    async deleteElection(electionId){
      try {
        //let resp = await api().post(`dashboard/deleteElection/${electionId}`, {token:this.$store.getters.getToken})
        //console.log(resp.data)
        //filter out the election deleted from the mycreated list
      } catch (error) {
        
      }
    }
  },
  async mounted(){
    
    // get the elections the user created, contested, and voted in
    try {
      let res = await api().get(`dashboard/getElections/${this.$store.getters.getUser._id}/${this.$store.getters.getToken}`)
      
      this.myCreatedElc = res.data.created
      this.myContestedElc = res.data.contested
      this.myEnrolledElc = res.data.enrolled
      // eslint-disable-next-line
      console.log(res)
    } catch (error) {
      // eslint-disable-next-line
      console.log(error)
    }
  },
  components:{
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu
  },
}
</script>
