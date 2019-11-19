<template>
  <transition name="fade">
    <v-overlay v-if="!showUi"
      opacity=".3"
      :value="!showUi"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  <div v-if="showUi">
    
    <div v-if="hideResults" class="text-center">
      <h1>Election In progress</h1>
      <p>See results after election ends</p>
    </div>

    <div v-else>

      <!-- summary of results -->
      <v-container mt-md-3 class="grey lighten-5" 
        pa-xs-0>
        <v-card flat class="grey lighten-5">
          <v-subheader class="font-weight-bold">Summary Of Results</v-subheader>
          <v-row row wrap>

            <!-- ==== OVERVIEW ===== -->
            <v-col cols="12" sm="6" md="4" d-flex class="pt-0" mb-sm-2>
              <v-card outlined>
                <v-subheader class="font-weight-bold primary--text">About</v-subheader>
                
                <v-list dense>
                  <v-list-item>
                    <v-row row wrap>
                      <v-col cols="4">
                        <v-list-item-title>Start time</v-list-item-title>
                      </v-col>
                      <v-col cols="8"> 
                        {{currElection.timed ? startTime : 'Not specified'}}
                      </v-col>
                    </v-row>
                  </v-list-item>
                  <v-list-item>
                    <v-row row wrap>
                      <v-col cols="4">
                        <v-list-item-title>Status</v-list-item-title>
                      </v-col>
                      <v-col cols="8"> 
                        {{status.inprogress ? 'In progress' : 'Ended'}}
                      </v-col>
                    </v-row>
                  </v-list-item>
                  <v-list-item>
                    <v-row row wrap>
                      <v-col cols="4">
                        <v-list-item-title>End time</v-list-item-title>
                      </v-col>
                      <v-col cols="8">{{currElection.timed ? endTime : 'Not specified'}}</v-col>
                    </v-row>
                  </v-list-item>
                  <v-list-item>
                    <v-row row wrap>
                      <v-col cols="4">
                        <v-list-item-title>Duration</v-list-item-title>
                      </v-col>
                      <v-col cols="8">{{currElection.timed ? currElection.duration + ' hrs' : 'Not specified'}}</v-col>
                    </v-row>
                  </v-list-item>
                  <v-list-item>
                    <v-row row wrap>
                      <v-col cols="4">
                        <v-list-item-title># of voters</v-list-item-title>
                      </v-col>
                      <v-col cols="8">{{currElection.voters_count}}</v-col>
                    </v-row>
                  </v-list-item>
                  <v-list-item>
                    <v-row row wrap>
                      <v-col cols="4">
                        <v-list-item-title># of contestants</v-list-item-title>
                      </v-col>
                      <v-col cols="8">{{contestants.length}}</v-col>
                    </v-row>
                  </v-list-item>
                </v-list>

                <!-- CIRCULAR PROGRESS BAR FOR STATS -->
                <v-container>
                  <v-row class="text-center">
                    <v-col cols="4" justify="center">
                      <v-progress-circular
                        :value="100" :size="$vuetify.breakpoint.sm ? 55 : 75"
                        color="teal"
                      >{{no_of_voters}}</v-progress-circular>
                      <div style="margin:auto;display:table;">Voters</div>
                    </v-col>
                    <v-col cols="4" justify="center">
                      <v-progress-circular
                        :value="100" :size="$vuetify.breakpoint.sm ? 55 : 75"
                        color="success"
                      >{{no_of_contestant}}</v-progress-circular>
                      <div style="margin:auto;display:table;">Contestants</div>
                    </v-col>
                    <v-col cols="4" justify="center">
                      <v-progress-circular 
                        :value="allVotes || regVotes ? rawVotes.length/regVoters * 100 : ''"
                        color="purple" :size="$vuetify.breakpoint.sm ? 55 : 75">
                        {{no_of_votes}}
                        </v-progress-circular>
                      <div style="margin:auto;display:table;">Voted</div>
                      
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>

            <!-- ==== WINNERS ===== -->
            <v-col cols="12" sm="6" 
              :md="this.currElection.type != 'School' ? 8 : 4" 
              d-flex class="pt-0" mb-sm-2>
              <v-card outlined min-height="400">
                <v-subheader class='font-weight-bold'>Winners 
                  <span v-if="status.inprogress" class="pl-3 green--text"> (Voting in progress)</span>
                  <span v-if="status.election_ended" class="pl-3 orange--text">Voting Ended</span>
                </v-subheader>
                
                <v-list dense two-line>
                  <v-subheader v-if="winners.length == 0">No contestants</v-subheader>
                  <div v-for="(winnersInEachRole,i) in winners" :key="winnersInEachRole.length + Math.random() * i">
                    
                    <v-list-item v-for="winner in winnersInEachRole" :key="winner.id">
                      <v-list-item-avatar :color="$helpers.colorMinder(getDetail(winner.id).name.charAt(0))">
                        <img :src="getDetail(winner.id).photoURL" v-if="getDetail(winner.id).photoURL">
                        <span class="white--text text-capitalize" v-else>{{getDetail(winner.id).name.charAt(0)}}</span>
                      </v-list-item-avatar>
                      <v-list-item-content class='font-weight-bold text-capitalize'>
                        {{getDetail(winner.id).name}}
                        <v-list-item-subtitle> for {{winner.role}}</v-list-item-subtitle>
                      </v-list-item-content>
                        <!-- if there are ties in the scores -->
                        <v-list-item-action class='font-weight-bold' v-if='winnersInEachRole.length > 1'>
                          <v-tooltip top>
                            <v-btn color="purple" slot='activator' dark icon class='text-capitalize mr-2'>Tie</v-btn>
                            <span>There was a tie for this role</span>
                          </v-tooltip>
                          
                        </v-list-item-action>

                        <v-list-item-action class='font-weight-bol'>{{winner.score}} votes</v-list-item-action>
                      
                    </v-list-item>
                    <v-divider v-if="i != winners.length -1"></v-divider>
                  </div>
                </v-list>
              </v-card>
            </v-col>

            <!-- ==== VOTER TURNOUT ===== -->
            <v-col sm="12" md="4" d-flex class="pt-0" v-if="currElection.type == 'School'" mb-sm-2>
              <v-card class="d-block" style="width:100%;" outlined>
                <v-subheader class='font-weight-bold'>Voter turnout
                  <v-tooltip left max-width="300px">
                    <template v-slot:activator="{on}">
                      <v-btn icon v-on="on" dark small>
                        <v-icon color="black" small>mdi-help-circle-outline</v-icon>
                      </v-btn>
                    </template>
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
            </v-col>

          </v-row>
        </v-card>
      </v-container>

      <!-- All Results -->
      <v-container class="grey lighten-5">
        <v-subheader>All results</v-subheader>
        <v-card class="" flat>
          <v-row row wrap>
            <vue-headful
              :title="title"
            />
            <v-col cols="12" sm="6" md="4" v-for="result in sortedResults" :key="result.role" mb-3>
              <v-card outlined>
                <v-card-text class="title text-capitalize">
                  {{result.role}}
                </v-card-text>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>Rank</v-list-item-content>
                    <v-list-item-content class="align-end"># of votes</v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list dense>
                  <v-subheader v-if="result.contestants && result.contestants.length == 0">No contestants</v-subheader>
                  <v-list-item v-for="(contestant,i) in result.contestants" :key="contestant.id">
                    
                    <v-list-item-avatar>
                      <!--accomodate for ties in result-->
                      <template v-if="i == 0">{{i+1}}</template>
                      <template v-if="i != 0">
                        <template v-if="i != 0 && result.contestants[i].score == result.contestants[i-1].score">{{i}}</template>
                        <template v-if="i != 0 && result.contestants[i].score != result.contestants[i-1].score">{{i+1}}</template>
                      </template>
                    </v-list-item-avatar>
                    <!-- <v-list-item-avatar :color="contestant.photoURL ? '' : $helpers.colorMinder(contestant.name.charAt(0))">
                      <img :src="contestant.photoURL" v-if="contestant.photoURL">
                      <span v-else class="white--text text-capitalize">{{contestant.name.charAt(0)}}</span>
                    </v-list-item-avatar> -->
                    <v-list-item-content>
                      <span class="text-capitalize">{{$helpers.truncateText(contestant.name, 20)}}</span>
                      <v-progress-linear color="primary" :value="percentage_score(contestant,result.role)"></v-progress-linear>
                    </v-list-item-content>
                    <span class="align-end mt-3 mx-4" style="font-size:15px;"> {{contestant.position  }}  </span>
                    <span class="align-end mt-3">{{ contestant.score}}{{percentage_score(contestant)}}</span>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-container>

      <!-- Charts -->
      <v-container :grid-list-xl="$vuetify.breakpoint.smAndUp" class="px-0" pa-xs-0>
        <v-subheader class="font-weight-bold">Charts</v-subheader>
        <v-card class="pa-md-4 pt-sm-5 lighten-3" flat>
          <v-row row wrap>
            <v-col cols="12" sm="4" md="4" mb-3 v-for="role in roles" :key="role.title">
              <v-card class="d-flex" outlined>
                <v-container>
                  <v-toolbar flat dense color="white" tabs>
                    <v-toolbar-title><h5 class="text-capitalize">{{role.title}}</h5></v-toolbar-title>
                    <v-spacer></v-spacer>
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
            </v-col>
          </v-row>
        </v-card>
      </v-container>

      <!-- More Charts -->
      <v-container grid-list-sm pt-0 pa-xs-0 v-if="isContestant && isSuperUser">
        <v-row row wrap>
          <v-col cols="12">
            <v-card class=""
              style="border-top: 4px solid gold !important">
              
              <v-toolbar class="white" flat dense>
                <v-subheader>More Charts</v-subheader>
                <v-spacer></v-spacer>
                <v-icon color="#FFC107" class="mr-1">mdi-flash-circle</v-icon>
                <span>Premium</span>
              </v-toolbar>
              <v-container pa-xs-1>
                <v-row row wrap class="justify-space-around">
                  <!-- Your Share of All Votes -->

                  <v-col cols="12" :sm="this.currElection.type == 'School' ? 4 : 8">
                    <v-card class="round_top" outlined>
                      <v-toolbar dense flat class="white" light>
                        <v-subheader class="pa-0 text-center ma-0 font-weight-bold">Your Share of All Votes</v-subheader>
                      </v-toolbar>
                      <div class="text-center primary--text"><small v-if="percentage_share">You got {{percentage_share}}% of all votes casted</small></div>
                      <pie-chart class="pt-4" :chart-data="chartData5" :options="chartOptions3"></pie-chart>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" v-if="currElection.type == 'School' && currElection.level == 'General'">
                    <v-card class="pb-4 round_top" outlined>
                      <v-toolbar dense flat class="white" light>
                        <v-subheader class="pa-0 ma-0 font-weight-bold">Your performance in each faculty</v-subheader>
                      </v-toolbar>
                      <bar-chart class="pt-6" :chart-data="chartData6" :options="chartOptionsb"></bar-chart>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="8" v-if="currElection.type == 'School'">
                    <v-card class="pb-4 round_top" outlined>
                      <v-toolbar flat dense class="white" light>
                        <v-subheader class="pa-0 ma-0 font-weight-bold">Your performance in each department</v-subheader>
                      </v-toolbar>
                      <bar-chart class="pt-6" :chart-data="chartData7" :options="chartOptionsb"></bar-chart>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
  </transition>
</template>
<script>
export default {
  data:()=>({
    // results:[],
    model:[],
    showUi: false,
    inprogress: true,
    status: {},
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
    // winners:[],
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
    contestants: [],
    roles: [],
    currElection: {},
    allVotes: [],
    rawVotes: [],
    votes: [],
  }),
  
  watch: {
    'roles': function(){
      this.sortResults()
      this.getLabels()
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
    regVoters(){
      return this.currElection.voters_count
    },
    no_of_voters(){
      
      if(this.regVoters){
        let len = this.regVoters || 0
        
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
      // console.log('allVotes: ', this.allVotes, this.rawVotes)
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
    winners(){
      // console.log(this.sortedResults)
      let winners = []
      this.sortedResults.forEach(result => {
        // console.log({result})
        if(result.contestants.length > 0){
          // the winners for each role ( if there is no tie then there is only one winner)
          let theWinners = this.getWinner(result.role)
          //console.log(theWinners)
          if(theWinners){
            winners.push(theWinners) // winners in all the roles
          }
        }
      });

      return winners
    },
    results(){
      // console.log(this.allVotes)
      return this.allVotes.sort(
        (a,b) => b.score - a.score
      )
    },
    hideResults(){
      return !this.currElection.realtime_results && 
      this.currElection.status != 'ended'
    },
    isContestant(){
      return !!this.contestants
        .find(contestant => contestant.username == this.getUser.username)
    },
    electionId(){
      return this.$route.params.electionId
    },
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ])
  },
  components:{
    'pie-chart':piechart,
    'bar-chart':barchart,
    
  },
  methods:{
    initialize(){
      this.$gun.get('elections')
        .get(this.electionId)
        .on( async election => {
          
          if(election){
            this.currElection = election
            

            // show results if the election settings allows it
            if(election.results_visible_to_all){
              
              if(!election.realtime_results){
                this.showUi = true
                // console.log(election.realtime_results)
              }
              else {

                await this.getRoles()
                await this.getContestants()
                await this.getVotes()
                await this.setup()
  
                this.showUi = true
              }
            }
            else {
              
              this.$router.push('/elections/' + this.electionId)
            }
            
          }
          else {
            console.log('router')
            // showUi = false
          }
          
        })
    },
    setup(){
      

      // console.log('setup running: ', this.results)
      this.currElection.level == 'Department' ? this.deptTurnout() : ''
      this.currElection.level == 'Faculty' ? this.turnoutByDepartment() : ''
      this.currElection.level == 'General' ? this.turnoutByFaculty() : ''
      
      

      this.isContestant ? this.percentageShareOfAllVotes() : ''
      this.currElection.type == 'School' && this.isSuperUser ? this.votesInEachFaculty() : ''
      this.currElection.type == 'School' && this.isSuperUser ? this.votesInEachDepartment() : ''
    },
    getRoles(){
      this.$gun.get('elections')
        .get(this.electionId)
        .get('roles')
        .map()
        .once((role,k) => {
          // console.log(role.title)
          role.key = k
          this.roles.find(r => r.value == role.value) ?
          '' : 
          this.roles.push(role)
        })
    },
    async getPerson(username){
      return await this.$gun
        .get(username)
        .then()
    },
    async getContestants(){
      // get contestants
      
      let contestants = []
      this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .map()
        .on(async (data,key) => {
          // console.log({data,key})

          let role = await this.getRole(key)
          let author = await this.getPerson(key)
          data.author = author;
          data.role = role;
          data.username = author.username
          contestants.push(data)
        })

        console.log({contestants})
      // this.contestants = uniqBy(contestants, 'username')
      this.contestants = contestants

    },
    async getVotes(){
      // get all votes for an election
      let votes = []
      let voteRef = this.$gun.get('elections')
        .get(this.electionId)
        .get('votes')

        voteRef.map()
        .on((vote,key) => {

          if(vote.choices){
            voteRef.get(key)
            .get('choices')
            .once(f => {

                // console.log({f,key})
                vote.choices = f
                vote.key = key
            })
          }


          delete(vote['_'])
          console.log({vote})
          
          if(!vote.choices){

            this.votes.find(v => v.key == key) ? '' : 
            this.votes.push({
              choices: vote,
              key: key
            })
          }

          else {

            this.votes.find(v => v.key == key) ? '' :
            this.votes.push(vote)
          }
          
          
        })

        // pickBy()

        this.rawVotes = this.votes;
        // console.log(this.rawVotes)
        this.allVotes = await this.getScores(await this.sortByRoles(this.rawVotes))

    },
    async sortByRoles(votes){

      let resultsByRoles = {};
      if(votes.length > 0){
        
        for(let item of Object.keys(votes[0].choices)){
          
          if(item != '_'){
            resultsByRoles[item] = [];
          }
          // console.log({item})

          
        }

        
        votes.map((item,index)=>{
          delete(item.choices['_'])

          for(let i=0;i<Object.keys(item.choices).length;i++){
            let f = Object.keys(item.choices)[i] // each key
            // console.log(resultsByRoles)
            // console.log(item)
            resultsByRoles[f].push(item.choices[f])
          }
          
        })
        // console.log(resultsByRoles)
        /* => {
                president:['contestant1id','contestant2id']
              }
        */
        return resultsByRoles
      }
    },
    async getScores(results){
      let scores = [];
      // console.log('resultsByRoles: ', results)
      for(let role in results){
        
        // sort the array of contestant ids in 'results[role]' by the ids
        // so that duplicate ids are grouped together
        //E.g ==> president:['contestant1id','contestant1id','contestant2id']
        let sortedVal = results[role].sort()
        sortedVal.forEach(id=>{
          if(!scores.find(item=> item.id === id)){
            let firstPos = sortedVal.indexOf(id);
            let lastPos = sortedVal.lastIndexOf(id);
            let score = lastPos - firstPos + 1;
            scores.push({id:id,score:score,role:role});
          }
        })
      }
      // console.log('scores: ', scores)
      return scores;
    },
    getName(id){ // return the name of each contestant
      let user = this.contestants.filter(
        item => item.author.username == id
      )
      // console.log(this.contestants, user[0] , id)
      return user[0] ? user[0].name : ' '
    },
    getDetail(id){ // return the name of each contestant
      // console.log(id, this.contestants)
      let user = this.contestants.filter(
        item => item.author.username == id
      )
      return user[0].author
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
        // console.log(role.title)
        
        let cont = []
        let total_score = 0

        let results = (this.allVotes).sort(
          (a,b) => b.score - a.score
        )
        for(let result of results){
          // console.log('result: ', result)
          role.title == result.role ? cont.push({
            ...this.getDetail(result.id),
            score: result.score,
            position: this.getPosition(role.title,result.score)
          }) : ''
          role.title == result.role ? total_score = total_score + result.score : ''
        }

        this.sortedResults.find(r => r.role == role.title) ? '' : 
        this.sortedResults.push({
          role: role.title,
          total_score: total_score,
          contestants: cont
        })

        // console.log(this.sortedResults)
      })
    },
    getLabels(){
      
      this.roles.forEach(role=>{
        // console.log(role, this.allVotes)
        let mylabels = []
        let mydata = []
        let mybgdColor = []
        this.contestants.map(d=>{
          
          let bar = this.allVotes.filter(item=> {
            return d.author.username == item.id && item.role == role.title
          })
          // console.log(d.role.value, role.value)
          if(d.role.value == role.value){
            
            mylabels.push(this.capitalizeText(d.author.name))
          }
          bar[0] ? mydata.push(bar[0].score) : ''
          d.role.value == role.value ? 
            mybgdColor.push(this.get_random_color()) : ''
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
      console.log(this.sortedResults)
      this.sortedResults.forEach(result => {
        console.log({result})
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
    async getRole(username){

      // get the role of a contestant
      return await this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .get(username)
        .get('role')
        .then()
          
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
          return this.$helpers.truncateText(key,12)
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
          return this.$helpers.truncateText(key,12)
        })
      }
    
    },
    
  },
  mounted(){
    // console.log(this.$parent)
    this.initialize()
  },
  destroyed(){
    document.title = `Vote | ${this.$appName}`
  }
}

import {mapGetters, mapState} from 'vuex'
import piechart from '@/charts/piechart'
import barchart from '@/charts/barchart'
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
