<template>
  <div>
    <v-container grid-list-xl>
      <v-subheader>All results</v-subheader>
      <v-layout row wrap>
        <vue-headful
          :title="title"
        />
        <v-flex xs12 sm6 md4 v-for="result in sortedResults" :key="result.role" mb-3>
          <v-card>
            <v-card-text class="title">
              {{result.role}}
            </v-card-text>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-tile>
                <v-list-tile-content>Rank</v-list-tile-content>
                <v-list-tile-content class="align-end"># of votes</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-list-tile avatar v-for="(contestant,i) in result.contestants" :key="contestant.id">
                <v-list-tile-avatar>
                  <!--img :src="contestant.imgSrc"-->
                  {{i+1}}
                </v-list-tile-avatar>
                <v-list-tile-avatar>
                  <img :src="contestant.imgSrc">
                </v-list-tile-avatar>
                <v-list-tile-content>{{contestant.name}}
                  <v-progress-linear color="secondary" :value="percentage_score(contestant,result.role)"></v-progress-linear>
                </v-list-tile-content>
                <span class="align-end mr-3" style="font-size:15px;"> {{contestant.position  }}  </span>
                <span class="align-end">{{ contestant.score}}{{percentage_score(contestant)}}</span>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>


    <!--v-container>
      <v-layout>
        <v-flex>
          
          <div v-for=" role in roles" :key="role +2">
            <h4 style='text-transform:capitalize;'>{{role}}</h4>
            <v-card color="grey lighten-3" class="mb-5" style="min-height:300px;">
              <v-layout row wrap mt-3>
                <v-flex xs2 v-for="(contestant,i) in results" :key="i" v-if="contestant.role == role" style="min-height:200px;">
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
    </v-container-->

    <v-container grid-list-xl>
      <v-subheader>Charts</v-subheader>
      <v-layout row wrap>
        <v-flex xs12 sm4 md4 mb-3 v-for="role in roles" :key="role.title">
          <v-card class="d-flex">
            <v-container>
              <v-toolbar flat dense color="white" tabs>
                <v-toolbar-title><h5>{{role.title}}</h5></v-toolbar-title>
                <v-spacer></v-spacer>
                <!--v-btn color="success" small flat class="text-capitalize">switch chart</v-btn-->
                <v-tabs slot="extension"
                  v-model="model" right
                  color="" slider-color="yellow"
                >
                  <v-tab href="#tab-1">Bar</v-tab>
                  <v-tab href="#tab-2"> Pie</v-tab>
                </v-tabs>
              </v-toolbar>
              
              <v-tabs-items v-model="model">
                
                <v-tab-item value="tab-2">
                  <v-card flat>
                    <pie-chart :chart-data="chartData[role.title]" :options="chartOptions2"></pie-chart>
                  </v-card>
                </v-tab-item>
                <v-tab-item value="tab-1" >
                  <v-card flat>
                    <bar-chart :chart-data="chartData[role.title]" :options="chartOptions"></bar-chart>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
              
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Results | Facevote',
    results:[],
    model:'tab-1',
    valueDeterminate:50,
    items:[],
    sortedResults:[],
    chartData:{},
    chartOptions:{
      responsive: true, maintainAspectRatio: true,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
                beginAtZero: true
            }
          }]
      }
    },
    chartOptions2:{
      responsive: true, maintainAspectRatio: true,
      
    },
  }),
  props:['id','roles','contestants'],
  components:{
    'pie-chart':piechart,
    //'horizontal-bar':horizontalbar,
    'bar-chart':barchart
  },
  methods:{
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
      return scoreArr.sort((a,b)=>b - a).indexOf(score) == 0 ? '🏆'   :
        scoreArr.sort((a,b)=>b - a).indexOf(score) == 1 ? '2nd' :
        scoreArr.sort((a,b)=>b - a).indexOf(score) == 2 ? '3rd' : 
        score + 'th'
    },
    percentage_score(contestant,role){
      let total_score_for_role = this.sortedResults.find(a=> a.role == role)
      //console.log(total_score_for_role)
      total_score_for_role ? total_score_for_role = total_score_for_role.total_score : ''
      return total_score_for_role ?  contestant.score/total_score_for_role * 100 : ''
    },
    getImgSrc(id){
      return this.contestants.filter(item=> item._id == id)[0].userId.imgSrc
    },
    sortResults(){
      this.roles.forEach(role=>{
        let cont = []
        let total_score = 0
        for(let result of this.results){
          role.title == result.role ? cont.push({
            name:this.getName(result.id),
            score:result.score,
            imgSrc:this.getImgSrc(result.id),
            position:this.getPosition(role.title,result.score)
          }) : ''
          role.title == result.role ? total_score = total_score + result.score : ''
        }
        this.sortedResults.push({
          role:role.title,
          total_score:total_score,
          contestants:cont
        })
      })
    },
    getLabels(){
      
      this.roles.forEach(role=>{
        let mylabels = []
        let mydata = []
        let mybgdColor = []
        this.contestants.map(d=>{
          let bar = this.$store.state.allVotes.filter(item=> {
            return d._id == item.id && item.role == role.title
          })
          if(d.role == role.title){
            mylabels.push(d.userId.name)
          }
          bar[0] ? mydata.push(bar[0].score) : ''
          let random1 = Math.floor(Math.random() * Math.floor(255))
          let random2 = Math.floor(Math.random() * Math.floor(255))
          let random3 = Math.floor(Math.random() * Math.floor(255))
          d.role == role.title ? mybgdColor.push(`rgba(${random1}, ${random2},  ${random3}, 0.5)`) : ''
        })
        this.chartData[role.title] = {
          labels:mylabels,
          datasets :[
            {
              label: '# of votes',
              backgroundColor: mybgdColor,
              data: mydata,
            }
          ]
        }
        console.log(this.chartData[role.title])

      })
      
    }, 
  },
  async mounted(){
    let res = await api().post(`dashboard/getresult/${this.id}`, {token:this.$store.getters.getToken});
    console.log(res.data.finalScores);
    console.log(res.data)
    //console.log(res.data.election.contestants);
    this.results = (res.data.finalScores).sort(
      (a,b) => b.score - a.score
    )
    this.sortResults()
    this.getLabels()
    console.log(this.contestants)
  },
  destroyed(){
    document.title = 'Vote | Facevote'
  }
}

import api from '@/services/api'
import piechart from '@/charts/piechart'
import barchart from '@/charts/barchart'
import horizontalbar from '@/charts/horizontalbar'
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
