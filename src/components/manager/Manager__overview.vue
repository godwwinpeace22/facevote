<template>
  <div class="grey lighten-3">
    <!-- LOADING WIREFRAME -->
    <v-container grid-list-xl fluid v-if="!ready">
      <v-layout row wrap justify-space-between>
        <v-flex xs12 sm3 v-for="i in 4" :key="i">
          <v-card class="round" flat height="100">
            
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md4>
          <v-card flat class="elevation-0" elevation-0 d-flex height="380">
            <v-card-text>
              <v-avatar size="100" class="mb-5 mx-auto d-block"
                color="grey lighten-3">
              </v-avatar>

              <div class="grey lighten-3 wireframe mx-auto mb-2" style="width:70%;height:12px;"></div>
              <div class="grey lighten-3 wireframe mx-auto mb-2" style="width:90%;height:12px;"></div>
              <div class="grey lighten-3 wireframe mx-auto mb-2" style="width:90%;height:12px;"></div>
            </v-card-text>
            
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md8 d-flex>
          <v-card flat class="mb-3 pb-2">
            
            <v-list two-line dense>
              <v-list-tile avatar>
                <v-list-tile-content class="">
                  <div class="grey lighten-3 wireframe mb-2 ml-2" style="width:40%;height:12px;"></div>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>

            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs3 v-for="i in 6" :key="'a' + i">
                  <v-card flat class="grey lighten-3 wireframe" height="100">
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
           
          </v-card>
        </v-flex>
        
      </v-layout>
    </v-container>
    
    <!-- ==STATS CARDS== -->
    <v-container grid-list-xl fluid class="secondary pb-5 pt-4" v-if="ready">
      <v-layout row wrap justify-center align-center pb-5>
        <v-flex xs3 v-for="stat in stats" :key="stat.title">
          <v-card class="round elevation-1 text-xs-center" height="120">
            
            <v-list two-line>
              <v-list-tile avatar>
                
                <v-list-tile-content>
                  <v-list-tile-sub-title class="font-weight-bold">{{stat.title}}</v-list-tile-sub-title>
                  <v-list-tile-title class="font-weight-bold">{{stat.value}},000</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-avatar>
                  <v-icon large  :color="stat.iconColor">{{stat.icon}}</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>
              <v-subheader class="font-weight-light">{{stat.text}}</v-subheader>
            </v-list>
          </v-card>
          
        </v-flex>
      </v-layout>
    </v-container>

    <!-- ==DETAILS AND CHARTS== -->
    <v-container grid-list-xl fluid class="pb-0" v-if="ready">
      <v-layout row wrap>
        <v-flex xs12 sm8 d-flex>
          <v-card dark class="round v-card--offset" height="300" elevation="3">
            <v-card-text class="pt-0">
              <v-subheader class="title font-weight-light">
                {{currElection.title}}
              </v-subheader>
              <v-list dense v-for="item in overviewItems" :key="item[0]">
                <v-list-tile @click="''">
                  <v-flex xs4 class="font-weight-bold">
                   {{item[0]}}
                  </v-flex>
                  <v-flex xs8>
                    {{item[1]}}
                  </v-flex>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm4 d-flex>
          <v-card class="round v-card--offset">
            
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- VOTERS, FOLLOWERS, AND ADMINS -->
    <v-container grid-list-xl  fluid class="pt-0" v-if="ready">
      <v-layout row wrap>
        <!-- VOTERS -->
        <v-flex xs12 sm6 md4 d-flex>
          <v-card class="round">
            <v-list dense>
              <v-list-tile avatar>

                Registered voters
                <v-text-field hide-details v-model="search_voters"
                  append-icon="search" color="secondary" single-line
                  label="Search voters..."
                ></v-text-field>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <div style="max-height:350px;overflow-y:auto;" class="scrollbar my-3 mr-1">
              <v-expansion-panel>
                <v-expansion-panel-content v-for="(voter, index) in filteredList" :key="index">
                  <template slot="actions">
                    <v-icon :color="voterSuspended(voter) ? 'error' : 'secondary'">{{voterSuspended(voter) ? 'info' : $vuetify.icons.expand}}</v-icon>
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
                          <!-- <v-list-tile-sub-title>
                            <span class="error--text" v-if="voterSuspended(voter)">suspended</span> .
                            <span class="error--text" v-if="voter.flaggedBy && voter.flaggedBy.length > 0"> flagged</span>
                          </v-list-tile-sub-title> -->
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </template>
                  <v-card>
                    <v-card-text class="grey lighten-2">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium facilis neque reiciendis nostrum ex laboriosa
                    </v-card-text>
                    <v-card-actions class="grey lighten-2">
                      <v-btn color="success" depressed small v-if="!voterSuspended(voter)">Make admin</v-btn>
                      <v-btn color="orange" depressed small @click="suspendVoter(voter)" 
                        v-if="!voterSuspended(voter)" :loading="loading">Suspend voter</v-btn>
                      <v-btn color="orange" flat small depressed @click="restoreVoter(voter)" v-else :loading="loading">Restore voter</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- <v-list three-line dense>
                <v-subheader v-if="regVoters.length == 0">No registered voters yet</v-subheader>
                <v-subheader v-if="filteredList.length == 0  && regVoters.length != 0">No results found</v-subheader>
                <div v-for="(voter, index) in filteredList" :key="index">
                  
                  <v-list-tile  :key="voter.name" avatar color="'default'">
                    <v-list-tile-avatar>
                      <img :src="voter.photoURL" v-if="voter.photoURL">
                      <v-avatar size="38" class="white--text" :color="$helpers.colorMinder(voter.name.charAt(0))" v-else>
                        {{voter.name.charAt(0)}}
                      </v-avatar>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title  class="text-capitalize secondary--text" 
                        @click.stop="$eventBus.$emit('ViewProfile', voter)">{{voter.name}}</v-list-tile-title>
                      <v-list-tile-sub-title v-if="isContestant(voter.uid)" class="text--primary">Contestant</v-list-tile-sub-title>
                      <v-list-tile-sub-title>
                        <span class="error--text" v-if="voterSuspended(voter)">suspended</span> .
                        <span class="error--text" v-if="voter.flaggedBy && voter.flaggedBy.length > 0"> flagged</span>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-menu bottom offset-y>
                        <v-btn icon  dark slot="activator">
                          <v-icon color="secondary">more_vert</v-icon>
                        </v-btn>
                        <v-list dense>
                          <v-list-tile  @click.stop="''">
                            <v-list-tile-title>Make admin</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile  @click.stop="''" v-if="voterSuspended(voter)">
                            <v-list-tile-title>Restore</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>

                      <v-tooltip top>
                        <v-btn slot="activator" v-if="voter.flaggedBy && voter.flaggedBy.length > 0" 
                           icon small @click.stop="flagged_user_dialog = true; flagged_user = voter">
                          <v-icon color="error" small>flag</v-icon>
                        </v-btn>
                        <span>This user has been flagged as suspicious</span>
                      </v-tooltip>

                      
                      v-btn color="success" class="d-inline text-lowercase"  depressed small>contestant</v-btn
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider  :inset="true" :key="index"></v-divider>
                </div>
              </v-list> -->
            </div>
          </v-card>
        </v-flex>
        <!-- FOLLOWERS -->
        <v-flex xs12 sm6 md4 d-flex>
          <v-card class="round">
            <v-list dense>
              <v-list-tile avatar>
                Followers
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <div style="max-height:350px;overflow-y:auto;" class="scrollbar my-3 mr-1">
              <v-list two-line dense>
                <v-subheader v-if="followers.length == 0">No followers</v-subheader>
                <div v-for="(follower, index) in followers" :key="index">
                  <v-list-tile  :key="follower.name" avatar @click="$eventBus.$emit('ViewProfile', follower)" color="'default'">
                    <v-list-tile-avatar>
                      <img :src="follower.photoURL" v-if="follower.photoURL">
                      <v-avatar size="38" class="white--text" :color="$helpers.colorMinder(follower.name.charAt(0))" v-else>
                        {{follower.name.charAt(0)}}
                      </v-avatar>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title  class="text-capitalize secondary--text">{{follower.name}}</v-list-tile-title>
                      <v-list-tile-sub-title>
                        <v-icon small :color="follower.online ? 'success' : 'orange'">fiber_manual_record</v-icon>
                        {{follower.online ? 'online' : 'offline'}}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider  :inset="true" :key="index"></v-divider>
                </div>
              </v-list>
            </div>
          </v-card>
        </v-flex>
        <!-- ADMINS -->
        <v-flex xs12 sm6 md4 d-flex>
          <v-card class="round">
            <v-list dense>
              <v-list-tile avatar>
                <v-list-tile-title>Election Admins</v-list-tile-title>
                <v-list-tile-avatar>
                  <v-tooltip top>
                    <v-btn color="orange" small dark btn depressed icon slot="activator">
                      <v-icon>add</v-icon>
                    </v-btn>
                    <span>Add new admin</span>
                  </v-tooltip>
                </v-list-tile-avatar>
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
                        <v-icon small :color="admin.online ? 'success' : 'orange'">fiber_manual_record</v-icon>
                        {{admin.online ? 'online' : 'offline'}}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action v-if="admin.uid == currElection.admin">
                      <v-btn color="secondary" class="text-capitalize" small depressed>Creator</v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider  :inset="true" :key="index"></v-divider>
                </div>
              </v-list>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- ACTIVITY AND TOKENS -->
    <v-container grid-list-md fluid v-if="ready">
      <v-layout row wrap>
        <!-- ACTIVITY -->
        <v-flex xs12 sm5 d-flex>
          <v-card class="round">
            <v-list dense>
              <v-list-tile avatar>
                <span class="font-weight-bold">Activity</span>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <div class="scrollbar my-3 mr-1" style="max-height:230px;overflow-y:auto;overflow-x:hidden;">
              <v-timeline align-top dense class="scrollbar" >
                <v-timeline-item :color="getColor(activity)" small v-for="activity in activities" :key="activity._id">
                  <v-layout pt-3>
                    <v-flex xs3>
                      <strong>{{new Date(activity.dateCreated).toDateString('en-Us',{day:'numeric'})}}</strong>
                    </v-flex>
                    <v-flex>
                      <strong>{{activity.by == $store.getters.getUser.uid ? 'Admin' : extractVoter(activity.by).name}} 
                        {{activity.text}}</strong>
                      <div class="caption">Mobile App</div>
                    </v-flex>
                  </v-layout>
                </v-timeline-item>
              </v-timeline>
            </div>
          </v-card>
        </v-flex>
        <!-- TOKENS -->
        <v-flex xs12 sm7 d-flex>
          <v-card class="round">
            <v-list dense>
              <v-list-tile>
                <v-list-tile-title>Tokens</v-list-tile-title>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <v-expansion-panel inset>
              <v-expansion-panel-content
                v-for="(role,i) in currElection.roles"
                :key="i"
              >
                <div slot="header" class="secondary--text font-weight-bold text-uppercase" style="color:;">{{role.title}}</div>
                
                <v-card>
                  <v-card-text>{{text}}</v-card-text>
                </v-card>
                <v-card-actions>
                  <h4 class="pl-2">{{role.token}}</h4>
                </v-card-actions>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    
    <!-- CONTESTANTS -->
    <v-container grid-list-sm v-if="ready" fluid>
      <v-layout row wrap>
        <v-flex sm9 d-flex>
          <v-card class="round">
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
                <td class="justify-center layout">
                  <v-icon class="mt-3" color="secondary" small @click="culprit = props.item; suspend_dialog = true">
                    block
                  </v-icon>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
        <v-flex sm3 d-flex>
          <v-card class="round">
            
            <v-toolbar flat tile dense>
              <v-icon color="error" small class="d-inline">block</v-icon>
              <v-toolbar-title class="d-inline subtitle">Suspended</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-subheader v-if="tabledata.filter(item => item.suspended == true).length == 0">non suspended</v-subheader>
            <v-list dense>
              <template v-for="contestant in tabledata">
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

    <input id="logo_img" type="file" ref="logo_img" 
      style="visibility:hidden" @change="openFileModal($event)" />
    
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

    <!-- election settings dialog -->
    <!--v-dialog v-model="settings_modal" v-if="settings_modal" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
      <v-card>
        <v-toolbar color="success">
          <v-toolbar-title class="white--text">Edit Election</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="settings_modal = false" depressed>Close</v-btn>
        </v-toolbar>
        <v-card-text>
          <edit-election :e6='3'></edit-election>
        </v-card-text>
      </v-card>
    </v-dialog-->
  </div>
</template>
<script>
export default {
  data:()=>({
    ready:false,
    flagged_user_dialog:false,
    flagged_user:{},
    contestants:[],
    currElection:{},
    regVoters:[],
    activities:[],
    tabledata:[],
    date_options:{
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    },
    value: [
      423,
      446,
      675,
      510,
      590,
      610,
      760
    ],
    settings_modal:false,
    text:'Lorem, ipsum dolor sit amet sed earum esse, culpa, enim omnis fuga aperiam ad deserunt voluptates!',
    search:'', // search contestants
    search_voters:'', // search voters
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
    loading:false,
    suspend_dialog:false,
    culprit:{},
    cloudinary: {
      uploadPreset: 'r9tlxvid',
      cloudName: 'unplugged'
    },
  }),
  props:['electionid'],
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
  components:{
    //EditElection,
  },
  computed:{
    stats(){
      return [
        {title:'Followers', value: this.currElection.followers, text: '65 new this week', icon: 'lens',iconColor:'secondary'},
        {title:'Voters', value: this.regVoters.length, text: 'Since last month', icon:'group', iconColor:'purple'},
        {title:'Contestants', value: this.contestants.length, text: '5 roles/positions', icon: 'hdr_strong', iconColor:'success'},
        {title:'Total Trafic', value: '103,000', text: 'Since last month', icon: 'equalizer', iconColor: 'cyan'}
      ]
    },
    overviewItems(){
      return [
        ['Election title',this.currElection.title],
        ['Creation Date',new Date(this.currElection.dateCreated).toDateString('en-Us',{day:'numeric'})],
        ['Followers',this.currElection.followers],
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
    adminList(){
      if(this.regVoters){
        return this.regVoters.filter(voter => {
          return this.currElection.admins.includes(voter.uid)
        })
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
      voter.suspended.find(electionId => electionId == this.electionid) ?
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

        // Get current election
        db.collection('elections')
          .doc(this.electionid)
          .get().then(doc=>{
            
            if(doc.exists){
              console.log(this.$store.getters.getUser.uid)
              if(doc.data().admin != this.$store.getters.getUser.uid){
                this.$router.push('/notFound')
              }
              else{
                this.currElection = doc.data()
              }
            }
            else{
              this.$router.push('/notFound')
            }
            console.log('currElection: ', this.currElection)
          }).catch(err=>{
            console.log(err)
          })

        // Get regvoters
        db.collection('moreUserInfo')
          .where('enrolled','array-contains',this.electionid)
          .get().then(querySnapshot=>{
            let myArr = []
            querySnapshot.forEach(doc=>{
              myArr.push(doc.data())
            })
            this.regVoters = myArr
            console.log('regVoters: ', this.regVoters)
            return myArr
          }).then(result=>{
            // get contestants
            let contestants = []
            result.forEach(voter=>{
              if(voter.contests && voter.contests.find(id => id == this.electionid)){
                contestants.push(voter)
              }
            })
            console.log('contestants: ', contestants)
            this.contestants = contestants
            return contestants
          }).then(conts=>{
            this.setTableData(conts)
            this.ready = true
          }).catch(err=>{
            console.log(err)
          })
        
      } catch (error) {
        console.log(error)
        if(error){}
      }
    },
    setTableData(contestants){
      this.tabledata = [] // to prevent multiple pushings
      contestants.forEach(cont=>{
        console.log(this.getRole(cont))
        let myObj = {
          value:false,
          name:cont.name,
          email:cont.email,
          contId:cont.uid, // contestant id
          role:this.getRole(cont),
          department:cont.department,
          faculty:cont.faculty,
          suspended:cont.contestsRef.find(item=> item.electionRef == this.currElection.electionId).suspended
        }
        this.tabledata.push(myObj)
      })
      console.log('tabledata: ', this.tabledata)
    },
    getActivities(){
      // Get activities
      db.collection('activities')
      .where('electionRef','==',this.electionid)
      .get().then(querySnapshot=>{
        let acts = []
        querySnapshot.forEach(doc=>{
          acts.push(doc.data())
        })
        this.activities = acts
        console.log('activities: ', acts)
      })
    },
    async follow(){
      if(this.user.followers.indexOf(this.currUser._id) == -1){
        // not following user, follow this user
        this.disabled = true
        this.user.followers.push(this.currUser._id)
        await api().post(`dashboard/followContestant/${this.user._id}/${this.currUser._id}`, {
          token:this.$store.getters.getToken
        })
        this.disabled = false
      }
      else{
        // is following the user, unfollow
        this.disabled = true
        await api().post(`dashboard/unfollowContestant/${this.user._id}/${this.currUser._id}`, {
          token:this.$store.getters.getToken
        })
        this.user.followers.splice(this.user.followers.indexOf(this.currUser._id),1)
        this.disabled = false
      }
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
    async suspend(){
      this.loading = true
      let foo = this.tabledata.findIndex(item =>
        item.contId == this.culprit.contId
      )
      this.tabledata[foo].suspended = true

      let theOffender = this.contestants.find(item=> item.uid == this.culprit.contId)

      let filterdContests = []

      theOffender.contestsRef.forEach(contest=>{
        if(contest.electionRef != this.currElection.electionId){
          filterdContests.push(contest)
        }else{
          filterdContests.push({
            electionRef:contest.electionRef,
            role:contest.role,
            suspended:true
          })
        }
      })

      console.log(this.culprit)
      let userRef = db.collection('moreUserInfo').doc(this.culprit.contId)
      await userRef.update({
        contestsRef:filterdContests
      })
      this.loading = false
      this.suspend_dialog = false
      
      
    },
    async restore(contestant){
      try {
        let index = this.tabledata.findIndex(item =>
          item.contId == contestant.contId
        )
        setTimeout(() => {
          this.tabledata[index].suspended = false
        }, 2000);
        
        let theOffender = this.contestants.find(item=> item.uid == contestant.contId)

        let filterdContests = []

        theOffender.contestsRef.forEach(contest=>{
          if(contest.electionRef != this.currElection.electionId){
            filterdContests.push(contest)
          }else{
            filterdContests.push({
              electionRef:contest.electionRef,
              role:contest.role,
              suspended:false
            })
          }
        })

        let userRef = db.collection('moreUserInfo').doc(contestant.contId)
        await userRef.update({
          contestsRef:filterdContests
        })
        
      } catch (error) {
        alert(error)
        console.log(error)
      }
      
    },
    suspendVoter(voter){
      // Suspend a voter from voting
      this.loading = true
      db.collection('moreUserInfo').doc(voter.uid)
      .update({
        suspended:firebase.firestore.FieldValue.arrayUnion(this.electionid)
      }).then(()=>{
        this.loading = false
        this.suspend_dialog = false
      })
    },
    restoreVoter(voter){
      // Restore a voter to allow them vote
      this.loading = true
      db.collection('moreUserInfo').doc(voter.uid)
      .update({
        suspended:firebase.firestore.FieldValue.arrayRemove(this.electionid)
      }).then(()=>{
        this.loading = false
        this.suspend_dialog = false
      })
    },
    
  },
  async mounted(){
    try {
      await this.setUp()
      await this.getActivities()
      
    } catch (error) {
      console.log(error)
    }
    
  }
}
import api from '@/services/api'
  //import EditElection from '@/components/EditElection'
</script>
<style scopped>
  .v-card--offset {
    top: -70px;
    position: relative;
  }
</style>
