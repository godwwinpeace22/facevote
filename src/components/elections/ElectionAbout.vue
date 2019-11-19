<template>
  <div>
    <v-container class='election_details'>
      <v-row row wrap>
        <v-col cols="12" sm="7">
          <v-card style="min-height:400px;width:100%;" outlined>
            <v-container>
              <v-toolbar flat tile dense color="white">
                <v-toolbar-title><h5><v-icon color="orange">mdi-equalizer</v-icon> Stats</h5></v-toolbar-title>
                <v-spacer></v-spacer>
                <!-- <v-btn small text color="success" 
                  outlined  @click="show_summary_dialog = true; title_string = `Election Results`" 
                  :disabled="!status.election_ended">
                  Results Summary
                </v-btn> -->
                
              </v-toolbar>
              <bar-chart :chart-data="chartData" :options="chartOptions" ></bar-chart>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="12" sm="5">
          <v-card outlined>
            <v-subheader class="font-weight-bold">Recent Activities</v-subheader>
            <div style="height:350px;overflow-y:auto;">
              <v-timeline align-top dense>
                <v-timeline-item :color="getColor(activity)" small v-for="(activity, i) in activities" :key="i + 'activity'">
                  <v-row pt-3>
                    <v-col>
                      <strong>
                        <span class="secondary--text linkify" @click="$eventBus.$emit('ViewProfile', activity.onr)">
                          {{activity.onr.uid == currElection.admin ? 'Admin' : 
                          activity.onr.name}}
                        </span>
                        {{activity.body}}</strong>
                      <div class="caption">{{new Date(activity.tstamp.toMillis()).toDateString('en-Us',{day:'numeric'})}}</div>
                    </v-col>
                  </v-row>
                </v-timeline-item>
              </v-timeline>
              <v-btn color="secondary" text small @click="moreActivities" v-if="activities.length >= 25 && !isLastActivity"
                :loading="loading_more_activities" style="text-transform: initial">
                See more
              </v-btn>
            </div>
          </v-card>
        </v-col>
        
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    chartData: {},
    chartOptions:{
      responsive: true, maintainAspectRatio: false,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true
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
    bgdColor: [],
    labels: [],
    data: [],
    activities: [],
    votes: [],
    allVotes: [],
    rawVotes: [],
    contestants: [],
  }),
  methods: {
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

                console.log({f,key})
                vote.choices = f
                vote.key = key
            })
          }


          console.log({vote})
          delete(vote['_'])
          
          if(!vote.choices){
            this.votes.push({
              choices: vote,
              key: key
            })
          }

          else {
            this.votes.push(vote)
          }
          
          
        })

        // pickBy()

        // this.rawVotes = votes;
        // console.log(this.rawVotes)
        this.allVotes = await this.getScores(await this.sortByRoles(this.rawVotes))

    },
    async allContestants(){
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
          contestants.push(data)
        })

        // console.log({contestants})
      this.contestants = contestants

    },
    async getAdmins(){
      let admins = [];

      this.$gun
        .get('elections')
        .get(this.electionId)
        .get('admins')
        .map()
        .on((d,k) => {
          // console.log(d,k)
          admins.push(d)
          // let person = this.getPerson(d)
        })
      // console.log(contest)
      this.admins = admins
      return admins
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
            console.log(item)
            resultsByRoles[f].push(item.choices[f])
          }
          
        })
        console.log(resultsByRoles)
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
    getRoles(){
      
      let roles = []
      this.$gun.get('elections')
        .get(this.electionId)
        .get('roles')
        .map().once(r => {
          roles.push(r)
        })

      console.log({roles})

      this.roles = roles
      return roles
    },
    getLabels(){
      
      this.labels = []
      this.data = []
      this.bgdColor = []

      console.log('getLabels ', this.allVotes)

      this.contestants.map(contestant=>{
        if(this.allVotes && this.contestants.length > 0){ // if there are votes
        
        // get votes for a particular contestant
        let foo = this.allVotes.filter(vote=> {
          return contestant.author.username == vote.id
        })
        
        let contestant_name = this.$helpers.capitalize(contestant.author.name)
        this.labels.push(this.$helpers.truncateText(contestant_name))

        this.data.push(foo[0] ? foo[0].score > 0 ? foo[0].score : 0 : 0)
        
        let random1 = Math.floor(Math.random() * Math.floor(255))
        let random2 = Math.floor(Math.random() * Math.floor(255))
        let random3 = Math.floor(Math.random() * Math.floor(255))
        this.bgdColor.push(`rgba(${random1}, ${random2},  ${random3}, 0.5)`)
        
        }
      })
      this.renderChart()
    },
    renderChart(){
      this.chartData = {
        labels: this.labels,
        datasets :[
          {
            label: '# of votes',
            backgroundColor: this.bgdColor,
            data: this.data,
          }
        ]
      }
    },
    getColor(activity){
      switch (activity.type) {
        case 'voter_registered':
          return 'purple'
        case 'election_created':
          return 'primary'
        case 'election_updated':
          return 'error'
        case 'logo_updated':
          return 'secondary'
        case 'new_contestant':
          return 'teal'
        case 'voter_registered':
          return 'orange'
        case 'vote_casted':
          return 'success'
        case 'contestant_suspended':
          return 'black'
        case 'contestant_restored':
          return 'success'
        default:
          return 'white'
      }
    },
  },
  async mounted(){
    await this.getVotes()
    await this.allContestants()
    await this.getLabels()
  },
  components: {
    BarChart
  }
}

import BarChart from '@/charts/barchart'
</script>


