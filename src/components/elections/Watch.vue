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

                  <transition name="fade">
                    <v-card-text ref="time">

                      <v-container>
                        <v-row align='center' justify="center">
                          <v-col cols="12" sm="12">
                            <v-card-text class="pa-0">
                              <div id="time" class="d-block" ref="div" 
                                v-if="currElection.timed">
                                
                                <vac :end-time="elecStartTime" v-if="status.not_started"
                                  ref="countdown2" :start-time="Date.now()">

                                  <span slot="process" slot-scope="{ timeObj }">
                                    <h4 class="orange--text">
                                      Election starts in
                                    </h4>

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
                                      <h3 class="display-1">Voting Started</h3>
                                      <small>at 
                                      {{new Date(elecStartTime).toLocaleString('en-Us',{day: 'numeric', month: 'numeric', year: 'numeric', hour:'numeric',minute:'numeric'})}}</small>
                                    </div>
                                  </span>
                                </vac>
                                
                                <vac :end-time="elecEndTime" v-else
                                  ref="countdown" :start-time="elecStartTime" 
                                  @finish="onFinish" @process="onProcess">

                                  <span slot="process" slot-scope="{ timeObj }">

                                    <h2 
                                      :class="[status.inprogress ? 'success--text' : 'primary--text']">

                                      Election {{status.inprogress ? 'in progress' : 'Ended'}}
                                    </h2>

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
                                      <h3 class="display-1">Voting Closed</h3>
                                      <small>at 
                                      {{new Date(elecEndTime).toLocaleString('en-Us',{day: 'numeric', month: 'numeric', year: 'numeric', hour:'numeric',minute:'numeric'})}}</small>
                                    </div>
                                  </span>
                                </vac>
                                
                              </div>

                              <div class="d-block" v-else>

                                <div class="text-xs-left py-5" style="display:table;margin:auto;">
                                  <h3 class="display-1">
                                    {{electionStatus[0]}}
                                  </h3>
                                  </div>
                                
                              </div>
                            </v-card-text>
                          </v-col>
                        </v-row>
                      </v-container>

                    </v-card-text>

                  </transition>

                  <transition name="fade" appear>

                    <!-- VOTE, ENROLL, FORUM, ACTIONS -->
                    <v-card-actions>
                      <!-- <v-btn @click="show_results_dialog = true" color="pink" class="mr-3"
                        dark v-if="!status.not_started" small>
                        View Results
                      </v-btn> -->
                      <v-btn  color="orange" depressed 
                        class="mr-3" dark 
                        @click="show_voting_dialog = true"
                        v-if="canVote">
                        Vote 
                      </v-btn>

                      <v-btn  color="info" class="mr-3" dark
                        :to="`/contest?eId=${currElection.electionId}`"
                        v-if="canContest">
                        Contest 
                      </v-btn>

                      <v-btn  color="success" dark @click="enroll_dialog = true" 
                          v-if="status.not_started && !hasEnrolled">
                        Enroll
                      </v-btn>
                    </v-card-actions>
                  </transition>
                

              </v-card>
            </v-col>

            <!-- Election DETAILS> -->
            <v-col sm="12" md="4" class="mb-0 py-0">
              <v-card tile flat>
                
                <v-list dense>
                  <v-list-item @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-clock</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Start Time:</span>
                      <span>{{(new Date(elecStartTime)).toLocaleString('en-Us',{day: 'numeric', month: 'numeric', year: 'numeric', hour:'numeric',minute:'numeric'})}}</span>
                    </v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-timer</v-icon>   
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">End Time:</span>
                      <span>{{(new Date(elecEndTime)).toLocaleString('en-Us',{day: 'numeric', month: 'numeric', year: 'numeric', hour:'numeric',minute:'numeric'})}}</span>
                    </v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-play</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Status</span>
                      <span v-if="!timer_ready && currElection.timed">Checking...</span>
                      <span v-else>{{electionStatus[0]}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.type == 'School'" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-school</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="text-capitalize">
                      <span class="mr-3">School:</span>
                      <span>{{currElection.sch}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-layers</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Level:</span>
                      <span>{{currElection.level}} Election</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.type == 'School' 
                    && (currElection.level != 'General')" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-domain</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="text-capitalize">
                      <span class="mr-3">Faculty:</span>
                      <span>{{currElection.fac}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.level == 'Department'" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-map-marker</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="text-capitalize">
                      <span class="mr-3">Department:</span>
                      <span>{{currElection.dept}}</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-card-actions>
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
                </v-card-actions>
              </v-card>
            </v-col>

          </v-row>
          <v-divider class="hidden-sm-and-up"></v-divider>

        </v-card>
      </v-container>
      
      <election-about/>

      <!-- VOTE -->
      <v-dialog v-model="show_voting_dialog"
        fullscreen >
        <v-card>
          <v-toolbar flat tile dense dark color="success">
            <v-btn icon dark @click.native="show_voting_dialog = false;">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-toolbar-title>Vote: {{currElection.title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only">
              <v-btn dark text @click.native="show_voting_dialog = false;">Cancel</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text class="pa-0" v-if="show_voting_dialog">
            <vote :currElection="currElection" :status="status"></vote>
          </v-card-text>
          
        </v-card>
      </v-dialog>

      <!-- ENROLL DIALOG -->
      <v-dialog
        v-model="enroll_dialog"
        :persistent="enrolling"
        :overlay="false"
        max-width="400px"
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

          <div class="mx-5 pb-2">
            <small class="">By clicking 'Enroll' you agree to {{currElection.title}}'s 
              <router-link :to="`/elections/${currElection.electionId}/terms`">
                terms and condition
              </router-link>
            </small>
          </div>
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
    showUi: false,
    timer_ready: false,
    time_lag: 0,
    endTime: 0,
    endTime1: 0, // countdown b4 start of election
    endTime2: 0, // countdown b4 end of election
    start: 0,
    enroll_dialog: false,
    enrolling: false,
    allVotes: [],
    currElection:{}, // contains the current election
    regVoters:[], // contains registered voters for the current election
    activities: [],
    isContestant: false,
    startDate:'',
    showCarousel:true,
    date_options:{
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    },
    status: {}, // the election progress - notstarted, inprogress, ended
    contestants: [],
    votes: [], // the raw votes but may contain duplicates
    show_voting_dialog: false,
    roles: [],
    tabledata: [],
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
  computed:{
    title(){
      return `${this.title_string} | ${this.$appName}`
    },
    elecStartTime(){
      return new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime()
    },
    elecEndTime(){
      return new Date(this.currElection.endDate + ' ' + this.currElection.endTime).getTime()
    },
    electionStatus(){
      // BEWARE THIS FUNCTION USES LOCAL TIME, WHICH MIGHT BE INACCURATE
      // Get the status of the current election
	
			if(this.currElection.timed){
	
				if(this.status.not_started){
					return ['Not Started', 'primary'] // not started
				}
				else if(this.status.inprogress){
					return ['In Progress', 'success'] // in progress
				}
				else{
					return ['Ended','error'] // ended
				}
			}

			else {
				switch(this.currElection.status){
					case 'inprogress': return ['In Progress', 'success'];
					case 'ended': return ['Ended', 'error'];
					default: return ['Not Started', 'primary']
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
    no_of_voters(){
      let len = this.currElection.voters_count
        
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
			let len = this.currElection.contestants_count
			
			switch (true){
				case len >= 1000000:
					return Math.round(len / 1000000) + 'M +'
				case len >= 1000:
					return Math.round(len / 1000) + 'K + '
				default:
					return len
			}
    },
    canVote(){

      let inprogress = this.currElection.timed ? 
        this.status.inprogress : 
        this.currElection.status == 'inprogress'

      if(this.currElection.type == 'Others'){
        return inprogress
      }
      else {

        return inprogress && 
        // !this.voted() &&
        this.hasEnrolled 
        // && 
        // this.is_verified
      }
      
    },
    canContest(){
      // console.log(this.isContestant)
      let not_started = this.currElection.timed ? 
        this.status.not_started : this.currElection.status == 'not_started'
      return not_started && this.currElection.who_can_contest != 'manual' &&
      !this.isContestant && this.hasEnrolled
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
      'getMyEnrolled'
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified'
    ])
  },
  methods:{
    async initialize(){
      
      this.showUi = false

      if(this.$route.params.electionId){
        
        this.$gun.get('elections')
        .get(this.$route.params.electionId).not((d) =>{

          this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'Election not found',
              color: 'error'
            })
            
            this.$router.push('/notFound')
        })

        this.$gun.get('elections')
        .get(this.$route.params.electionId)
        .on(election => {
          
          if(election){
            this.currElection = election
            
            this.open()
            this.hasContested()
          }
          else {
            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'Election not found',
              color: 'error'
            })
            
            this.$router.push('/notFound')
          }
          
        })
      }

      else {
        console.log('invalid route')
        this.$router.push('/notFound')
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
    async open(){
      try{

        this.showUi = false

        if(this.currElection.timed){
          this.timer_ready = false
          // if the election is a timed election
          
            let serverTime = this.$Gun.state() // resp.time
            this.time_lag = serverTime - (new Date()).getTime()

            this.countDownTimer()
          
        }
        else{
          this.status = {
            inprogress: this.currElection.status == 'inprogress',
            not_started: this.currElection.status == 'not_started',
            ended: this.currElection.status == 'ended'
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
        let voter = this.$gun.get('users').get(this.getUser.username)


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
    async hasContested(){
      this.$gun.get('users')
        .get(this.getUser.username)
        .get('contests')
        .get(this.currElection.electionId)
        .on(d => {
          // console.log(d)
          this.isContestant = d ? true : false
        })
      
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
    
      this.status = {
        inprogress: false,
        not_started: false,
        election_ended: true
      }

      // console.log('finished')
      
    },
    onProcess(v){
      this.status = {
        inprogress: true,
        not_started: false,
        election_ended: false
      }

      // console.log('on progress', this.status)
    },
    countDownTimer(){
      
      this.timer_ready = false
      this.startDate = (new Date(this.currElection.fullStartDate)).getTime();
      let now = (new Date()).getTime() + this.time_lag;

      // console.log(this.endTime1, new Date(this.currElection.fullStartDate))
      if(now < this.elecStartTime){ // not started yet
      
        this.status = {
          inprogress: false,
          not_started: true,
          election_ended: false
        }
        setTimeout(()=> {
          this.timer_ready = true
        }, 1000)
      }
      else if(now > this.elecStartTime && now < this.elecEndTime){ // started
        
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
          .get(this.electionId, function(err,ack){
            console.log({err,ack})
            err ? voted = false : true
          })

          this.$helpers.sleep(0.2)

          // .not(v => {
          //   console.log(v)
          //   voted = v ? false : true
          // })
        return voted
      }
      else{
        return true
      }
    },
    
    
  },
  mounted(){
    
    this.initialize()

  },
  beforeDestroy(){
    // this.elecRef.off()
  },
  async created(){
    
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
  // font-family: "Titillium Web", Helvetica, Arial, sans-serif;
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
