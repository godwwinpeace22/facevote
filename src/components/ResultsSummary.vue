<template>
  <div>
    <v-container grid-list-sm fluid>
      <v-layout row wrap justify-center>
        <v-flex sm12 md8>
          <v-card class="round">
            <v-card-title primary-title>
              {{currElection.title}}
            </v-card-title>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-list dense>
                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-stop</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Title:</span>
                      <span>{{currElection.title}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                  
                  <v-list-tile v-if="currElection.type == 'School'" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-school</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title class="text-capitalize">
                      <span class="mr-3">School:</span>
                      <span>{{currElection.sch}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-layers</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Level:</span>
                      <span>{{currElection.level}} Election</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.type == 'School' 
                    && (currElection.level != 'General')" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-domain</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title class="text-capitalize">
                      <span class="mr-3">Faculty:</span>
                      <span>{{currElection.fac}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.level == 'Department'" @click="''">
                    <v-list-tile-action>
                      <v-icon>mdi-map-marker</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title class="text-capitalize">
                      <span class="mr-3">Department:</span>
                      <span>{{currElection.dept}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-poll</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Contestants:</span>
                      <span>{{currElection.contestants}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                  
                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-account-group</v-icon>   
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Enrolled Voters:</span>
                      <span>{{currElection.voters}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                  
                  <v-list-tile @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-vote-outline</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Number that voted:</span>
                      <span >{{rawVotes.length}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
                
              </v-flex>
              <v-flex xs12 sm6>
                <v-list dense>
                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-clock</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Date Created:</span>
                      <span>{{(new Date(currElection.dateCreated.toMillis())).toLocaleString('en-Us')}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-account</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Created By:</span>
                      <span class="text-capitalize">{{getAdmin.name | capitalize}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-clock</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Start Date:</span>
                      <span>{{(new Date(currElection.fullStartDate))}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                  
                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-timer</v-icon>   
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Duration:</span>
                      <span>{{currElection.duration}} hrs</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-adjust</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Status:</span>
                      <span v-if="!timer_ready">Checking...</span>
                      <span v-else>{{status.not_started ? 'Not started' : status.inprogress ? 'In progress' : 'Ended'}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-flex>
            </v-layout>
            <v-data-table
              :headers="headers"
              :items="tabledata"
              :loading='false'
            >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.name | capitalize}}</td>
                <td class="text-xs-left">{{ props.item.role }}</td>
                <td class="text-xs-left">{{ props.item.department }}</td>
                <td class="text-xs-left">{{ props.item.faculty }}</td>
                <td class="text-xs-left">{{props.item.score}}</td>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
        
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () => ({
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
      {text:'Votes', value:'score'},
    ],
    tabledata: []
  }),
  props: ['currElection','status','getAdmin','timer_ready','contestants','allVotes','rawVotes'],
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
  computed: {
    title(){
      return `Results Summary | ${this.$appName}`
    },
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ])
  },
  methods: {
    setTableData(){
      this.tabledata = [] // to prevent multiple pushings
      if(this.allVotes && this.contestants.length > 0){

        this.contestants.forEach(cont=>{
          
          // get votes for a particular contestant
          let foo = this.allVotes.filter(vote=> {
            return cont.uid == vote.id
          })
  
          let myObj = {
            value: false,
            name: cont.name,
            email: cont.email,
            contId: cont.uid, // contestant id
            role: this.getRole(cont),
            department: cont.dept,
            faculty: cont.fac,
            score: foo[0] ? foo[0].score > 0 ? foo[0].score : 0 : 0
          }
          this.tabledata.push(myObj)
        })
      }
    },
    initialize(){
      this.setTableData()
    },
    getRole(contestant){
      let ref = contestant.contestsRef
      .find(item=>item.electionRef == this.currElection.electionId)
      let found = this.currElection.roles.find(role=>role.value == ref.role)
      return found ? found.title : false
    },
  },
  mounted(){
    this.initialize()
  }
}
import { mapGetters, mapState } from 'vuex';
</script>
