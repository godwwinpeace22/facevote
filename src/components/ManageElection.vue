<template>
  <div class="grey lighten-3">
    
		<transition name="fade" mode="out-in">
			
		<loading-bar v-if="!ready" height="80vh"></loading-bar>
			
		<div v-if="ready">

			<!-- ==STATS CARDS== -->
    <v-container grid-list-xl fluid class="secondary pb-5 pt-4" v-if="ready">
      <v-layout row wrap justify-center align-center pb-5>
        
      </v-layout>
    </v-container>

			<!-- ==DETAILS AND CHARTS== -->
			<v-container grid-list-xl fluid class="pb-0">
				<v-layout row wrap>
					<v-flex sm12 md8 d-flex>
						<v-card dark color="cyan" class="round_top v-card--offset" height="500" elevation="3">
							
							<v-card-title primary-title>
								<span class="title">{{currElection.title}}</span> <small class="ml-2">( {{currElection.electionId}} )</small>
								<v-spacer></v-spacer>
								<v-subheader>Voter Registrations</v-subheader>
							</v-card-title>
							<v-sheet
									height="400"
									class="mx-auto"
									style="" flat
									color="white"
									elevation=""
									max-width="calc(100% - 32px)"
								>

									<bar-chart v-if="currElection.type == 'School'" 
										:chart-data="chartData" :options="chartOptions">
									</bar-chart>
									
								</v-sheet>
						</v-card>
					</v-flex>
					<v-flex sm12 md4 d-flex>
						<v-card class="round v-card--offset">
							<v-card
								class="mt-3" flat
							>
								

								<v-card-text class="pt-0">
									<div class="title font-weight-light mb-2">{{$helpers.truncateText(currElection.title, 35)}} </div>
									<small>Created on {{currElection.dateCreated.toDate().toLocaleString()}}</small>
									<v-divider class="my-2"></v-divider>

									<v-list dense >
										<v-list-tile>
											<v-list-tile-action>
												<v-icon color="teal">access_time</v-icon>
											</v-list-tile-action>
											<v-list-tile-title class="ml-0">
												<span class="mr-3">Start Date</span>
												<span>{{electionStartDate}}</span>
											</v-list-tile-title>
										</v-list-tile>
										<v-list-tile>
											<v-list-tile-action>
												<v-icon color="teal">timer</v-icon>
											</v-list-tile-action>
											<v-list-tile-title class="ml-0">
												<span class="mr-3">Duration</span>
												<span>{{currElection.duration}} hrs</span>
											</v-list-tile-title>
										</v-list-tile>
										
										<v-list-tile>
											<v-list-tile-action>
												<v-icon color="teal">school</v-icon>
											</v-list-tile-action>
											<v-list-tile-title class="ml-0">
												<span class="mr-3">School</span>
												<span>{{currElection.sch}}</span>
											</v-list-tile-title>
											<v-list-tile-action>
											</v-list-tile-action>
										</v-list-tile>

										<v-list-tile v-if="currElection.level == 'Faculty'">
											<v-list-tile-action>
												<v-icon color="teal">business</v-icon>
											</v-list-tile-action>
											<v-list-tile-title class="ml-0">
												<span class="mr-3">Faculty</span>
												<span>{{currElection.fac}}</span>
											</v-list-tile-title>
										</v-list-tile>

										<v-list-tile v-if="currElection.level == 'Department'">
											<v-list-tile-action>
												<v-icon color="teal">people</v-icon>
											</v-list-tile-action>
											<v-list-tile-title class="ml-0">
												<span class="mr-3">Department</span>
												<span>{{currElection.dept}}</span>
											</v-list-tile-title>
										</v-list-tile>

										<v-list-tile>
											<v-list-tile-action>
												<v-icon color="teal">adjust</v-icon>
											</v-list-tile-action>
											<v-list-tile-title class="ml-0">
												<span class="mr-3">Status</span>
												<span :class="[electionStatus[1] + '--text']">
													{{electionStatus[0]}}
												</span>
											</v-list-tile-title>
										</v-list-tile>

									</v-list>

								</v-card-text>

								<v-card-actions>
									<v-layout row wrap justify-center>
										
										<v-flex shrink class="">
											<v-progress-circular
												:value="100"
												size="80"
												color="success"
											>
											{{no_of_voters}}
											</v-progress-circular>
											<span 
												:class="{'d-block': $vuetify.breakpoint.smAndDown, 'mt-2': $vuetify.breakpoint.smAndDown}" 
												class="text-xs-center"> Voters</span>
										</v-flex>

										<v-flex shrink class="mr-4">
											<v-progress-circular
												:value="80" size="80"
												color="purple lighten-2"
											>
											{{no_of_contestants}}
											</v-progress-circular>
											<span 
												:class="{'d-block': $vuetify.breakpoint.smAndDown, 'mt-2': $vuetify.breakpoint.smAndDown}" 
												class="text-xs-center"> Contestants</span>
										</v-flex>

									</v-layout>
								</v-card-actions>

							</v-card>
						</v-card>
					</v-flex>
				</v-layout>
			</v-container>

			<!-- VOTERS, ACTIVITIES, ADMINS, AND TOKENS -->
			<v-container grid-list-xl  fluid class="pt-0">
				<v-layout row wrap>
					<!-- VOTERS, ACTIVITIES -->
					<v-flex xs12 sm4 md4 d-flex>
						<v-card class="round_top" height="350" style="overflow: hidden;">

							<v-tabs left color="teal" dark show-arrows>
								<v-tabs-slider color="orange"></v-tabs-slider>

								<v-tab href="#tab-1" class="text-capitalize"> Voters </v-tab>

								<v-tab href="#tab-2" class="text-capitalize"> Activity </v-tab>

								<v-tab-item value="tab-1">
									<div style="max-height:250px;overflow-y:auto;" class="my-3 mr-1">
										<v-expansion-panel>
											<v-expansion-panel-content v-for="(voter, index) in filteredList" :key="index">
												<template slot="actions">
													<v-tooltip top v-if="voterSuspended(voter)">
														<v-icon color="error" slot="activator">
															info
														</v-icon>
														<span v-if="voterSuspended(voter)">Voter has been suspended</span>
													</v-tooltip>
													<v-icon>{{$vuetify.icons.expand}}</v-icon>
												</template>
												<template slot="header">
													<v-list dense>
														<v-list-tile avatar>
															<v-list-tile-avatar :color="$helpers.colorMinder(voter.name.charAt(0))">
																<img :src="voter.photoURL" v-if="voter.photoURL">
																<span class="white--text" v-else>
																	{{voter.name.charAt(0)}}
																</span>
															</v-list-tile-avatar>
															<v-list-tile-content>
																<v-list-tile-title  class="text-capitalize secondary--text" 
																	@click.stop="$eventBus.$emit('ViewProfile', voter)">{{voter.name}}</v-list-tile-title>
																<v-list-tile-sub-title v-if="isContestant(voter.uid)" class="text--primary">Contestant</v-list-tile-sub-title>
																
															</v-list-tile-content>
														</v-list-tile>
													</v-list>
												</template>
												<v-card>
													<v-card-text class="grey lighten-2">
													</v-card-text>
													<v-card-actions class="grey lighten-2 text-xs-center">
														<v-tooltip top class="mr-4">
															<v-btn color="success" depressed small 
																v-if="!voterSuspended(voter) && !currElection.admins.includes(voter.uid)" 
																slot="activator" @click="makeAdmin(voter)" :loading="making_admin">
																Make admin</v-btn>
															<span>Give this user admin privilages</span>
														</v-tooltip>

														<v-tooltip top class="mr-4">
															<v-btn color="success" depressed 
																small v-if="currElection.admins.includes(voter.uid) && voter.uid != currElection.admin" 
																slot="activator" @click="removeAdmin(voter)" :loading="making_admin">
																Remove admin</v-btn>
															<span>Remove admin privilages</span>
														</v-tooltip>
														

														<v-tooltip top v-if="!voterSuspended(voter) && !currElection.admins.includes(voter.uid)">
															<v-btn color="orange" dark depressed small @click="suspendVoter(voter)" 
																 :loading="loading" slot="activator">Suspend voter</v-btn>
															<span>This will deny this voter access to vote and the chat forum</span>
														</v-tooltip>

														<v-btn color="orange" dark 
															small depressed @click="restoreVoter(voter)"
															v-if="voterSuspended(voter)" 
															:loading="loading">Restore voter</v-btn>
													</v-card-actions>
												</v-card>
											</v-expansion-panel-content>
										</v-expansion-panel>
									</div>
								</v-tab-item>

								<v-tab-item value="tab-2">
									<div class="scrollbar my-3 mr-1" style="max-height:250px;overflow-y:auto;overflow-x:hidden;">
										<v-timeline align-top dense class="" >
											<v-timeline-item :color="getColor(activity)" small v-for="(activity, i) in activities" :key="i + 'activity'">
												<v-layout pt-3>
													<v-flex xs3>
														<strong>{{$helpers.parseDate(activity.tstamp)}}</strong>
													</v-flex>
													<v-flex>
														<strong>
															<span class="secondary--text linkify" @click="$eventBus.$emit('ViewProfile', activity.onr)">
																{{activity.onr.uid == getUser.uid ? 'Admin' : activity.onr.name}}
															</span> 
															{{activity.body}}</strong>
														<div class="caption">Mobile App</div>
													</v-flex>
												</v-layout>
											</v-timeline-item>
										</v-timeline>
									</div>
								</v-tab-item>
							</v-tabs>
							<v-divider></v-divider>
						</v-card>
					</v-flex>
					
					<!-- ADMINS -->
					<v-flex xs12 sm4 md4 d-flex>
						<v-card class="round">
							<v-list dense class="grey lighten-4">
								<v-list-tile>
									<v-list-tile-title class="font-weight-bold">Election Admins</v-list-tile-title>
								</v-list-tile>
							</v-list>
							<v-divider></v-divider>
							<div style="max-height:350px;overflow-y:auto;" class="scrollbar my-3 mr-1">
								<v-list two-line dense>
									<v-subheader v-if="adminList.length == 0">No admins</v-subheader>
									<div v-for="(admin, index) in adminList" :key="index">
										<v-list-tile  :key="admin.name" avatar @click="$eventBus.$emit('ViewProfile', admin)" color="'default'">
											<v-list-tile-avatar>
												<img :src="admin.photoURL" v-if="admin.photoURL">
												<v-avatar size="38" class="white--text" :color="$helpers.colorMinder(admin.name.charAt(0))" v-else>
													{{admin.name.charAt(0)}}
												</v-avatar>
											</v-list-tile-avatar>

											<v-list-tile-content>
												<v-list-tile-title  class="text-capitalize secondary--text">{{admin.name}}</v-list-tile-title>
												<v-list-tile-sub-title>
													<span class="online_badge" :class="[admin.online ? 'success' : 'orange']"></span>
													{{admin.online ? 'online' : 'offline'}}
												</v-list-tile-sub-title>
											</v-list-tile-content>
											<v-list-tile-action v-if="admin.uid == currElection.admin">
												<v-list-tile-action-text class="secondary--text">Creator</v-list-tile-action-text>
											</v-list-tile-action>
										</v-list-tile>
										<v-divider  :inset="true" :key="index"></v-divider>
									</div>
								</v-list>
							</div>
						</v-card>
					</v-flex>

					<!-- TOKENS -->
					<v-flex xs12 sm4 d-flex>
						<v-card class="round">
							<v-list dense class="grey lighten-4">
								<v-list-tile >
									<span class="font-weight-bold">Tokens</span>
								</v-list-tile>
							</v-list>
							<v-divider></v-divider>
							<div style="max-height:250px;overflow-y:auto;">
								<v-expansion-panel inset>
									<v-expansion-panel-content
										v-for="(role,i) in currElection.roles"
										:key="i"
									>
										<div slot="header" class="secondary--text font-weight-bold text-uppercase" style="color:;">{{role.title}}</div>
										
										<v-card>
											<v-card-text>This token should be issued to contestants who wants to contest for the role of 
												<strong>{{role.title}}</strong> and has met your requirements
											</v-card-text>
										</v-card>
										<v-card-actions>
											<h4 class="pl-2">{{role.token}}</h4>
										</v-card-actions>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</div>
						</v-card>
					</v-flex>

				</v-layout>
			</v-container>
			
			<!-- CONTESTANTS -->
			<v-container grid-list-lg fluid>
				<v-layout row wrap>
					<v-flex xs12 sm9>
						<v-card class="round_top">
							<v-card-title primary-title>
								Contestants
								<v-spacer></v-spacer>
								<v-text-field
									v-model="search"
									append-icon="search"
									label="Search"
									single-line
									color="secondary"
									hide-details
								></v-text-field>
							</v-card-title>
							
							<v-data-table
								:headers="headers"
								:items="tabledata"
								:search="search"
								:loading='false'
								class="elevation-1"
							>
							<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
								<template slot="items" slot-scope="props" v-if="!props.item.suspended">
									<td>{{ props.item.name | capitalize}}</td>
									<td class="text-xs-left">{{ props.item.role }}</td>
									<td class="text-xs-left">{{ props.item.department }}</td>
									<td class="text-xs-left">{{ props.item.faculty }}</td>
									<td class="justify-center">
										<v-tooltip top>
											<v-icon slot="activator" class="mt-3" color="error" small @click="culprit = props.item; suspend_dialog = true">
												block
											</v-icon>
											<span>Suspend contestant</span>
										</v-tooltip>
									</td>
								</template>
							</v-data-table>
						</v-card>
					</v-flex>
					<v-flex xs12 sm3 d-flex>
						<v-card class="round_top">
							<v-list class="grey lighten-4" dense>
								<v-list-tile>
									<v-list-tile-title class="font-weight-bold">Suspended</v-list-tile-title>
								</v-list-tile>
							</v-list>
							<v-divider></v-divider>
							<v-subheader v-if="tabledata.filter(item => item.suspended == true).length == 0">0 suspended contestants</v-subheader>
							<v-list dense>
								<template v-for="contestant in tabledata.filter(cont => cont.suspended == true)">
									<v-list-tile :key="contestant.contId">
										<v-list-tile-title>{{contestant.name | capitalize}}</v-list-tile-title>
										<v-list-tile-action>
											<v-tooltip top>
												<v-icon slot="activator" color="secondary" 
													@click="restore(contestant)">
													cached
												</v-icon>
												<span>Restore {{contestant.name | capitalize}}</span>
											</v-tooltip>
										</v-list-tile-action>
									</v-list-tile>
									<v-divider :key="contestant.name"></v-divider>
								</template>
							</v-list>
						</v-card>
					</v-flex>
				</v-layout>
			</v-container>

		</div>
		</transition>
    
    <!-- suspend contestant dialog -->
    <v-dialog v-model="suspend_dialog" max-width="500px" persistent hide-overlay>
      <v-card min-height='200' flat>
        <v-card-title>
          <span class='headline text-capitalize'>Suspend {{culprit.name | capitalize}}</span>
        </v-card-title>
        <v-card-text>
         Suspend this contestant to prevent him/her from contesting in this election. Suspended contestants
         won't appear on the election page and cannot be voted for during elections.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="suspend_dialog = false; loading = false">Cancel</v-btn>
          <v-btn color="orange" outline @click="suspend" :loading="loading">Suspend</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- FLAGGED USER DIALOG -->
    <v-dialog hide-overlay v-model="flagged_user_dialog" 
      v-if="flagged_user.name"
      max-width="500px" transition="dialog-transition" lazy>
      
      <v-card>
        <v-toolbar card color="grey lighten-3" dense>
          <v-avatar size="38" class="white--text" :color="$helpers.colorMinder(flagged_user.name.charAt(0))">
            <img :src="flagged_user.photoURL" v-if="flagged_user.photoURL" alt="alt">
            <span v-else>{{flagged_user.name.charAt(0)}}</span>
          </v-avatar>
          <v-toolbar-title>{{flagged_user.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="flagged_user_dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <p>This user has been flagged as suspicious. This usually happens when a voter is not 
          recognized by other voters</p>
          <p>You can suspend this user to prevent them from voting or ignore the flags. Do this with caution</p>
          <p>Note that the user will be notified once they are suspended</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="orange" small @click="suspendVoter(flagged_user)" 
            v-if="!voterSuspended(flagged_user)" :loading="loading">Suspend voter</v-btn>
          <v-btn color="orange" small @click="restoreVoter(flagged_user)" v-else :loading="loading">Restore voter</v-btn>
          <v-btn color="secondary" small @click="flagged_user_dialog = false" :disabled="loading">Ignore</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>
<script>
export default {
  data:()=>({
    ready: false,
    flagged_user_dialog: false,
    flagged_user: {},
    contestants: [],
    currElection: {},
    regVoters: [],
		activities: [],
		regActivities: [],
		chartData: {
			 
		},
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
		tabledata: [],
		adminList: [],
    date_options: {
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    },
    search: '', // search contestants
    search_voters: '', // search voters
    headers: [
      {
      text: 'Name',
      align: 'left',
      sortable: false,
      value: 'name'
      },
      {text:'Role', value:'role'},
      {text:'Department', value:'department'},
      {text:'Faculty', value:'faculty'},
      {text:'Actions', value:'actions'},
    ],
		loading: false,
		making_admin: false,
    suspend_dialog: false,
    culprit: {},
    cloudinary: {
      uploadPreset: 'r9tlxvid',
      cloudName: 'unplugged'
    },
  }),
  props:['election', 'acts', 'voters', 'conts'],
	watch: {
		'curRoom': function(){
			this.setUp()
		}
	},
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
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom'
    ]),
    stats(){
      return [
        // {title:'Followers', value: this.currElection.followers, text: '65 new this week', icon: 'lens',iconColor:'secondary'},
        {title:'Voters', value: this.regVoters.length, text: 'Since last month', icon:'group', iconColor:'purple'},
        {title:'Contestants', value: this.contestants.length, text: '5 roles/positions', icon: 'hdr_strong', iconColor:'success'},
        {title:'Total Votes', value: '103,000', text: 'Since last month', icon: 'how_to_vote', iconColor: 'cyan'}
      ]
		},
		no_of_voters(){
      let len = this.currElection.voters
        
			switch (true){
				case len >= 1000000:
					return len / 1000000 + 'M +'
				case len >= 1000:
					return len / 1000 + 'K + '
				default:
					return len
			}
    },
    // purposely duplicated this instead of merging
    // it with above as a method bcs it should be reactive
    no_of_contestants(){
			let len = this.currElection.contestants
			
			switch (true){
				case len >= 1000000:
					return len / 1000000 + 'M +'
				case len >= 1000:
					return len / 1000 + 'K + '
				default:
					return len
			}
    },
    overviewItems(){
      return [
        ['Election title',this.currElection.title],
        ['Creation Date', this.currElection.dateCreated.toDate().toDateString('en-Us',{day:'numeric'})],
        ['School',this.currElection.sch],
        ['Faculty',this.currElection.fac],
        ['Department',this.currElection.dept],
        ['Start Time',new Date(this.getStartDate).toDateString('en-Us',this.date_options)],
      ]
    },
    filteredList() {
      if(this.regVoters){
        return this.regVoters.filter(voter => {
          return voter.name.toLowerCase().includes(this.search_voters.toLowerCase())
        })
      }
    },
    electionStartDate(){
      let d = new Date(this.currElection.startDate + ' ' + this.currElection.startTime);
      return d.toLocaleString('en-US',{
        month: 'short',
        day: 'numeric',
        'year': 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    electionStatus(){
      // BEWARE THIS FUNCTION USES LOCAL TIME, WHICH MIGHT BE INACCURATE
      // Get the status of the current election
    
      let start = new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
      let one_hour = 1000 * 60 * 60
      if(start > Date.now()){
        return ['Not Started', 'secondary'] // not started
      }
      else if(start + this.currElection.duration * one_hour > Date.now()){
        return ['In Progress', 'success'] // in progress
      }
      else{
        return ['Ended','error'] // ended
      }
      
    },
    followers(){
      if(this.regVoters){
        // return this.regVoters.filter(voter => {
        //   return this.currElection.followers.includes(voter.uid)
        // })
        return []
      }
    },
    getStartDate(){
      return new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
    }
   
  },
  methods:{
    voterSuspended(voter){
      let finding = voter.suspended &&
      voter.suspended.find(electionId => electionId == this.currElection.electionId) ?
      true : false
      //console.log(finding)
      return finding
    },
    extractVoter(uid){
      return this.regVoters.find(voter=> voter.uid == uid)
    },
    getRole(contestant){
      let ref = contestant.contestsRef
      .find(item=>item.electionRef == this.currElection.electionId)
      let role = this.currElection.roles.find(role=>role.value == ref.role).title
      return role
    },
    async setUp(){
      try {

        // Set current election
				this.currElection = this.election ? this.election : this.curRoom
				// console.log(this.currElection, this.election, this.curRoom)
				if(this.voters){
					this.regVoters = this.voters
					this.contestants = this.conts
					this.setTableData(this.conts)
					this.setChart()
					this.ready = true
				}
				else{

					db.collection('moreUserInfo')
					.where('enrolled','array-contains',this.currElection.electionId)
					.limit(25).get()
					.then(querySnapshot=>{
						let myArr = []
						querySnapshot.forEach(doc=>{
							myArr.push(doc.data())
						})
						this.regVoters = myArr
						
						return myArr
					}).then(result=>{
						// get contestants
						let contestants = []
						result.forEach(voter=>{
							if(voter.contests && voter.contests.find(id => id == this.currElection.electionId)){
								contestants.push(voter)
							}
						})
						
						this.contestants = contestants
						return contestants
					}).then(conts=>{
						this.setTableData(conts)
						this.setChart()
						this.ready = true
					}).catch(err=>{
						// console.log(err)
					})
				}

      } catch (error) {
        // console.log(error)
      }
    },
    setTableData(contestants){
      this.tabledata = [] // to prevent multiple pushings
      contestants.forEach(cont=>{
        // console.log(this.getRole(cont))
        let myObj = {
          value: false,
          name: cont.name,
          email: cont.email,
          contId: cont.uid, // contestant id
          role: this.getRole(cont),
          department: cont.dept,
          faculty: cont.fac,
					suspended: this.currElection.suspended ? 
						this.currElection.suspended.includes(cont.uid) : 
						false
        }
        this.tabledata.push(myObj)
      })
      // console.log('tabledata: ', this.tabledata)
		},
		setChart(){
			let votersObj = this.currElection.votersByDept
			if(votersObj){

				// console.log(votersObj)
				this.chartData = {
					labels: Object.keys(votersObj),
					datasets: [{
						label: 'Voter Registrations',
						backgroundColor: 'orange',
						data: Object.values(votersObj)
					}]
				}
			}
		},
    getActivities(){
      // Get activities
      if(this.acts){
        this.activities = this.acts
      }
      else {

        db.collection('activities')
        .where('elecRef','==',this.currElection.electionId)
        .orderBy('tstamp', 'desc').limit(25)
        .get().then(querySnapshot=>{
          let acts = []
          querySnapshot.forEach(doc=>{
            acts.push(doc.data())
          })
          this.activities = acts
          // console.log('activities: ', acts)
        })
      }
		},
		recentRegActivities(){
			// get registrations within a week ago
			let one_week_ago = 7 * 24 * 60 * 60 * 1000
			db.collection('activities')
			// .where('tstamp', '<', one_week_ago)
			.where('type', '==', 'voter_registered')
			.orderBy('tstamp','desc').limit(100)
			.get().then(querySnapshot =>{
				
				let acts = []
				querySnapshot.forEach(doc =>{
					acts.push(doc.data())
				})

				// console.log(acts)
				this.regActivities = acts
			})
		},
		getAdmins(){
			// retrieve the election admins
			let adminList = []
			this.currElection.admins.forEach(uid => {

				db.collection('moreUserInfo').doc(uid)
				.get().then(doc => {
					adminList.push(doc.data())
				})
			})

			this.adminList = adminList
		},
    isContestant(id){
      //console.log(id)
      return this.contestants.find(item => item.uid == id)
    },
    getColor(activity){
      switch (activity.type) {
        case 'voter_registered':
          return 'purple'
          break;
        case 'election_created':
          return 'primary'
          break
        case 'election_edited':
          return 'success'
          break
        case 'logo_updated':
          return 'secondary'
          break
        case 'new_contestant':
          return 'teal'
          break
        case 'voter_registered':
          return 'orange'
          break
        case 'vote_casted':
          return 'success'
          break
        case 'contestant_suspended':
          return 'black'
          break
        case 'contestant_restored':
          return 'success'
          break
        default:
          return 'white'
          break;
      }
		},
		get_random_color() {
      var letters = 'A98DE'.split('');
      var color = '#';
      for (var i=0; i<3; i++ ) {
          color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    },
		async votersByDepartment(){
			// voter regisration by department
			
      this.chartData = {
        labels: Object.keys(this.currElection.votersByDept).map(key =>{
          return this.$helpers.truncateText(key)
        }),
        datasets: [{
          label:'Turnout by department',
          backgroundColor: Object.keys(this.currElection.votersByDept).map(item =>{
            return this.get_random_color()
          }),
          data: Object.values(this.currElection.votersByDept),
        }]
        
      }
    
    },
    async suspend(){
      this.loading = true
      let index = this.tabledata.findIndex(item =>
        item.contId == this.culprit.contId
      )

      // console.log(this.culprit)
      let elecRef = db.collection('elections').doc(this.currElection.electionId)
      elecRef.update({
        suspended: firebase.firestore.FieldValue.arrayUnion(this.culprit.contId)
			}).then(() => {

				this.tabledata[index].suspended = true
				this.$eventBus.$emit('Suspend_Contestant', this.culprit.contId)

				this.loading = false
				this.suspend_dialog = false
			})
			
      
      
    },
    async restore(contestant){
      try {
        let index = this.tabledata.findIndex(item =>
          item.contId == contestant.contId
        )
        setTimeout(() => {
          this.tabledata[index].suspended = false
        }, 1000);
        
				this.$eventBus.$emit('Restore_Contestant', contestant.contId)
				
        let elecRef = db.collection('elections').doc(this.currElection.electionId)
				elecRef.update({
					suspended: firebase.firestore.FieldValue.arrayRemove(contestant.contId)
				})
        
      } catch (error) {
        alert(error)
        // console.log(error)
      }
      
    },
    suspendVoter(voter){
      // Suspend a voter from voting
			this.loading = true
			
      db.collection('moreUserInfo').doc(voter.uid)
      .update({
        suspended:firebase.firestore.FieldValue.arrayUnion(this.currElection.electionId)
      }).then(()=>{
				this.loading = false
				voter.suspended ? 
					voter.suspended.push(this.currElection.electionId) :
					voter['suspended'] = [this.currElection.electionId]

        this.suspend_dialog = false
      })
    },
    restoreVoter(voter){
      // Restore a voter to allow them vote
      this.loading = true
      db.collection('moreUserInfo').doc(voter.uid)
      .update({
        suspended: firebase.firestore.FieldValue.arrayRemove(this.currElection.electionId)
      }).then(()=>{
				this.loading = false
				voter.suspended.splice(voter.suspended.indexOf(this.currElection.electionId), 1)
        this.suspend_dialog = false
      })
		},
		makeAdmin(voter){
			// give a voter admin privilages
			this.making_admin = true
			db.collection('elections').doc(this.currElection.electionId)
			.update({
				admins: firebase.firestore.FieldValue.arrayUnion(voter.uid)
			}).then(() => {
				this.adminList.push(voter)
				this.currElection.admins.push(voter.uid)
				this.making_admin = false
			})
		},
		removeAdmin(voter){
			// remove admin privilages
			this.making_admin = true
			db.collection('elections').doc(this.currElection.electionId)
			.update({
				admins: firebase.firestore.FieldValue.arrayRemove(voter.uid)
			}).then(() => {
				this.adminList = this.adminList.filter(v => v.uid != voter.uid)
				this.currElection.admins.splice(this.currElection.admins.indexOf(voter.uid),1)
				this.making_admin = false
			})
		}
    
	},
	components:{
		LoadingBar,
		BarChart
	},
  async mounted(){
    try {
      await this.setUp()
			await this.getActivities()
			await this.recentRegActivities()
			this.getAdmins()
      
    } catch (error) {
      // console.log(error)
    }
    
  }
}
// import api from '@/services/api'
import {mapGetters, mapState} from 'vuex'
import LoadingBar from '@/spinners/LoadingBar'
import BarChart from '@/charts/barchart'
</script>
<style scopped>
  .linkify{
    cursor: pointer;
  }
  .v-card--offset {
    top: -70px;
    position: relative;
  }
</style>
