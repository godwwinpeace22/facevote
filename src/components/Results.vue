<template>
  <div>
    <!-- summary of results -->
    <v-container grid-list-sm class="grey lighten-3">
      <v-card flat class="grey lighten-5">
        <v-subheader class="font-weight-bold">Summary Of Results</v-subheader>
        <v-layout row wrap>

          <!-- ==== OVERVIEW ===== -->
          <v-flex xs12 sm4 d-flex class="pt-0">
            <v-card class="dflex">
              <v-subheader class="font-weight-bold">Overview</v-subheader>
              <v-list dense>
                <v-list-tile>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-list-tile-title>Start time</v-list-tile-title>
                    </v-flex>
                    <v-flex xs8> 
                      {{startTime}}
                    </v-flex>
                  </v-layout>
                </v-list-tile>
                <v-list-tile>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-list-tile-title>End time</v-list-tile-title>
                    </v-flex>
                    <v-flex xs8>{{endTime}}</v-flex>
                  </v-layout>
                </v-list-tile>
                <v-list-tile>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-list-tile-title>Duration</v-list-tile-title>
                    </v-flex>
                    <v-flex xs8>{{currElection.duration}}hrs</v-flex>
                  </v-layout>
                </v-list-tile>
                <v-list-tile>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-list-tile-title># of voters</v-list-tile-title>
                    </v-flex>
                    <v-flex xs8>{{currElection.regVoters.length}}</v-flex>
                  </v-layout>
                </v-list-tile>
                <v-list-tile>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-list-tile-title># of contestants</v-list-tile-title>
                    </v-flex>
                    <v-flex xs8>{{contestants.length}}</v-flex>
                  </v-layout>
                </v-list-tile>
              </v-list>
              <v-container grid-list-xs>
                <v-layout row wrap class="text-xs-center">
                  <v-flex xs4 justify-center>
                    <v-progress-circular style="display:block;margin:auto;"
                      :value="100" :size="$vuetify.breakpoint.sm ? 55 : 95"
                      color="teal"
                    >{{no_of_voters}}</v-progress-circular>
                    <div style="margin:auto;width:fit-content">Voters</div>
                  </v-flex>
                  <v-flex xs4 justify-center>
                    <v-progress-circular style="display:block;margin:auto;"
                      :value="100" :size="$vuetify.breakpoint.sm ? 55 : 95"
                      color="success"
                    >{{no_of_contestant}}</v-progress-circular>
                    <div style="margin:auto;width:fit-content">Contestants</div>
                  </v-flex>
                  <v-flex xs4 justify-center>
                    <v-progress-circular style="display:block;margin:auto;"
                      :value="allVotes || regVotes ? allVotes.length/regVoters.length * 100 : ''"
                      color="purple" :size="$vuetify.breakpoint.sm ? 55 : 95">
                      {{no_of_votes}}
                      </v-progress-circular>
                    <div style="margin:auto;width:fit-content">Votes</div>
                    
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>

          <!-- ==== WINNERS ===== -->
          <v-flex xs12 sm4 d-flex class="pt-0">
            <v-card class="dflex">
              <v-subheader class='font-weight-bold'>Winners</v-subheader>
              <v-list dense two-line>
                <div v-for="winner in winners" :key="`${winner.id}${winner.score}`">
                  <v-list-tile avatar>
                    <v-list-tile-avatar>
                      <img :src="winner.imgSrc || `https://ui-avatars.com/api/?name=${winner.name}`">
                    </v-list-tile-avatar>
                    <v-list-tile-content class='font-weight-bold'>
                      {{winner.name}}
                      <v-list-tile-sub-title>{{winner.score}} votes</v-list-tile-sub-title>
                    </v-list-tile-content>
                      
                      <v-list-tile-action class='font-weight-bold'> {{winner.role}}</v-list-tile-action>
                    
                  </v-list-tile>
                  <v-divider></v-divider>
                </div>
              </v-list>
            </v-card>
          </v-flex>

          <!-- ==== VOTER TURNOUT ===== -->
          <v-flex xs12 sm4 d-flex class="pt-0">
            <v-card class="dflex">
              <v-subheader class='font-weight-bold'>Voter turnout</v-subheader>
              <bar-chart :chart-data="chartData4" :options="chartOptions"></bar-chart>
            </v-card>
          </v-flex>

        </v-layout>
      </v-card>
    </v-container>

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
                  <img :src="contestant.imgSrc || `https://ui-avatars.com/api/?name=${contestant.name}`">
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
    date_options:{
      weekday: 'short', 
      year: 'numeric', 
      month: 'short',
      day:'numeric',
      hour:'numeric', 
      minute:'numeric'
    },
    valueDeterminate:50,
    items:[],
    sortedResults:[],
    winners:[],
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
    chartData4:{
      datasets: [{
        label:'# of stuff',
        data: [10, 20, 30],
        backgroundColor:['teal','yellow','purple'],
      }],
      labels: [
        'Red',
        'Yellow',
        'Blue'
      ]
    }
  }),
  props:['id','roles','currElection','allVotes',
    'regVoters','contestants', 'charDate3','countDownDate'
  ],
  computed:{
    endTime(){
      let a = this.currElection
      let enddate = new Date(a.startDate + ' ' + a.startTime)
      enddate.setHours(enddate.getHours() + a.duration)
      return enddate.toLocaleString('en-Us',
        this.date_options
      )
    },
    startTime(){
      let a = this.currElection
      let start_time = new Date(a.startDate + ' ' + a.startTime)
      return start_time.toLocaleString('en-Us',this.date_options)
    },
    no_of_voters(){
      if(this.regVoters){
        let len = 20000000
        
        switch (true){
          case len > 1000000:
            return len / 1000000 + 'M +'
            break;
          case len > 1000:
            return len / 1000 + 'K + '
            break;
          default:
            return len
        }
      }
    },
    // purposely duplicated this instead of merging
    // it with above as a method bcs it should be reactive
    no_of_contestant(){
      if(this.contestants){
        let len = 200
        
        switch (true){
          case len > 1000000:
            return len / 1000000 + 'M +'
            break;
          case len > 1000:
            return len / 1000 + 'K + '
            break;
          default:
            return len
        }
      }
    },
    no_of_votes(){
      if(this.allVotes){
        let len = 2000000
        
        switch (true){
          case len > 1000000:
            return len / 1000000 + 'M +'
            break;
          case len > 1000:
            return len / 1000 + 'K + '
            break;
          default:
            return len
        }
      }
    },
  },
  components:{
    'pie-chart':piechart,
    //'horizontal-bar':horizontalbar,
    'bar-chart':barchart,
    
  },
  methods:{
    getName(id){ // return the name of each contestant
      let user = this.contestants.filter(
        item => item._id == id
      )
      return user[0].userId.name
    },
    getDetail(id){ // return the name of each contestant
      let user = this.contestants.filter(
        item => item._id == id
      )
      return user[0].userId
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
    getWinner(role){
      let rl = this.results.filter(
        item => item.role == role
      ); // filter out other roles
      return rl.sort((a,b)=>{
        return b.score - a.score
      })[0] // this guy is the winner
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
    allWinners(){
      this.sortedResults.forEach(result => {
        let theWinner = this.getWinner(result.role)
        let him = this.getDetail(theWinner.id)
        this.winners.push({
          role:theWinner.role,
          name:him.name,
          imgSrc:him.imgSrc,
          id:theWinner.id,
          score:theWinner.score
        }
          
        )
        
      });
    }
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
    this.allWinners()
    console.log(this.contestants)
  },
  destroyed(){
    document.title = 'Vote | Facevote'
  }
}

import api from '@/services/api'
import piechart from '@/charts/piechart'
import barchart from '@/charts/barchart'
//import polararea from '@/charts/polararea'
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
