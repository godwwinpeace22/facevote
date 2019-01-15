<template>
  <div>
    <navigation>
      <span slot="title">Dashboard</span>
      <h1 slot="extended_nav">Watch</h1>
    </navigation>
    <vue-headful
      :title="title"
      :description="description"
    />
    
    <loading-bar v-show="!show_when_ready"></loading-bar>


    <!-- ==DETAILS== -->
    <v-container :grid-list-sm='$vuetify.breakpoint.xsOnly' v-if="show_when_ready">
      <v-card >
        <v-layout row wrap>
          <v-flex xs12 sm8 d-flex class="mb-0">
            <v-card dark flat tile class="ma-0">
              <v-card-title class="headline">{{currElection.title}}</v-card-title>
              <small class="pl-3 d-block" style="color:#eee;">Election Id: {{currElection.electionId}}</small>
              <v-card-text>

                <v-card-actions class="mt-0 pt-0">
                  <span>{{currElection.followers? currElection.followers.length : ''}}</span>
                  <v-divider inset vertical class="mx-2"></v-divider>
                  <v-btn flat small class="white-text">Followers</v-btn>
                  <v-btn color="success" outline small class="white-text" @click="follow_election"
                    :disabled='!!disabled.find(id => id == getUser.uid)'>
                    {{follow_election_text}}
                  </v-btn>
                </v-card-actions>

                <h4  v-if="not_started">Election starts in</h4>
                <h4  v-if="inprogress">Election in progress</h4>
                <v-container justify-center fill-height>
                  <v-layout align-center justify-center>
                    <v-flex xs12 sm12>
                      <v-card-text class="pa-0">
                        <div id="time" class="d-block">
                          <div class="verticalChart" v-if="not_started || inprogress">

                            <div class="singleBar">
                              <div class="bar">
                                <div class="value elevation-4" style="height: 38%;background:teal;">
                                  <span id="ontop">{{electionTime.days}}</span>
                                  <span>DAYS</span>
                                </div>
                              </div>
                            </div>

                            <div class="singleBar">
                              <div class="bar">
                                <div class="value" style="height: 70%;background:#8bc34a;">
                                  <span id="ontop">{{electionTime.hours}}</span>
                                  <span>HOURS</span>
                                </div>
                              </div>
                            </div>
                            <div class="singleBar">
                              <div class="bar">
                                <div class="value" style="height: 90%;background:#ee44aa;">
                                  <span  id="ontop">{{electionTime.minutes}}</span>
                                  <span>MINUTES</span>
                                </div>
                              </div>
                            </div>
                            <div class="singleBar">
                              <div class="bar">
                                <div class="value" style="height: 50%;background:#5192c5;">
                                  <span id="ontop">{{electionTime.seconds}}</span>
                                  <span>SECONDS</span>
                                </div>
                              </div>
                            </div>
                            <div class="clearfix"></div>
                          </div>

                          <template v-else>
                            <div class="text-xs-left py-5" style="display:table;margin:auto;">
                              <h3 class="display-1">Election Ended</h3>
                              <small v-if="election_ended">at 
                              {{new Date(countDownDate).toLocaleString('en-Us',date_options)}}</small>
                            </div>
                          </template>
                        </div>
                        
                      </v-card-text>
                    </v-flex>
                  </v-layout>
                </v-container>

                <v-btn fixed dark fab bottom right color="pink" ><v-icon>home</v-icon></v-btn>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="show_results_dialog = true" color="pink"
                  v-show="show_btn" dark v-if="inprogress || election_ended" depressed small>
                  See results
                </v-btn>
                <v-btn  color="teal" dark @click="show_voting_dialog = true" depressed small
                  v-show="show_btn"    :disabled="voterdOrNot(getUser.uid) == 'Voted'">
                  Vote
                </v-btn>
                <v-tooltip top v-if="not_started" class="ml-3">
                  <v-btn  color="success" slot="activator" small dark :to="`/enroll`" 
                    v-show="show_btn"  v-if="not_started" :disabled="hasEnrolled">
                    Enroll
                  </v-btn>
                  <span>Enroll to vote</span>
                </v-tooltip>
                <v-tooltip top class="ml-3">
                  <v-btn  color="success" slot="activator" small dark 
                    :to="`/forum/${currElection.electionId}`" depressed>
                    Forum
                  </v-btn>
                  <span>Join the conversation for this election</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4 d-flex class="mb-0">
            <v-card flat tile>
              <v-toolbar color="teal" class="white--text" flat dense>
                Election Details
              </v-toolbar>
              <v-list dense>
                <v-list-tile :to="`/users/${currElection.admin}`">
                  <v-flex xs4>
                    <v-icon color="teal">person</v-icon>
                    Admin </v-flex>
                  <v-flex xs8 class="text-capitalize">
                    {{getAdmin}}
                  </v-flex>
                </v-list-tile>
                <v-list-tile>
                  <v-flex xs4>
                    <v-icon color="teal">schedule</v-icon>
                      Start time</v-flex>
                  <v-flex xs8> {{new Date(startDate).toLocaleString('en-Us',{hour:'numeric',minute:'numeric'})}}</v-flex>
                </v-list-tile>
                <v-list-tile>
                  <v-flex xs4>
                    <v-icon color="teal">timer</v-icon>   
                    Duration</v-flex>
                  <v-flex xs8> {{currElection.duration}}hrs</v-flex>
                </v-list-tile>
                <v-list-tile>
                  <v-flex xs4>
                    <v-icon color="teal">play_circle_filled</v-icon>
                    Status</v-flex>
                  <v-flex xs8> {{not_started ? 'Not started' : inprogress ? 'In progress' : 'Ended'}}</v-flex>
                </v-list-tile>
                <v-list-tile v-if="currElection.type == 'School'">
                  <v-flex xs4>
                    <v-icon color="teal">school</v-icon>
                    School</v-flex>
                  <v-flex xs8 class="text-capitalize"> {{currElection.school}}</v-flex>
                </v-list-tile>
                <v-list-tile>
                  <v-flex xs4>
                    <v-icon color="teal">layers</v-icon>
                    Level</v-flex>
                  <v-flex xs8> {{currElection.level}} Elections</v-flex>
                </v-list-tile>
                <v-list-tile v-if="currElection.type == 'School' 
                  && (currElection.level != 'General')">
                  <v-flex xs4>
                    <v-icon color="teal">domain</v-icon>
                    Faculty</v-flex>
                  <v-flex xs8 class="text-capitalize">{{currElection.faculty}}</v-flex>
                </v-list-tile>
                <v-list-tile v-if="currElection.level == 'Department'">
                  <v-flex xs4>Department</v-flex>
                  <v-flex xs8 class="text-capitalize">{{currElection.department}}</v-flex>
                </v-list-tile>
              </v-list>
              <!--v-container grid-list-xs>
                <v-layout row wrap>
                  <v-flex xs4 justify-center>
                    <v-progress-circular style="display:block;margin:auto;"
                      :value="100" 
                      color="secondary"
                    >{{regVoters.length}}</v-progress-circular>
                    <div style="margin:auto;width:fit-content">Voters</div>
                  </v-flex>
                  <v-flex xs4 justify-center>
                    <v-progress-circular style="display:block;margin:auto;"
                      :value="100"
                      color="success"
                    >{{currElection.contestants.length}}</v-progress-circular>
                    <div style="margin:auto;width:fit-content">Contestants</div>
                  </v-flex>
                  <v-flex xs4 justify-center>
                    <v-progress-circular style="display:block;margin:auto;"
                      :value="allVotes.length/regVoters.length * 100"
                      color="purple">
                      {{allVotes.length}}
                      </v-progress-circular>
                    <div style="margin:auto;width:fit-content">Votes</div>
                    
                  </v-flex>
                </v-layout>
              </v-container-->
              
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
    
    <v-dialog v-model="show_voting_dialog" v-if="show_voting_dialog" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar clipped-left card dark color="success" scroll-target="vote_target">
          <v-btn icon dark @click.native="isNotVoting; show_voting_dialog = false;">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Vote: {{currElection.title}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items v-if="$vuetify.breakpoint.width > 350">
            <v-btn dark flat @click.native="isNotVoting; show_voting_dialog = false;">Cancel</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <vote id="vote_target" :currElection='currElection' :contestants='contestants' :countDownDate='countDownDate' :rawVotes='rawVotes'></vote>
      </v-card>
    </v-dialog>


    <v-dialog v-model="show_results_dialog" v-if="show_results_dialog" 
      fullscreen transition="dialog-bottom-transition" scrollable>
      <v-card>
        <v-toolbar clipped-left flat dark color="success" scroll-target="result_dialog">
          <v-btn icon dark @click.native="show_results_dialog = false;">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Results: {{currElection.title}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items v-if="$vuetify.breakpoint.width > 350">
            <v-btn depressed @click.native="show_results_dialog = false;">
              Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div id='result_dialog'>
          <results :id='currElection._id' :chartData3='chartData' :allVotes='allVotes'
          :currElection='currElection' :contestants='contestants' :regVoters='regVoters'
          :roles='currElection.roles' :countDownDate='countDownDate' v-if="show_results_dialog">
          </results>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewprofile" v-if="viewprofile" :style="styleObj"
      :fullscreen="$vuetify.breakpoint.smAndDown" width="300" hide-overlay>
      
      <v-toolbar  dense dark color="teal" scroll-target="vprofile">
        <v-toolbar-title>Profile</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="viewprofile = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <view-profile :user='voterprofile'  id="vprofile"></view-profile>
    </v-dialog>

    <!-- ==SMALL CARDS== -->
    <v-container grid-list-xl v-if="show_when_ready">
      <v-layout row wrap>
        <v-flex xs12 sm4 md3 v-for="(flashNumber,i) in flashNumbers" :key="i">
          <v-card class="mt-3 mx-auto round">
            <v-sheet
              class="v-sheet--offset ml-3" :class="{'orange':i==0,'primary':i==1,'success':i==2,'cyan':i==3}"
              color="" elevation="3"
              max-width="35%" height="80">
              <v-icon class='mx-auto d-block ma-auto' 
                style="width:50px;padding-top:15%;" size="50" color="white">
                {{flashNumber.icon1}}
              </v-icon>
            </v-sheet>

            <v-card-text class="pt-0">
              <div class="subheading font-weight-light grey--text mb-2">{{flashNumber.text}}</div>
              <div class="subheading font-weight-light text-xs-right">{{flashNumber.number}}0K</div>
              <v-divider class="my-2"></v-divider>
              <v-icon class="mr-2" small>{{flashNumber.icon2}}</v-icon>
              <span class="caption grey--text font-weight-light">{{flashNumber.sub}}</span>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>


    <v-container class='election_details' v-if="show_when_ready">
      <v-layout row wrap>
        <v-flex xs12 sm3 d-flex pl-1 pr-2>
          <v-card>
            <v-tabs left color="teal" dark show-arrows>
              <v-tabs-slider color="orange"></v-tabs-slider>

              <v-tab href="#tab-1" class="text-capitalize"> Voters </v-tab>

              <v-tab href="#tab-2" class="text-capitalize"> Activity </v-tab>

              <v-tab href="#tab-3" class="text-capitalize"> Actions</v-tab>

              <v-tab-item value="tab-1">
                
                <v-container style="max-height:320px;overflow:auto;" class="scrollbar pt-1 pl-0">
                  
                  <v-list two-line dense>
                    <div v-if="regVoters.length > 0" v-for="(voter, index) in regVoters" :key="index">
                      <v-list-tile  :key="voter.name" avatar @click="viewprofile = true; voterprofile = voter" :color="checkIfOnline(voter.uid) ? 'default' : 'grey'">
                        <v-list-tile-avatar>
                          <img :src="voter.photoURL || `https://ui-avatars.com/api/?name=${voter.name}`">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title  class="text-capitalize">{{voter.name}}<span id="online_badge" v-if="checkIfOnline(voter)"></span></v-list-tile-title>
                          <!--v-list-tile-sub-title v-html="voter.username" ></v-list-tile-sub-title-->
                          <v-list-tile-sub-title v-if="!isVoting(voter.uid)"><span style=''>{{voterdOrNot(voter.uid)}}</span></v-list-tile-sub-title>
                          <v-list-tile-sub-title v-else color="green"><span style='color:green;'>voting...</span></v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider  :inset="true" :key="index"></v-divider>
                    </div>
                  </v-list>
                </v-container>
              </v-tab-item>
              
              <v-tab-item value="tab-2">
                <v-subheader>Recent activities</v-subheader>
                <v-divider></v-divider>
                <div class="pt-2 scrollbar" style="max-height:350px;overflow:auto;">
                  <v-timeline align-top dense>
                    <v-timeline-item :color="getColor(activity)" small v-for="activity in activities" :key="activity.id">
                      <v-layout pt-3>
                        <v-flex>
                          <strong>{{activity.by == getUser.uid ? 'Admin' : 
                            extractVoter(activity.by).name}} 
                            {{activity.text}}</strong>
                          <div class="caption">{{new Date(activity.dateCreated).toDateString('en-Us',{day:'numeric'})}}</div>
                        </v-flex>
                      </v-layout>
                    </v-timeline-item>
                  </v-timeline>
                </div>
              </v-tab-item>
              <v-tab-item value="tab-3">
                <v-container class="pa-0">
                  <v-subheader>Actions</v-subheader>
                  <v-list dense>
                    <v-list-tile avatar to="/contest">
                        <span>Contest</span>
                    </v-list-tile>
                    <v-list-tile avatar to="/manifesto/create">
                        <span>Create manifesto</span>
                    </v-list-tile>
                    <v-list-tile avatar to="/enroll">
                        <span>Enroll</span>
                    </v-list-tile>
                  </v-list>
                </v-container>
              </v-tab-item>
            </v-tabs>
            
          </v-card>
        </v-flex>
        <v-flex xs12 sm9  d-flex pl-1 pr-2>
          <v-card style="min-height:400px;">
            <v-container>
              <v-toolbar flat dense color="white">
                <v-toolbar-title><h5><v-icon color="orange">equalizer</v-icon> Stats</h5></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn small flat color="success" outline  @click="show_results_dialog = true" :disabled="!inprogress || !election_ended"> more charts</v-btn>
                
              </v-toolbar>
              <bar-chart :chart-data="chartData" :options="chartOptions" ></bar-chart>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- ===CONTESTANTS=== -->
    <v-container grid-list-md v-if="show_when_ready">
      <v-card class="round pa-4" style="min-height:150px;">
      <v-subheader class="font-weight-bold">Contestants</v-subheader>
      
      <carousel :nav='true' :responsive="{0:{items:1,nav:false},600:{items:3,nav:true},800:{items:4,nav:true}}" >
        
        <v-subheader v-if="contestants && contestants.length == 0">No contestants</v-subheader>
        <v-card  :class="i%2 > 0 ? 'purple round mr-2 mb-1' : 'teal round mr-2 mb-1'" 
          dark height="285" v-if="contestants.length > 0" 
          v-for="(contestant,i) in contestants" :key="contestant.email">
          <v-tooltip top>
            <v-img @click="viewManifesto(contestant)" class="hover" slot="activator"
              :src="contestant.photoURL || `https://ui-avatars.com/api/?name=${contestant.name}&size=300`"
              height="185px"
            ></v-img>
            <span>View <span class="text-capitalize">{{contestant.name}}'s</span> manifesto</span>
          </v-tooltip>

          <v-card-text primary-title style="cursor:-webkit-grab;cursor:grab;">
            <span class="subheading font-weight-bold mb-0 text-capitalize .text-truncate hover" @click="viewprofile = true; voterprofile = contestant">
              {{contestant.name}}
              <span id="online_badge" v-if="checkIfOnline(contestant.email)"></span>
            </span>
          </v-card-text>
          <v-card-actions class="px-3 pb-3 pt-0" style="cursor:-webkit-grab;cursor:grab;">
            <span class='text-capitalize'>For {{getRole(contestant)}}</span>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <v-btn color="" slot="activator" class="text-capitalize follow" v-if="contestant.email != getUser.email" 
                :disabled='!!disabled.find(email => email == contestant.email)'
                flat outline small @click="follow($event,contestant)" :id="contestant.email">
                {{contestant.followers.length}}&nbsp;| Followers
              </v-btn>
              
              <span :ref="contestant._id">
                {{isFollowing(contestant) ? 'you are following ' + contestant.name : 'Follow ' + contestant.name}}
              </span>
            </v-tooltip>
            <span v-if="contestant.email == getUser.email" slot="activator">
              {{contestant.followers.length}}&nbsp;| Followers
            </span>
          </v-card-actions>
        </v-card>
        
      </carousel>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Vote | Facevote',
    description:'',
    show_when_ready:false,
    show_btn:false, // just to hide the btn initially - I don't want to see 'vote' and then 'show results' later after processing
    disabled:[],
    user:{}, // currently logged in user
    allVotes:[],
    myEnrolledElc:[], 
    //currElection:{}, // contains the current election
    regVoters:[], // contains registered voters for the current election
    startDate:'',
    countDownDate:'',
    interval:'',
    electionTime:'',
    date_options:{
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    },
    not_started:true,
    inprogress:false, // tells the timer whether the election is in progress or not
    election_ended:true, // tells the timer whether the election  has ended or not
    voterprofile:{},
    //activities:[],
    contestants:[], // all the contestants for this election
    rawVotes:[], // contains all the raw votes made for the current election
    votingList:[], // list of people currently voting for the current election
    show_voting_dialog:false, // whether to show the voting window/ dialog
    show_results_dialog:false, // whether to show the results window/ dialog
    viewprofile:false,
    chartData:null,
    data:[],
    labels:[],
    bgdColor:[],
    chartOptions:{
      responsive: true, maintainAspectRatio: false,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true
            }
          }]
      }
    }
  }),
  props:['electionId'], // this prop is from the vue-router params
  computed:{
    flashNumbers(){
      return [
        {text:'Registerd voters',number:this.regVoters.length,icon1:'equalizer',icon2:'timer',sub:this.lastRegistration},
        {text:'Contestants', number:this.contestants.length,icon1:'spa',icon2:'block',sub:this.suspendedContestants},
        {text:'Votes',number:this.allVotes.length,icon1:'trending_up',icon2:'timer',sub:this.lastVotedTime},
        {text:'Followers',number:this.currElection.followers.length,icon1:'people',icon2:'timer',sub:'opps sub'}
      ]
    },
    lastRegistration(){
      let regActivities = this.activities.filter(
        activity => activity.type == 'voter_registered'
      )
      //console.log(regActivities[0])

      if(regActivities && regActivities.length > 0){
        let the_last_reg_time = regActivities[0].dateCreated
        let now = Date.now()
        let oneMin = 60*1000
        let oneHour = 60*oneMin
        let oneDay = 24*oneHour
        let oneWeek = oneDay * 7
        let time_difference = now - the_last_reg_time
        console.log(now,the_last_reg_time,time_difference)
        return time_difference < oneMin ?
        Math.floor(time_difference) + ' seconds ago' :
        time_difference < oneHour ? 'Last registration ' + Math.floor(time_difference/oneMin) + ' minutes ago' :
        time_difference < oneDay ? 'Last registration ' + Math.floor(time_difference/oneHour) + ' hours ago' :
        time_difference < oneWeek ? 'Last registration ' + Math.floor(time_difference/oneDay) + ' days ago' :
        'Last registration ' + new Date(the_last_reg_time).toLocaleString('en-Us',{hour:'numeric',minute:'numeric'})
      }
      else{
        return 'No registrations yet'
      }
    },
    suspendedContestants(){
      let suspended = []
      this.contestants.forEach(contestant => {
        let found = contestant.contestsRef.find(contest => contest.electionRef == this.currElection.electionId)
        found ? found.suspended ? suspended.push(contestant) : '' : ''
      });
      return suspended > 0 ? suspended.length + 'suspended contestants' : 'No contestant suspended'
    },
    lastVotedTime(){
      if(this.rawVotes && this.rawVotes.length > 0){
        let sortedVotes = this.rawVotes.sort((a,b)=>b.createdAt - a.createdAt)
        let the_last_vote_time = sortedVotes[0].createdAt
        let now = Date.now()
        let oneMin = 60*1000
        let oneHour = 60*oneMin
        let oneDay = 24*oneHour
        let oneWeek = oneDay * 7
        let time_difference = now - the_last_vote_time
        
        return time_difference < oneMin ?
        Math.floor(time_difference) + ' seconds ago' :
        time_difference < oneHour ? 'Last vote ' + Math.floor(time_difference/oneMin) + ' minutes ago' :
        time_difference < oneDay ? 'Last vote ' + Math.floor(time_difference/oneHour) + ' hours ago' :
        time_difference < oneWeek ? 'Last vote ' + Math.floor(time_difference/oneDay) + ' days ago' :
        'Last vote ' + new Date(the_last_vote_time).toLocaleString('en-Us',{hour:'numeric',minute:'numeric'})
      }
      else{
        return 'No votes yet'
      }
      
    },
    styleObj(){
      if(this.$vuetify.breakpoint.smAndDown){
        return {
          height:'100vh',
          backgroundColor:'#fff'
        }
      }
    },
    getAdmin(){
      console.log(this.regVoters)
      let found = this.regVoters.find(voter => voter.email == this.currElection.admin)
      return found ? found.name : this.currElection.admin
    },
    hasEnrolled(){
      //console.log(this.regVoters)
      return this.regVoters.find(voter => voter.uid == this.getUser.uid) ? true : false
    },
    follow_election_text(){
      return this.currElection.followers.find(id => id == this.getUser.uid) ? 
      'Following' : 'Follow'
    },
    ...mapGetters([
      'isAuthenticated',
      'getUser',
      'getSchools',
      'getContestants',
      'getCurElection',
      'getCurElectionResults',
      'getCurElectionActivities',
      'getVotes',
      // ...
    ]),
    currElection(){
      return this.getCurElection
    },
    activities(){
      return this.getCurElectionActivities
    },
    votes(){
      return this.getVotes
    }
  },
  methods:{
    async setup(){
      // get election
      let elecRef = db.collection('elections').doc(this.$route.params.electionId)
      await elecRef.onSnapshot(async (doc)=>{
        this.$store.dispatch('setCurElection', doc.data())
        console.log('currElection: ', doc.data())
      })
      

      // get registered voters
      db.collection('moreUserInfo').where('enrolled','array-contains', this.$route.params.electionId)
      .onSnapshot(async querySnapshot=>{
        this.regVoters = []
        querySnapshot.forEach(doc=>{
          console.log(doc.id, " => ", doc.data());
          this.regVoters.push(doc.data())
        })
        await this.allContestants()
        this.open()
      }, function(err){
        // handle listening errors
        console.log(err)
      })


      // get raw votes for this election
      db.collection('votes').where('electionRef', '==', this.$route.params.electionId)
      .onSnapshot(async querySnapshot=>{
        let arr = []
        querySnapshot.forEach(doc=>{
          arr.push(doc.data())
        })
        this.rawVotes = arr // the raw votes
        console.log(this.rawVotes)
        this.allVotes = await this.getScores(await this.sortByRoles(this.rawVotes))
        console.log(this.allVotes)
        this.getLabels()
        this.$store.dispatch('allVotes', arr)
      })
      

      // Get activities
      db.collection('activities')
      .orderBy('dateCreated', 'desc')
      .where('electionRef','==',this.$route.params.electionId).onSnapshot(async querySnapshot=>{
        let acts = []
        querySnapshot.forEach(doc=>{
          acts.push(doc.data())
        })
        this.$store.dispatch('setCurElectionActivities', acts)
      })
      

      
    },
    async allContestants(voters){
      // get contestants
      let contestants = []
      this.regVoters.forEach(voter=>{
        if(voter.contests && voter.contests.find(id => id == this.$route.params.electionId)){
          contestants.push(voter)
        }
      })
      console.log(contestants)
      // show only contestants that are not suspended. therefore they can't be voted for
      //contestants = contestants.data.filter(item => item.suspended == false)
      this.contestants = contestants
      //this.$store.dispatch('setCurElectionContestants', contestants)
    },
    async sortByRoles(votes){
      let resultsByRoles = {};
      if(votes.length > 0){
        for(let item of Object.keys(votes[0].choices)){
          resultsByRoles[item] = [];
        }

        
        votes.map((item,index)=>{
          for(let i=0;i<Object.keys(item.choices).length;i++){
            let f = Object.keys(item.choices)[i] // each key
            //console.log(f)
            resultsByRoles[f].push(item.choices[f])
          }
          
        })
        //console.log(resultsByRoles)
        /* => {
                president:['contestant1id','contestant2id']
              }
        */
        return resultsByRoles
      }
    },
    async getScores(results){
      let scores = [];
      console.log('resultsByRoles: ', results)
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
      console.log('scores: ', scores)
      return scores;
    },
    async open(){
      try{
        this.countDownTimer()
        this.getLabels()
        this.show_when_ready = true
      }catch(error){
        console.log(error)
      }

    },
    extractVoter(uid){
      return this.regVoters.find(voter=> voter.uid == uid)
    },
    getRole(contestant){
      let ref = contestant.contestsRef
      .find(item=>item.electionRef == this.currElection.electionId)
      return this.currElection.roles.find(role=>role.value == ref.role).title
    },
    async serverTime(){

      // MAKE SURE YOU SECURE THIS ENDPOINT
      let resp = await api().post('dashboard/serverTimestamp')
      this.currentTime = resp.data
    },
    countDownTimer(){
      this.startDate = new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
      this.countDownDate = this.startDate + this.currElection.duration * 1000 * 60 * 60
      console.log(this.countDownDate)
      console.log(this.startDate)
			this.interval = setInterval(()=>{
        var now = new Date().getTime();
        //let now = serverDate.now();
        let distance = this.countDownDate - now;
        let days = Math.floor(distance/(1000*60*60*24));
        let hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
        let minutes = Math.floor((distance % (1000*60*60))/(1000*60));
        let seconds = Math.floor((distance % (1000*60))/1000);
      
        //this.electionTime = {days:days + "d ", hours:hours + "h ", minutes:secondsminutes + "m ", seconds:seconds + "s "}
        days = days < 10 ? days = `0${days}` : days
        hours = hours < 10 ? hours = `0${hours}` : hours
        minutes = minutes < 10 ? minutes = `0${minutes}` : minutes
        seconds = seconds < 10 ? seconds = `0${seconds}` : seconds

        this.electionTime = {days:days, hours:hours, minutes:minutes, seconds:seconds}
        
        let lent = Object.keys(this.regVoters).length
        
        if(this.getVotes && this.getVotes.length != 0 && lent == this.getVotes.length){
          // all voters have registered, stop the election
          clearInterval(this.interval)
          this.not_started = false
          this.election_ended = true
          this.inprogress = false
          this.show_btn = true
        }
        else if(distance <= this.currElection.duration * 1000 * 60 * 60 && distance > 0){
          // the election is in progress
          //console.log('step2')
          this.not_started = false
          this.election_ended = false
          this.inprogress = true
          this.electionTime = {days:days + "d ", hours:hours + "h ", minutes:minutes + "m ", seconds:seconds + "s "}
          this.show_btn = true
        }
        else if(distance <= 0 ){ // election duration is reached
          //console.log(distance)
          //console.log('step3')
          clearInterval(this.interval)
          this.inprogress = false
          this.not_started = false
          this.election_ended = true
          this.show_btn = true
        }
        else{ // election not yet started
          //console.log('step4')
          this.not_started = true
          this.inprogress = false
          this.election_ended = false
          this.show_btn = true
        }
        
      }, 1000);
    },
    voterdOrNot(id){
      if(this.currElection){
        let voted = this.currElection.voted.find(item => item == id)
        return voted ? 'Voted': 'Not voted'
      }
      else{
        return 'Not voted'
      }
    },
    isNotVoting(){
      console.log('closed voting dialog')
      this.votingList.splice(this.votingList.indexOf(this.getUser.uid), 1)
    },
    truncateText(text){
      return text.replace(/(.{18})..+/, "$1...");
    },
    getLabels(){
      this.labels = []
      this.data = []
      this.bgdColor = []
      this.contestants.map(d=>{
        if(this.allVotes && this.contestants.length > 0){ // if there are votes

        // get votes for a particular contestant
        let foo = this.allVotes.filter(vote=> {
          return d.uid == vote.id
        })
        //console.log(item)
        console.log(d)
        this.labels.push(this.truncateText(d.name))
        //this.labels = labels
        this.data.push(foo[0] ? foo[0].score > 0 ? foo[0].score : 0 : 0)
        //this.data = data
        let random1 = Math.floor(Math.random() * Math.floor(255))
        let random2 = Math.floor(Math.random() * Math.floor(255))
        let random3 = Math.floor(Math.random() * Math.floor(255))
        this.bgdColor.push(`rgba(${random1}, ${random2},  ${random3}, 0.5)`)
        //this.bgdColor = bgdColor
        }
      })
      //console.log('chartdata: ', data)
      //console.log('chart labels: ', labels)
      this.renderChart()
    },
    renderChart(){
      this.chartData = {
        labels:this.labels,
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
        case 'election_edited':
          return 'success'
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
    isFollowing(contestant){
      return contestant.followers.indexOf(this.getUser.uid) == -1 ? false : true
    },
    follow(event,contestant){
      //console.log(contestant)
      if(contestant.followers.indexOf(this.getUser.uid) == -1){
        this.disabled.push(contestant.uid)
        contestant.followers.push(this.getUser.uid)

        db.collection('moreUserInfo').doc(contestant.email).update({
          followers:firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.email).update({
            following:firebase.firestore.FieldValue.arrayUnion(contestant.uid)
          })
          if(res){
            //this.contestants = res.data,
            this.disabled.splice(this.disabled.indexOf(contestant.uid),1)
            this.$refs[contestant.uid][0].innerText = `you are following ${contestant.name}`
            //console.log(res.data)
            this.disabled.splice(this.disabled.indexOf(contestant.uid),1)
          }
        })
      }
      else{
        this.disabled.push(contestant.uid)
        contestant.followers.splice(contestant.followers.indexOf(this.getUser.uid), 1)
        
        //event.target.innerText = `(${contestant.followers.length - 1})  follow`
        db.collection('moreUserInfo').doc(contestant.email).update({
          followers:firebase.firestore.FieldValue.arrayRemove(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.email).update({
            following:firebase.firestore.FieldValue.arrayRemove(contestant.uid)
          })
          if(res){
            this.$refs[contestant.uid][0].innerText = `Follow ${contestant.name}`
            //console.log(res.data)
            this.disabled.splice(this.disabled.indexOf(contestant.uid),1)
          }
        }).catch(err=>{
          console.log(err)
        })
      }
      
      
    },
    follow_election(){
      //console.log(this.getUser)
      let this_user = this.getUser
      this.disabled.push(this_user.uid)
      if(this.currElection.followers.find(data=> data == this_user.uid)){
        // is following
        this.currElection.followers.splice(this.currElection.followers.indexOf(this_user),1)
        db.collection('elections').doc(this.currElection.electionId).update({
          followers:firebase.firestore.FieldValue.arrayRemove(this_user.uid)
        }).then(res=>{
          this.disabled.splice(this.disabled.indexOf(this_user.uid),1)
          
        })
      }
      else{
        // not following
        this.currElection.followers.push(this_user.uid)
        db.collection('elections').doc(this.currElection.electionId).update({
          followers:firebase.firestore.FieldValue.arrayUnion(this_user.uid)
        }).then(res=>{
          
          this.disabled.splice(this.disabled.indexOf(this_user.uid),1)
          
        })
      }
    },
    isVoting(id){
      return this.votingList.indexOf(id) == -1 ? false : true
    },
    checkIfOnline(user){
      let those_online = this.$store.state.those_online
      let foo = []
      let found = those_online.find(data => data.username == user.username)
      return found ? true : false
    },
    viewManifesto(contestant){
      //console.log('manifestor: ', contestant)
      this.$router.push(`/manifesto/view?username=${contestant.userId.username}&manifesto=foo`)
    },
  },
  async mounted(){
    // get the elections the user enrolled in
    try {
      this.setup()
      
      this.$eventBus.$on('Hide_Profile', data=>{
        this.viewprofile = false
      })
      
      this.$eventBus.$on('Close_Voting_Dialog', data=>{
        this.show_voting_dialog = false
      })
     
    } catch (error) {
      console.log(error)
      
    }
  },
  components:{
    ViewProfile,
    LoadingBar,
    Vote,
    Results,
    BarChart,
    carousel,
    Navigation
  },
}
import api from '@/services/api'
  import {mapGetters} from 'vuex'
  import ViewProfile from '@/components/ViewProfile'
  import Results from '@/components/Results'
  import Vote from '@/components/Vote'
  import BarChart from '@/charts/barchart'
  import carousel from 'v-owl-carousel'
  import Navigation from '@/components/Navigation'
  import LoadingBar from '@/spinners/LoadingBar'
</script>
<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;
  .v-dialog--fullscreen{
    background:#fff !important;
  }
  #bar_chart{
    width:100%;
  }

  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
  
  @media (min-width: 0){
    .flex.xs12 {
      margin-bottom: 15px;
      padding:0;
    }
    .election_details .pr-2{
      padding-right:0 !important;
    }
    .election_details .pl-1{
      padding-left:0 !important;
    }
    #tslshow .flex.xs12{
      width:45vh !important;
    }
    
  }
  #online_badge{
    display: inline-block;
    background: green;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 5px;
  }
  .hover{
    &:hover{
      cursor: pointer;
    }
  }

  .following{
    color:#4CAF50,
  }
  .following::before{
    border:1px solid #4CAF50
  }
  #first{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  #last{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .timer{
    //display:inline-block;
    //padding:5px;
    color:#fff;
    background:teal;
    background:#000;
    box-shadow: 1px 4px 9px 0px #1b1a1a;
    //margin-right:2px;
  }
  
  body {
  background-color: #2D89EF;
  font-family: "Titillium Web", Helvetica, Arial, sans-serif;
}
.verticalChart {
  width:100%;
  .singleBar {
    width:23%;
    float:left;
    margin-left:0.5%;
    margin-right:0.5%;
    .bar {
      position:relative;
      height:200px;
      //background:rgba(255,255,255,0.2);
      overflow:hidden;
      .value {
        position:absolute;
        bottom:0;
        width:100%;
        background:#ffffff;
        color:#ffffff;
        span {
          position:absolute;
          font-size:12px;
          bottom:0;
          width:100%;
          height:20px;
          color:#fff;
          display:block;
          text-align:center;
        }
        #ontop{
          bottom:58px;
          font-size: 3em;
        }
      }
    }
  }
}

  /* --scrollbar --*/
.scrollbar::-webkit-scrollbar {
    width: 10px;
    background-color: #d7d7df ;
    @include borderRadius(10px)
  }
.scrollbar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #d7d7df ;
  @include borderRadius(10px)
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>
