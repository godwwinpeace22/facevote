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
                style="background-color:#1c1f35;color:bfbbbb;z-index:20" >
                <v-toolbar flat tile class="" style="background-color:rgba(51, 54, 78, 0.9);color:#fff;">
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
                            <v-icon color="success">check</v-icon>
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
                      <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Home</v-list-tile-title>
                  </v-list-tile>

                  <!-- FORUM -->
                  <v-list-tile :to="curRoom ? `/forum` : '/#forum'">
                    <v-list-tile-action>
                      <v-icon color="">forum</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Forum</v-list-tile-title>
                  </v-list-tile>

                  <!-- Messages -->
                  <v-list-group prepend-icon="message" no-action :value="true">
                    <v-list-tile slot="activator">
                      <v-list-tile-title>Messages</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="openBroadcastDialog">
                      <v-list-tile-action>
                        <v-icon color="success">mail</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Inbox</v-list-tile-title>
                      <v-list-tile-action v-show="getUnreadLength > 0">
                        <v-badge right color="red">
                          <span class="caption" slot="badge">{{getUnreadLength}}</span>
                        </v-badge>
                      </v-list-tile-action>
                    </v-list-tile>

                    <template v-if="isSuperUser || isAdmin">
                      <v-list-tile @click="new_broadcast = true" :disabled="!curRoom">
                        <v-list-tile-action>
                          <v-icon color="">record_voice_over</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>New Broadcast </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>

                    <template v-else>
                      <v-tooltip top>
                        <v-list-tile slot="activator">
                          <v-list-tile-action>
                            <v-icon color="">record_voice_over</v-icon>
                          </v-list-tile-action>
                          <v-list-tile-title>New Broadcast</v-list-tile-title>
                        </v-list-tile>
                        <span>This feature requires a premium account</span>
                      </v-tooltip>
                    </template>
                  </v-list-group>

                  <!-- ELECTIONS -->
                  <v-list-group prepend-icon="poll" no-action :value="false">
                    <v-list-tile slot="activator">
                      <v-list-tile-title>Elections</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile  to="/elections/create">
                      <v-list-tile-action>
                        <v-icon color="success">add_box</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Create Election</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile :to="curRoom ? `/elections/vote` : '/#vote'">
                      <v-list-tile-action>
                        <v-icon color="success">how_to_vote</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Vote</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile  to="/contest">
                      <v-list-tile-action>
                        <v-icon color="success">hdr_strong</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Contest</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile @click="new_manifesto_dialog = true" 
                      v-if="isSuperUser && curRoom"
                      :disabled="!isContestant">
                        <v-list-tile-action>
                          <v-icon color="success">add_box</v-icon>
                        </v-list-tile-action>
                      <v-list-tile-title>New Manifesto </v-list-tile-title>
                    </v-list-tile>


                    <v-tooltip right v-if="!isSuperUser">
                      <v-list-tile disabled slot="activator">
                        <v-list-tile-action>
                          <v-icon color="success">add_box</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>New Manifesto</v-list-tile-title>
                      </v-list-tile>
                      <span>This feature requires a premium account</span>
                    </v-tooltip>

                    <v-tooltip right v-if="isAdmin">
                      <v-list-tile @click="show_manager = !show_manager" slot="activator">
                        <v-list-tile-action>
                          <v-icon color="success">build</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>Manage Election</v-list-tile-title>
                      </v-list-tile>
                      <span>Manage Election</span>
                    </v-tooltip>
                  </v-list-group>
                  
                  <v-list-tile to="/verify" exact >
                    <v-list-tile-action>
                      <v-icon color="success">verified_user</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Verify Account</v-list-tile-title>
                  </v-list-tile>

                  <!-- SETTINGS -->
                  <v-list-tile  @click="$eventBus.$emit('show_profile_settings')">
                    <v-list-tile-action>
                      <v-icon color="success">settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Settings</v-list-tile-title>
                  </v-list-tile>

                  <!-- HELP -->
                  <v-list-group prepend-icon="help" no-action>
                    <v-list-tile slot="activator">
                      <v-list-tile-title>Help</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile href="https://voteryte.com/faq" target="blank">
                      <v-list-tile-action>
                        <v-icon color="success">info</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>FAQ</v-list-tile-title>
                    </v-list-tile>

                      <v-list-tile href="https://voteryte.freshdesk.com" target="blank">
                        <v-list-tile-action>
                          <v-icon color="grey">live_help</v-icon>
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
                        <v-icon color="secondary" class="mr-2">star</v-icon>
                        Upgrade</v-btn>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile avatar v-if="isSuperUser" style="background: #2f324a;">
                    <v-list-tile-action>
                      <v-icon color="orange">flash_on</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>SuperUser</v-list-tile-title>
                      <small>You've got super powers!</small>
                    </v-list-tile-content>
                  </v-list-tile>
                
                </v-list>
              </v-navigation-drawer>

              <!-- SNACKBAR -->
              <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" top right>
                {{snackbar.message}}
                <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
              </v-snackbar>
              
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
                <private-msg-list v-if="broadcast_dialog" style="min-height:300px;background:#fff;"></private-msg-list>
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
                  <v-icon>chevron_left</v-icon> 
                </v-btn>
                <span>Create a Manifesto</span>
                <v-spacer></v-spacer>
                <v-btn flat icon @click="new_manifesto_dialog = false" class="hidden-xs-only">
                  <v-icon>close</v-icon>
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
                  <v-icon>close</v-icon>
                </v-btn>
              </v-toolbar>

              <v-card-text class="pa-0">
                <manage-election v-if="isAdmin"/>
              </v-card-text>
            </v-card>
          </v-dialog>

          <!-- PAYMENTS -->
          <v-dialog v-model="upgrade" lazy :persistent="procesing_payment"
            max-width="500px" :transition="switchTransition" content-class="round_top" >
            <v-card class="round_top" flat>
              
              <v-subheader class="title">Get Premium</v-subheader>

              <v-card-text class="lighten-3">
                <div>Upgrade your account and have the ability to create posts, campaigns, election manifestos, and much more. Get SuperPowers!</div>
                <div class="mt-2"><strong>Amount</strong>: ₦ 5,000 per month</div>
                <v-btn color="secondary" 
                  style="text-transform: initial;" 
                  small class="px-0 ml-0" target="blank" href="https://voteryte.com/pricing.php" 
                  flat>
                  <span style="text-decoration: underline;">See plan details</span>
                  <v-icon small>open_in_new</v-icon>
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

              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="" class="mr-2" depressed :disabled="procesing_payment" @click="upgrade = false">
                  Cancel
                </v-btn>
                <paystack
                  :amount="plan.amount * 100"
                  :email="getUser.email"
                  :metadata="metadata"
                  :paystackkey="plan.paystack_key"
                  :reference="reference"
                  :callback="verifyTxn"
                  :close="onclose"
                  :embed="false"
                >
                  <v-btn color="success" :loading="procesing_payment">Upgrade</v-btn>
                </paystack>
                
              </v-card-actions>
            </v-card>
          </v-dialog>

          <input type="file" name="file" id="file_img" style="visibility:hidden;position:absolute;" 
            @change="onFileSelect($event)" accept="image/jpeg,image/png/gif" multiple>

          <v-layout row justify-center>
            <v-dialog v-model="switch_room_dialog" persistent max-width="290" content-class="switch_room_dialog">
              
              <v-card style="height: 150px;" class="pa-5">
                <p class="title text-xs-center">Switching Election</p>
                <v-progress-circular indeterminate 
                  color="primary lighten-3" class="mx-auto d-block">

                </v-progress-circular>
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
    show_private_chat_window: false,
    broadcast_dialog: false,
    fetching_enrolled: true,
    snackbar: {},
    new_manifesto_dialog: false,
    plan: {
      title: 'SuperUser',
      amount: 5000,
      paystack_key:'pk_test_cd14c065dfe123cd983362a4ed795fe1128ec4e2',
    },
    reference: Date.now() + btoa(Math.random()).substring(0,12),
    drawer: true,
  }),
  components:{
    ViewProfile,
    LoadingBar,
    PrivateMsgList,
    Navigation,
    NewManifesto,
    paystack,
    Gallery,
    NewBroadcast,
    ManageElection
  },

  watch: {
    'curRoom': function(to, from) {
      this.curRoom ? this.getBroadcasts() : ''

      this.switch_room_dialog = true
      setTimeout(()=>{
        this.switch_room_dialog = false
      }, 1000)
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
      'loading_rooms'
      
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
    metadata: function(){
      return {
        plan_type: this.plan.title,
        orderid: this.reference,
        custom_fields: [
          {
            display_name: "Plan_type",
            variable_name: "plan",
            value: 'SuperUser'
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
    tryPremium(){
      this.procesing_payment = true

      return firebase.auth().currentUser.getIdToken()
      .then(async (token)=>{
        return api().post('dashboard/trypremium', {
          idToken: token
        }).then(res=>{
          // transaction is ok
          firebase.auth().currentUser.getIdToken(true).then(idToken=>{
            
          })

          // TODO: SEND EMAIL TO USER ON SUBSCRIPTION

          this.snackbar = {
            show: true,
            message: 'Account upgraded successfully',
            color: 'success'
          }
          this.procesing_payment = false
          this.upgrade = false
          setTimeout(() => {
            window.location.reload()
          }, 2000);
          
        }).catch(error=>{
          this.procesing_payment = false
          $NProgress.done()

          this.snackbar = {
            show: true,
            message: error.response ? error.response.data.message : 'Transaction failed',
            color: 'error'
          }
        })
        
      })
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
        return api().post('dashboard/verifyTxn', {
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
        })
        
      })
      
    },
    truncateText(text){
      return text ? text.replace(/(.{18})..+/, "$1...") : '';
    },
    logout(){
      this.$store.dispatch('logout')
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
          console.log(error)
        }
        
      }
    },
  },
  async mounted(){
    document.getElementById('welcome_logo').style.display = 'none'

    this.$eventBus.$on('Toggle_Left_Drawer', data=>{
      this.drawer = !this.drawer
    })

    this.$eventBus.$on('Toggle_New_Broadcast', data=>{
      this.new_broadcast = data
    })
    
    if(this.curRoom){
      this.getBroadcasts()
    }

    this.$eventBus.$on('Open_Private_Chat_Window', (data)=>{
      this.broadcasts = data
      this.show_private_chat_window = true
      this.show_private_msg_list = false
    })

    this.$eventBus.$on('ToggleInboxDialog', data =>{
      this.broadcast_dialog = data
    })

    this.$eventBus.$on('Close_Private_Chat_Window', ()=>{
      this.show_private_chat_window = false
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
    // show loading animation for some seconds
    setTimeout(() => {
      this.show_loading_bar = false
    }, 1000);
    
    this.$eventBus.$on('Snackbar', data =>{
      this.snackbar = data
    })

  
   
    firebase.auth().onAuthStateChanged(u => {
      if(u){
        // console.log(u)
        firebase.auth().currentUser.getIdTokenResult()
        .then((idTokenResult) => {

          let user = idTokenResult.claims

          // user.phoneNumber = u.phoneNumber
          this.$store.dispatch('setUser', u)
          this.showUi = true
          this.getUser ? this.presenceWatcher() : ''
          this.getUserInfo ? this.setup() : ''
          
          // console.log(idTokenResult.claims)

          let state = idTokenResult.claims.superuser
          let on_trial = user.trial
          let tstamp = user.timestamp
          let one_month = 30 * 24 * 60 * 60 * 1000
          let two_weeks = 14 * 24* 60 * 60 * 1000
          let now = new Date().getTime()
          let time_spent = now - tstamp
          
          // console.log(time_spent/(1000*60*60*24*30))
          if(on_trial && time_spent <= two_weeks){
            // user is on premium trial
            this.$store.dispatch('subscriberState', state)
          }
          else if(!on_trial && time_spent <= one_month){
            // user is on premium subscription
            this.$store.dispatch('subscriberState', state)
          }

          this.$store.dispatch('verifiedState', user.is_verified)

          // let usr = idTokenResult.claims
          // console.log({user})
          this.$LogRocket.identify(user.user_id, {
            name: user.name,
            email: user.email,
            isSuperUser: user.superuser,
            dept: user.dept
          })

          // console.log(user)
          
          window.fcWidget.init({
            token: "3402f5b8-1e86-4016-bad3-bb1b79d386d3",
            host: "https://wchat.freshchat.com"
          });
          
          window.fcWidget.setExternalId(u.uid);
          window.fcWidget.user.setEmail(u.email);
          window.fcWidget.user.setProperties({
            name: u.displayName,
            is_superuser: user.superuser,
            is_verified: user.is_verified
          });

        })
        .catch((error) => {
          // console.log(error);
        });
      }
    })
  

    this.$vuetify.breakpoint.smAndDown ? this.drawer = false : this.drawer = true
    
    this.$eventBus.$on('Change_Title', (data)=>{
      //console.log('changing the title')
      this.title = data
    })
  },
  async created(){

  },
  beforeDestroy(){
    this.broadcastsRef ? this.broadcastsRef() : ''
  }
}

import { mapGetters, mapState } from 'vuex'
  import api from '@/services/api2'
  import ViewProfile from '@/components/ViewProfile'
  import LoadingBar from '@/spinners/LoadingBar'
  import PrivateMsgList from '@/components/PrivateMsgList'
  // import PrivateChatWindow from '@/components/PrivateChatWindow'
  import Navigation from '@/components/Navigation'
  import NewManifesto from '@/components/profile/NewManifesto'
  import paystack from 'vue-paystack'
  import Gallery from 'vue-gallery';
  import NewBroadcast from '@/components/NewBroadcast'
  import ManageElection from '@/components/ManageElection'
  import {firebase, db, database} from '@/plugins/firebase'
  // import ViewBroadcasts from '@/components/ViewBroadcasts'
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' >
@import url('https://unpkg.com/nprogress@0.2.0/nprogress.css');
@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons');

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;

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

.v-dialog--active{
  @include borderTopRadius(10px)
}

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
  background: url('../assets/girl.png');
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

.emoji-mart-bar{
  background: #ececec;
}
.emoji-mart-scroll{
  overflow-x: hidden;
}

.theme--light.v-text-field--outline .v-input__slot {
  border: 1px solid rgba(115, 114, 114, 0.54) !important;
}
.v-content{
  background:#eceff1;
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
    @include borderRadius(10px)
  }
.navdrawr::-webkit-scrollbar-track, .emoji-mart-scroll::-webkit-scrollbar-track {
  background-color: white;
  // @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>
