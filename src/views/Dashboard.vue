<template>
  <v-app>
    <v-content>
      <transition name="fade" mode="out-in">
        <loading-bar v-if="!showUi" color="grey"></loading-bar>
        
        <div v-else>
          
          <vue-headful :title="title"/>

          <v-navigation-drawer fixed v-model="drawer" 
            app width="250" :mini-variant="mini"
            dark color="#1c1f35"
            class="navdrawr">
            <v-toolbar flat tile id="step1" 
              style="background-color:#1c1f35; color:bfbbbb; z-index:20">
              <v-avatar
                size="40"
                color="transparent"
              >
                <img src="@/assets/logo-50x50.png" alt="logo">
              </v-avatar>

              <v-toolbar-title class="ml-4" v-show="!mini">{{$appName}}</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>

            <!-- Switch Elections -->
            <!-- <v-expansion-panels accordion>
              <v-expansion-panel style="background: #2f324a;">
                <v-expansion-panel-header>
                  <div >
                    <span class="text-capitalize text-truncate success--text font-weight-bold">
                      {{truncateText(curRoom ? curRoom.title : 'Set Current Election')}}
                    </span><br>
                    <small class="grey--text darken-1">Switch election</small>
                  </div>
                </v-expansion-panel-header>
                
                <v-expansion-panel-content>
                  
                  <v-card class="lighten-1" color="#2f324a" flat>
                    <v-progress-linear 
                      :indeterminate="true" height="4" 
                      v-if="loading_rooms" color="primary">
                    </v-progress-linear>
                    <v-list class=" lighten-1" dense>
                      <v-subheader 
                        v-if="!loading_rooms && getMyEnrolled && getMyEnrolled.length == 0">
                        No Election
                      </v-subheader>
                      
                      <v-list-item v-for="election in getMyEnrolled" 
                        :key="election.electionId"
                        @click="$store.dispatch('curRoom', election)">
                        <v-list-item-content>
                          <v-list-item-title class="grey--text darken-1">
                            {{election.title}}
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action v-if="curRoom && curRoom.electionId == election.electionId">
                          <v-icon color="success">mdi-check</v-icon>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                    <v-btn color="info" 
                      ripple text :loading="getting_enrolled"
                      class="ml-0 text-capitalize" 
                      small @click="initialize">
                      Refresh
                    </v-btn>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels> -->

            <v-list dense nav
              v-if="getUser">
        
              <v-list-item to="/home" exact >
                <v-list-item-action>
                  <v-icon color="teal">mdi-view-dashboard-outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Home</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <!-- FORUM -->
              <v-list-item to="/forum/d">
                <v-list-item-action>
                  <v-icon color="teal">mdi-forum-outline</v-icon>
                </v-list-item-action>
                <v-list-item-title>Forum</v-list-item-title>
              </v-list-item>

              <!-- Messages -->
              <v-list-group prepend-icon="mdi-message-text-outline" no-action :value="true">
                <v-list-item slot="activator">
                  <v-list-item-title>Messages</v-list-item-title>
                </v-list-item>
                <v-list-item @click="openBroadcastDialog">
                  <v-list-item-action>
                    <v-icon color="success">mdi-inbox</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Inbox</v-list-item-title>
                  <v-list-item-action v-show="getUnreadLength > 0">
                    <v-badge right color="red">
                      <span class="caption" slot="badge">{{getUnreadLength}}</span>
                    </v-badge>
                  </v-list-item-action>
                </v-list-item>

                <v-list-item @click="isSuperUser || isAdmin ? new_broadcast = true : upgrade = true" :disabled="!curRoom">
                  <v-list-item-action>
                    <v-icon color="">mdi-bullhorn</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>New Broadcast </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>

              <!-- ELECTIONS -->
              <v-list-group prepend-icon="mdi-poll-box" no-action :value="false">
                <v-list-item slot="activator">
                  <v-list-item-title>Elections</v-list-item-title>
                </v-list-item>
                <v-list-item  to="/elections/create">
                  <v-list-item-action>
                    <v-icon color="success">mdi-plus-box</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Create Election</v-list-item-title>
                </v-list-item>

                <v-list-item :to="curRoom ? `/elections/${curRoom.electionId}/vote` : '/#vote'">
                  <v-list-item-action>
                    <v-icon color="info">mdi-vote-outline</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Vote</v-list-item-title>
                </v-list-item>
                <v-list-item  to="/contest">
                  <v-list-item-action>
                    <v-icon color="">mdi-trophy</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Contest</v-list-item-title>
                </v-list-item>

              </v-list-group>
              
              <v-list-item to="/discover" exact >
                <v-list-item-action>
                  <v-icon color="teal">mdi-pound-box</v-icon>
                </v-list-item-action>
                <v-list-item-title>Discover</v-list-item-title>
              </v-list-item>

              <!-- HELP -->
              <v-list-item href="https://support.voteryte.com" target="blank">
                <v-list-item-action>
                  <v-icon color="grey">mdi-help-circle</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Help</v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar>
                  <v-icon small>mdi-open-in-new</v-icon>
                </v-list-item-avatar>
              </v-list-item>

              <v-divider></v-divider>

              <!-- NOT SUPERUSER -->
              <v-list-item v-if="!isSuperUser">
                <v-list-item-content>
                  <v-btn color="success" block @click="upgrade = true">
                    <v-icon color="secondary" class="mr-2">mdi-star</v-icon>
                    Upgrade</v-btn>
                </v-list-item-content>
              </v-list-item>

              <!-- <v-list-item v-if="isSuperUser" style="">
                <v-list-item-action>
                  <v-icon color="orange">mdi-flash-circle</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Premium User</v-list-item-title>
                  <small>You've got super powers!</small>
                </v-list-item-content>
              </v-list-item> -->
              
              <!-- Update available -->
              <v-list-item v-if="appUpdateAvailable" class="elevation-2 black" @click="updateApp">
                <v-list-item-action>
                  <v-icon color="orange">mdi-update</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="orange--text">Update Available</v-list-item-title>
                  <small>Click to refresh</small>
                </v-list-item-content>
              </v-list-item>
            
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
            <v-btn dark text @click="snackbar.show = false"> Close</v-btn>
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
              
        

          <!-- GALLERY VIEWER -->
          <gallery :images="images" :index="index" @close="index = null"></gallery>
          
          <!-- Broadcast Dialog -->
          <v-dialog v-model="broadcast_dialog" max-width="1000"
            :fullscreen="$vuetify.breakpoint.smAndDown" hide-overlay scrollable>
            <v-card flat class="pa-0">
              <v-card-text class="pa-0">
                <broadcast v-if="broadcast_dialog" style="min-height:300px;background:#fff;"></broadcast>
              </v-card-text>
            </v-card>
            
          </v-dialog>

          <!-- NEW MANIFESTO DIALOG -->
          <v-dialog v-model="new_manifesto_dialog" :fullscreen="$vuetify.breakpoint.xsOnly"
            max-width="800px" :transition="switchTransition" hide-overlay v-if="new_manifesto_dialog" scrollable>
            <v-card flat>
              <v-toolbar card dense flat>
                <v-btn text icon v-if="$vuetify.breakpoint.xsOnly"
                  @click="new_manifesto_dialog = false">
                  <v-icon>mdi-chevron-left</v-icon> 
                </v-btn>
                <span>Create a Manifesto</span>
                <v-spacer></v-spacer>
                <v-btn text icon @click="new_manifesto_dialog = false" class="hidden-xs-only">
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
          <v-dialog v-model="viewprofile" v-if="viewprofile" :style="styleObj"
            width="300" hide-overlay scrollable
            :transition="switchTransition">
            <v-card flat :class="{'round_top': $vuetify.breakpoint.smAndUp}">
              
              <v-card-text class="pa-0" :class="{'round_top': $vuetify.breakpoint.smAndUp}">
                <view-profile :user='voterprofile'  id="vprofile"></view-profile>
              </v-card-text>
            </v-card>
          </v-dialog>

          <profile-card></profile-card>

          <!-- GO PREMIUM -->
          <v-dialog v-model="upgrade" :persistent="procesing_payment"
            max-width="950px" :transition="switchTransition" content-class="round_top" >
            <v-card class="round_top" flat>
              <v-toolbar color="white" flat>
                <v-card-title primary-title class="pl-1 font-weight-bold title">
                  Upgrade To Premium
                </v-card-title>

                <v-spacer></v-spacer>
                <v-btn light icon :disabled="procesing_payment" @click="upgrade = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-row row wrap class="" justify="space-between">
                <v-col cols="12" sm="4">
                  <v-subheader class="black--text">
                    Voteryte premium gives you all the tools you need to rise above the competition
                  </v-subheader>
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
                      <div style="overflow: auto" class="mb-1">
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
                        <v-btn color="teal" dark block class="ml-2 text-capitalize" depressed :loading="procesing_payment">Upgrade Now</v-btn>
                      </paystack>
                    </v-card-actions>
                    <small class="ml-3">Cancel at any time</small> <br>
                    <v-btn color="secondary" 
                      style="text-transform: initial;margin-bottom: 15px;" 
                      small class="" target="blank" href="https://voteryte.com/contestants" 
                      text>
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
                </v-col>
                <v-col cols="0" sm="7" class="hidden-xs-only">
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
                </v-col>
              </v-row>
            </v-card>
          </v-dialog>

          <input type="file" name="file" class="d-none" id="file_img" style="visibility:hidden;position:absolute;" 
            @change="onFileSelect($event)" accept="image/jpeg,image/png/gif" multiple>

          <v-row row justify-center>

            <v-dialog v-model="switch_room_dialog" fullscreen persistent transition="fade-transition">
              
              <v-card style="height: 100%;" class="pa-5" color="rgba(0,0,0,0.8)">
                <v-container fluid fill-height>
                  <v-row align-center justify-center>
                    <v-col cols="12" sm="8" md="4">
                      <v-card flat color="transparent">
                        
                        <v-card-text>
                          
                          <p class="title text-center white--text">Switching Election</p>
                          <v-progress-circular indeterminate 
                            color="success" class="mx-auto d-block">

                          </v-progress-circular>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
          </v-row>
        </div>


      </transition>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () =>({
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
    reference: reference(), // Date.now() + btoa(Math.random()).substring(0,12),
    drawer: true,
    mini: false,
    drawer_right: false,
    drawer_right_persist: false,
    appUpdateAvailable: window.appUpdateAvailable
  }),
  components:{
    ProfileCard,
    LoadingBar,
    Broadcast,
    Navigation,
    NewManifesto,
    paystack,
    Gallery,
    NewBroadcast,
    // ManageElection,
    NewEvent,
    footr: Footer
  },

  watch: {
    'curRoom': function(to, from) {
      if(this.curRoom){

        this.switch_room_dialog = true

        setTimeout(()=>{
          this.switch_room_dialog = false
        }, 1000)
      }
    },
  },
  computed: {
    ...mapGetters([
      'getUser',
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
    async isAdmin(){
      let is_admin = false
      let admins = []

      if(this.curRoom){

        await this.$gun.get('elections')
          .get(this.curRoom.electionId)
          .get('admins').map().once((a,key) => {
            admins.push(a.username)
            // console.log(a)
          })
      }

      return this.curRoom ? admins.includes(this.getUser.username) : false
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
      return false
    },
  },
  
  methods:{
    async initialize () {
      //get dept elections in user dept
      // get fac elections in user fac
      // get sch elections in user school
      // populate myEnrolled with the retrieved elections

      // get elections user has enrolled in

      let elections = []
      // let el = this.$gun.get('elections').get('realize-refused')
      this.$gun.get(this.getUser.username)
        .get('enrolled')
        // .set(el)
        .map().on(data => {
          // console.log(data)
          elections.push(data)

        })
      
      this.getBroadcasts()

      let sorted = elections.sort((a,b) => b.dateCreated - a.dateCreated)
      this.$store.dispatch('setMyEnrolled', sorted)
      this.getting_enrolled = false

      // set current room if there is none

      this.curRoom ? '' : 
        sorted.length > 0 ? 
        this.$store.dispatch('curRoom', sorted[0]) : ''

      // this.getMessages()
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
    getBroadcasts(){
      
      try {

        let arr = []
        this.$gun.get(this.getUser.username)
          .get('enrolled')
          .map()
          .get('broadcasts')
          .map().on((broadcast, key) => {

            // console.log({broadcast, key})

            this.$gun.get(broadcast.author['#'])
            .once(a => {
              broadcast.author = a
            })

            arr.push(broadcast)

          })
          
          // console.log('broadcasts: ==>', {arr})
          this.$store.dispatch('setBroadcasts', arr)
          
      } catch (error) {
        // console.log(error)
      }
        
    },
    getMessages(){
      // get recent chats
      let chats = []
      if(this.curRoom){

        this.$gun.get('chat_messages')
          .get(this.curRoom.electionId)
          .map()
          .on(data => {
            this.$gun.get(data.author)
            .once(author => {
              data.author = author
              chats.push(data)
            })
            
          })
        chats.mutation = 'setChatMsgs'
        this.$store.dispatch('generalAction', chats)
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
        let user = this.getUser
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
        // this.drawer = !this.drawer
        this.mini = !this.mini
      })

      this.$eventBus.$on('Toggle_New_Broadcast', data=>{
        this.new_broadcast = data
      })
      

      this.$eventBus.$on('ToggleInboxDialog', data =>{
        this.broadcast_dialog = data
      })
      
      this.$eventBus.$on('OpenNewManifestoDialog', data=>{
        this.new_manifesto_dialog = true
      })
      this.$eventBus.$on('CloseNewManifestoDialog', data=>{
        this.new_manifesto_dialog = false
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
      this.$eventBus.$on('NewEvent', data => {
        this.drawer_right = data
      })


      // show loading animation for some seconds
      setTimeout(() => {
        this.show_loading_bar = false
      }, 1000);
      
      this.$eventBus.$on('Snackbar', data =>{
        this.snackbar = data
      })

    
    // firebase.auth().onAuthStateChanged(u => {

    //   let sessionTimeout = null

    //   if(u){
        
    //     firebase.auth().currentUser.getIdTokenResult()
    //     .then((idTokenResult) => {

    //       let user = idTokenResult.claims

    //       // user.phoneNumber = u.phoneNumber
    //       this.$store.dispatch('setUser', u)
    //       this.showUi = true
    //       this.getUser ? this.presenceWatcher() : ''
    //       this.getUserInfo ? this.setup() : ''
          

    //       let isSuperUser = idTokenResult.claims.superuser
    //       // let now = new Date().getTime()
    //       // let trial_expired = now > user.trial_expiry_date
          
    //       // console.log(user)
    //       if(isSuperUser){
            
    //         this.$store.dispatch('subscriberState', isSuperUser)
    //       }
    //       else{
            
    //         this.$store.dispatch('subscriberState', false)
    //       }

    //       this.$store.dispatch('verifiedState', user.is_verified)

    //       // User sessions should last for only 2 hours
    //       // Make sure all the times are in milliseconds!
    //       // const authTime = idTokenResult.claims.auth_time * 1000;
    //       // const sessionDuration = 1000 * 60 * 5;
    //       // const millisecondsUntilExpiration = sessionDuration - (Date.now() - authTime);
    //       // sessionTimeout = setTimeout(() => {

    //       //   this.$store.dispatch('sessionExpired')
            
    //       // }, millisecondsUntilExpiration);


    //       // let usr = idTokenResult.claims
    //       // console.log({user})
    //       // this.$LogRocket.identify(user.user_id, {
    //       //   name: user.name,
    //       //   email: user.email,
    //       //   isSuperUser: user.superuser,
    //       //   dept: user.dept
    //       // })

    //       // console.log(user)
    //       // show chat widget only on large screens
    //       // if(this.$vuetify.breakpoint.mdAndUp){

    //       //   this.initChatWidget(user)
    //       // }

    //       // window.fcWidget ? window.fcWidget.on("widget:closed", (resp)=>{
    //       //   // console.log('Widget Closed');
    //       //   // destroy the widget on close in small screen
    //       //   if(this.$vuetify.breakpoint.smAndDown){
    //       //     window.fcWidget.destroy()
    //       //   }
    //       // }) : ''

    //     })
    //     .catch((error) => {
    //       // console.log(error);
    //     });
    //   }
    //   else {
    //     // User is logged out.
    //     // Clear the session timeout.
    //     // sessionTimeout && clearTimeout(sessionTimeout);
    //     // sessionTimeout = null;
    //   }
    // })

    if(this.getUser){
      this.showUi = true
      this.initialize()
      this.$store.dispatch('verifiedState', true)
      this.$store.dispatch('subscriberState', true)
    }

    this.$vuetify.breakpoint.smAndDown ? 
      this.drawer = false : this.drawer = true
    
    this.$eventBus.$on('Change_Title', (data)=>{
      //console.log('changing the title')
      this.title = data
    })
  },
  async created(){
    
    // if(this.$store.state.session_expired){
    //   let to = this.$route.fullPath
    //   firebase.auth().signOut().then(() => this.$router.push(`/login?returnTo=${to}`))
    // }

  },
  beforeDestroy(){
    this.broadcastsRef ? this.broadcastsRef() : ''
  }
}

function reference(){
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( let i=0; i < 10; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

import { mapGetters, mapState } from 'vuex'
  import api from '@/services/api'
  import LoadingBar from '@/spinners/LoadingBar'
  import Broadcast from '@/components/Broadcast'
  import Navigation from '@/components/Navigation'
  import NewManifesto from '@/components/profile/NewManifesto'
  import paystack from 'vue-paystack'
  import Gallery from 'vue-gallery';
  import NewBroadcast from '@/components/dialogs/NewBroadcast'
  import NewEvent from '@/components/events/NewEvent'
  import ProfileCard from '@/components/ProfileCard'
  import Footer from '@/components/Footer'
  // import {firebase, db, database} from '@/plugins/firebase'
</script>

<style lang='scss' >

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

.round-1 {
  @include borderRadius(5px)
}

.round-2 {
  @include borderRadius(7px)
}

.round-3 {
  @include borderRadius(9px)
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

#pay_card {
  background: url('../assets/abstract.png');
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.online_badge{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 5px;
}

</style>
