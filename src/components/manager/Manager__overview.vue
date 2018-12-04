<template>
  <div>
    <v-container grid-list-xs>
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
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.role }}</td>
            <td class="text-xs-right">{{ props.item.department }}</td>
            <td class="text-xs-right">{{ props.item.faculty }}</td>
            <td class="text-xs-right">{{ props.item.others }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <v-container grid-list-md class="scrollbar">
      
      <v-layout row wrap mb-5>
        <v-flex xs12 sm8>
          <v-layout row wrap>
          <v-flex xs12 sm6 d-flex>
            <v-card >
              <v-list dense>
                <v-list-tile avatar>
                  Activity
                </v-list-tile>
              </v-list>
              <v-divider></v-divider>
              <div class="scrollbar my-3" style="max-height:230px;overflow-y:auto;overflow-x:hidden;">
                <v-timeline align-top dense class="scrollbar" >
                  <v-timeline-item color="pink" small>
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

                  <v-timeline-item color="teal lighten-3" small>
                    <v-layout pt-3>
                      <v-flex xs3>
                        <strong>8pm</strong>
                      </v-flex>
                      <v-flex>
                        <strong>At work</strong>
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>

                  <v-timeline-item color="pink" small >
                    <v-layout pt-3>
                      <v-flex xs3>
                        <strong>12pm</strong>
                      </v-flex>
                      <v-flex>
                        <strong>Lunch break</strong>
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>

                  <v-timeline-item color="teal lighten-3" small>
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

    <!-- logo upload dialog -->
    <!--v-dialog v-model="logo_dialog" max-width="400" hide-overlay style="">
      <v-container style="background:#fff;">
        <h3 class="mb-2">Upload a file</h3>
        <v-img :src="imgSrc" max-height='200' max-width='400'></v-img>
        
        <v-spacer></v-spacer>
        <v-btn flat small color="success" @click="uploadLogo">Upload file</v-btn>
      </v-container>
      
    </v-dialog-->
    <input id="logo_img" type="file" ref="logo_img" 
      style="visibility:hidden" @change="openFileModal($event)" />


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
      {text:'Others', value:'others'},
    ],
    table_data:[],
    cloudinary: {
      uploadPreset: 'r9tlxvid',
      cloudName: 'unplugged'
    },
  }),
  props:['currElection','regVoters','contestants','tabledata'],
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
   }
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
    
  },
  async mounted(){
    try {

    } catch (error) {
      console.log(error)
    }
    
  }
}
import EditElection from '@/components/EditElection'
</script>
