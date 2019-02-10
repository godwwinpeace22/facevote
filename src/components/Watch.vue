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
              
              <loading-bar spinnerType='circle' height="40vh" v-if="!timer_ready"></loading-bar>
              <v-card-text v-if="timer_ready && currElection.timed">

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

              <v-card-actions v-if="timer_ready">
                <v-btn @click="show_results_dialog = true" color="pink" class="mr-3"
                   dark v-if="inprogress || election_ended" small>
                  See results
                </v-btn>
                <v-btn  color="teal" class="mr-3" dark @click="show_voting_dialog = true" small
                   v-if="canVote">
                  Vote 
                </v-btn>
                <v-tooltip top v-if="not_started" class="mr-3">
                  <v-btn  color="success" slot="activator" small dark :to="`/enroll`" 
                      v-if="not_started && !hasEnrolled">
                    Enroll
                  </v-btn>
                  <span>Enroll to vote</span>
                </v-tooltip>
                <v-tooltip top >
                  <v-btn  color="success" slot="activator" small dark 
                    :to="`/forum/${currElection.electionId}`">
                    <v-icon>forum</v-icon>
                    <span class="ml-2">Forum</span>
                  </v-btn>
                  <span>Join the conversation for this election</span>
                </v-tooltip>
                <v-btn color="secondary" class="ml-3" small v-if="getUser.uid == currElection.admin"
                  :to="`/elections/manage/${currElection.electionId}`">
                  <v-icon>settings</v-icon>
                  <span class="ml-2">Manager</span></v-btn>
              </v-card-actions>

            </v-card>
          </v-flex>

          <!-- Election DETAILS> -->
          <v-flex xs12 sm4 d-flex class="mb-0">
            <v-card flat tile>
              <v-toolbar color="teal" class="white--text" flat dense>
                Election Details
              </v-toolbar>
              <v-list dense>
                <v-list-tile :to="`/users/${getAdmin.email}`">
                  <v-flex xs4>
                    <v-icon color="teal">person</v-icon>
                    Admin </v-flex>
                  <v-flex xs8 class="text-capitalize">
                    {{getAdmin.name}}
                  </v-flex>
                </v-list-tile>
                <v-list-tile v-if="currElection.timed">
                  <v-flex xs4>
                    <v-icon color="teal">schedule</v-icon>
                      Start time</v-flex>
                  <v-flex xs8> {{(new Date(getStartDate)).toLocaleString('en-Us',{hour:'numeric',minute:'numeric'})}}</v-flex>
                </v-list-tile>
                <v-list-tile v-if="currElection.timed">
                  <v-flex xs4>
                    <v-icon color="teal">timer</v-icon>   
                    Duration</v-flex>
                  <v-flex xs8> {{currElection.duration}}hrs</v-flex>
                </v-list-tile>
                <v-list-tile>
                  <v-flex xs4>
                    <v-icon color="teal">play_circle_filled</v-icon>
                    Status</v-flex>
                  <v-flex xs8>
                    <span v-if="!timer_ready">Checking...</span>
                    <span v-else>{{not_started ? 'Not started' : inprogress ? 'In progress' : 'Ended'}}</span>
                  </v-flex>
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
    
    <v-dialog v-model="show_voting_dialog" v-if="show_voting_dialog" lazy fullscreen transition="dialog-bottom-transition">
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
        <vote id="vote_target" :currElection='currElection' :contestants='contestants' :rawVotes='rawVotes'></vote>
      </v-card>
    </v-dialog>


    <v-dialog v-model="show_results_dialog" v-if="show_results_dialog" 
      fullscreen transition="dialog-bottom-transition" scrollable>
      <v-card>
        <v-toolbar clipped-left flat dark color="success" scroll-target="result_dialog">
          <v-toolbar-title>Results: {{currElection.title}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items v-if="$vuetify.breakpoint.width > 350">
            <v-btn icon @click.native="show_results_dialog = false;">
              <v-icon >close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div id='result_dialog' lazy>
          <results :id='currElection._id' :chartData3='chartData' :allVotes='allVotes' :currElection='currElection' 
          :contestants='contestants' :regVoters='regVoters' :roles='currElection.roles' 
          :inprogress="inprogress" :electionEnded="election_ended">
          </results>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewprofile" v-if="viewprofile" lazy :style="styleObj"
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


    <!-- MANIFESTO DIALOG -->
    <v-dialog v-model="show_manifesto_dialog" v-if="show_manifesto_dialog" 
      fullscreen transition="dialog-bottom-transition" lazy>
      <v-card dark>
        <v-toolbar flat dark dense scroll-target="result_dialog">
          <v-toolbar-title>{{manifesto_spotlight.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon @click.native="show_manifesto_dialog = false;">
              <v-icon >close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <manifesto :user="manifesto_spotlight" :election="currElection" ></manifesto>
      </v-card>
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
                
                <v-container style="height:320px;overflow-y:auto;" class="scrollbar my-2 pt-1 pl-0 pr-3">
                  
                  <v-list two-line dense>
                    <div v-if="regVoters.length > 0" v-for="(voter, index) in regVoters" :key="index">
                      <v-list-tile  :key="voter.name" avatar @click="viewprofile = true; voterprofile = voter" :color="voter.online ? 'default' : 'grey'">
                        <v-list-tile-avatar>
                          
                          <v-badge overlap color="transparent">
                            <v-icon slot="badge" color="success" small v-if="voter.online">lens</v-icon>
                            <v-avatar v-if="voter.photoURL" size="40">
                              <img  :src="voter.photoURL">
                            </v-avatar>
                            <v-avatar v-else  :color="$helpers.colorMinder(voter.name.charAt(0))" size="40">
                              <span class="white--text headline">{{voter.name.charAt(0)}}</span>
                            </v-avatar>
                          </v-badge>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title  class="text-capitalize text-truncate">{{voter.name}}</v-list-tile-title>
                          <!--v-list-tile-sub-title v-html="voter.username" ></v-list-tile-sub-title-->
                          <v-list-tile-sub-title v-if="!isVoting(voter.uid)"><span style=''>{{voted(voter.uid) ? 'Voted' : 'Not Voted'}}</span></v-list-tile-sub-title>
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
                <div class="pt-2 scrollbar my-2" style="height:350px;overflow:auto;">
                  <v-timeline align-top dense>
                    <v-timeline-item :color="getColor(activity)" small v-for="activity in activities" :key="activity.id">
                      <v-layout pt-3>
                        <v-flex>
                          <strong>
                            <span class="secondary--text linkify" @click="viewprofile = true; voterprofile = extractVoter(activity.by)">{{activity.by == currElection.admin ? 'Admin' : 
                              extractVoter(activity.by).name}}
                            </span>
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
                    <v-list-tile avatar to="/manifesto/create" v-if="isContestant(getUser.uid)">
                        <span>Create manifesto</span>
                    </v-list-tile>
                    <v-list-tile avatar to="/enroll">
                        <span>Enroll</span>
                    </v-list-tile>
                    <v-list-tile avatar v-if="getUser.uid == currElection.admin"
                      :to="`/elections/manage/${currElection.electionId}`">
                      <span>Manage</span>
                    </v-list-tile>
                  </v-list>
                </v-container>
              </v-tab-item>
            </v-tabs>
            
          </v-card>
        </v-flex>
        <v-flex xs12 sm9  d-flex pl-1 pr-2>
          <v-card style="min-height:400px;width:100%;">
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
        
        <carousel v-if="showCarousel" :nav='true' :responsive="{0:{items:1,nav:false},600:{items:3,nav:true},800:{items:4,nav:true}}" >
          
          <v-subheader v-if="contestants && contestants.length == 0">No contestants</v-subheader>
          <v-card  :class="$helpers.colorMinder(contestant.name.charAt(0))" class="round mr-2"
            dark height="300" v-if="contestants.length > 0" 
            v-for="contestant in contestants" :key="contestant.email">
            
            <v-img  class="hover"
              :src="contestant.photoURL || `https://ui-avatars.com/api/?name=${contestant.name}&size=300`"
              height="185px">
              <v-layout column fill-height>
                <v-card-title class="px-1">
                  <v-spacer></v-spacer>
                  <v-menu offset-y v-if="hasManifesto(contestant)">
                    <v-btn dark icon slot="activator">
                      <v-icon color="secondary">more_vert</v-icon>
                    </v-btn>
                    <v-list dense dark>
                      <v-list-tile @click="viewManifesto(contestant)">
                        <v-list-tile-title>
                          View {{contestant.name}}'s manifesto
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  
                </v-card-title>
                <v-card-actions>
                  <!--span>{{contestant.followers.length}}</span-->
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" style="margin-top:120px;" class="text-capitalize follow" v-if="contestant.email != getUser.email" 
                    :disabled='!!disabled.find(email => email == contestant.email)'
                    small @click="follow($event,contestant)" :id="contestant.email">
                    {{isFollowing(contestant) ? 'Following' : 'Follow'}}
                  </v-btn>
                </v-card-actions>
              </v-layout>
            </v-img>

            <v-card-text style="cursor:-webkit-grab;cursor:grab;" class="px-1">
              <v-list two-line light>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title @click="viewprofile = true; voterprofile = contestant"
                      class="subheading font-weight-bold mb-0 text-capitalize .text-truncate hover">
                      {{contestant.name}}
                      <span id="online_badge" v-if="contestant.online"></span>
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      <i>for</i> {{getRole(contestant)}}
                    </v-list-tile-sub-title>
                    <!--v-list-tile-sub-title>
                      {{contestant.followers.length}} Followers
                    </v-list-tile-sub-title-->
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
            
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
    timer_ready:false,
    show_btn:false, // just to hide the btn initially - I don't want to see 'vote' and then 'show results' later after processing
    disabled:[],
    user:{}, // currently logged in user
    allVotes:[],
    myEnrolledElc:[], 
    elecRef:'', // primarilly to detatch listeners
    moreUserInfoRef:'', // primarilly to detatch listeners
    votesRef:'', // primarilly to detatch listeners
    //currElection:{}, // contains the current election
    regVoters:[], // contains registered voters for the current election
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
    show_manifesto_dialog:false,
    manifesto_spotlight:{},
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
          }],
          xAxes: [{
            ticks: {
                beginAtZero: true,
                autoSkip:false,
            }
          }]
      }
    }
  }),
  props:['electionId'], // this prop is from the vue-router params
  watch:{
    $route:function(to,from){
      this.contestants = []
      this.setup()
      // Rerender the contestants carousel
      this.showCarousel = false
      setTimeout(()=>this.showCarousel = true, 2000)
    }
  },
  computed:{
    getStartDate(){
      return new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
    },
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
      ////console.log(regActivities[0])

      if(regActivities && regActivities.length > 0){
        let the_last_reg_time = regActivities[0].dateCreated
        let now = Date.now()
        let oneMin = 60*1000
        let oneHour = 60*oneMin
        let oneDay = 24*oneHour
        let oneWeek = oneDay * 7
        let time_difference = now - the_last_reg_time
        //console.log(now,the_last_reg_time,time_difference)
        return time_difference < oneMin ?
        'Last registration a few seconds ago' :
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
        'Last vote a few seconds ago' :
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
    canVote(){
      return this.inprogress && 
      !this.voted(getUser.uid) &&
      this.hasEnrolled()
    },
    getAdmin(){
      //console.log(this.regVoters)
      let found = this.regVoters.find(voter => voter.uid == this.currElection.admin)
      return found ? found : this.currElection.admin
    },
    hasEnrolled(){
      ////console.log(this.regVoters)
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
      this.elecRef = await elecRef.onSnapshot(async (doc)=>{
        if(doc.exists){
          this.$store.dispatch('setCurElection', doc.data())
        }
        else{
          this.$router.push('/notFound')
        }
        
        //console.log('currElection: ', doc.data())
      }, error=>{
        console.log(error)
      })
      

      // get registered voters
      this.moreUserInfoRef = db.collection('moreUserInfo').where('enrolled','array-contains', this.$route.params.electionId)
      .onSnapshot(async querySnapshot=>{
        this.regVoters = []
        querySnapshot.forEach(doc=>{
          //console.log(doc.id, " => ", doc.data());
          this.regVoters.push(doc.data())
        })
        await this.allContestants()
        console.log('allcontestants')
        this.open()
      }, function(err){
        // handle listening errors
        console.log(err)
      })


      // get raw votes for this election
      this.votesRef = db.collection('votes')
      .where('electionRef', '==', this.$route.params.electionId)
      .onSnapshot(async querySnapshot=>{
        let arr = []
        querySnapshot.forEach(doc=>{
          arr.push(doc.data())
        })
        this.rawVotes = arr // the raw votes
        //console.log(this.rawVotes)
        this.allVotes = await this.getScores(await this.sortByRoles(this.rawVotes))
        //console.log(this.allVotes)
        this.getLabels()
        this.$store.dispatch('allVotes', arr)
      }, error=>{
        console.log(error)
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
      //console.log(contestants)
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
            ////console.log(f)
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
      //console.log('resultsByRoles: ', results)
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
      //console.log('scores: ', scores)
      return scores;
    },
    updateCarousel(e){
      console.log(e)
    },
    async open(){
      try{
        if(this.currElection.timed){
          // if the election is a timed election
          this.getServerTime().then(resp=>{
          //console.log(resp.time - Date.now())
          let serverTime = resp.time
          let time_lag = serverTime - Date.now()
          
          this.countDownTimer(time_lag)
        }).catch(err=>console.log(err,err.response))
        }else{
          this.inprogress = true;
          this.not_started = false;
        }
        
        //this.getLabels()
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
      let found = this.currElection.roles.find(role=>role.value == ref.role)
      return found ? found.title : false
    },
    async getServerTime(){
      // === TODO: MAKE SURE YOU SECURE THIS ENDPOINT! ===
      return new Promise((resolve,reject)=>{
        api().post('dashboard/serverTimestamp').then(resp=>{
          resolve(resp.data)
        }).catch(err=>reject(err))
      })
      
    },
    countDownTimer(time_lag){
      this.startDate = new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
      this.countDownDate = this.startDate + this.currElection.duration * 1000 * 60 * 60
      let count = this.startDate
      //console.log(this.startDate)
			this.interval = setInterval(()=>{
        var now = new Date().getTime() + time_lag;
        let distance = count - now;
        let days = Math.floor(distance/(1000*60*60*24));
        let hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
        let minutes = Math.floor((distance % (1000*60*60))/(1000*60));
        let seconds = Math.floor((distance % (1000*60))/1000);
      
        days = days < 10 ? days = `0${days}` : days
        hours = hours < 10 ? hours = `0${hours}` : hours
        minutes = minutes < 10 ? minutes = `0${minutes}` : minutes
        seconds = seconds < 10 ? seconds = `0${seconds}` : seconds

        this.electionTime = {days:days, hours:hours, minutes:minutes, seconds:seconds}
        
        let lent = Object.keys(this.regVoters).length
        
        if(this.getVotes && this.getVotes.length != 0 && lent == this.getVotes.length){
          // all voters have voted, stop the election
          clearInterval(this.interval)
          this.not_started = false
          this.election_ended = true
          this.inprogress = false
          this.show_btn = true
        }
        else if(distance <= 0 && this.countDownDate <= now){ 
          // election duration is reached
          clearInterval(this.interval)
          this.inprogress = false
          this.not_started = false
          this.election_ended = true
          this.show_btn = true
        }
        else if(distance <= 0 && this.startDate <= now){
          // count down to start time. Election just started
          count = this.countDownDate
          this.not_started = false
          this.election_ended = false
          this.inprogress = true
          this.electionTime = {days:days, hours:hours, minutes:minutes, seconds:seconds}
          this.show_btn = true
        }
        
        
        else{ // election not yet started
          //console.log('step4')
          this.not_started = true
          this.inprogress = false
          this.election_ended = false
          this.show_btn = true
        }
        
        this.timer_ready = true
      }, 1000);
    },
    voted(id){
      if(this.currElection){
        let voted = this.currElection.voted.find(item => item == id)
        return voted ? true : false
      }
      else{
        return false
      }
    },
    isNotVoting(){
      //console.log('closed voting dialog')
      this.votingList.splice(this.votingList.indexOf(this.getUser.uid), 1)
    },
    truncateText(text){
      return text.replace(/(.{18})..+/, "$1...");
    },
    getLabels(){
      console.log('getLabels fired')
      this.labels = []
      this.data = []
      this.bgdColor = []
      this.contestants.map(d=>{
        if(this.allVotes && this.contestants.length > 0){ // if there are votes

        // get votes for a particular contestant
        let foo = this.allVotes.filter(vote=> {
          return d.uid == vote.id
        })
        ////console.log(item)
        //console.log(d)
        this.labels.push(this.$helpers.truncateText(d.name))
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
    isAdmin(voterId){
      return voterId === this.currElection.admin
    },
    isFollowing(contestant){
      return contestant.followers.indexOf(this.getUser.uid) == -1 ? false : true
    },
    hasManifesto(contestant){
      if(contestant.manifestos){
        let index = contestant.manifestos.indexOf(
        this.getUser.uid + this.currElection.electionId)
        console.log(index)
        if(index != -1){
          return true;
        }
        else{return false}
      }else{return false}
      
    },
    follow(event,contestant){
      ////console.log(contestant)
      if(contestant.followers.indexOf(this.getUser.uid) == -1){
        this.disabled.push(contestant.uid)
        contestant.followers.push(this.getUser.uid)

        db.collection('moreUserInfo').doc(contestant.uid).update({
          followers:firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.uid).update({
            following:firebase.firestore.FieldValue.arrayUnion(contestant.uid)
          })
          if(res){
            //this.contestants = res.data,
            this.disabled.splice(this.disabled.indexOf(contestant.uid),1)
            this.$refs[contestant.uid][0].innerText = `you are following ${contestant.name}`
            ////console.log(res.data)
            this.disabled.splice(this.disabled.indexOf(contestant.uid),1)
          }
        })
      }
      else{
        this.disabled.push(contestant.uid)
        contestant.followers.splice(contestant.followers.indexOf(this.getUser.uid), 1)
        
        //event.target.innerText = `(${contestant.followers.length - 1})  follow`
        db.collection('moreUserInfo').doc(contestant.uid).update({
          followers:firebase.firestore.FieldValue.arrayRemove(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.uid).update({
            following:firebase.firestore.FieldValue.arrayRemove(contestant.uid)
          })
          if(res){
            this.$refs[contestant.uid][0].innerText = `Follow ${contestant.name}`
            ////console.log(res.data)
            this.disabled.splice(this.disabled.indexOf(contestant.uid),1)
          }
        }).catch(err=>{
          //console.log(err)
        })
      }
      
      
    },
    follow_election(){
      ////console.log(this.getUser)
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
      this.show_manifesto_dialog = true;
      this.manifesto_spotlight = contestant
    },
    isContestant(voterId){
      let found = this.currElection.contestants.find(contId =>
      contId == voterId)
      return !!found
    }
  },
  async created(){
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
      //console.log(error)
      
    }
  },
  destroyed(){
    this.elecRef()
    this.moreUserInfoRef();
    this.votesRef();
  },
  components:{
    ViewProfile,
    LoadingBar,
    Vote,
    Results,
    BarChart,
    carousel,
    Navigation,
    Manifesto,
  },
}
import api from '@/services/api'
  import {mapGetters} from 'vuex'
  import ViewProfile from '@/components/ViewProfile'
  import Results from '@/components/Results'
  import Vote from '@/components/Vote'
  import BarChart from '@/charts/barchart'
  import carousel from 'vue-owl-carousel'
  import Navigation from '@/components/Navigation'
  import LoadingBar from '@/spinners/LoadingBar'
  import Manifesto from '@/components/Manifesto'
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
  .linkify{
    cursor: pointer;
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
