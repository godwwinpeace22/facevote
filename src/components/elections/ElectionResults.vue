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
          <!-- <v-subheader class="font-weight-bold">Summary Of Results</v-subheader> -->
          <v-row row wrap>

            <!-- ==== WINNERS ===== -->
            <v-col cols="12" sm="6" md="4"
              d-flex class="pt-0" mb-sm-2>
              <v-card outlined min-height="400">
                <v-subheader class='font-weight-bold'>Winners for each role
                  <span v-if="status.inprogress" class="pl-3 green--text"> (Voting in progress)</span>
                  <span v-if="status.election_ended" class="pl-3 orange--text">Voting Ended</span>
                </v-subheader>
                
                <v-list dense two-line>
                  <v-subheader v-if="winners.length == 0">No votes</v-subheader>
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

            <!-- ==== ALL SCORES ===== -->
            <v-col cols="12" sm="6" md="8" d-flex class="pt-0" mb-sm-2>
              <v-card outlined min-height="400">
                <v-subheader class="font-weight-bold">All results</v-subheader>

                <v-card-text class="mb-3" v-if="currElection.type != 'Others' && currElection.status == 'ended'">

                  Of the {{(currElection.voters_count || 0).toLocaleString()}} people that enrolled, 
                  {{(rawVotes.length || 0).toLocaleString()}} of them voted. <br>
                  Voting started on {{startDate}}, and ended on {{endDate}}

                </v-card-text>

                <v-data-table
                  :headers="headers"
                  :items="tabledata"
                  :loading='false'
                >
                <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                  <!-- <template slot="items" slot-scope="props">
                    <td>{{ props.item.name | capitalize}}</td>
                    <td class="text-xs-left">{{ props.item.role }}</td>
                    <td class="text-xs-left">{{ props.item.department }}</td>
                    <td class="text-xs-left">{{ props.item.faculty }}</td>
                    <td class="text-xs-left">{{props.item.score}}</td>
                  </template> -->
                </v-data-table>
              </v-card>
            </v-col>

            <!-- ==== CHARTS ==== -->
            <v-col cols="12">
              <v-card outlined>
                <v-subheader class="font-weight-bold">Charts</v-subheader>
                <v-row justify="center">
                  <v-col cols="12" sm="4" :md="mdSize(roles.length)" 
                    mb-3 v-for="role in roles" :key="role.title">
                    <v-card outlined :tile="roles.length == 1">
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
                            <v-card flat height="400">
                              <bar-chart :chart-data="chartData[role.title] ? chartData[role.title] : {}" :options="chartOptions"></bar-chart>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item value="tab-2" >
                            <v-card flat height="400">
                              <pie-chart :chart-data="chartData[role.title] ? chartData[role.title] : {}" :options="chartOptions2"></pie-chart>
                            </v-card>
                          </v-tab-item>
                        </v-tabs-items>
                        
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- ==== VOTER TURNOUT ===== -->
            <v-col cols="12" class="pt-0" v-if="currElection.type == 'School'" mb-sm-2>
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

                <!-- turnout by department or faculty in a faculty or school election -->
                <bar-chart v-if="currElection.type == 'School' && currElection.level != 'Department'" 
                  :chart-data="chartData2" :options="chartOptions">
                </bar-chart>
              </v-card>
            </v-col>

          </v-row>
        </v-card>
      </v-container>

    </div>
  </div>
  </transition>
</template>
<script>
export default {
  data:()=>({
    showUi: false,
    model:[],
    elecRef: '', // detatch listeners
    status: {},
    date_options:{
      weekday: 'short', 
      year: 'numeric', 
      month: 'short',
      day:'numeric',
      hour:'numeric', 
      minute:'numeric'
    },
    sortedResults:[],
    chartData:{},
    chartOptions:{
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
      responsive: true, 
      maintainAspectRatio: false,
    },
    chartData2:{},
    contestants: [],
    roles: [],
    currElection: {},
    allVotes: [],
    rawVotes: [],
    votes: [],
    headers: [
      {
      text: 'Name',
      align: 'left',
      value: 'name'
      },
      {text:'Role', value:'role'},
      // {text:'Department', value:'department'},
      // {text:'Faculty', value:'faculty'},
      {text:'Votes', value:'score'},
    ],
    tabledata: [],
  }),
  
  watch: {
    'roles': function(){
      this.sortResults()
      this.setResultsChart()
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
    startDate(){
      let a = this.currElection
      let start_time = new Date(a.startDate + ' ' + a.startTime)
      return start_time.toLocaleString('en-Us',this.date_options)
    },
    endDate(){
      let a = this.currElection
      let start_time = new Date(a.endDate + ' ' + a.endTime)
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
      if(this.isAdmin){
        return false;
      }
      else {

        return !this.currElection.realtime_results && 
        this.electionStatus != 'ended'
      }
    },
    electionStatus(){
      // BEWARE THIS FUNCTION USES LOCAL TIME, WHICH MIGHT BE INACCURATE
      // Get the status of the current election
      let now = this.$Gun.state()
      let start = (new Date(this.currElection.startDate + ' ' + this.currElection.startTime)).getTime()
      let end = (new Date(this.currElection.endDate + ' ' + this.currElection.endDate)).getTime()

			if(this.currElection.timed){
	
				if(now < start){
					return 'notstarted'
				}
				else if(now > start && start < end){
					return 'inprogress'
				}
				else{
					return 'ended'
				}
			}

			else {
				this.currElection.status

			}
      
		},
    isAdmin(){
      // console.log(this.currElection)
      return this.currElection.admin &&
      this.currElection.admin == this.getUser.username
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
            if(this.isAdmin){
              await this.getRoles()
              await this.getContestants()
              await this.getVotes()
              await this.setTableData()
              await this.turnoutByDepartment()

              this.showUi = true
            }
            else if(election.results_visible_to_all){
              
              if(!election.realtime_results){
                this.showUi = true
                // console.log(election.realtime_results)
              }
              else {

                await this.getRoles()
                await this.getContestants()
                await this.getVotes()
                await this.setTableData()
                await this.turnoutByDepartment()
  
                this.showUi = true
              }
            }
            else {
              
              this.$router.push('/elections/' + this.electionId)
              
            }
            
          }
          else {
            console.log('router')
            this.$router.push('/notFound')
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
        .get('users')
        .get(username)
        .then()
    },
    async getContestants(){
      // get contestants
      
      // let contestants = []
      this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .map()
        .on(async (data,key) => {
          // console.log({data,key})

          let cont = Object.assign({}, data)
          cont.author = await this.getPerson(key)
          cont.role = await this.getRole(key)
          cont.username = key

          this.contestants.push(cont)
        })

        // console.log(this.contestants)
      // this.contestants = uniqBy(contestants, 'username')
      // this.contestants = contestants

    },
    async getVotes(){
      // get all votes for an election
      let votes = []
      let voteRef = this.$gun.get('elections')
        .get(this.electionId)
        .get('votes')

        // console.log(voteRef)

        voteRef.map()
        .on((vote,key) => {
          // console.log({vote,key})

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
          // console.log({vote})
          
          if(!vote.choices){

            // this.votes.find(v => v.key == key) ? '' : 
            // this.votes.push({
            //   choices: vote,
            //   key: key
            // })
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
            resultsByRoles[f] ? resultsByRoles[f].push(item.choices[f]) : ''
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
    mdSize(size){
      switch(size){
        case 1: return 12;
        case 2: return 6;
        default: return 4
      }
      
    },
    setTableData(){
      this.tabledata = [] // to prevent multiple pushings
      if(this.allVotes && this.contestants.length > 0){

        this.contestants.forEach(cont=>{
          // console.log({cont})
          // get votes for a particular contestant
          let foo = this.allVotes.filter(vote=> {
            return cont.username == vote.id
          })
  
          let myObj = {
            value: false,
            name: cont.author.name,
            contId: cont.author.username, // contestant id
            role: cont.role.title,
            department: cont.author.dept,
            faculty: cont.author.fac,
            score: foo[0] ? foo[0].score > 0 ? foo[0].score : 0 : 0
          }
          this.tabledata.push(myObj)
        })
      }
    },
    setResultsChart(){
      
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
    capitalizeText(text){
      return text ? text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ') : ''
    },
    async turnoutByDepartment(){
      // comparing voted voters in each dept.
      
      let votersByDept = {}
      
      this.rawVotes.forEach(vote=>{
        let votes = this.rawVotes.filter(v => v.dept == vote.dept)
        votersByDept[vote.dept] = votes.length
      })

      //console.log(votersByDept)
      this.chartData2 = {
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
      this.chartData2 = {
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
    // this.$gun.get('elections')
    //     .get(this.electionId)
    //     .get('votes').map()
    //     .once((v,k) => {
    //       console.log({v,k})
    //     })
  },
  destroyed(){
    document.title = `Vote | ${this.$appName}`

    // this.elecRef.off()
    // this.contRef.off()
    // this.voteRef.off()
  }
}

import {mapGetters, mapState} from 'vuex'
import piechart from '@/charts/piechart'
import barchart from '@/charts/barchart'
</script>



