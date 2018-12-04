<template>
  <div>
    <vue-headful
      :title="title"
      :description="description"
    />
    <v-container v-if="show_when_ready">
      <v-card >
        <v-layout row wrap>
          <v-flex xs12 sm8 d-flex class="mb-0">
            <v-card dark flat tile class="ma-0">
              <v-card-title class="headline">{{currElection.title}}</v-card-title>
              <v-card-text>

                <v-card-actions class="mt-0 pt-0">
                  <span>{{currElection.followers? currElection.followers.length : ''}}</span>
                  <v-divider inset vertical class="mx-2"></v-divider>
                  <v-btn flat small class="white-text">Followers</v-btn>
                  <v-btn color="success" outline small class="white-text" @click="follow_election"
                    :disabled='!!disabled.find(id => id == $store.state.logged_in_user._id)'>
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
                          <!-- show this if there is a count-down-->
                          <!--h3 v-if="not_started || inprogress" class="display-1">
                            <span class="timer" id="first">{{electionTime.days}}</span>
                            <span class="timer">{{electionTime.hours}}</span>
                            <span class="timer">{{electionTime.minutes}}</span>
                            <span class="timer" id="last">{{electionTime.seconds}}</span>
                            
                          </h3-->
                          <div class="verticalChart" v-if="not_started || inprogress">

                            <div class="singleBar">
                              <div class="bar">
                                <div class="value" style="height: 38%;background:teal;">
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
                            <h3 class="display-1">Election Ended</h3>
                            <small v-if="election_ended">at 
                            {{new Date(countDownDate).toLocaleString('en-Us',date_options)}}</small>
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
                  v-show="show_btn" dark v-if="inprogress || election_ended">
                  View results
                </v-btn>
                <v-btn  color="pink" dark @click="show_voting_dialog = true" 
                  v-show="show_btn"  v-if="inprogress">
                  Vote
                </v-btn>
                <v-tooltip top v-if="not_started">
                  <v-btn  color="success" slot="activator" small dark :to="`/dashboard/enroll`" 
                    v-show="show_btn"  v-if="not_started">
                    Enroll
                  </v-btn>
                  <span>Enroll to vote</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4 d-flex class="mb-0">
            <v-card flat tile>
              <v-toolbar color="teal" class="white--text" flat>
                Election Details
              </v-toolbar>
              <v-list dense>
                <v-list-tile :to="`/users/${currElection.admin.username}`">
                  <v-flex xs4>
                    <v-icon color="teal">person</v-icon>
                    Admin </v-flex>
                  <v-flex xs8 class="text-capitalize"> {{currElection.admin.name}}</v-flex>
                </v-list-tile>
                <!--v-list-tile>
                  <v-flex xs4>
                    <v-icon color="teal">schedule</v-icon>
                        Created at</v-flex>
                  <v-flex xs8> {{currElection.dateCreated}}</v-flex>
                </v-list-tile-->
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
                <v-list-tile v-if="currElection.type == 'School'">
                  <v-flex xs4>
                    <v-icon color="teal">domain</v-icon>
                    Faculty</v-flex>
                  <v-flex xs8 class="text-capitalize">{{currElection.faculty}}</v-flex>
                </v-list-tile>
                <v-list-tile v-if="currElection.level == 'Department'">
                  <v-flex xs4>Department</v-flex>
                  <v-flex xs8 class="text-capitalize">{{currElection.department}}</v-flex>
                </v-list-tile>
                <v-list-tile>
                  <v-flex xs4>{{contestants.length}} contestants</v-flex>
                  <v-divider inset vertical class="mr-3"></v-divider>
                  <v-flex xs6>{{regVoters.length}} registered voters</v-flex>
                </v-list-tile>
              </v-list>
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
        <vote id="vote_target" :currElection='currElection' :contestants='contestants'></vote>
      </v-card>
    </v-dialog>


    <v-dialog v-model="show_results_dialog" v-if="show_results_dialog" fullscreen transition="dialog-bottom-transition" hide-overlay>
      <v-card>
        <v-toolbar clipped-left flat dark color="success">
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

        <results :id='currElection._id' :contestants='contestants' :roles='currElection.roles' v-if="show_results_dialog"></results>
      </v-card>
    </v-dialog>

    <v-container class='election_details' v-if="show_when_ready">
      <v-layout row wrap>
        <v-flex xs12 sm3 d-flex pl-1 pr-2>
          <v-card>
            <v-tabs left color="teal" dark show-arrows>
              <v-tabs-slider color="success"></v-tabs-slider>

              <v-tab href="#tab-1" class="text-capitalize"> Voters </v-tab>

              <v-tab href="#tab-2" class="text-capitalize"> Activity </v-tab>

              <v-tab href="#tab-3" class="text-capitalize"> Actions</v-tab>

              <v-tab-item value="tab-1">
                <v-card-title class="py-2">{{currElection.regVoters.length}} Enrolled Voters</v-card-title>
                <v-divider></v-divider>
                
                <!--v-toolbar flat dense color="white">
                  <v-toolbar-title><h4>Total voters</h4></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items><v-btn icon class="mt-3" >{{currElection.regVoters.length}}</v-btn></v-toolbar-items>
                  
                </v-toolbar-->
                
                <v-container style="max-height:320px;overflow:auto;" class="scrollbar pl-0">
                  
                  <v-list two-line dense>

                    <div v-for="(voter, index) in regVoters" :key="index">
                      <v-list-tile  :key="voter.name" avatar @click="viewprofile = true; voterprofile = voter" :color="checkIfOnline(voter._id) ? 'default' : 'grey'">
                        <v-list-tile-avatar>
                          <img :src="voter.imgSrc || `https://ui-avatars.com/api/?name=${voter.name}`">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title  class="text-capitalize">{{voter.name}}<span id="online_badge" v-if="checkIfOnline(voter)"></span></v-list-tile-title>
                          <!--v-list-tile-sub-title v-html="voter.username" ></v-list-tile-sub-title-->
                          <v-list-tile-sub-title v-if="!isVoting(voter._id)"><span style=''>{{voterdOrNot(voter._id)}}</span></v-list-tile-sub-title>
                          <v-list-tile-sub-title v-else color="green"><span style='color:green;'>voting...</span></v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider  :inset="true" :key="index"></v-divider>
                    </div>
                  </v-list>
                  <v-dialog v-model="viewprofile" width="300" hide-overlay>
                    <view-profile :user='voterprofile'></view-profile>
                  </v-dialog>
                </v-container>
              </v-tab-item>
              
              <v-tab-item value="tab-2">
                <v-subheader>Recent activities</v-subheader>
                <v-divider></v-divider>
                <div class="pt-2 scrollbar" style="max-height:350px;overflow:auto;">
                  <v-timeline
                    align-top
                    dense
                  >
                    <v-timeline-item
                      color="pink"
                      small
                    >
                      <v-layout pt-3>
                        <v-flex xs3>
                          <strong>5pm</strong>
                        </v-flex>
                        <v-flex>
                          <strong>New Icon</strong>
                          <div class="caption">Mobile App</div>
                        </v-flex>
                      </v-layout>
                    </v-timeline-item>

                    <v-timeline-item
                      color="teal lighten-3"
                      small
                    >
                      <!--v-layout wrap pt-3>
                        <v-flex xs3>
                          <strong>3-4pm</strong>
                        </v-flex>
                        <v-flex>
                          <strong>Design Stand Up</strong>
                          <div class="caption mb-2">Hangouts</div>
                          <v-avatar>
                            <v-img
                              src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"
                            ></v-img>
                          </v-avatar>
                          <v-avatar>

                            <v-img
                              src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Tanned"
                            ></v-img>
                          </v-avatar>
                          <v-avatar>
                            <v-img
                              src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale"
                            ></v-img>
                          </v-avatar>
                        </v-flex>
                      </v-layout-->
                    </v-timeline-item>

                    <v-timeline-item
                      color="pink"
                      small
                    >
                      <v-layout pt-3>
                        <v-flex xs3>
                          <strong>12pm</strong>
                        </v-flex>
                        <v-flex>
                          <strong>Lunch break</strong>
                        </v-flex>
                      </v-layout>
                    </v-timeline-item>

                    <v-timeline-item
                      color="teal lighten-3"
                      small
                    >
                      <v-layout pt-3>
                        <v-flex xs3>
                          <strong>9-11am</strong>
                        </v-flex>
                        <v-flex>
                          <strong>Finish Home Screen</strong>
                          <div class="caption">Web App</div>
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
                    <v-list-tile avatar to="/dashboard/contest">
                        <span>Contest</span>
                    </v-list-tile>
                    <v-list-tile avatar to="/dashboard/manifesto/create">
                        <span>Create manifesto</span>
                    </v-list-tile>
                    <v-list-tile avatar to="/dashboard/enroll">
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
                <v-toolbar-title><h5><v-icon>equalizer</v-icon> Stats</h5></v-toolbar-title>
                <v-spacer></v-spacer>
                <!--v-toolbar-items class="hidden-sm-and-down"-->
                <v-btn color="success" small outline flat @click="trythis">Add data</v-btn>
                  <v-btn small flat color="success" outline  @click="show_results_dialog = true" :disabled="electionTime != 'Election ended'"> more charts</v-btn>
                <!--/v-toolbar-items-->
                
              </v-toolbar>
              <bar-chart :chart-data="chartData" :options="chartOptions" ></bar-chart>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container grid-list-xs v-if="show_when_ready">
      <v-subheader class="font-weight-bold">Contestants</v-subheader>
      <carousel :nav='true' :responsive="{0:{items:1,nav:false},600:{items:3,nav:true}}" >
         <v-subheader v-if="contestants && contestants.length == 0">No contestants</v-subheader>
        <v-card  class="mr-2 mb-1" height="280" v-for="contestant in contestants" :key="contestant._id">
          <v-tooltip top>
            <v-img @click="viewManifesto(contestant)" class="hover" slot="activator"
              :src="contestant.userId.imgSrc || `https://ui-avatars.com/api/?name=${contestant.userId.name}`"
              height="150px"
            ></v-img>
            <span>View <span class="text-capitalize">{{contestant.userId.name}}'s</span> manifesto</span>
          </v-tooltip>

          <v-card-text primary-title style="cursor:-webkit-grab;cursor:grab;">
            <span class="subheading success--text font-weight-bold mb-0 text-capitalize .text-truncate hover" @click="viewprofile = true; voterprofile = contestant.userId">
              {{contestant.userId.name}}
              <span id="online_badge" v-if="checkIfOnline(contestant.userId)"></span>
            </span>
          </v-card-text>
          <v-card-actions class="pa-3" style="cursor:-webkit-grab;cursor:grab;">
            For {{contestant.role}}
            <v-spacer></v-spacer>
            <v-tooltip top>
              <v-btn color="success" slot="activator" class="text-capitalize follow" v-if="contestant.userId.username != $store.getters.getUser.username" 
                :disabled='!!disabled.find(id => id == contestant._id)'
                flat outline small @click="follow($event,contestant)" :id="contestant._id">
                {{contestant.userId.followers.length}}&nbsp;| {{isFollowing(contestant) ? 'Following' : 'Follow'}}
              </v-btn>
              
              <span :ref="contestant._id">
                {{isFollowing(contestant) ? 'you are following ' + contestant.userId.name : 'Follow ' + contestant.userId.name}}
              </span>
            </v-tooltip>
            <span v-if="contestant.userId.username == $store.getters.getUser.username" slot="activator">
              {{contestant.userId.followers.length}}&nbsp;| Followers
            </span>
          </v-card-actions>
        </v-card>
      </carousel>
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
    currElection:{}, // contains the current election
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
    contestants:[], // all the contestants for this election
    votes:[], // contains all the votes made for the current election
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
    follow_election_text(){
      return this.currElection.followers.find(id => id == this.$store.state.logged_in_user._id) ? 
      'Following' : 'Follow'
    }
  },
  methods:{
    trythis(){
      
      this.data.push(3)
      this.labels.push('Vwarhe')
      this.bgdColor.push('rgba(200,250,111,.5')
      this.renderChart()
    },
    async open(){
      try{
        let res = await api().post(
          `dashboard/getId/${this.$route.params.electionId}`,
          {token:this.$store.getters.getToken}
        )
        this.currElection = res.data
        this.regVoters = res.data.regVoters
        console.log(this.currElection)
        let contestants = await api().post(
          `dashboard/getContestants/${this.currElection._id}`,
          {token:this.$store.getters.getToken}
        )
        this.contestants = contestants.data

        //this.show_when_ready = true

        /*api().post(`dashboard/getUser/${this.$store.getters.getUser.username}`, {token:this.$store.getters.getToken}).then(user=>{
          if(user){
            this.user = user.data
            //console.log(user.data)
          }
        })*/

        let reslt = await api().post(`dashboard/getresult/${this.currElection._id}`, {token:this.$store.getters.getToken});
        this.allVotes = reslt.data.finalScores
        //console.log('yes, all votes: ', reslt.data.finalScores)
        /*api().post(`dashboard/latestActivities/${res.data._id}`, {
          token:this.$store.getters.getToken
        }).then(activities=>{
          console.log(activities)
        }).catch(err=>{console.log(err)}) */

        
      
        
        this.countDownTimer()
        this.getLabels()
        this.show_when_ready = true
        this.$eventBus.$emit('Update_Votes',{
          user:this.$store.state.user.username,
          room:this.currElection._id
        }) // after mounted, get the latest votes
      }catch(error){
        console.log(error)
      }

    },
    countDownTimer(){
      //console.log(this.currElection.startDate)
      this.startDate = new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
      //this.startDate = new Date('2018, 29 September' + ' ' + '18:00').getTime();
      //console.log(countDownDate)
      this.countDownDate = this.startDate + this.currElection.duration * 1000 * 60 * 60
      //console.log(countDownDate)
			this.interval = setInterval(()=>{
        var now = new Date().getTime();
        var distance = this.countDownDate - now;
        var days = Math.floor(distance/(1000*60*60*24));
        var hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
        var minutes = Math.floor((distance % (1000*60*60))/(1000*60));
        var seconds = Math.floor((distance % (1000*60))/1000);
      
        //this.electionTime = {days:days + "d ", hours:hours + "h ", minutes:secondsminutes + "m ", seconds:seconds + "s "}
        days = days < 10 ? days = `0${days}` : days
        hours = hours < 10 ? hours = `0${hours}` : hours
        minutes = minutes < 10 ? minutes = `0${minutes}` : minutes
        seconds = seconds < 10 ? seconds = `0${seconds}` : seconds

        this.electionTime = {days:days, hours:hours, minutes:minutes, seconds:seconds}
        
        if(this.currElection.regVoters){
          let lent = Object.keys(this.regVoters).length
          //console.log(this.votes)
          if(this.votes && lent == this.votes.length){
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
        }
        
      }, 1000);
    },
    voterdOrNot(id){
      if(this.votes){
        let thisUser = this.votes.filter( eachvote => eachvote.voterId == id)
        return thisUser.length == 0 ? 'Not voted': 'voted'
      }
      else{
        return 'Not voted'
      }
    },
    isNotVoting(){
      console.log('closed voting dialog')
      this.votingList.splice(this.votingList.indexOf(this.$store.state.logged_in_user._id), 1)
    },
    getLabels(){
      let labels = []
      let data = []
      let bgdColor = []
      
      this.contestants.map(d=>{
        if(this.allVotes){ // if there are votes

        
        let foo = this.allVotes.filter(item=> {
          return d._id == item.id
        })
        //console.log(item)
        //console.log(foo)
        this.labels.push(d.userId.name)
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
    isFollowing(contestant){
      return contestant.userId.followers.indexOf(this.$store.state.logged_in_user._id) == -1 ? false : true
    },
    follow(event,contestant){
      if(contestant.userId.followers.indexOf(this.$store.state.logged_in_user._id) == -1){
        this.disabled.push(contestant._id)
        contestant.userId.followers.push(this.$store.state.logged_in_user._id)
        //event.target.innerText = `(${contestant.followers.length + 1})  following`
        api().post(`dashboard/followContestant/${contestant.userId._id}/${this.$store.state.logged_in_user._id}`, {token:this.$store.getters.getToken}).then(res=>{
          if(res){
            //this.contestants = res.data,
            this.disabled.splice(this.disabled.indexOf(contestant._id),1)
            this.$refs[contestant._id][0].innerText = `you are following ${contestant.userId.name}`
            //console.log(res.data)
            this.disabled.splice(this.disabled.indexOf(contestant._id),1)
          }
        })
      }
      else{
        this.disabled.push(contestant._id)
        contestant.userId.followers.splice(contestant.userId.followers.indexOf(this.$store.state.logged_in_user._id), 1)
        
        //event.target.innerText = `(${contestant.followers.length - 1})  follow`
        api().post(`dashboard/unfollowContestant/${contestant.userId._id}/${this.$store.state.logged_in_user._id}`, {token:this.$store.getters.getToken}).then(res=>{
          if(res){
            //this.contestants = res.data,
            //this.disabled.splice(this.disabled.indexOf(contestant._id),1)
            this.$refs[contestant._id][0].innerText = `Follow ${contestant.userId.name}`
            //console.log(res.data)
            this.disabled.splice(this.disabled.indexOf(contestant._id),1)
          }
        })
      }
      
      
    },
    follow_election(){
      let this_user = this.$store.state.logged_in_user
      this.disabled.push(this_user._id)
      if(this.currElection.followers.find(data=> data == this_user._id)){
        // is following
        this.currElection.followers.splice(this.currElection.followers.indexOf(this_user),1)
        api().post(`dashboard/unfollowElection/${this.currElection.electionId}/${this_user._id}`, {
          token:this.$store.getters.getToken
        }).then(res=>{
          if(res){
            this.disabled.splice(this.disabled.indexOf(this_user._id),1)
          }
        })
      }
      else{
        // not following
        this.currElection.followers.push(this_user._id)
        api().post(`dashboard/followElection/${this.currElection.electionId}/${this_user._id}`, {
          token:this.$store.getters.getToken
        }).then(res=>{
          if(res){
            this.disabled.splice(this.disabled.indexOf(this_user._id),1)
          }
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
      this.$router.push(`/dashboard/manifesto/view?username=${contestant.userId.username}&manifesto=foo`)
    },
  },
  async mounted(){
    // get the elections the user enrolled in
    try {
      
      this.open()
      
      //console.log(this.$store.state.allVotes)

      this.$eventBus.$on('All_Votes', data=>{
        // after component is mounted, receive all the votes casted
        this.votes = data
        console.log('alvotes data: ', data)
        // the line below is bad!! don't use!
        // clear the voting list, so that the 'voting...' will disappear from the users profile
        this.votingList = []
      })
      this.$eventBus.$on('Update_Voting_Status', data=>{ // tell if a user is voting or not
        this.votingList.push(data.user._id) // put the id of the user voting into the voting list
      })
      
      this.$eventBus.$on('Hide_Profile', data=>{
        this.viewprofile = false
      })
      
     
    } catch (error) {
      console.log(error.response)
      if(error.response.status == 401){
        this.$router.push('/login')
      }
    }
  },
  components:{
    ViewProfile,
    Vote,
    Results,
    BarChart,
    carousel
  },
}
import api from '@/services/api'
  import ViewProfile from '@/components/ViewProfile'
  import Results from '@/components/Results'
  import Vote from '@/components/Vote'
  import BarChart from '@/charts/barchart'
  import carousel from 'v-owl-carousel'
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
