<template>
  <div>
    
    <transition name="fade" mode="out-in">
      
      <v-overlay v-if="!showUi"
        :absolute="true"
        :value="!showUi"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <div v-else >

      <!-- ==DETAILS== -->
      <v-container :pa-1="$vuetify.breakpoint.xsOnly" pb-0>
        <v-card outlined tile class="mt-0">
          <v-row no-gutters>
            <v-col sm="12" md="8" class="mb-0 py-0">
              <v-card dark flat tile class="ma-0">
                <v-list>
                  <v-list-item  ref="list">
                    <v-list-item-avatar color="teal">
                      <img :src="currElection.logo" v-if="currElection.logo">
                      <span v-else class="text-capitalize">{{currElection.title.charAt(0)}}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{currElection.title}}</v-list-item-title>
                      <v-list-item-subtitle>{{currElection.official ? 'Official' : currElection.sch}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <!-- <v-list-item-action v-show="$vuetify.breakpoint.smAndUp">
                      
                      <small>Current Time</small>
                        
                      <iframe src="https://free.timeanddate.com/clock/i6svkufx/n1972/fs12/fcddd/tc424242/pc424242/ahr/tt0/tw0/tm1/ts1/ta1/tb1" frameborder="0" width="189" height="16"></iframe>
                    </v-list-item-action> -->
                    <v-list-item-action>
                      <v-menu offset-y>
                        <template v-slot:activator="{on}">
                          <v-icon @click="''" v-on="on">mdi-dots-vertical</v-icon>
                        </template>
                        <v-list dense>
                          <v-list-item @click="''">
                            <v-list-item-title>Copy election link</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              
                <!-- <loading-bar spinnerType='circle' height="40vh" v-if="!timer_ready"></loading-bar> -->
                
                <!-- <v-overlay v-if="!timer_ready"
                  :absolute="true"
                  :value="!timer_ready"
                >
                  <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay> -->

                  <transition name="fade">
                    <v-card-text  v-if="timer_ready" ref="time">
                      <h4  v-if="status.not_started">Election starts in</h4>
                      <h4  v-if="status.inprogress" class="title error--text lighten-4">Election in progress</h4>

                      <v-container justify-center fill-height>
                        <v-row align-center justify-center>
                          <v-col cols="12" sm="12">
                            <v-card-text class="pa-0">
                              <div id="time" class="d-block" ref="div">

                                <vac :end-time="endTime" ref="countdown" :start-time="start" @onFinish="onFinish" @onProcess="onProcess">

                                  <span slot="process" slot-scope="{ timeObj }">

                                    <div class="verticalChart">

                                      <div class="singleBar">
                                        <div class="bar">
                                          <div class="value elevation-4" style="height: 48%;background:teal;">
                                            <span id="ontop">{{timeObj.d}}</span>
                                            <span>DAYS</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div class="singleBar">
                                        <div class="bar">
                                          <div class="value" style="height: 75%;background:#8bc34a;">
                                            <span id="ontop">{{timeObj.h}}</span>
                                            <span>HOURS</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="singleBar">
                                        <div class="bar">
                                          <div class="value" style="height: 100%;background:#ee44aa;">
                                            <span  id="ontop">{{timeObj.m}}</span>
                                            <span>MINUTES</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="singleBar">
                                        <div class="bar">
                                          <div class="value" style="height: 60%;background:#5192c5;">
                                            <span id="ontop">{{timeObj.s}}</span>
                                            <span>SECONDS</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                  </span>
                                  <span slot="finish">
                                    <div class="text-xs-left py-5" style="display:table;margin:auto;">
                                      <h3 class="display-1">Election Ended</h3>
                                      <small>at 
                                      {{new Date(endTime).toLocaleString('en-Us',{day: 'numeric', month: 'numeric', year: 'numeric', hour:'numeric',minute:'numeric'})}}</small>
                                    </div>
                                  </span>
                                </vac>
                                
                              
                              </div>
                              
                            </v-card-text>
                          </v-col>
                        </v-row>
                      </v-container>

                    </v-card-text>

                  </transition>

                  <transition name="fade" appear>

                    <!-- VOTE, ENROLL, FORUM, ACTIONS -->
                    <v-card-actions v-if="timer_ready">
                      <v-btn @click="show_results_dialog = true" color="pink" class="mr-3"
                        dark v-if="!status.not_started" small>
                        View Results
                      </v-btn>
                      <v-btn  color="teal" class="mr-3" dark @click="show_voting_dialog = true" small
                        v-if="canVote">
                        Vote 
                      </v-btn>

                      <v-tooltip right>
                        <template v-slot:activator="{on}">
                          <v-btn  color="red" v-on="on" class="mr-3 text-capitalize" dark to="/verify" small
                            v-if="!is_verified">
                            Verify Your account
                          </v-btn>
                        </template>
                        <span>You need to verify your account before you can enroll to vote</span>
                      </v-tooltip>

                      <v-btn  color="success" small dark @click="enroll_dialog = true" 
                          v-if="status.not_started && !hasEnrolled && is_verified">
                        Enroll
                      </v-btn>

                      <!-- <v-tooltip right class="mr-3">
                        <v-btn  color="success" slot="activator" small dark 
                          to="/forum">
                          <v-icon>forum</v-icon>
                          <span class="ml-2">Forum</span>
                        </v-btn>
                        <span>Join the conversation for this election</span>
                      </v-tooltip> -->

                      <!-- <v-btn  color="primary" depressed
                        small dark class="hidden-xs-only"
                        @click="show_manager = !show_manager" v-if="isAdmin">
                        <span class="ml-2">Election Manager</span>
                      </v-btn> -->
                    </v-card-actions>
                  </transition>
                

              </v-card>
            </v-col>

            <!-- Election DETAILS> -->
            <v-col sm="12" md="4" class="mb-0 py-0">
              <v-card tile flat>
                
                <v-subheader class="font-weight-bold">About </v-subheader>
                <v-list dense>
                  <v-list-item v-if="currElection.timed" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-clock</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Start Time</span>
                      <span>{{(new Date(currElection.fullStartDate)).toLocaleString('en-Us',{day: 'numeric', month: 'numeric', year: 'numeric', hour:'numeric',minute:'numeric'})}}</span>
                    </v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item v-if="currElection.timed" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-timer</v-icon>   
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Duration</span>
                      <span>{{currElection.duration}} hrs</span>
                    </v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-play</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Status</span>
                      <span v-if="!timer_ready">Checking...</span>
                      <span v-else>{{status.not_started ? 'Not started' : status.inprogress ? 'In progress' : 'Ended'}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.type == 'School'" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-school</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="text-capitalize">
                      <span class="mr-3">School</span>
                      <span>{{currElection.sch}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-layers</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Level</span>
                      <span>{{currElection.level}} Election</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.type == 'School' 
                    && (currElection.level != 'General')" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-domain</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="text-capitalize">
                      <span class="mr-3">Faculty</span>
                      <span>{{currElection.fac}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.level == 'Department'" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-map-marker</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="text-capitalize">
                      <span class="mr-3">Department</span>
                      <span>{{currElection.dept}}</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <!-- <v-card-actions>
                  <v-row row wrap justify-center>
										
										<v-col shrink class="mr-5 text-center">
											<v-progress-circular
												:value="100"
												size="80"
												color="success"
											>
											{{no_of_voters || 0}}
											</v-progress-circular>
											<span class="d-block mt-2"> Voters</span>
										</v-col>

										<v-col shrink class="text-center">
											<v-progress-circular
												:value="80" size="80"
												color="purple lighten-2"
											>
											{{no_of_contestants}}
											</v-progress-circular>
											<span class=" d-block ml-1 mt-2"> Contestants</span>
										</v-col>

									</v-row>
                </v-card-actions> -->
              </v-card>
            </v-col>

          </v-row>
          <v-divider class="hidden-sm-and-up"></v-divider>

        </v-card>
      </v-container>
      
      <election-about/>

      <!-- VOTE -->
      <v-dialog v-model="show_voting_dialog" v-if="show_voting_dialog"
        scrollable fullscreen :transition="switchTransition">
        <v-card>
          <v-toolbar flat tile dense dark color="success">
            <v-btn icon dark @click.native="show_voting_dialog = false;">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-toolbar-title>Vote: {{currElection.title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="$vuetify.breakpoint.smAndUp">
              <v-btn dark text @click.native="show_voting_dialog = false;">Cancel</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text class="pa-0">
            <vote :currElection='currElection' :contestants='contestants' :roles="roles"></vote>
          </v-card-text>
          
        </v-card>
      </v-dialog>

      <!-- VIEW MANIFESTO -->
      <v-dialog v-model="show_manifesto_dialog" content-class="white view_dialog"
        v-if="show_manifesto_dialog" max-width="500"   scrollable :transition="switchTransition"
          :fullscreen="$vuetify.breakpoint.xsOnly || fullscreen">
        <v-card style="min-height: 450px;">
          <v-list dense dark :class="[$helpers.colorMinder(viewing.onr.name.charAt(0))]">
            <v-list-item >
              <v-list-item-action class="hidden-sm-and-up" style="min-width: 30px;">
                <v-btn text icon @click="show_manifesto_dialog = false">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-avatar :color="!viewing.photoURL ? viewing.onr.name.charAt(0) : ''">
                <img v-if="viewing.onr.photoURL" :src="viewing.onr.photoURL">
                <span v-else class="white--text">{{viewing.onr.name.charAt(0)}}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-capitalize">{{viewing.onr.name}}</v-list-item-title>
                <v-list-item-subtitle>{{$helpers.parseDate(viewing.tstamp)}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class="hidden-xs-only">
                <v-btn text icon @click="fullscreen = !fullscreen">
                  <v-icon>{{fullscreen ? "mdi-fullscreen-exit" : "mdi-fullscreen"}}</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action class="hidden-xs-only">
                <v-btn text icon @click="show_manifesto_dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>

          <v-card-text>
            <v-container grid-list-xs>
              <v-row row wrap justify-center>
                <v-col shrink>
                  <v-card flat class="grey lighten-5 pa-3">
                    <div v-html="viewing.body"></div>
                    
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- SUMMARY OF RESULTS -->
      <v-dialog
        v-model="show_summary_dialog"
        fullscreen hide-overlay scrollable
        transition="dialog-transition"
         
      >
        <v-card class="grey lighten-4" id="print_summary">
          <v-toolbar flat color="teal" dark>
            <div class="title">Summary of Results</div>
            <v-spacer></v-spacer>
            <v-btn text icon @click.native="printSummary" class="hidden-sm-and-down">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
            <v-btn text icon @click.native="show_summary_dialog = false; title_string = 'Vote'">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pa-0">
            <results-summary 
              :curr-election="currElection" 
              :raw-votes="rawVotes" 
              :get-admin="getAdmin" 
              :status="status"
              :timer_ready="timer_ready"
              :contestants="contestants"
              :all-votes="allVotes"
              :total-votes="totalVotes"
              :is-printing="isPrinting">
            </results-summary>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- ENROLL DIALOG -->
      <v-dialog
        v-model="enroll_dialog"
        :persistent="enrolling"
        :overlay="false"
        max-width="350px"
        transition="dialog-transition">
        <v-card>
          <v-toolbar flat dense>
            Enroll
          </v-toolbar>
          <v-card-text>
            Enroll in this election to be able to vote or participate in the forum
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" text @click="enroll_dialog = false" :disabled="enrolling">Cancel</v-btn>
            <v-btn color="success" depressed @click.native="enroll" :loading="enrolling">Enroll</v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>

      </div>
    </transition>
    </div>
  </template>
<script>
export default {
  data:()=>({
    title_string: 'Vote',
    tabs: 'tab1',
    description: '',
    showUi: false,
    timer_ready: false,
    time_lag: 0,
    endTime: 0,
    endTime1: 0, // countdown b4 start of election
    endTime2: 0, // countdown b4 end of election
    start: 0,
    manifestos: [],
    isLastVoter: false,
    isLastActivity: false,
    lastActivity: '',
    lastVoter: '',
    loading_more_voters: false,
    loading_more_activities: false,
    enroll_dialog: false,
    enrolling: false,
    suspended: [],
    disabled: [],
    allVotes: [],
    myEnrolledElc: [], 
    elecRef: '', // primarilly to detatch listeners
    moreUserInfoRef: '', // primarilly to detatch listeners
    votesRef: '', // primarilly to detatch listeners
    contestantsRef: '',
    activityRef: '', // primarilly to detatch listeners
    currElection:{}, // contains the current election
    regVoters:[], // contains registered voters for the current election
    activities: [],
    startDate:'',
    countDownDate:'',
    interval:'',
    showCarousel:true,
    electionTime:'',
    date_options:{
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    },
    status: {}, // the election progress - notstarted, inprogress, ended
    voterprofile: {},
    contestants: [],
    votes: [], // the raw votes but may contain duplicates
    show_voting_dialog: false, // whether to show the voting window/ dialog
    show_results_dialog: false, // whether to show the results window/ dialog
    show_manifesto_dialog: false,
    show_summary_dialog: false,
    viewing: {}, // manifesto in view
    fullscreen: false, // read manifesto in fullscreen mode
    show_manager: false,
    chartData: {},
    data: [],
    roles: [],
    labels:[],
    bgdColor:[],
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
    profile_menu: false,
    selected_profile: {},
    tabledata: [],
    isPrinting: false,
  }),
  props:['electionId'], // this prop is from the vue-router params
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      let arr = []
      value.split(' ').map((item,index)=>
        arr.push(item.charAt(0).toUpperCase() + item.slice(1))
      )
      return arr.toString().split(',').join(' ')
    }
  },
  watch:{
    $route:function(to,from){
      
    },
    curRoom: function(){
      this.contestants = []
      this.curRoom && this.getUser ? this.setup() : ''
      // Rerender the contestants carousel
      this.showCarousel = false
      setTimeout(()=>this.showCarousel = true, 2000)
    },
    rawVotes: function(){
      this.getLabels()
    },
    // 'suspended.contestants': function(to, from){
    //   if(this.all_contestants){
    //     let suspended = to
    //     this.contestants = this.all_contestants.filter(item => !suspended.includes(item.uid))
    //     this.showCarousel = false
    //     setTimeout(()=>this.showCarousel = true, 2000)
    //   }
    // },
    // 'suspended.voters': function(to, from){
    //   this.regVoters = this.regVoters.filter(voter => !to.includes(voter.uid))
    // }
  },
  computed:{
    title(){
      return `${this.title_string} | ${this.$appName}`
    },
    getStartDate(){
      return new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
    },
    rawVotes(){
      // contains duplicate-free version of all the raw votes made for the current election
      
      return uniqBy(this.votes, 'key')
    },
    
    allVoters(){
      return uniqBy(this.regVoters, 'username')
    },
    totalVotes(){
      let totalVotes = 0
      this.allVotes.forEach(vote =>{
        totalVotes += vote.score
      })
      return totalVotes
    },
    no_of_voters(){
      let len = this.currElection.voters
        
			switch (true){
				case len >= 1000000:
					return Math.round(len / 1000000) + 'M +'
				case len >= 1000:
					return Math.round(len / 1000) + 'K + '
				default:
					return len
			}
    },
    no_of_contestants(){
			let len = this.contestants.length
			
			switch (true){
				case len >= 1000000:
					return Math.round(len / 1000000) + 'M +'
				case len >= 1000:
					return Math.round(len / 1000) + 'K + '
				default:
					return len
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
    canVote(){
      return this.status.inprogress && 
      !this.voted() &&
      this.hasEnrolled && 
      this.is_verified
    },
    switchTransition(){
      return this.$vuetify.breakpoint.smAndDown ? 
      'slide-x-reverse-transition' : 
      'dialog-bottom-transition'
    },
    
    async isAdmin(){
      
      return !!this.admins.find(admin => admin.username == this.getUser.username)
      
    },
    
    getAdmin(){
      //console.log(this.regVoters)
      let found = this.regVoters.find(voter => voter.username == this.currElection.admin)
      return found ? found : this.currElection.admin
    },
    hasEnrolled(){
      let enrolled = 
      this.getMyEnrolled.find(election => {
        return election.electionId == this.currElection.electionId
      })

      // console.log(!!enrolled)
      return !!enrolled
    },
    
    ...mapGetters([
      'getUser',
      'getSchools',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ])
  },
  methods:{
    async setup(){
      
      this.showUi = false

      if(this.$route.params.electionId){
        
        this.$gun.get('elections')
        .get(this.$route.params.electionId)
        .on(election => {
          
          if(election){
            this.currElection = election
            
            this.open()
          }
          else {
            // showUi = false
          }
          
        })
      }

      else {
        this.currElection = this.curRoom
      }
      
      console.log(this.currElection)

      
    },
    printSummary(){

      this.isPrinting = true

      let expandResults = async ()=>{
        this.isPrinting = true
      }

      expandResults().then(()=>{
        let scripts = document.scripts
        let head = document.head.innerHTML

        let myWindow = window.open()
        myWindow.document.head.innerHTML = head
        myWindow.document.body.innerHTML = document.getElementById('print_summary').innerHTML

        myWindow.focus()
        myWindow.print()
        this.isPrinting = false
      })

    },
    viewManifesto(manifesto){
      // console.log(manifesto)
      this.viewing = manifesto
      this.show_manifesto_dialog = true
    },
    async open(){
      try{

        this.showUi = false

        if(this.currElection.timed){
          this.timer_ready = false;
          // if the election is a timed election
          // this.getServerTime().then(resp=>{
            //console.log(resp.time - Date.now())
            let serverTime = (new Date()).getTime() // resp.time
            this.time_lag = serverTime - (new Date()).getTime()

            this.countDownTimer()
          // }).catch(err=> {
          //   // console.log(err,err.response)
          // })
        }
        else{
          this.status = {
            inprogress: true,
            not_started: false
          }
        }

        this.showUi = true
      }catch(error){
        // console.log(error)
      }

    },
    async enroll(){
      this.enrolling = true

      try{

        // Enroll a voter
        let election = this.$gun.get('elections')
          .get(this.currElection.electionId)
        let voter = this.$gun.get(this.getUser.username)


        let proceedToEnroll = () => {
              
          election
            .get('voters')
            .set(voter);
          
          voter.get('enrolled')
            .set(election)

          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Enrollement successfull!',
            color: 'success'
          })

          election.once(e => {
            this.$store.dispatch('curRoom', e)
          })
        }


        if(this.status.election_ended || this.status.inprogress){
          // election not started

          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: "Sorry, enrollement has ended",
            color: 'error'
          })
        }


        else if(this.hasEnrolled){
          
        // Voter has already enrolled

          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'You have already enrolled for this election',
            color: 'error'
          })
        }

        else {
          // voter has not previously enrolled

          // check if is same sch, fac, dept corresponding to election level

          let is_same_sch = this.currElection.sch == this.getUser.sch;
          let is_same_fac = this.currElection.fac == this.getUser.fac;
          let is_same_dept = this.currElection.dept == this.getUser.dept;
          let is_sch_election = this.currElection.type == 'School'
          let election_level = this.currElection.level

          if(is_sch_election){
            if(!is_same_sch){

              this.$eventBus.$emit('Snackbar', {
                show: true,
                message: 'You can only vote in your school',
                color: 'error'
              })
            }

            else if(election_level == 'Faculty' && !is_same_fac){

              this.$eventBus.$emit('Snackbar', {
                show: true,
                message: 'You can only vote in your faculty',
                color: 'error'
              })
            }

            else if(election_level == 'Department' && !is_same_dept){

              this.$eventBus.$emit('Snackbar', {
                show: true,
                message: 'You can only vote in your department',
                color: 'error'
              })
            }

            else {
              proceedToEnroll()
              console.log('Is school election. Other conditions met')
            }
          }

          else {
            proceedToEnroll()
            console.log('Not a school election')
          }

        }

        this.enrolling = false
        this.enroll_dialog = false
      }
      catch(error){
        
        this.enrolling = false
        this.enroll_dialog = false

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Something went wrong. Try again',
          color: 'error'
        })

        console.log(error)
      }
      
    },
    async getServerTime(){
  
      return new Promise((resolve,reject)=>{

        firebase.auth().currentUser.getIdToken()
        .then(async (token)=>{
          
          api().post('serverTimestamp', { idToken: token }).then(resp=>{
            resolve(resp.data)
          }).catch(err=>reject(err))
        })
      })
      
    },
    onFinish(v){
        let now = (new Date()).getTime() + this.time_lag;

        if(now > this.endTime2){
          // Election ended
          // console.log('ended-ended')
          this.status = {
            inprogress: false,
            not_started: false,
            election_ended: true
          }
        }
        
        else {
          // still in progress or not started
          // console.log('not started or inprogress')
          this.countDownTimer()
        }
      
    },
    onProcess(v){
      // console.log('process', v)
    },
    countDownTimer(){
      
      this.timer_ready = false
      this.startDate = (new Date(this.currElection.fullStartDate)).getTime();
      let now = (new Date()).getTime() + this.time_lag;
    
      this.start = now + this.time_lag;

      this.endTime1 = this.startDate
      this.endTime2 = this.startDate + this.currElection.duration * 1000 * 60 * 60
      // console.log(this.endTime1, new Date(this.currElection.fullStartDate))
      if(now < this.endTime1){ // not started yet
      
        this.endTime = this.endTime1
        this.status = {
          inprogress: false,
          not_started: true,
          election_ended: false
        }
        setTimeout(()=> {
          this.timer_ready = true
        }, 1000)
      }
      else if(now > this.endTime1 && now < this.endTime2){ // started
        
        this.endTime = this.endTime2
        this.status = {
          inprogress: true,
          not_started: false,
          election_ended: false
        }
        setTimeout(()=> {
          this.timer_ready = true
        }, 1000)
      }

      else {
        
        this.endTime = this.endTime2
        this.status = {
          inprogress: false,
          not_started: false,
          election_ended: true
        }

        setTimeout(()=> {
          this.timer_ready = true
        }, 1000)
      }
        

    },
    voted(){
      if(this.currElection){

        let voted = false;

        this.$gun.user()
          .get('votes')
          .get(this.currElection.electionId)
          .not(v => {
            console.log(v)
            voted = v ? false : true
          })
        return voted
      }
      else{
        return false
      }
    },
    
    
  },
  mounted(){
    // console.log(this.curRoom, 'mounted')
    this.setup()

  },
  async created(){
    // get the elections the user enrolled in
    try {
      
      this.$eventBus.$on('Close_Voting_Dialog', data=>{
        this.show_voting_dialog = false
      })
     
    } catch (error) {
      //console.log(error)
      
    }
  },
  destroyed(){
    
  },
  components:{
    LoadingBar,
    Vote,
    ElectionAbout,
    ResultsSummary
  },
}
import api from '@/services/api'
  import {mapGetters, mapState} from 'vuex'
  import Vote from '@/components/elections/Vote'
  import LoadingBar from '@/spinners/LoadingBar'
  import ResultsSummary from '@/components/elections/ResultsSummary'
  import ElectionAbout from '@/components/elections/ElectionAbout'
  import { pickBy, uniqBy } from "lodash";
</script>
<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;

  #bar_chart{
    width:100%;
  }

  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
  .linkify{
    cursor: pointer;
  }
  .round_top {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    -webkit-border-top-right-radius: 10px;
    -webkit-border-top-left-radius: 10px;
    -moz-border-top-right-radius: 10px;
    -moz-border-top-left-radius: 10px;
    -o-border-top-right-radius: 10px;
    -o-border-top-left-radius: 10px;
    -ms-border-top-right-radius: 10px;
    -ms-border-top-left-radius: 10px;
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
          bottom:48px;
          font-size: 3em;
        }
      }
    }
  }
}

//   /* --scrollbar --*/
// .scrollbar::-webkit-scrollbar {
//     width: 8px;
//     background-color: #d7d7df ;
//     @include borderRadius(10px)
//   }
// .scrollbar_thin::-webkit-scrollbar {
//     width: 2px;
//     background-color: #d7d7df ;
//     @include borderRadius(10px)
//   }
// .scrollbar::-webkit-scrollbar-track {
//   box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
//   -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
//   -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
//   -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
//   background-color: #d7d7df ;
//   @include borderRadius(10px)
// }
// .scrollbar::-webkit-scrollbar-thumb {
//   background-color:#87899c ;
//   @include borderRadius(10px);
// }
</style>
