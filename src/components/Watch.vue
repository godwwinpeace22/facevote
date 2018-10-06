<template>
  <div v-if="show">
    <v-container>
      <v-card>
      <v-layout>
        <v-flex xs4>
          <v-card-title>{{currElection.title}}</v-card-title>
          <v-card-text>
            <p>Election starts in</p>
            <h4 v-if="inprogress">Election in progress</h4>
            <h4 v-if="electionTime.days">
              <span>{{this.electionTime.days}}</span>
              <span>{{this.electionTime.hours}}</span>
              <span>{{this.electionTime.minutes}}</span>
              <span>{{this.electionTime.seconds}}</span>
            </h4>
            <h4 v-else>
              {{electionTime}}
            </h4>
            <v-btn :to="'/dashboard/elections/results/' + currElection.electionId" color="pink" dark v-if="electionTime == 'Election ended'">View results</v-btn>
            <v-btn  color="pink" dark @click="show_voting_dialog = true" v-if="electionTime == 'Election ended'">Vote</v-btn>
            
            <v-dialog v-model="show_voting_dialog" fullscreen hide-overlay>
              <v-toolbar card dark color="teal">
                <v-btn icon dark @click.native="isNotVoting; show_voting_dialog = false;">
                  <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Vote</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn dark flat @click.native="isNotVoting; show_voting_dialog = false;">Cancel</v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <vote></vote>
            </v-dialog>

            <v-btn fixed dark fab bottom right color="pink" ><v-icon>home</v-icon>
            </v-btn>
          </v-card-text>
        </v-flex>
        <v-flex xs8 >
          <v-container justify-center fill-height>
            <v-layout align-center justify-center>
              <v-flex xs8>
                <v-card-text>
                  <div id="time" class="display-1">
                    <h3 v-if="electionTime.days">
                      <span class="timer">{{electionTime.days}}</span>
                      <span class="timer">{{electionTime.hours}}</span>
                      <span class="timer">{{electionTime.minutes}}</span>
                      <span class="timer">{{electionTime.seconds}}</span>
                      
                    </h3>
                    <h3 v-else>{{electionTime}}</h3>
                  </div>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-container>
          
        </v-flex>
      </v-layout>
      </v-card>
    </v-container>
    

    <v-container>
      <v-layout>
        <v-flex xs3 >
          <v-card >
            <v-card-title class="py-2">Enrolled voters</v-card-title>
            <v-divider></v-divider>
            
            <v-toolbar flat dense color="white">
              <v-toolbar-title><h4>Total voters</h4></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items><h4 class="mt-3">{{currElection.regVoters.length}}</h4></v-toolbar-items>
              
            </v-toolbar>
            
            <v-container style="max-height:300px;overflow:auto;" class="scrollbar pl-0">
              <v-divider></v-divider>
              <v-list two-line dense>

                <div v-for="(voter, index) in currElection.regVoters" :key="index">
                  <v-list-tile  :key="voter.name" avatar @click="viewprofile = true; voterprofile = voter" :color="checkIfOnline(voter._id) ? 'default' : 'grey'">
                    <v-list-tile-avatar>
                      <img :src="'https://api.adorable.io/avatars/285/' + voter.username + '@adorable.png'">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title  class="text-capitalize">{{voter.name}}<span id="online_badge" v-if="checkIfOnline(voter._id)"></span></v-list-tile-title>
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
          </v-card>
        </v-flex>
        <v-flex xs9 pl-2 >
          <v-card style="height:385px;">
            <v-container>
              <v-toolbar flat dense color="white">
                <v-toolbar-title><h5>statistics</h5></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn small flat class="">more charts</v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <bar-chart :chart-data="chartData" :options="chartOptions" :width="550" :height="330"></bar-chart>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!--v-container v-bind="{ '[grid-list-sm]': true }">
      <v-card class="pb-3">
        <v-card-title class="body-2"><h3>Contestants</h3></v-card-title>
        <v-layout row wrap mt-3>
          <v-flex xs3 v-for="(contestant,index) in contestants" :key="contestant._id" style="min-height:150px;">
            <v-card  class=" mt-4 mx-4" hover>
              <v-img
                :src="'https://cdn.vuetifyjs.com/images/lists/' + (index*1 + 1) + '.jpg'"
                height="150px"
              ></v-img>

              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{contestant.userId.name}}</h3>
                  <div>{{contestant.userId.username}}<span id="online_badge" ></span></div>
                  <div>For {{contestant.role}}</div>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container-->
    <v-container>
      <v-card class="bstimeslider mb-4">
          <div id="rightArrow" @click="rightarrow">
            <v-btn icon dark><v-icon >arrow_forward</v-icon></v-btn>
          </div>
          <div id="viewContainer">
              <v-layout id="tslshow">
                <v-flex xs6 v-for="contestant in contestants" :key="contestant._id" style="width:300px;min-height:150px;">
                  <v-card  class=" mt-4 mx-4" hover>
                    <v-img
                      :src="'https://api.adorable.io/avatars/285/' + contestant.userId.username + '@adorable.png'"
                      height="150px"
                    ></v-img>

                    <v-card-title primary-title>
                      <div>
                        <h3 class="headline mb-0">{{contestant.userId.name}}</h3>
                        <div>{{contestant.userId.username}}<span id="online_badge" ></span></div>
                        <div>For {{contestant.role}}</div>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-flex>
                  
              </v-layout>
          </div>
          <div id="leftArrow" @click="leftarrow">
            <v-btn icon dark><v-icon >arrow_back</v-icon></v-btn>
          </div>
      </v-card>
    </v-container>
  </div>
  <v-layout v-else>
    <v-flex>
      <v-card>
        <v-card-title>Select an election below</v-card-title>
        <v-list>
          <v-list-tile v-for="election in myEnrolledElc" :key="election._id" :to="'watch/id/'  + election.electionId" @click="openWatchWindow(election)">
            <v-list-tile-title >{{election.title}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data:()=>({
    myEnrolledElc:[], 
    currElection:{}, // contains the current election
    show:false, // whether to show the 'select election' page or show the voting page
    electionTime:'',
    inprogress:false, // tells the timer whether the election is in progress or not
    voterprofile:{},
    contestants:[], // all the contestants for this election
    votes:[], // contains all the votes made for the current election
    votingList:[], // list of people currently voting for the current election
    show_voting_dialog:false, // whether to show the voting window/ dialog
    viewprofile:false,
    move:"600px", // how much to move the contestants slider on each click of next or prev
    sliderLimit:-2050, // the limit of the marginleft offset for the contestants slider
    chartData:null,
    chartOptions:{
      responsive: false, maintainAspectRatio: true
    }
  }),
  props:['electionId'], // this prop is from the vue-router params
  methods:{
    async openWatchWindow(election){
      this.currElection = election
      this.show = true
      this.$store.dispatch('setCurrElection', this.currElection)
      
      let contestants = await api().get(`dashboard/getContestants/${election._id}/${this.$store.getters.getToken}`, {token:this.$store.getters.getToken})
      this.contestants = contestants.data
      this.$store.dispatch('setCurrElectionContestants', contestants.data);
      //console.log(contestants)
      
      this.countDownTimer()
      this.getLabels()
    },
    countDownTimer(){
      //console.log(this.currElection.startDate)
      //let countDownDate = new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
      let countDownDate = new Date('2018, 29 September' + ' ' + '18:00').getTime();
      //console.log(countDownDate)
      countDownDate = countDownDate + this.currElection.duration * 1000 * 60 * 60
      //console.log(countDownDate)
			let interval = setInterval(()=>{
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance/(1000*60*60*24));
        var hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
        var minutes = Math.floor((distance % (1000*60*60))/(1000*60));
        var seconds = Math.floor((distance % (1000*60))/1000);
      
        this.electionTime = {days:days + "d ", hours:hours + "h ", minutes:minutes + "m ", seconds:seconds + "s "}
        
        if(distance <= this.currElection.duration * 1000 * 60 * 60 && distance > 0){
          this.inprogress = true
          this.electionTime = {days:days + "d ", hours:hours + "h ", minutes:minutes + "m ", seconds:seconds + "s "}
        }
        else if(distance <= 0 ){
          //console.log('now now ?')
          //countDownDate = countDownDate + this.currElection.duration * 1000000
          clearInterval(interval)
          this.electionTime = 'Election ended'
        }
      }, 1000);
    },
    voterdOrNot(id){
      let votes = this.votes;
      let thisUser = votes.filter( eachvote=> eachvote.voterId == id)
      return thisUser.length == 0 ? 'Not voted': 'voted'
    },
    isNotVoting(){
      console.log('closed voting dialog')
      this.votingList.splice(this.votingList.indexOf(this.$store.getters.getUser._id), 1)
    },
    getLabels(){
      let labels = []
      let data = []
      let bgdColor = []
      
      this.$store.state.allVotes.map(item=>{
        let foo = this.contestants.filter(d=> {
          return d._id == item.id
        })
        labels.push(foo[0].userId.name)
        data.push(item.score)
        let random1 = Math.floor(Math.random() * Math.floor(255))
        let random2 = Math.floor(Math.random() * Math.floor(255))
        let random3 = Math.floor(Math.random() * Math.floor(255))
        bgdColor.push(`rgba(${random1}, ${random2},  ${random3}, 0.5)`)
      })

      this.chartData = {
        labels:labels,
        datasets :[
          {
            label: '# of votes',
            backgroundColor: bgdColor,
            data: data,
          }
        ]
      }
    },
    isVoting(id){
      return this.votingList.indexOf(id) == -1 ? false : true
    },
    checkIfOnline(userId){
      let those_online = this.$store.state.those_online
      //console.log(this.those_online)
      let foo = []
      those_online.forEach(data=>{
        if(data.user == userId){
          foo.push(true)
          //console.log(data.user)
        }
      })
      // using foo[0] bcs we know that the user can only appear once 
      // in the 'those_online' list, the only one not eventually filtered out, and therefore found at the zero
      return foo[0] 
    },
    rightarrow(e){
      //console.log(e)
      let view = $('#tslshow');
      let sliderLimit = - $('#tslshow').width() + 950
      //console.log($('#tslshow').width())
      //console.log(sliderLimit)
      var currentPosition = parseInt(view.css("left"));
      if (currentPosition >= sliderLimit) view.stop(false,true).animate({left:"-="+this.move},{ duration: 400})
    },
    leftarrow(e){
      //console.log(e)
      let view = $('#tslshow');
      var currentPosition = parseInt(view.css("left"));
      if (currentPosition < 0) 
      view.stop(false,true).animate({left:"+="+this.move},{ duration: 400})
    }
  },
  async mounted(){
    // get the elections the user enrolled in
    try {
      let res = await api().get(`dashboard/getElections/${this.$store.getters.getUser._id}/${this.$store.getters.getToken}`)
     
      this.myEnrolledElc = res.data.enrolled
      // the election requested by the route param(if it exists)
      let filtrd = this.myEnrolledElc.filter(election => election.electionId == this.electionId)
      
      this.electionId ? this.openWatchWindow(filtrd[0]) : this.show = false // open the watch page if its accessed through the route param else open the election select page
      
      
      this.$eventBus.$emit('Update_Votes',{user:this.$store.state.user.username,room:this.$store.state.curRoom._id}) // after mounted, get the latest votes
      //console.log(this.$store.state.allVotes)

      this.$eventBus.$on('All_Votes', data=>{ // after component is mounted, receive all the votes casted
        this.votes = data
        // the line below is bad!! don't use!
        this.votingList = [] // clear the voting list, so that the 'voting...' will disappear from the users profile
      })
      this.$eventBus.$on('Update_Voting_Status', data=>{ // tell if a user is voting or not
        this.votingList.push(data.user._id) // put the id of the user voting into the voting list
      })
      
      
    } catch (error) {
      console.log(error.response)
      if(error.response.status == 401){
        this.$router.push('/login')
      }
    }
  },
  components:{
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu,
    ...VList,
    ...VBtn,
    ...VImg,
    ...VDialog,
    ...VToolbar,
    ViewProfile,
    Vote,
    BarChart
  },
}
import api from '@/services/api'
  import ViewProfile from '@/components/ViewProfile'
  import Vote from '@/components/Vote'
  import BarChart from '@/charts/barchart'
  import * as VCard from 'vuetify/es5/components/VCard'
  import * as VAvatar from 'vuetify/es5/components/VAvatar'
  import * as VSubheader from 'vuetify/es5/components/VSubheader'
  import * as VDivider from 'vuetify/es5/components/VDivider'
  import * as VTabs from 'vuetify/es5/components/VTabs'
  import * as VMenu from 'vuetify/es5/components/VMenu'
  import * as VTooltip from 'vuetify/es5/components/VTooltip'
  import * as VList from 'vuetify/es5/components/VList'
  import * as VBtn from 'vuetify/es5/components/VBtn'
  import * as VImg from 'vuetify/es5/components/VImg'
  import * as VDialog from 'vuetify/es5/components/VDialog'
  import * as VToolbar from 'vuetify/es5/components/VToolbar'
</script>
<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;

  #online_badge{
    display: inline-block;
    background: green;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 5px;
  }

  .timer{
    display:inline-block;
    padding:5px;
    color:#fff;
    background:teal;
    margin-right:2px;
  }
  .bstimeslider {
    width:100%;
    height:300px;
    //background:#ccc;
    position:relative;

    .v-btn{
      top:40%;
    }
  }

  .bktibx {   
    float:left;
    //margin:0 40px 0 0 ;
    //width:60px;
    display:block;
    background:#000;
    color:#fff;
      
  }

  #tslshow {
    position:absolute;
    left:0;
    //width:1200px;
      
  }

  #leftArrow {    
    width:40px;
    height:100%;
    background:#dcdde0; 
    position:absolute;
    cursor: pointer;
    left:0px;
    z-index: 3;
  }

  #rightArrow {
    width:40px;
    height:100%;
    background:#dcdde0; 
    position:absolute;
    cursor: pointer;
    right:0px;
    z-index: 3;
  }

#viewContainer {
  width:100%;
  max-width:950px;
  height:100%;
  //background:#193619;
  position:absolute;
  left:25px;
  overflow:hidden; 
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
