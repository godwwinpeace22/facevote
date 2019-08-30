<template>
  <v-app>
    <v-content>
      <transition name="fade" mode="out-in">
        <loading-bar v-if="!showUi" color="grey"></loading-bar>
        
        <div v-else>
          <v-layout >
            <v-flex>
              <vue-headful :title="title"/>

              <v-navigation-drawer fixed v-model="drawer" app dark width="230" 
                style="background-color:#1c1f35;color:bfbbbb;z-index:20" class="navdrawr">
                <v-toolbar flat tile id="step1" class="" style="background-color:rgba(51, 54, 78, 0.9);color:#fff;">
                  <v-avatar
                    size="40"
                    color="transparent"
                  >
                    <img src="@/assets/logo-50x50.png" alt="logo">
                  </v-avatar>

                  <v-toolbar-title>{{$appName}}</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>

                <!-- Switch Elections -->
                <v-expansion-panel>
                  <v-expansion-panel-content style="background: #2f324a;">
                    <template slot="actions">
                      <v-icon color="primary">$vuetify.icons.expand</v-icon>
                    </template>
                    <template slot="header">
                      <div >
                        <span class="text-capitalize text-truncate success--text font-weight-bold">
                          {{truncateText(curRoom ? curRoom.title : 'Set Current Election')}}
                        </span><br>
                        <small class="grey--text darken-1">Switch election</small>
                      </div>
                    </template>
                    <v-card class="main lighten-1">
                      <v-progress-linear :indeterminate="true" height="4" v-if="loading_rooms" color="primary"></v-progress-linear>
                      <v-list class="main lighten-1" dense>
                        <v-subheader v-if="!loading_rooms && getMyEnrolled && getMyEnrolled.length == 0">No Election</v-subheader>
                        
                        <v-list-tile v-for="election in getMyEnrolled" :key="election.electionId"
                          @click="$store.dispatch('curRoom', election)">
                          <v-list-tile-content>
                            <v-list-tile-title class="grey--text darken-1">
                              {{election.title}}
                            </v-list-tile-title>
                          </v-list-tile-content>
                          <v-list-tile-action v-if="curRoom && curRoom.electionId == election.electionId">
                            <v-icon color="success">mdi-check</v-icon>
                          </v-list-tile-action>
                        </v-list-tile>
                      </v-list>
                      <v-btn color="info" 
                        ripple flat :loading="getting_enrolled"
                        class="ml-0 text-capitalize" 
                        small @click="setup">
                        Refresh
                      </v-btn>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-list dense 
                  style="background-color:#1c1f35;color:bfbbbb;padding-top:0;" 
                  v-if="getUser" class="home_list">
            
                  <v-list-tile to="/home" exact >
                    <v-list-tile-action>
                      <v-icon>mdi-home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Home</v-list-tile-title>
                  </v-list-tile>

                  <!-- FORUM -->
                  <v-list-tile :to="curRoom ? `/forum` : '/#forum'">
                    <v-list-tile-action>
                      <v-icon color="">mdi-forum</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Forum</v-list-tile-title>
                  </v-list-tile>

                  <!-- Messages -->
                  <v-list-group prepend-icon="mdi-message-text" no-action :value="true">
                    <v-list-tile slot="activator">
                      <v-list-tile-title>Messages</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="openBroadcastDialog">
                      <v-list-tile-action>
                        <v-icon color="success">mdi-inbox</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Inbox</v-list-tile-title>
                      <v-list-tile-action v-show="getUnreadLength > 0">
                        <v-badge right color="red">
                          <span class="caption" slot="badge">{{getUnreadLength}}</span>
                        </v-badge>
                      </v-list-tile-action>
                    </v-list-tile>

                    <v-list-tile @click="isSuperUser || isAdmin ? new_broadcast = true : upgrade = true" :disabled="!curRoom">
                      <v-list-tile-action>
                        <v-icon color="">mdi-bullhorn</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>New Broadcast </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list-group>

                  <!-- ELECTIONS -->
                  <v-list-group prepend-icon="mdi-poll-box" no-action :value="false">
                    <v-list-tile slot="activator">
                      <v-list-tile-title>Elections</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile  to="/elections/create">
                      <v-list-tile-action>
                        <v-icon color="success">mdi-plus-box</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Create Election</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile :to="curRoom ? `/elections/vote` : '/#vote'">
                      <v-list-tile-action>
                        <v-icon color="info">mdi-vote-outline</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Vote</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile  to="/contest">
                      <v-list-tile-action>
                        <v-icon color="">mdi-trophy</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Contest</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile @click="isSuperUser ? new_manifesto_dialog = true : upgrade = true" 
                      v-if="curRoom"
                      :disabled="!isContestant">
                        <v-list-tile-action>
                          <v-icon color="">mdi-plus-circle</v-icon>
                        </v-list-tile-action>
                      <v-list-tile-title>New Manifesto </v-list-tile-title>
                    </v-list-tile>

                    <v-tooltip right v-if="isAdmin">
                      <v-list-tile @click="show_manager = !show_manager" slot="activator">
                        <v-list-tile-action>
                          <v-icon color="cyan">mdi-tune</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>Manage Election</v-list-tile-title>
                      </v-list-tile>
                      <span>Manage Election</span>
                    </v-tooltip>
                  </v-list-group>
                  
                  <v-list-tile to="/verify" exact >
                    <v-list-tile-action>
                      <v-icon color="success">mdi-check-decagram</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Verify Account</v-list-tile-title>
                  </v-list-tile>

                  <!-- SETTINGS -->
                  <v-list-tile  @click="$eventBus.$emit('show_profile_settings')">
                    <v-list-tile-action>
                      <v-icon color="success">mdi-settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Settings</v-list-tile-title>
                  </v-list-tile>

                  <!-- HELP -->
                  <v-list-group prepend-icon="mdi-help-circle" no-action>
                    <v-list-tile slot="activator">
                      <v-list-tile-title>Help</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile href="https://voteryte.com/faq" target="blank">
                      <v-list-tile-action>
                        <v-icon color="success">mdi-frequently-asked-questions</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>FAQ</v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-avatar>
                        <v-icon small>mdi-open-in-new</v-icon>
                      </v-list-tile-avatar>
                    </v-list-tile>

                      <v-list-tile href="https://support.voteryte.com" target="blank">
                        <v-list-tile-action>
                          <v-icon color="grey">mdi-headset</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>Helpdesk </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                  </v-list-group>

                  <!-- NOT SUPERUSER -->
                  <v-list-tile v-if="!isSuperUser">
                    <v-list-tile-content>
                      <v-btn color="success" block @click="upgrade = true">
                        <v-icon color="secondary" class="mr-2">mdi-star</v-icon>
                        Upgrade</v-btn>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile avatar v-if="isSuperUser" style="background: #2f324a;">
                    <v-list-tile-action>
                      <v-icon color="orange">mdi-flash-circle</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Premium User</v-list-tile-title>
                      <small>You've got super powers!</small>
                    </v-list-tile-content>
                  </v-list-tile>
                  
                  <!-- Update available -->
                  <v-list-tile avatar v-if="appUpdateAvailable" class="elevation-2 black" @click="updateApp">
                    <v-list-tile-action>
                      <v-icon color="orange">mdi-update</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title class="orange--text">Update Available</v-list-tile-title>
                      <small>Click to refresh</small>
                    </v-list-tile-content>
                  </v-list-tile>
                
                </v-list>
                <footr/>
              </v-navigation-drawer>
              
              <!-- New Interactive Session -->
              <v-navigation-drawer temporary
                :stateless="drawer_right_persist"
                v-model="drawer_right" right app width="800">

                <new-event 
                  @persist-drawer="drawer_right_persist = true" 
                  @close-event-drawer="drawer_right = false">
                </new-event>

              </v-navigation-drawer>

              <!-- SNACKBAR -->
              <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" top right>
                {{snackbar.message}}
                <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
              </v-snackbar>
              
              <!-- FAB -->
              <v-speed-dial v-if="showFab"
                v-model="fab" fixed
                bottom right
                direction="top"
                transition="slide-y-reverse-transition">
                <template v-slot:activator>
                  <v-btn v-model="fab" color="teal" dark fab>
                    <v-icon v-if="fab">mdi-close</v-icon>
                    <v-icon v-else>mdi-view-dashboard</v-icon>
                  </v-btn>
                </template>
                <v-btn fab dark small @click="$router.push({path: '/elections/vote'})"
                   color="green">
                  <v-icon>mdi-vote-outline</v-icon>
                </v-btn>
                <v-btn fab dark small class=""
                  color="indigo" @click="$router.push({path: '/forum'})">
                  <v-icon>mdi-forum</v-icon>
                </v-btn>
              </v-speed-dial>

              <loading-bar v-if="show_loading_bar" color="grey"></loading-bar>
              <router-view v-else></router-view>
              
            </v-flex>
          </v-layout>
        

          <!-- GALLERY VIEWER -->
          <gallery :images="images" :index="index" @close="index = null"></gallery>
          
          <!-- Broadcast Dialog -->
          <v-dialog v-model="broadcast_dialog" max-width="1000"
            :fullscreen="$vuetify.breakpoint.smAndDown" hide-overlay lazy scrollable>
            <v-card flat class="pa-0">
              <v-card-text class="pa-0">
                <broadcast v-if="broadcast_dialog" style="min-height:300px;background:#fff;"></broadcast>
              </v-card-text>
            </v-card>
            
          </v-dialog>

          <!-- NEW MANIFESTO DIALOG -->
          <v-dialog v-model="new_manifesto_dialog" lazy :fullscreen="$vuetify.breakpoint.xsOnly"
            max-width="800px" :transition="switchTransition" hide-overlay v-if="new_manifesto_dialog" scrollable>
            <v-card flat>
              <v-toolbar card dense flat>
                <v-btn flat icon v-if="$vuetify.breakpoint.xsOnly"
                  @click="new_manifesto_dialog = false">
                  <v-icon>mdi-chevron-left</v-icon> 
                </v-btn>
                <span>Create a Manifesto</span>
                <v-spacer></v-spacer>
                <v-btn flat icon @click="new_manifesto_dialog = false" class="hidden-xs-only">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <new-manifesto />
              </v-card-text>
            </v-card>
          </v-dialog>
          
          <!-- NEW BROADCASTs -->
          <new-broadcast v-if="new_broadcast" ></new-broadcast>

          <!-- VIEW PROFILE -->
          <v-dialog v-model="viewprofile" v-if="viewprofile" lazy :style="styleObj"
            width="300" hide-overlay scrollable
            :transition="switchTransition">
            <v-card flat :class="{'round_top': $vuetify.breakpoint.smAndUp}">
              
              <v-card-text class="pa-0" :class="{'round_top': $vuetify.breakpoint.smAndUp}">
                <view-profile :user='voterprofile'  id="vprofile"></view-profile>
              </v-card-text>
            </v-card>
          </v-dialog>

          <!-- MANAGE ELECTION DIALOG -->
          <v-dialog v-model="show_manager" fullscreen lazy
            hide-overlay transition="dialog-bottom-transition" scrollable>
            <v-card tile>
              <v-toolbar card color="secondary" flat dark>
                <v-toolbar-title>Election Manager</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="" icon @click="show_manager = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>

              <v-card-text class="pa-0">
                <manage-election v-if="isAdmin"/>
              </v-card-text>
            </v-card>
          </v-dialog>

          <!-- GO PREMIUM -->
          <v-dialog v-model="upgrade" lazy :persistent="procesing_payment"
            max-width="950px" :transition="switchTransition" content-class="round_top" >
            <v-card class="round_top" flat>
              <v-toolbar color="white" card>
                <v-card-title primary-title class="pl-1 font-weight-bold title">
                  Upgrade To Premium
                </v-card-title>

                <v-spacer></v-spacer>
                <v-btn light icon :disabled="procesing_payment" @click="upgrade = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-layout row wrap class="pl-2" justify-space-between>
                <v-flex xs12 sm4>
                  <v-subheader class="black--text">Voteryte premium gives you all the tools you need to rise above the competition</v-subheader>
                  <v-card flat>
                    
                    <v-card-text class="px-0">
                      <div style="overflow: auto" class="mb-2">
                        <div style="width: 30px; height: 30px;float: left;" class="ml-3 d-inline-block">
                          <v-icon color="success">mdi-check</v-icon>
                        </div>
                        <div class="d-inline-block" style="width: calc(100% - 50px);float: right;">
                          Ability to create compelling manifestos 
                        </div>
                      </div>
                      <div style="overflow: auto" class="mb-2">
                        <div style="width: 30px; height: 30px;float: left;" class="ml-3 d-inline-block">
                          <v-icon color="success">mdi-check</v-icon>
                        </div>
                        <div class="d-inline-block" style="width: calc(100% - 50px);float: right;">
                          Create events such as meetups, webinar, interactive sessions, e.t.c.
                        </div>
                      </div>
                      <div style="overflow: auto" class="mb-2">
                        <div style="width: 30px; height: 30px;float: left;" class="ml-3 d-inline-block">
                          <v-icon color="success">mdi-check</v-icon>
                        </div>
                        <div class="d-inline-block" style="width: calc(100% - 50px);float: right;">
                          Engage targeted audience through campaigns and posts
                        </div>
                      </div>
                      <div style="overflow: auto" class="mb-2">
                        <div style="width: 30px; height: 30px;float: left;" class="ml-3 d-inline-block">
                          <v-icon color="success">mdi-check</v-icon>
                        </div>
                        <div class="d-inline-block" style="width: calc(100% - 50px);float: right;">
                          Overview of contestant Insights and who's viewed your profile
                        </div>
                      </div>
                      <div style="overflow: auto" class="mb-2">
                        <div style="width: 30px; height: 30px;float: left;" class="ml-3 d-inline-block">
                          <v-icon color="success">mdi-check</v-icon>
                        </div>
                        <div class="d-inline-block" style="width: calc(100% - 50px);float: right;">
                          Send unlimited broadcast messages to election participants
                        </div>
                      </div>
                    </v-card-text>
                      <v-subheader class="teal--text">For only ₦ 5,000 per month</v-subheader>
                      

                    <v-card-actions>
                      <paystack
                        :amount="plan.amount * 100"
                        :email="getUser.email"
                        :plan="plan.plan_code"
                        :metadata="metadata"
                        :paystackkey="$paystackKey"
                        :reference="reference"
                        :callback="verifyTxn"
                        :close="onclose"
                        :embed="false"
                      >
                        <v-btn color="teal" dark block large class="ml-2 text-capitalize" depressed :loading="procesing_payment">Upgrade Now</v-btn>
                      </paystack>
                    </v-card-actions>
                    <small class="ml-3">Cancel at any time</small> <br>
                    <v-btn color="secondary" 
                      style="text-transform: initial;margin-bottom: 15px;" 
                      small class="" target="blank" href="https://voteryte.com/contestants" 
                      flat>
                      <span style="text-decoration: underline;">Learn more  </span>
                      <v-icon small class="pl-1">mdi-open-in-new</v-icon>
                    </v-btn>

                    
                    <v-dialog v-model="procesing_payment"
                      persistent width="300">
                      <v-card color="secondary" dark >
                        <v-card-text>
                          Processing. Please wait...
                          <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                          ></v-progress-linear>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </v-card>
                </v-flex>
                <v-flex xs0 sm7 class="hidden-xs-only">
                  <v-card id="pay_card" flat tile>
                    <div class="slider">
                      <div class="slide1"></div>
                      <div class="slide2"></div>
                      <div class="slide3"></div>
                      <div class="slide4"></div>
                      <div class="slide5"></div>
                      <div class="slide6"></div>
                      <div class="slide7"></div>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-dialog>

          <input type="file" name="file" id="file_img" style="visibility:hidden;position:absolute;" 
            @change="onFileSelect($event)" accept="image/jpeg,image/png/gif" multiple>

          <v-layout row justify-center>

            <v-dialog v-model="switch_room_dialog" fullscreen persistent transition="fade-transition">
              
              <v-card style="height: 100%;" class="pa-5" color="rgba(0,0,0,0.8)">
                <v-container fluid fill-height>
                  <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                      <v-card flat color="transparent">
                        
                        <v-card-text>
                          
                          <p class="title text-xs-center white--text">Switching Election</p>
                          <v-progress-circular indeterminate 
                            color="success" class="mx-auto d-block">

                          </v-progress-circular>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-dialog>
          </v-layout>
        </div>


      </transition>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data:()=>({
    showUi: false,
    fab: false,
    switch_room_dialog: false,
    index: null, // for image gallery viewer
    images: [], // for image gallery viewer
    getting_enrolled: false,
    show_loading_bar: true,
    show_manager: false, // election manager dialog
    new_broadcast: false,
    broadcasts: '',
    broadcastsRef: '', // for clearing watcher
    timestamp: Date.now(),
    upgrade: false,
    procesing_payment: false,
    viewprofile: false,
    voterprofile: {},
    broadcast_dialog: false,
    fetching_enrolled: true,
    snackbar: {},
    new_manifesto_dialog: false,
    plan: {
      plan_name: 'testplan',
      plan_code: 'PLN_npflhujgmzdqppi',
      amount: 5000,
      paystack_key:'pk_test_cd14c065dfe123cd983362a4ed795fe1128ec4e2',
    },
    reference: Date.now() + btoa(Math.random()).substring(0,12),
    drawer: true,
    drawer_right: false,
    drawer_right_persist: false,
    appUpdateAvailable: window.appUpdateAvailable
  }),
  components:{
    ViewProfile,
    LoadingBar,
    Broadcast,
    Navigation,
    NewManifesto,
    paystack,
    Gallery,
    NewBroadcast,
    ManageElection,
    NewEvent,
    footr: Footer
  },

  watch: {
    'curRoom': function(to, from) {
      if(this.curRoom){
        this.getBroadcasts()

        this.switch_room_dialog = true
        setTimeout(()=>{
          this.switch_room_dialog = false
        }, 1000)
      }
    },
    'getUserInfo': function() {
      this.getUserInfo ? 
      this.setup() : ''
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getRecentBroadcasts',
      'getMyEnrolled',
      'getUnreadLength'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
      'curRoomId',
      'loading_rooms',
      'is_verified',
      
    ]),
    title(){
      return `Dashboard | ${this.$appName}`
    },
    isAdmin(){
      return this.curRoom ? this.curRoom.admins.includes(this.getUser.uid) : false
    },
    switchTransition(){
      return this.$vuetify.breakpoint.smAndDown ? 
      'slide-x-reverse-transition' : 
      'dialog-transition'
    },
    showFab(){
      if(this.$vuetify.breakpoint.smAndDown){
        
        let route_name = this.$route.name
  
        switch (route_name) {
          case 'members':
            return false;
          case 'profile':
            return false;
          case 'profile2':
            return false;
          default:
            return true;
        }
      }
      
      return false
      
    },
    metadata: function(){
      return {
        plan_type: this.plan.plan_name,
        orderid: this.reference,
        custom_fields: [
          {
            display_name: "Plan_type",
            variable_name: "plan",
            value: this.plan.plan_name
          },
          {
            display_name: "Amount Paid",
            variable_name: "amount_paid",
            value: 5000
          },
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: this.getUser.displayName
          },
          {
            display_name: "CustomerId",
            variable_name: "customer_id",
            value: this.getUser.uid
          }
        ]
      }
    },
    styleObj(){
      if(this.$vuetify.breakpoint.xsOnly){
        return {
          height:'100vh',
          backgroundColor:'#fff'
        }
      }
    },
    isContestant(){ // return the role a user is contesting for
      if(this.getUserInfo && this.getUserInfo.contestsRef){
        let found = this.getUserInfo.contestsRef.find(contest=>contest.electionRef == this.curRoom.electionId)
        //console.log(res)
        return found ? this.curRoom.roles.find(role => role.value == found.role).title : false
      }else{
        return false
      }
    },
  },
  
  methods:{
    async setup () {
      //get dept elections in user dept
      // get fac elections in user fac
      // get sch elections in user school
      // populate myEnrolled with the retrieved elections
      // console.log(this.getUser)
      // console.log(this.getUser, this.getUserInfo)
      if(this.getUserInfo.is_student) {

        let elections = []
        this.getting_enrolled = true
        // get user's General elections
        await db.collection('elections')
        .where('sch', '==', this.getUserInfo.sch)
        .where('level', '==', 'General')
        .get().then(docs => {
          docs.forEach(doc => {
            elections.push(doc.data())
          })
        })

        // get user's fac elections
        await db.collection('elections')
        .where('sch', '==', this.getUserInfo.sch)
        .where('fac', '==', this.getUserInfo.fac)
        .where('level', '==', 'Faculty')
        .get().then(docs => {
          docs.forEach(doc => {
            elections.push(doc.data())
          })
        })

        // get user's dept elections
        await db.collection('elections')
        .where('sch', '==', this.getUserInfo.sch)
        .where('dept', '==', this.getUserInfo.dept)
        .where('level', '==', 'Department')
        .get().then(docs => {
          docs.forEach(doc => {
            elections.push(doc.data())
          })
        })
        // sort elections by creation date and dispatch to store
        let sorted = elections.sort((a,b) => b.dateCreated.toMillis() - a.dateCreated.toMillis())
        this.$store.dispatch('setMyEnrolled', sorted)
        this.getting_enrolled = false

        // set current room if there is none

        this.curRoom ? '' : sorted.length > 0 ? this.$store.dispatch('curRoom', sorted[0]) : ''
      }
      else {
        this.getting_enrolled = false
      }
    },
    openBroadcastDialog(){
      this.$vuetify.breakpoint.smAndDown ? 
      this.dialog = false : ''

      this.broadcast_dialog = true
    },
    verifyTxn(data){
      
      // verfy on the server that the transaction is ok
      this.procesing_payment = true
      return firebase.auth().currentUser.getIdToken()
      .then(async (token)=>{
        return api().post('/verifyTxn', {
          token,
          reference: data.reference,
          amount: this.plan.amount * 100,
          upgrade_user: true
        }).then(res=>{
          // transaction is ok
          firebase.auth().currentUser.getIdToken(true).then(idToken=>{
            
          })

          this.timestamp = Date.now()
          this.procesing_payment = false
          this.upgrade = false

          this.snackbar = {
            show: true,
            message: 'Account upgraded successfully',
            color: 'success'
          }
          setTimeout(() => {
            window.location.reload()
          }, 2000);
          
        }).catch(error=>{
          // avoid duplicate trxn reference
          this.reference = Date.now() + btoa(Math.random()).substring(0,12)

          this.snackbar = {
            show:true,
            message:error.response ? error.response.data.message : 'Transaction failed',
            color:'error'
          }
          this.loading = false
          this.timestamp = Date.now()
          this.upgrade = false
          this.procesing_payment = false
          this.$Nprogress.done()
        })
        
      })
      
    },
    truncateText(text){
      return text ? text.replace(/(.{18})..+/, "$1...") : '';
    },
    onclose(){
      this.reference = Date.now() + btoa(Math.random()).substring(0,12)
    },
    onFileSelect(e){
      // handle file selecting for all components
      let two_mb = 2000000
      let blob_urls = []
      // Allow only images
      let stop = true
      let file_sizes = 0
      for(let file of e.target.files){
        if(file.type == 'image/jpeg' || 
          file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif'){
            stop = false
          
        }
        else{
          stop = true
          break
        }
        file_sizes += file.size
      }

			if(!stop){
					
				// limit file upload to 1mb
				if(file_sizes < two_mb){
          
          for(let file of e.target.files){
            //console.log(file)
            blob_urls.push(URL.createObjectURL(file))
          }
          this.$eventBus.$emit('Selected_Files', {
            imgSrc: blob_urls,
            selected_files: e.target.files
          })
          
				}
				else{
          e.target.value = ''
          this.snackbar = {
            show: true,
            message: 'Please select an image that is less than 1mb',
            color: 'error'
          }
				}
			}
			else{
        this.snackbar = {
          show: true,
          message: 'Only images are allowed!',
          color: 'error'
        }
			}
    },
    presenceWatcher(){
      // Fetch the current user's ID from Firebase Authentication.
      let userId = this.getUser.uid;

      const usersRef = db.collection('users'); // Get a reference to the Users collection;
      const onlineRef = database.ref('.info/connected'); // Get a reference to the list of connections

      onlineRef.on('value', snapshot => {
        
        database
          .ref(`/status/${userId}`)
          .onDisconnect() // Set up the disconnect hook
          .set('offline') // The value to be set for this key when the client disconnects
          .then(() => {
              // Set the Firestore User's online status to true
              usersRef
                .doc(this.getUser.uid)
                .set({
                  online: true,
                }, { merge: true});  

              // Let's also create a key in our real-time database
              // The value is set to 'online'
              database.ref(`/status/${userId}`).set('online');
          });
        
      });
    },
    getBroadcasts(){
      if(this.curRoom){
        
        try {
          this.broadcastsRef = db.collection('broadcasts')
          .where('elecRef', '==', this.curRoom.electionId)
          .orderBy('tstamp', 'desc')
          .limit(100)
          .onSnapshot(docs =>{
            let d = []
            docs.forEach(doc =>{
              d.push(doc.data())
            })
            this.$store.dispatch('setBroadcasts', d)
            // console.log('broadcasts: ', d)
          }, error => {
            // console.log(error)
          })
        } catch (error) {
          // console.log(error)
        }
        
      }
    },
    isMobile() {
      return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
    },
    openChatWidget(){
      this.initChatWidget()
      if (window.fcWidget.isInitialized() == true) {
        // console.log('Widget already initialised');
        // open widget
        window.fcWidget.open();
      }
    },
    initChatWidget(){
      try {
        let user = this.getUserInfo
        if(window.fcWidget){

          window.fcWidget.init({
            token: "3402f5b8-1e86-4016-bad3-bb1b79d386d3",
            host: "https://wchat.freshchat.com"
          });
  
          window.fcWidget.setExternalId(user.uid);
          window.fcWidget.user.setEmail(user.email);
          window.fcWidget.user.setProperties({
            name: user.name,
            is_superuser: this.isSuperUser,
            is_verified: this.is_verified
          });
        }
       
      } catch (error) {
        // console.log(error)
      }
    },
    updateApp(){
      window.location.reload(true)
    }
  },
  async mounted(){
    document.getElementById('welcome_logo').style.display = 'none'
      document.querySelector('body').style.backgroundColor = '#fff'

      this.$eventBus.$on('Toggle_Left_Drawer', data=>{
        this.drawer = !this.drawer
      })

      this.$eventBus.$on('Toggle_New_Broadcast', data=>{
        this.new_broadcast = data
      })
      
      if(this.curRoom){
        this.getBroadcasts()
      }

      this.$eventBus.$on('ToggleInboxDialog', data =>{
        this.broadcast_dialog = data
      })
      
      this.$eventBus.$on('OpenNewManifestoDialog', data=>{
        this.new_manifesto_dialog = true
      })
      this.$eventBus.$on('CloseNewManifestoDialog', data=>{
        this.new_manifesto_dialog = false
      })

      this.$eventBus.$on('ViewProfile', data=>{
        this.viewprofile = true
        this.voterprofile = data
      })
      this.$eventBus.$on('CloseProfile', data=>{
        this.viewprofile = false
      })
      
      this.$eventBus.$on('Show_Upgrade_Dialog', data=>{
        this.upgrade = true
      })

      this.$eventBus.$on('Open_Image_Gallery', data=>{
        this.images = data.images
        this.index = data.index
      })
      this.$eventBus.$on('Open_Upgrade_Dialog', data=>{
        this.upgrade = true
      })

      this.$eventBus.$on('ShowManager', data => {
        this.show_manager = true
      })

      this.$eventBus.$on('bdialog', ()=> this.new_broadcast = false)
      this.$eventBus.$on('NewInteractive', data => {
        this.drawer_right = data
      })


      // show loading animation for some seconds
      setTimeout(() => {
        this.show_loading_bar = false
      }, 1000);
      
      this.$eventBus.$on('Snackbar', data =>{
        this.snackbar = data
      })

    
    firebase.auth().onAuthStateChanged(u => {

      let sessionTimeout = null

      if(u){
        
        firebase.auth().currentUser.getIdTokenResult()
        .then((idTokenResult) => {

          let user = idTokenResult.claims

          // user.phoneNumber = u.phoneNumber
          this.$store.dispatch('setUser', u)
          this.showUi = true
          this.getUser ? this.presenceWatcher() : ''
          this.getUserInfo ? this.setup() : ''
          

          let isSuperUser = idTokenResult.claims.superuser
          // let now = new Date().getTime()
          // let trial_expired = now > user.trial_expiry_date
          
          // console.log(user)
          if(isSuperUser){
            
            this.$store.dispatch('subscriberState', isSuperUser)
          }
          else{
            
            this.$store.dispatch('subscriberState', false)
          }

          this.$store.dispatch('verifiedState', user.is_verified)

          // User sessions should last for only 2 hours
          // Make sure all the times are in milliseconds!
          const authTime = idTokenResult.claims.auth_time * 1000;
          const sessionDuration = 1000 * 60 * 5;
          const millisecondsUntilExpiration = sessionDuration - (Date.now() - authTime);
          sessionTimeout = setTimeout(() => {

            this.$store.dispatch('sessionExpired')
            
          }, millisecondsUntilExpiration);


          // let usr = idTokenResult.claims
          // console.log({user})
          this.$LogRocket.identify(user.user_id, {
            name: user.name,
            email: user.email,
            isSuperUser: user.superuser,
            dept: user.dept
          })

          // console.log(user)
          // show chat widget only on large screens
          if(this.$vuetify.breakpoint.mdAndUp){

            this.initChatWidget(user)
          }

          window.fcWidget ? window.fcWidget.on("widget:closed", (resp)=>{
            // console.log('Widget Closed');
            // destroy the widget on close in small screen
            if(this.$vuetify.breakpoint.smAndDown){
              window.fcWidget.destroy()
            }
          }) : ''

        })
        .catch((error) => {
          // console.log(error);
        });
      }
      else {
        // User is logged out.
        // Clear the session timeout.
        sessionTimeout && clearTimeout(sessionTimeout);
        sessionTimeout = null;
      }
    })
  

    this.$vuetify.breakpoint.smAndDown ? this.drawer = false : this.drawer = true
    
    this.$eventBus.$on('Change_Title', (data)=>{
      //console.log('changing the title')
      this.title = data
    })
  },
  async created(){
    
    if(this.$store.state.session_expired){
      let to = this.$route.fullPath
      firebase.auth().signOut().then(() => this.$router.push(`/login?returnTo=${to}`))
    }

  },
  beforeDestroy(){
    this.broadcastsRef ? this.broadcastsRef() : ''
  }
}

import { mapGetters, mapState } from 'vuex'
  import api from '@/services/api'
  import ViewProfile from '@/components/dialogs/ViewProfile'
  import LoadingBar from '@/spinners/LoadingBar'
  import Broadcast from '@/components/Broadcast'
  import Navigation from '@/components/Navigation'
  import NewManifesto from '@/components/profile/NewManifesto'
  import paystack from 'vue-paystack'
  import Gallery from 'vue-gallery';
  import NewBroadcast from '@/components/dialogs/NewBroadcast'
  import ManageElection from '@/components/elections/ManageElection'
  import NewEvent from '@/components/events/NewEvent'
  import Footer from '@/components/Footer'
  import {firebase, db, database} from '@/plugins/firebase'
</script>

<style lang='scss' >
@import url('https://unpkg.com/nprogress@0.2.0/nprogress.css');
// @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons');

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;
$secondary: #1867c0;

[v-cloak] {
  display: none;
}
@mixin borderTopRadius($radius) {
  border-top-right-radius: $radius;
  -webkit-border-top-right-radius:$radius;
  -moz-border-top-right-radius:$radius;
  -o-border--top-right-radius:$radius;
  border-top-left-radius: $radius;
  -webkit-border-top-left-radius:$radius;
  -moz-border-top-left-radius:$radius;
  -o-border--top-left-radius:$radius;
}
.round_top{
  @include borderTopRadius(10px);
}

.round {
  @include borderRadius(10px);
}

.magnify {
  cursor: zoom-in;
}

.dragify {
  cursor: grab;
}

.linkified{
  color: $secondary;
  text-decoration: none;
}
.text-lowercase {
  text-transform: lowercase;
}
.text-normal {
  text-transform: initial;
}
.fade-enter-active, .fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

// .v-dialog--active{
//   @include borderTopRadius(10px)
// }

.switch_room_dialog.v-dialog--active {
  @include borderTopRadius(0px)
}
.v-dialog--fullscreen{
  @include borderTopRadius(0px)
}
.view_dialog .v-dialog--fullscreen{
  background: transparent !important;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#pay_card {
  background: url('../assets/abstract.png');
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.menu_tabs{
  .v-tabs__div{
    text-transform:capitalize
  }
  .v-list__tile{
    font-size: 14px;
  }
}
.v-list__group__header .v-list__group__header__prepend-icon{
  min-width: 35px;
}
.home_list{

  // height: calc(100vh - 40%);
  // overflow-y: auto;

  .v-list__tile__action, .v-list__group__header .v-list__group__header__prepend-icon{
    min-width:35px;
  }
  .v-icon{
    color:#adabab;
  }
  .v-list__tile{
    //color:#bfbbbb;
    color:#fff;
  }
}

.theme--light.v-text-field--outline .v-input__slot {
  border: 1px solid rgba(115, 114, 114, 0.54) !important;
}
.v-content{
  background:#eceff1;
  // background: #fff;
}

.online_badge{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 5px;
}

/* --scrollbar --*/
.navdrawr::-webkit-scrollbar {
    width: 8px;
    background-color: $mainBgColor;
    @include borderRadius(10px);
  }
.navdrawr::-webkit-scrollbar-track {
  background-color: $mainBgColor;
  // @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}

.emoji-picker::-webkit-scrollbar-track {
  background-color: #fff;
}


/* --slider-- */

.slider {
	max-width: 209px;
	height: 434px;
	margin: 20px auto;
	position: relative;
	// box-shadow: 2px -1px 5px 1px #a29f9f;
	// border-radius: 5px;
  }

  @media (max-width: 400px){
	  .slider {
		  height: 160px;
	  }
  }

.slide1,.slide2,.slide3,.slide4,.slide5,.slide6,.slide7 {
	position: absolute;
	width: 100%;
  height: 100%;
  animation-name: fade; 
  animation-duration: 18s; 
  animation-iteration-count: infinite;
	// border-radius: 5px;
}
.slide1 {
	background: url('../assets/insight.png') no-repeat center;
	background-size: cover;
  animation-delay: 0s;
}
.slide2 {
	background: url('../assets/insight2.png')no-repeat center;
	background-size: cover;
  animation-delay: 3s;
}
.slide3 {
	background: url('../assets/profile-viewers.png')no-repeat center;
	background-size: cover;
  animation-delay: 6s;
}
.slide4 {
	background: url('../assets/profile-viewers2.png')no-repeat center;
	background-size: cover;
  animation-delay: 9s;
} 
.slide5 {
	background: url('../assets/create-post.png')no-repeat center;
	background-size: cover;
  animation-delay: 12s;
}
.slide6 {
	background: url('../assets/create-campaign.png')no-repeat center;
	background-size: cover;
  animation-delay: 15s;
}
.slide7 {
	background: url('../assets/create-manifesto.png')no-repeat center;
	background-size: cover;
  animation-delay: 18s;
}

@keyframes fade
  {
	0%   {opacity:1}
	33.333% { opacity: 0}
	66.666% { opacity: 0}
	100% { opacity: 1}
}

</style>
