<template>
  <div>
    <!-- summary of results -->
    <v-container grid-list-sm class="mt-3 round grey lighten-3">
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
                
                <div v-for="(winnersInEachRole,i) in winners" :key="winnersInEachRole.length + Math.random() * i">
                  
                  <v-list-tile avatar v-for="winner in winnersInEachRole" :key="winner.id">
                    <v-list-tile-avatar>
                      <img :src="getDetail(winner.id).photoURL || `https://ui-avatars.com/api/?name=${getName(winner.id)}`">
                    </v-list-tile-avatar>
                    <v-list-tile-content class='font-weight-bold'>
                      {{getName(winner.id)}}
                      <v-list-tile-sub-title>{{winner.score}} votes</v-list-tile-sub-title>
                    </v-list-tile-content>
                      <!-- if there are ties in the scores -->
                      <v-list-tile-action class='font-weight-bold' v-if='winnersInEachRole.length > 1'>
                        <v-tooltip top>
                          <v-btn color="purple" slot='activator' dark icon class='text-capitalize mr-2'>Tie</v-btn>
                          <span>There was a tie for this role</span>
                        </v-tooltip>
                        
                      </v-list-tile-action>

                      <v-list-tile-action class='font-weight-bold'> {{winner.role}}</v-list-tile-action>
                    
                  </v-list-tile>
                  <v-divider></v-divider>
                </div>
                <!-- no ties -->
                <!--div v-for="winner in winners" :key="`${winner.id}${winner.score}`"
                  v-else>
                  <v-list-tile avatar v-for="winner in winner" :key="winner.id">
                    <v-list-tile-avatar>
                      <img :src="getDetail(winner.id).photoURL || `https://ui-avatars.com/api/?name=${getName(winner.id)}`">
                    </v-list-tile-avatar>
                    <v-list-tile-content class='font-weight-bold'>
                      {{getName(winner.id)}}
                      <v-list-tile-sub-title>{{winner.score}} votes</v-list-tile-sub-title>
                    </v-list-tile-content>
                      
                      <v-list-tile-action class='font-weight-bold'> {{winner.role}}</v-list-tile-action>
                    
                  </v-list-tile>
                  <v-divider></v-divider>
                </div-->
              </v-list>
            </v-card>
          </v-flex>

          <!-- ==== VOTER TURNOUT ===== -->
          <v-flex xs12 sm4 d-flex class="pt-0">
            <v-card class="dflex">
              <v-subheader class='font-weight-bold'>Voter turnout</v-subheader>

              <!-- turnout in a department election -->
              <pie-chart v-if="currElection.type == 'School' && currElection.level == 'Department'"
                :chart-data="chartData4" :options="chartOptions">
              </pie-chart>

              <!-- turnout by department in a faculty election -->
              <bar-chart v-if="currElection.type == 'School' && currElection.level == 'Faculty'" 
                :chart-data="chartData5" :options="chartOptions">
              </bar-chart>

              <!-- turnout by faculty in a school election-->
              <bar-chart v-if="currElection.type == 'School' && currElection.level == 'School'" 
                :chart-data="chartData6" :options="chartOptions">
              </bar-chart>
            </v-card>
          </v-flex>

        </v-layout>
      </v-card>
    </v-container>

    <!-- All Results -->
    <v-container grid-list-xl class="px-0">
      <v-subheader>All results</v-subheader>
      <v-card class="round pa-4 grey lighten-3">
        <v-layout row wrap>
          <vue-headful
            :title="title"
          />
          <v-flex xs12 sm6 md4 v-for="result in sortedResults" :key="result.role" mb-3>
            <v-card>
              <v-card-text class="title text-capitalize">
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
                    <!--accomodate for ties in result-->
                    <template v-if="i == 0">{{i+1}}</template>
                    <template v-if="i != 0">
                      <template v-if="i != 0 && result.contestants[i].score == result.contestants[i-1].score">{{i}}</template>
                      <template v-if="i != 0 && result.contestants[i].score != result.contestants[i-1].score">{{i+1}}</template>
                    </template>
                  </v-list-tile-avatar>
                  <v-list-tile-avatar>
                    <img :src="contestant.photoURL || `https://ui-avatars.com/api/?name=${contestant.name}`">
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
      </v-card>
    </v-container>

    <!-- Charts -->
    <v-container grid-list-xl class="px-0">
      <v-subheader class="font-weight-bold">Charts</v-subheader>
      <v-card class="round pa-4 pt-5 grey lighten-3">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 mb-3 v-for="role in roles" :key="role.title">
            <v-card class="d-flex">
              <v-container>
                <v-toolbar flat dense color="white" tabs>
                  <v-toolbar-title><h5 class="text-capitalize">{{role.title}}</h5></v-toolbar-title>
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
      </v-card>
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
    chartData4:{},
    /*chartData4:{
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
    },*/
    chartData5:{},
    chartData6:{},
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
          case len > 1000:
            return len / 1000 + 'K + '
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
          case len > 1000:
            return len / 1000 + 'K + '
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
          case len > 1000:
            return len / 1000 + 'K + '
          default:
            return len
        }
      }
    },
    ...mapGetters([
      'isAuthenticated',
      'getToken',
      'getUser',
      'getSchools',
      'getContestants',
      'getCurElection',
      'getCurElectionResults',
      'getCurElectionActivities'
      // ...
    ]),
  },
  components:{
    'pie-chart':piechart,
    //'horizontal-bar':horizontalbar,
    'bar-chart':barchart,
    
  },
  methods:{
    getName(id){ // return the name of each contestant
      let user = this.contestants.filter(
        item => item.uid == id
      )
      return user[0].name
    },
    getDetail(id){ // return the name of each contestant
      let user = this.contestants.filter(
        item => item.uid == id
      )
      return user[0]
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

      let uniqueScores = []
      rl.forEach(item => {
        if(uniqueScores.indexOf(item.score) == -1){
          uniqueScores.push(item.score)
        }
      });
      
      let theHighestScore = uniqueScores.sort((a,b) => b-a)[0]
      //find all results with the highest unique score
      return rl.filter(result => result.score == theHighestScore)
    },
    percentage_score(contestant,role){
      let total_score_for_role = this.sortedResults.find(a=> a.role == role)
      //console.log(total_score_for_role)
      total_score_for_role ? total_score_for_role = total_score_for_role.total_score : ''
      return total_score_for_role ?  contestant.score/total_score_for_role * 100 : ''
    },
    getImgSrc(id){
      return this.contestants.filter(item=> item.uid == id)[0].photoURL
    },
    sortResults(){
      this.roles.forEach(role=>{
        let cont = []
        let total_score = 0
        for(let result of this.results){
          role.title == result.role ? cont.push({
            name:this.getName(result.id),
            score:result.score,
            photoURL:this.getImgSrc(result.id),
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
        //console.log(this.allVotes)
        let mylabels = []
        let mydata = []
        let mybgdColor = []
        this.contestants.map(d=>{
          
          let bar = this.allVotes.filter(item=> {
            return d.uid == item.id && item.role == role.title
          })
          
          if(d.contestsRef.find(elec => elec.electionRef == this.currElection.electionId)
            .role == role.value){
            mylabels.push(d.name)
          }
          bar[0] ? mydata.push(bar[0].score) : ''
          let random1 = Math.floor(Math.random() * Math.floor(255))
          let random2 = Math.floor(Math.random() * Math.floor(255))
          let random3 = Math.floor(Math.random() * Math.floor(255))
          d.contestsRef.find(elec => elec.electionRef == this.currElection.electionId)
            .role == role.value ? 
            mybgdColor.push(`rgba(${random1}, ${random2},  ${random3}, 0.5)`) : ''
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
        //console.log(this.chartData[role.title])

      })
      
    },
    allWinners(){
      this.sortedResults.forEach(result => {
        //console.log(result)
        if(result.contestants.length > 0){
          // the winners for each role ( if there is no tie then there is only one winner)
          let theWinners = this.getWinner(result.role)
          //console.log(theWinners)
          if(theWinners){
            this.winners.push(theWinners) // winners in all the roles
          }
        }
      });
      //console.log(this.winners)
    },
    truncateText(text){
      return text.replace(/(.{12})..+/, "$1...");
    },
    async deptTurnout(){
      let members = [] // voters in the same dept
      db.collection('moreUserInfo')
      .where('department','==',this.currElection.department)
      .where('school','==',this.currElection.school)
      .get().then(querySnapshot=>{
        
        querySnapshot.forEach(doc=>{
          members.push(doc.data())
        })

        let enrolled = this.regVoters.length
        let not_enrolled = members.length - enrolled
        //console.log(enrolled,not_enrolled)
        this.chartData4 = {
          datasets: [{
            data: [enrolled, not_enrolled],
            backgroundColor:['teal','yellow'],
          }],
          labels: [
            'Enrolled',
            'Not enrolled'
          ]
        }
      })
    },
    async findAFaculty(){
      let faculty = await api().post('dashboard/findAFaculty/' + this.currElection.faculty + '/' + this.currElection.school)
      //console.log(faculty)
      return faculty.data
    },
    async findASchool(school){
      let found = await api().post('dashboard/getASchool/'+school)
      console.log('findASchool: ', found)
      return found.data
    },
    async turnoutByDepartment(){
      let thisFaculty = await this.findAFaculty()
      
      let votersByDept = {}
      
      thisFaculty.departments.forEach(dept=>{
        let members = this.regVoters.filter(voter => voter.department == dept.text)
        votersByDept[dept.text] = members.length
      })

      //console.log(votersByDept)
      this.chartData5 = {
        datasets: [{
          label:'Turnout by department',
          data: Object.values(votersByDept),
          backgroundColor:['teal','yellow','purple','cyan','lemon','blue','pink','orange','grey'],
        }],
        labels: Object.keys(votersByDept).map(key =>{
          return this.truncateText(key)
        })
      }
    
    },
    async turnoutByFaculty(){
      let thisSchool = await this.findASchool(this.currElection.school)
      
      let votersByFaculty = {}
      
      thisSchool.faculties.forEach(fac=>{
        let members = this.regVoters.filter(voter => voter.faculty == fac.abbr)
        votersByFaculty[faculty.abbr] = members.length
      })

      //console.log(votersByDept)
      this.chartData6 = {
        datasets: [{
          label:'Turnout by faculty',
          data: Object.values(votersByFaculty),
          backgroundColor:['teal','yellow','purple','cyan','lemon','blue','pink','orange','grey'],
        }],
        labels: Object.keys(votersByFaculty).map(key =>{
          return this.truncateText(key)
        })
      }
    
    },
    
  },
  async mounted(){
    if(this.getCurElection.electionId == this.id){
      this.results = this.getCurElectionResults

      this.results = (res.data.finalScores).sort(
        (a,b) => b.score - a.score
      )

      this.sortResults()
      this.currElection.level == 'Department' ? this.deptTurnout() : ''
      this.currElection.level == 'Faculty' ? this.turnoutByDepartment() : ''
      this.currElection.level == 'School' ? this.turnoutByFaculty() : ''
      this.getLabels()
      this.allWinners()
    }
    
    
    this.results = (this.allVotes).sort(
      (a,b) => b.score - a.score
    )
    //console.log(this.results)
    this.currElection.level == 'Department' ? this.deptTurnout() : ''
    this.currElection.level == 'Faculty' ? this.turnoutByDepartment() : ''
    this.currElection.level == 'School' ? this.turnoutByFaculty() : ''
    this.sortResults()
    this.getLabels()
    this.allWinners()
    //console.log(this.contestants)
  },
  destroyed(){
    document.title = 'Vote | Facevote'
  }
}

import api from '@/services/api'
import {mapGetters} from 'vuex'
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
