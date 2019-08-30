<template>
  <div :class="{grey:$vuetify.breakpoint.smAndDown}" class="lighten-3">
    <!-- summary of results -->
    <v-container grid-list-sm="$vuetify.breakpoint.smAndUp" :mt-3="$vuetify.breakpoint.mdAndUp" class="grey lighten-3" 
      :class="{round: $vuetify.breakpoint.mdAndUp}" :pa-0="$vuetify.breakpoint.xsOnly">
      <v-card flat class="grey lighten-5">
        <v-subheader class="font-weight-bold">Summary Of Results</v-subheader>
        <v-layout row wrap>

          <!-- ==== OVERVIEW ===== -->
          <v-flex xs12 sm6 md4 d-flex class="pt-0" :mb-2="$vuetify.breakpoint.smAndUp">
            <v-card class="dflex" :flat="$vuetify.breakpoint.xsOnly">
              <v-subheader class="font-weight-bold">Overview</v-subheader>
              <v-list dense>
                <v-list-tile>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-list-tile-title>Start time</v-list-tile-title>
                    </v-flex>
                    <v-flex xs8> 
                      {{currElection.timed ? startTime : 'Not specified'}}
                    </v-flex>
                  </v-layout>
                </v-list-tile>
                <v-list-tile>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-list-tile-title>Status</v-list-tile-title>
                    </v-flex>
                    <v-flex xs8> 
                      {{status.inprogress ? 'In progress' : 'Ended'}}
                    </v-flex>
                  </v-layout>
                </v-list-tile>
                <v-list-tile>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-list-tile-title>End time</v-list-tile-title>
                    </v-flex>
                    <v-flex xs8>{{currElection.timed ? endTime : 'Not specified'}}</v-flex>
                  </v-layout>
                </v-list-tile>
                <v-list-tile>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-list-tile-title>Duration</v-list-tile-title>
                    </v-flex>
                    <v-flex xs8>{{currElection.timed ? currElection.duration + ' hrs' : 'Not specified'}}</v-flex>
                  </v-layout>
                </v-list-tile>
                <v-list-tile>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-list-tile-title># of voters</v-list-tile-title>
                    </v-flex>
                    <v-flex xs8>{{currElection.voters}}</v-flex>
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

              <!-- CIRCULAR PROGRESS BAR FOR STATS -->
              <v-container grid-list-xs>
                <v-layout row wrap class="text-xs-center">
                  <v-flex xs4 justify-center>
                    <v-progress-circular style="display:block;margin:auto;"
                      :value="100" :size="$vuetify.breakpoint.sm ? 55 : 75"
                      color="teal"
                    >{{no_of_voters}}</v-progress-circular>
                    <div style="margin:auto;display:table;">Voters</div>
                  </v-flex>
                  <v-flex xs4 justify-center>
                    <v-progress-circular style="display:block;margin:auto;"
                      :value="100" :size="$vuetify.breakpoint.sm ? 55 : 75"
                      color="success"
                    >{{no_of_contestant}}</v-progress-circular>
                    <div style="margin:auto;display:table;">Contestants</div>
                  </v-flex>
                  <v-flex xs4 justify-center>
                    <v-progress-circular style="display:block;margin:auto;"
                      :value="allVotes || regVotes ? rawVotes.length/regVoters.length * 100 : ''"
                      color="purple" :size="$vuetify.breakpoint.sm ? 55 : 75">
                      {{no_of_votes}}
                      </v-progress-circular>
                    <div style="margin:auto;display:table;">Voted</div>
                    
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>

          <!-- ==== WINNERS ===== -->
          <v-flex xs12 sm6 :md4="this.currElection.type == 'School'" :md8="this.currElection.type != 'School'" 
            d-flex class="pt-0" mb-2="$vuetify.breakpoint.smAndUp">
            <v-card class="dflex" :flat="$vuetify.breakpoint.xsOnly">
              <v-subheader class='font-weight-bold'>Winners 
                <span v-if="status.inprogress" class="pl-3 green--text"> (Voting in progress)</span>
                <span v-if="status.election_ended" class="pl-3 orange--text">Voting Ended</span>
              </v-subheader>
              
              <v-list dense two-line>
                <v-subheader v-if="winners.length == 0">No contestants</v-subheader>
                <div v-for="(winnersInEachRole,i) in winners" :key="winnersInEachRole.length + Math.random() * i">
                  
                  <v-list-tile avatar v-for="winner in winnersInEachRole" :key="winner.id">
                    <v-list-tile-avatar :color="$helpers.colorMinder(getName(winner.id).charAt(0))">
                      <img :src="getDetail(winner.id).photoURL" v-if="getDetail(winner.id).photoURL">
                      <span class="white--text text-capitalize" v-else>{{getName(winner.id).charAt(0)}}</span>
                    </v-list-tile-avatar>
                    <v-list-tile-content class='font-weight-bold text-capitalize'>
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
              </v-list>
            </v-card>
          </v-flex>

          <!-- ==== VOTER TURNOUT ===== -->
          <v-flex sm12 md4 d-flex class="pt-0" v-if="currElection.type == 'School'" mb-2="$vuetify.breakpoint.smAndUp">
            <v-card class="d-block" style="width:100%;" :flat="$vuetify.breakpoint.xsOnly">
              <v-subheader class='font-weight-bold'>Voter turnout
                <v-tooltip left max-width="300px">
                  <v-btn icon slot="activator" dark small>
                    <v-icon color="black" small>mdi-help-circle-outline</v-icon>
                  </v-btn>
                  <span v-if="currElection.level == 'Faculty'">This chart compares the number of people that voted in each department</span>
                  <span v-if="currElection.level == 'General'">This chart compares the number of people that voted in each faculty</span>
                </v-tooltip>
              </v-subheader>

              <!-- turnout in a department election -->
              <pie-chart v-if="currElection.type == 'School' && currElection.level == 'Department'"
                :chart-data="chartData4" :options="chartOptions">
              </pie-chart>

              <!-- turnout by department or faculty in a faculty or school election -->
              <bar-chart v-if="currElection.type == 'School' && currElection.level != 'Department'" 
                :chart-data="chartData4" :options="chartOptions">
              </bar-chart>
            </v-card>
          </v-flex>

        </v-layout>
      </v-card>
    </v-container>

    <!-- All Results -->
    <v-container :grid-list-xl="$vuetify.breakpoint.smAndUp" class="px-0" >
      <v-subheader>All results</v-subheader>
      <v-card class="lighten-3" :class="{grey:$vuetify.breakpoint.smAndUp, 'pa-4': $vuetify.breakpoint.smAndUp, 
        round:$vuetify.breakpoint.mdAndUp}" :flat="$vuetify.breakpoint.smAndDown">
        <v-layout row wrap>
          <vue-headful
            :title="title"
          />
          <v-flex d-flex xs12 sm6 md4 v-for="result in sortedResults" :key="result.role" mb-3>
            <v-card :flat="$vuetify.breakpoint.xsOnly">
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
              <v-list dense>
                <v-subheader v-if="result.contestants && result.contestants.length == 0">No contestants</v-subheader>
                <v-list-tile avatar v-for="(contestant,i) in result.contestants" :key="contestant.id">
                  
                  <v-list-tile-avatar>
                    <!--accomodate for ties in result-->
                    <template v-if="i == 0">{{i+1}}</template>
                    <template v-if="i != 0">
                      <template v-if="i != 0 && result.contestants[i].score == result.contestants[i-1].score">{{i}}</template>
                      <template v-if="i != 0 && result.contestants[i].score != result.contestants[i-1].score">{{i+1}}</template>
                    </template>
                  </v-list-tile-avatar>
                  <v-list-tile-avatar :color="contestant.photoURL ? '' : $helpers.colorMinder(contestant.name.charAt(0))">
                    <img :src="contestant.photoURL" v-if="contestant.photoURL">
                    <span v-else class="white--text text-capitalize">{{contestant.name.charAt(0)}}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <span class="text-capitalize">{{$helpers.truncateText(contestant.name, 20)}}</span>
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
    <v-container :grid-list-xl="$vuetify.breakpoint.smAndUp" class="px-0" :pa-0="$vuetify.breakpoint.xsOnly">
      <v-subheader class="font-weight-bold">Charts</v-subheader>
      <v-card class=" lighten-3" :class="{round:$vuetify.breakpoint.mdAndUp, 
        grey: $vuetify.breakpoint.smAndUp, 'pa-4': $vuetify.breakpoint.smAndUp, 'pt-5': $vuetify.breakpoint.smAndUp}" :flat="$vuetify.breakpoint.smAndDown">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 mb-3 v-for="role in roles" :key="role.title">
            <v-card class="d-flex" :flat="$vuetify.breakpoint.xsOnly">
              <v-container>
                <v-toolbar flat dense color="white" tabs>
                  <v-toolbar-title><h5 class="text-capitalize">{{role.title}}</h5></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <!--v-btn color="success" small flat class="text-capitalize">switch chart</v-btn-->
                  <v-tabs slot="extension"
                    v-model="model[role.value]" right
                    color="" slider-color="yellow"
                  >
                    <v-tab href="#tab-1">Bar</v-tab>
                    <v-tab href="#tab-2"> Pie</v-tab>
                  </v-tabs>
                </v-toolbar>
                
                <v-tabs-items v-model="model[role.value]">
                  
                  <v-tab-item value="tab-1">
                    <v-card flat>
                      <bar-chart :chart-data="chartData[role.title] ? chartData[role.title] : {}" :options="chartOptions"></bar-chart>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item value="tab-2" >
                    <v-card flat>
                      <pie-chart :chart-data="chartData[role.title] ? chartData[role.title] : {}" :options="chartOptions2"></pie-chart>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
                
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>

    <!-- More Charts -->
    <v-container grid-list-sm pt-0 :pa-0="$vuetify.breakpoint.xsOnly" v-if="isContestant && isSuperUser">
       <v-layout row wrap>
         <v-flex xs12>
           <v-card :class="[{round_top: $vuetify.breakpoint.smAndUp, 'grey lighten-4': $vuetify.breakpoint.mdAndUp}]" 
            style="border-top: 4px solid gold !important" :flat="$vuetify.breakpoint.xsOnly">
             
            <v-toolbar class="white" flat card dense>
              <v-subheader>More Charts</v-subheader>
              <v-spacer></v-spacer>
              <v-icon color="#FFC107" class="mr-1">mdi-flash-circle</v-icon>
              <span>Premium</span>
            </v-toolbar>
            <v-container grid-list-xl :pa-1="$vuetify.breakpoint.xsOnly">
              <v-layout row wrap justify-space-around>
                <!-- Your Share of All Votes -->

                <v-flex xs12 :sm4="this.currElection.type == 'School'" :sm8="this.currElection.type != 'School'" >
                  <v-card class="round_top">
                    <v-toolbar dense flat card class="white" light>
                      <v-subheader class="pa-0 text-xs-center ma-0 font-weight-bold">Your Share of All Votes</v-subheader>
                    </v-toolbar>
                    <div class="text-xs-center secondary--text"><small v-if="percentage_share">You got {{percentage_share}}% of all votes casted</small></div>
                    <pie-chart class="pt-4" :chart-data="chartData5" :options="chartOptions3"></pie-chart>
                  </v-card>
                </v-flex>

                <v-flex xs12 sm6 v-if="currElection.type == 'School' && currElection.level == 'General'">
                  <v-card class="pb-3 round_top">
                    <v-toolbar dense flat card class="white" light>
                      <v-subheader class="pa-0 ma-0 font-weight-bold">Your performance in each faculty</v-subheader>
                    </v-toolbar>
                    <bar-chart class="pt-4" :chart-data="chartData6" :options="chartOptionsb"></bar-chart>
                  </v-card>
                </v-flex>

                <v-flex xs12 sm8 v-if="currElection.type == 'School'">
                  <v-card class="pb-3 round_top">
                    <v-toolbar card flat dense class="white" light>
                      <v-subheader class="pa-0 ma-0 font-weight-bold">Your performance in each department</v-subheader>
                    </v-toolbar>
                    <bar-chart class="pt-4" :chart-data="chartData7" :options="chartOptionsb"></bar-chart>
                  </v-card>
                </v-flex>
              </v-layout>
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
    results:[],
    model:[],
    show: false,
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
    percentage_share: '', // Contestant's % share of all votes
    winners:[],
    chartData:{},
    chartOptions:{
      responsive: true, maintainAspectRatio: true,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true,
            }
          }],
          xAxes: [{
            ticks: {
                beginAtZero: true,
                autoSkip:false,
            }
          }]
      }
    },
    chartOptionsb:{
      responsive: true, maintainAspectRatio: false,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true,
            }
          }],
          xAxes: [{
            ticks: {
                beginAtZero: true,
                autoSkip:false,
            }
          }]
      }
    },
    chartOptions2:{
      responsive: true, maintainAspectRatio: true
    },
    chartOptions3:{
      responsive: true, maintainAspectRatio: false
    },
    chartData4:{},
    chartData5:{},
    chartData6:{},
    chartData7:{},
  }),
  props:['id','roles','currElection','allVotes', 'rawVotes',
    'regVoters','contestants', 'charDate3', 'status'
  ],
  watch: {
    'curRoom': function(){
      // console.log({regvoters: this.regVoters, contestants: this.contestants, chardate: this.charDate3, status: this.status, roles: this.roles})
      this.curRoom ? this.setUp() : ''
    },
  },
  computed:{
    title(){
      return `Results | ${this.$appName}`
    },
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
        let len = this.currElection.voters || 0
        
        switch (true){
          case len > 1000000:
            return Math.round(len / 1000000) + 'M +'
          case len > 1000:
            return Math.round(len / 1000) + 'K + '
          default:
            return len
        }
      }
    },
    // purposely duplicated this instead of merging
    // it with above as a method bcs it should be reactive
    no_of_contestant(){
      if(this.contestants){
        let len = this.contestants.length
        
        switch (true){
          case len > 1000000:
            return Math.round(len / 1000000) + 'M +'
          case len > 1000:
            return Math.round(len / 1000) + 'K + '
          default:
            return len
        }
      }
    },
    no_of_votes(){
      if(this.allVotes){
        let len = this.rawVotes.length
        
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
    totalVotes(){
      let totalVotes = 0
      this.allVotes.forEach(vote =>{
        totalVotes += vote.score
      })
      return totalVotes
    },
    isContestant(){
      return !!this.contestants.find(contestant => contestant.uid == this.getUser.uid)
    },
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getSchools',
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ])
  },
  components:{
    'pie-chart':piechart,
    //'horizontal-bar':horizontalbar,
    'bar-chart':barchart,
    
  },
  methods:{
    setUp(){
      this.results = (this.allVotes).sort(
        (a,b) => b.score - a.score
      )

      // console.log('setup running: ', this.results)
      this.currElection.level == 'Department' ? this.deptTurnout() : ''
      this.currElection.level == 'Faculty' ? this.turnoutByDepartment() : ''
      this.currElection.level == 'General' ? this.turnoutByFaculty() : ''
      this.sortResults()
      this.getLabels()
      this.allWinners()
      this.isContestant ? this.percentageShareOfAllVotes() : ''
      this.currElection.type == 'School' && this.isSuperUser ? this.votesInEachFaculty() : ''
      this.currElection.type == 'School' && this.isSuperUser ? this.votesInEachDepartment() : ''
    },
    getName(id){ // return the name of each contestant
      let user = this.contestants.filter(
        item => item.uid == id
      )
      // console.log(this.contestants, user[0] , id)
      return user[0] ? user[0].name : ' '
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
        scoreArr.sort((a,b)=>b - a).indexOf(score) + 1 + 'th'
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
      // console.log({contestants: this.contestants})
      return this.contestants.filter(item=> item.uid == id)[0].photoURL
    },
    sortResults(){
      this.roles.forEach(role=>{
        let cont = []
        let total_score = 0
        for(let result of this.results){
          role.title == result.role ? cont.push({
            name: this.getName(result.id),
            score: result.score,
            photoURL: this.getImgSrc(result.id),
            position: this.getPosition(role.title,result.score)
          }) : ''
          role.title == result.role ? total_score = total_score + result.score : ''
        }
        this.sortedResults.push({
          role: role.title,
          total_score: total_score,
          contestants: cont
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
            mylabels.push(this.capitalizeText(d.name))
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
    percentageShareOfAllVotes(){
      // compare the votes for a contestant to total votes
      
      let found = this.allVotes.find(v =>
        v.id == this.getUser.uid
      )
      let votesForContestant = found ? found.score : 0
      let totalVotes = 0
      this.allVotes.forEach(vote =>{
        totalVotes += vote.score
      })
      
      if(votesForContestant > 0 && totalVotes > 0){
        this.percentage_share = (votesForContestant / totalVotes * 100).toFixed(2)
      }
      else {
        this.percentage_share = false
      }
      

      this.chartData5 = {
        datasets: [{
          label:"Contestant's share of all votes",
          data: [
            totalVotes,
            votesForContestant
          ],
          backgroundColor:['orange','purple','cyan'].map(item =>{
            return this.get_random_color()
          })
        }],
        labels: [
          'All votes',
          'Your score'
        ]
      }
    },
    getRole(contestant){
      let ref = contestant.contestsRef
      .find(item=>item.electionRef == this.currElection.electionId)
      let found = this.currElection.roles.find(role=>role.value == ref.role)
      return found ? found.title : false
    },
    get_random_color() {
      var letters = 'A98DE'.split('');
      var color = '#';
      for (var i=0; i<3; i++ ) {
          color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    },
    votesInEachDepartment(){
      // votes contestant got in each dept.
      let votesByDept = {}
      this.rawVotes.forEach(vote =>{
        let myvote = Object.values(vote.choices).filter(id => id == this.getUser.uid)
        if(votesByDept[vote.dept]){
          votesByDept[vote.dept] += myvote.length
        }
        else{
          votesByDept[vote.dept] = myvote.length
        }
        
      })
      
      this.chartData7 = {
        datasets: [{
          label:"Votes",
          data: Object.values(votesByDept),
          backgroundColor: Object.keys(votesByDept).map(item =>{
            return this.get_random_color()
          })
        }],
        labels: Object.keys(votesByDept).map(dept => this.$helpers.truncateText(dept))
      }
    },
    votesInEachFaculty(){
      // votes contestant got in each fac.
      let votesByFac = {}
      this.rawVotes.forEach(vote =>{
        let myvote = Object.values(vote.choices).filter(id => id == this.getUser.uid)
        if(votesByFac[vote.fac]){
          votesByFac[vote.fac] += myvote.length
        }
        else{
          votesByFac[vote.fac] = myvote.length
        }
        
      })
      
      this.chartData6 = {
        datasets: [{
          label: "Votes",
          data: Object.values(votesByFac),
          backgroundColor: Object.keys(votesByFac).map(item =>{
            return this.get_random_color()
          }),
        }],
        labels: Object.keys(votesByFac)
          .map(fac => this.$helpers.truncateText(fac))
      }
    },
    async deptTurnout(){
      // comparing number of those that voted and those that registed but didn't vote

      // reg voters in the same dept
      let members = this.currElection.voters

      let voted_members = this.rawVotes.length

      let no_that_voted = voted_members
      let no_that_not_voted = members - no_that_voted
      // console.log(no_that_voted, no_that_not_voted, voted_members, members)

        this.chartData4 = {
          datasets: [{
            data: [no_that_voted, no_that_not_voted],
            backgroundColor:['skyblue','lightgreen'],
          }],
          labels: [
            'Voted',
            'Not Voted'
          ]
        }
    },
    async findAFaculty(){
      let faculty = await api().post('dashboard/findAFaculty/' + this.currElection.fac + '/' + this.currElection.sch)
      //console.log(faculty)
      return faculty.data
    },
    async findASchool(school){
      let found = await api().post('dashboard/getASchool/'+school)
      // console.log('findASchool: ', found)
      return found.data
    },
    capitalizeText(text){
      return text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    },
    async turnoutByDepartment(){
      // comparing voted voters in each dept.
      // let thisFaculty = await this.findAFaculty()
      
      let votersByDept = {}
      
      this.rawVotes.forEach(vote=>{
        let votes = this.rawVotes.filter(v => v.dept == vote.dept)
        votersByDept[vote.dept] = votes.length
      })

      //console.log(votersByDept)
      this.chartData4 = {
        labels: Object.keys(votersByDept).map(key =>{
          return this.truncateText(key)
        }),
        datasets: [{
          label:'Turnout by department',
          backgroundColor: Object.keys(votersByDept).map(item =>{
            return this.get_random_color()
          }),
          data: Object.values(votersByDept),
        }]
        
      }
    
    },
    async turnoutByFaculty(){
      // showing/comparing voted voters in each faculty
      // let thisSchool = await this.findASchool(this.currElection.sch)
      
      let votersByFaculty = {}
      
      this.rawVotes.forEach(vote=>{
        let votes = this.rawVotes.filter(v => v.fac == vote.fac)
        votersByFaculty[vote.fac] = votes.length
      })

      //console.log(votersByFaculty)
      this.chartData4 = {
        datasets: [{
          label:'Turnout by faculty',
          data: Object.values(votersByFaculty),
          backgroundColor: Object.keys(votersByFaculty).map(item =>{
            return this.get_random_color()
          })
        }],
        labels: Object.keys(votersByFaculty).map(key =>{
          return this.truncateText(key)
        })
      }
    
    },
    
  },
  mounted(){
    // console.log(this.$parent)
    this.setUp()
  },
  async created(){
    
  },
  destroyed(){
    document.title = `Vote | ${this.$appName}`
  }
}

import api from '@/services/api'
import {mapGetters, mapState} from 'vuex'
import piechart from '@/charts/piechart'
import barchart from '@/charts/barchart'
import {firebase, db, database} from '@/plugins/firebase'
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
