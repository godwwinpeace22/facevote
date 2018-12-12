<template>
  <div>
    <v-container grid-list-sm>
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

    <v-container grid-list-md class="scrollbar">
      
      <v-layout row wrap mb-5>
        <v-flex xs12 sm8>
          <v-layout row wrap>
            <v-flex xs12 sm7 d-flex>
              <v-card >
                <v-list dense>
                  <v-list-tile avatar>
                    Activity
                  </v-list-tile>
                </v-list>
                <v-divider></v-divider>
                <div class="scrollbar my-3" style="max-height:230px;overflow-y:auto;overflow-x:hidden;">
                  <v-timeline align-top dense class="scrollbar" >
                    <v-timeline-item :color="getColor(activity)" small v-for="activity in activities" :key="activity._id">
                      <v-layout pt-3>
                        <v-flex xs3>
                          <strong>{{new Date(activity.dateCreated).toDateString('en-Us',{day:'numeric'})}}</strong>
                        </v-flex>
                        <v-flex>
                          <strong>{{activity.by._id == currElection.admin._id ? 'Admin' : activity.by.name}} 
                            {{activity.text}}</strong>
                          <div class="caption">Mobile App</div>
                        </v-flex>
                      </v-layout>
                    </v-timeline-item>
                  </v-timeline>
                </div>
              </v-card>
            </v-flex>
            <v-flex xs12 sm5 d-flex>
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
                <div style="max-height:230px;overflow-y:auto;" class="scrollbar my-3">
                  <v-list two-line dense>
                    <v-subheader v-if="regVoters.length == 0">No registered voters yet</v-subheader>
                    <v-subheader v-if="filteredList.length == 0  && regVoters.length != 0">No results found</v-subheader>
                    <div v-for="(voter, index) in filteredList" :key="index">
                      <v-list-tile  :key="voter.name" avatar @click="viewprofile = true; voterprofile = voter" color="'default'">
                        <v-list-tile-avatar>
                          <img :src="voter.imgSrc || `https://ui-avatars.com/api/?name=${usr.name}`">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title  class="text-capitalize">{{voter.name}}<!--span id="online_badge" 'v-if="checkIfOnline(voter)"'></span--></v-list-tile-title>
                          
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn color="success" class="text-lowercase" v-if="isContestant(voter._id)" depressed small>contestant</v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-divider  :inset="true" :key="index"></v-divider>
                    </div>
                  </v-list>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm4>
          <v-layout row wrap>
            <v-flex xs12 sm12  d-flex>
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
        </v-flex>
        
        
      </v-layout>
    </v-container>

    <input id="logo_img" type="file" ref="logo_img" 
      style="visibility:hidden" @change="openFileModal($event)" />
    
    <!-- suspend contestant dialog -->
    <v-dialog v-model="suspend_dialog" max-width="500px">
      <v-card min-height='200'>
        <v-card-title>
          <span class='headline text-capitalize'>Suspend {{culprit.name | capitalize}}</span>
        </v-card-title>
        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ipsa ducimus veniam quisquam voluptatum laborum voluptas deserunt aperiam fuga quasi ex unde nemo, assumenda aspernatur quia vitae ullam delectus in!

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="suspend_dialog = false">Cancel</v-btn>
          <v-btn color="success" outline @click="suspend" :loading="loading">Suspend</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- election settings dialog -->
    <v-dialog v-model="settings_modal" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
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
    </v-dialog>
  </div>
</template>
<script>
export default {
  data:()=>({
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
    culprit:'',
    table_data:[],
    cloudinary: {
      uploadPreset: 'r9tlxvid',
      cloudName: 'unplugged'
    },
  }),
  props:['currElection','regVoters','contestants','tabledata','activities'],
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
    EditElection,
  },
  computed:{
    filteredList() {
      if(this.regVoters){
        return this.regVoters.filter(voter => {
          return voter.name.toLowerCase().includes(this.search_voters.toLowerCase())
        })
      }
    },
   followText(){
     return this.user.followers.indexOf(this.currUser._id) == -1 ? '+ Follow' : 'Following'
   },
   
  },
  methods:{
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
      return this.contestants.find(item => item.userId._id == id)
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
      
      let result = await api().post(`dashboard/suspendContestant`, {
        token:this.$store.getters.getToken,
        ...this.culprit,
        electionRef:this.currElection._id,
        admin:this.currElection.admin._id
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
        
        let result = await api().post(`dashboard/restoreContestant`,{
          token:this.$store.getters.getToken,
          ...contestant,
          electionRef:this.currElection._id,
          admin:this.currElection.admin._id
        })

      } catch (error) {
        alert(error)
        console.log(error)
      }
      
    }
    
  },
  async mounted(){
    try {
      setTimeout(
        _=> console.log(this.tabledata),
      4000)
      
    } catch (error) {
      console.log(error)
    }
    
  }
}
import api from '@/services/api'
  import EditElection from '@/components/EditElection'
</script>
