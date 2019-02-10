<template>
  <div>

    <v-container grid-list-sm v-if="ready">
      <v-card class="pt-2 pb-5">
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <v-card class="" flat>
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
            </v-card>
          </v-flex>
          <v-flex xs12 sm6>
            <v-card
              class="mx-auto text-xs-center"
              color="green"
              dark max-width="600">
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)">
                  <v-sparkline
                    :value="value"
                    color="rgba(255, 255, 255, .7)"
                    height="100"
                    padding="24"
                    stroke-linecap="round"
                    smooth
                  >
                    <template
                      slot="label"
                      slot-scope="item"
                    >
                      ${{ item.value }}
                    </template>
                  </v-sparkline>
                </v-sheet>
              </v-card-text>

              <v-card-text>
                <div class="display-1 font-weight-thin">Sales Last 24h</div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="justify-center">
                <v-btn block flat>Go to Report</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>


    <v-container grid-list-sm v-if="ready">
      <v-layout row wrap>
        <v-flex sm9 d-flex>
          <v-card >
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
          <v-card>
            
            <v-toolbar flat tile dense>
              <v-icon color="error" small class="d-inline">block</v-icon>
              <v-toolbar-title class="d-inline subtitle">Suspended</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list dense>
              <v-subheader v-if="tabledata.filter(item => item.suspended == true).length == 0">non suspended</v-subheader>
              <template v-for="contestant in tabledata" v-if="contestant.suspended">
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

    <v-container grid-list-md class="scrollbar" v-if="ready">
      
      <v-layout row wrap mb-5>
        
        <v-flex xs12 sm6 d-flex>
          <v-card >
            <v-list dense>
              <v-list-tile avatar>
                Activity
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
        <v-flex xs12 sm6 d-flex>
          <v-card >
            <v-list dense>
              <v-list-tile avatar>

                Registered voters
                <v-spacer></v-spacer>
                <v-text-field hide-details v-model="search_voters"
                  append-icon="search" color="secondary" single-line
                  label="Search voters..."
                ></v-text-field>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <div style="max-height:230px;overflow-y:auto;" class="scrollbar my-3 mr-1">
              <v-list three-line dense>
                <v-subheader v-if="regVoters.length == 0">No registered voters yet</v-subheader>
                <v-subheader v-if="filteredList.length == 0  && regVoters.length != 0">No results found</v-subheader>
                <div v-for="(voter, index) in filteredList" :key="index">
                  <v-list-tile  :key="voter.name" avatar @click="viewprofile = true; voterprofile = voter" color="'default'">
                    <v-list-tile-avatar>
                      <img :src="voter.photoURL" v-if="voter.photoURL">
                      <v-avatar size="38" class="white--text" :color="$helpers.colorMinder(voter.name.charAt(0))" v-else>
                        {{voter.name.charAt(0)}}
                      </v-avatar>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title  class="text-capitalize secondary--text">{{voter.name}}</v-list-tile-title>
                      <v-list-tile-sub-title v-if="isContestant(voter.uid)" class="text--primary">Contestant</v-list-tile-sub-title>
                      <v-list-tile-sub-title v-if="voterSuspended(voter)" class="error--text">suspended</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-tooltip top>
                        <v-btn slot="activator" v-if="voter.flaggedBy && voter.flaggedBy.length > 0" 
                          color="error" icon small @click="flagged_user_dialog = true; flagged_user = voter">
                          <v-icon>flag</v-icon>
                        </v-btn>
                        <span>This user has been flagged as suspicious</span>
                      </v-tooltip>

                      
                      <!--v-btn color="success" class="d-inline text-lowercase"  depressed small>contestant</v-btn-->
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider  :inset="true" :key="index"></v-divider>
                </div>
              </v-list>
            </div>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6  d-flex>
          <v-card >
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
                <div slot="header" class="font-weight-bold text-uppercase" style="color:;">{{role.title}}</div>
                
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

    <input id="logo_img" type="file" ref="logo_img" 
      style="visibility:hidden" @change="openFileModal($event)" />
    
    <!-- suspend contestant dialog -->
    <v-dialog v-model="suspend_dialog" max-width="500px" persistent>
      <v-card min-height='200'>
        <v-card-title>
          <span class='headline text-capitalize'>Suspend {{culprit.name | capitalize}}</span>
        </v-card-title>
        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ipsa ducimus veniam quisquam voluptatum laborum voluptas deserunt aperiam fuga quasi ex unde nemo, assumenda aspernatur quia vitae ullam delectus in!

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="suspend_dialog = false" :disabled="loading">Cancel</v-btn>
          <v-btn color="success" outline @click="suspend" :loading="loading">Suspend</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- FLAGGED USER DIALOG -->
    <v-dialog persistent
      v-model="flagged_user_dialog" 
      v-if="flagged_user.name"
      max-width="500px"
      transition="dialog-transition" lazy
    >
      <v-toolbar color="grey lighten-3" dense>
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
      <v-card>
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
  props:[],
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
    overviewItems(){
      return [
        ['Election title',this.currElection.title],
        ['Creation Date',new Date(this.currElection.dateCreated).toDateString('en-Us',{day:'numeric'})],
        ['Followers',this.currElection.followers.length],
        ['Start Time',this.currElection.startTime],
      ]
    },
    filteredList() {
      if(this.regVoters){
        return this.regVoters.filter(voter => {
          return voter.name.toLowerCase().includes(this.search_voters.toLowerCase())
        })
      }
    },
   followText(){
     //return this.user.followers.indexOf(this.currUser._id) == -1 ? '+ Follow' : 'Following'
     return 'following'
   }
   
  },
  methods:{
    voterSuspended(voter){
    let finding = voter.suspended &&
    voter.suspended.find(electionId => electionId == this.$route.params.electionId) ?
    true : false
    console.log(finding)
    return finding
   },
    extractVoter(uid){
      return this.regVoters.find(voter=> voter.uid == uid)
    },
    getRole(contestant){
      let ref = contestant.contestsRef
      .find(item=>item.electionRef == this.currElection.electionId)
      return this.currElection.roles.find(role=>role.value = ref.role).title
    },
    async setUp(){
      try {

        // Get current election
        db.collection('elections')
          .doc(this.$route.params.electionId)
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
          .where('enrolled','array-contains',this.$route.params.electionId)
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
              if(voter.contests && voter.contests.find(id => id == this.$route.params.electionId)){
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
      console.log(contestants)
      contestants.forEach(cont=>{
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
      .where('electionRef','==',this.$route.params.electionId)
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

      let userRef = db.collection('moreUserInfo').doc(this.culprit.uid)
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

        let userRef = db.collection('moreUserInfo').doc(contestant.uid)
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
        suspended:firebase.firestore.FieldValue.arrayUnion(this.$route.params.electionId)
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
        suspended:firebase.firestore.FieldValue.arrayRemove(this.$route.params.electionId)
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
