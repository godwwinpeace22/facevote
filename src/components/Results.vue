<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex>
          
          <div v-for=" role in roles" :key="role +2">
            <h4 style='text-transform:capitalize;'>{{role}}</h4>
            <v-card color="grey lighten-3" class="mb-5" style="min-height:300px;">
              <v-layout row wrap mt-3>
                <v-flex xs4 v-for="(contestant,i) in results" :key="i" v-if="contestant.role == role" style="min-height:200px;">
                  <v-card  class=" mt-4 mx-4" hover >
                    <v-card-media
                      :src="'https://cdn.vuetifyjs.com/images/lists/' + (i*1 + 1) + '.jpg'"
                      height="140px"
                    ></v-card-media>

                    <v-card-title primary-title>
                      <div>
                        <h4 class=" mb-0" style='text-transform:capitalize;'>{{getName(contestant.id)}}</h4>
                        <h4 class=" mb-0" style='text-transform:capitalize;'>{{getPosition(contestant.role,contestant.score)}}</h4>
                        <h4 class=" mb-0" style='text-transform:capitalize;'>Number of votes: {{contestant.score}}</h4>
                      </div>
                    </v-card-title>

                    <v-card-actions>
                      <v-btn flat color="orange">Select</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
            <v-divider></v-divider>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data:()=>({
    results:[],
    roles:[],
    contestants:[],
  }),
  props:['electionId'],
  components:{
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu,
    ...VList,
    ...VBtn
  },
  methods:{
    getScores(results){
      let scores = [];
      let ids = [];
      for(role in results){
        
        let sortedVal = results[role].sort()
        sortedVal.forEach(id=>{
          if(ids.indexOf(id) == -1){
            let firstPos = sortedVal.indexOf(id);
            let lastPos = sortedVal.lastIndexOf(id);
            let score = lastPos - firstPos + 1;
            scores.push({id:id,score:score,role:role});
            ids.push(id);
          }
        })
      }
      return scores;
    },

    getName(id){ // return the name of each contestant
      let user = this.contestants.filter(
        item => item._id == id
      )
      return user[0].userId.name
    },
    getPosition(role,score){
      let rl = this.results.filter( // filter out other roles
        item => item.role == role
      );
      let scoreArr = [];
      rl.map(item=>{ // push each their score to scoreArr
        scoreArr.push(item.score)
      });

      // sort the array in descending order and find the position of the contestants score in that arr
      return scoreArr.sort((a,b)=>b - a).indexOf(score) == 0 ? 'winner'   :
        scoreArr.sort((a,b)=>b - a).indexOf(score) == 1 ? '1st runner up' :
        scoreArr.sort((a,b)=>b - a).indexOf(score) == 1 ? '2nd runner up' : 
        score + 'th'
    }
  },
  async mounted(){
    let res = await api().post(`dashboard/getresult/${this.electionId}`, {token:this.$store.getters.getToken});
    console.log(res.data.finalScores);
    //console.log(res.data.election.contestants);
    this.results = (res.data.finalScores).sort(
      (a,b) => b.score - a.score
    )
    this.roles = res.data.election.roles
    this.contestants = res.data.election.contestants
    console.log(this.contestants)
  }
}

import api from '@/services/api'
import * as VCard from 'vuetify/es5/components/VCard'
import * as VAvatar from 'vuetify/es5/components/VAvatar'
import * as VSubheader from 'vuetify/es5/components/VSubheader'
import * as VDivider from 'vuetify/es5/components/VDivider'
import * as VTabs from 'vuetify/es5/components/VTabs'
import * as VMenu from 'vuetify/es5/components/VMenu'
import * as VTooltip from 'vuetify/es5/components/VTooltip'
import * as VList from 'vuetify/es5/components/VList'
import * as VBtn from 'vuetify/es5/components/VBtn'
</script>

<style lang="scss" scoped>
  #online_badge{
    display: inline-block;
    background: green;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 5px;
  }
</style>
