<template>
  <v-app id="inspire">
    <v-content>
      <v-layout >
        <v-flex>
          <vue-headful :title="title"/>

          <v-navigation-drawer fixed v-model="drawer" app dark width="230" class='navdrawr' 
            style="background-color:#1c1f35;color:bfbbbb;z-index:20" >
            <v-toolbar flat tile class="" style="background-color:rgba(51, 54, 78, 0.9);color:#fff;">
              <v-toolbar-title>Facevote</v-toolbar-title>
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
                    <small class="grey--text darken-1">Swicth election</small>
                  </div>
                </template>
                <v-card >
                  <v-list class="main lighten-1" dense>
                    <v-subheader v-if="getMyEnrolled && getMyEnrolled.length == 0">No Election</v-subheader>
                    <v-list-tile v-for="election in getMyEnrolled" :key="election.electionId"
                      @click="$store.dispatch('curRoom', election)">
                      <v-list-tile-title class="text-truncate grey--text darken-1">
                        {{election.title}}
                      </v-list-tile-title>
                      <v-list-tile-action v-if="curRoom && curRoom.electionId == election.electionId">
                        <v-icon color="success">check</v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-list dense style="background-color:#1c1f35;color:bfbbbb;padding-top:0;" v-if="getUser" class="home_list">
        
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
                <v-list-tile @click="show_private_msg_list = true">
                  <v-list-tile-action>
                    <v-icon color="success">mail</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>Inbox</v-list-tile-title>
                  <v-list-tile-action v-if="no_of_unread_msgs > 0">
                    <v-badge right color="red">
                      <span class="caption" slot="badge">{{no_of_unread_msgs}}</span>
                    </v-badge>
                    <!-- <span class="red px-2 round">new</span> -->
                  </v-list-tile-action>
                </v-list-tile>

                <template v-if="isSuperUser">
                  <v-list-tile @click="new_broadcast = true" :disabled="!isSuperUser">
                    <v-list-tile-action>
                      <v-icon color="">record_voice_over</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>New Broadcast</v-list-tile-title>
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
                <v-list-tile @click="new_manifesto_dialog = true" v-if="isSuperUser">
                    <v-list-tile-action>
                      <v-icon color="success">add_box</v-icon>
                    </v-list-tile-action>
                  <v-list-tile-title>New Manifesto</v-list-tile-title>
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
              </v-list-group>
              
              <v-list-tile :to="menu.link" exact v-for="menu in navmenus" :key="menu.icon">
                <v-list-tile-action>
                  <v-icon :color="menu.icon_color">{{menu.icon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>{{menu.title}}</v-list-tile-title>
              </v-list-tile>

              <!-- SETTINGS -->
              <v-list-tile  @click="$eventBus.$emit('show_profile_settings')">
                <v-list-tile-action>
                  <v-icon color="success">settings</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>Settings</v-list-tile-title>
              </v-list-tile>

              <!-- HELP -->
              <v-list-tile to='#2'>
                <v-list-tile-action>
                  <v-icon color="success">help</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>Help</v-list-tile-title>
              </v-list-tile>

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

          <!-- FAB -->
          <v-speed-dial v-model="fab" fixed bottom
            right direction="top" open-on-hover
            transition="slide-y-reverse-transition" v-if="$vuetify.breakpoint.xsOnly">
            
            <v-btn slot="activator" v-model="fab"
              color="orange" dark fab>
              <v-icon large>how_to_vote</v-icon>
            </v-btn>

            <v-btn fab dark small color="green" @click.stop="$router.push(`/elections/watch/${curRoom.electionId}`)">
              <v-icon>how_to_vote</v-icon>
            </v-btn>
            <v-btn fab dark small color="indigo" @click.stop="$router.push(`/forum/${curRoom.electionId}`)">
              <v-icon>forum</v-icon>
            </v-btn>
            <v-btn fab dark small color="red">
              <v-icon>add</v-icon>
            </v-btn>
          </v-speed-dial>
          
          <router-view v-if="!show_loading_bar"></router-view>
          <loading-bar v-if="show_loading_bar" color="grey"></loading-bar>
    
        </v-flex>
      </v-layout>
      
      <!-- GALLERY VIEWER -->
      <gallery :images="images" :index="index" @close="index = null"></gallery>
      
      <!-- PRIVATE MESSAGE LIST -->
      <v-dialog v-model="show_private_msg_list" max-width="500" min-width="300" 
        :fullscreen="$vuetify.breakpoint.smAndDown">
        <v-toolbar color="teal" dark dense>
          <v-toolbar-title>Inbox</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="show_private_msg_list = !show_private_msg_list">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <private-msg-list v-if="show_private_msg_list" style="min-height:300px;background:#fff;"></private-msg-list>
      </v-dialog>

      <!-- PRIVATE CHAT WINDOW -->
      <!-- <v-dialog v-model="show_private_chat_window" hide-overlay :max-width="$vuetify.breakpoint.smOnly ? 500 : 400" 
        :fullscreen="$vuetify.breakpoint.xsOnly">
        <private-chat-window v-if="show_private_chat_window" :user='chat_user'></private-chat-window>
      </v-dialog> -->

      <!-- NEW MANIFESTO DIALOG -->
    <v-dialog v-model="new_manifesto_dialog" lazy :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="800px" transition="slide-x-reverse-transition">
      <v-toolbar dense flat>
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
      <new-manifesto />
    </v-dialog>
    
    <!-- NEW BROADCASTs -->
    <new-broadcast v-if="new_broadcast" ></new-broadcast>

    <!-- VIEW BROADCAST -->
    <v-dialog v-model="show_private_chat_window" scrollable v-if="show_private_chat_window" max-width="500px" 
      lazy>
      <v-card class="grey lighten-3">
        <v-toolbar card dense flat dark class="teal">
          <v-avatar size="36" :color="$helpers.colorMinder(broadcasts.user.name.charAt(0))">
            <img v-if="broadcasts.user.photoURL" :src="broadcasts.user.photoURL" :alt="broadcasts.user.name">
            <span v-else>{{broadcasts.user.name.charAt(0)}}</span>
          </v-avatar>

          <v-toolbar-title>{{broadcasts.user.name}}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn flat icon @click="$eventBus.$emit('Close_Private_Chat_Window', '')">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="min-height: 300px;">
           <view-broadcasts :broadcasts="broadcasts"></view-broadcasts>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- VIEW PROFILE -->
    <v-dialog v-model="viewprofile" v-if="viewprofile" lazy :style="styleObj"
      :fullscreen="$vuetify.breakpoint.xsOnly" width="300" hide-overlay scrollable
        :transition="$vuetify.breakpoint.xsOnly ? 'slide-x-reverse-transition' : 'dialog-transition'">
      <v-card flat>
        <v-toolbar card dense dark color="teal" scroll-target="vprofile">
          <v-btn flat icon class="hidden-sm-and-up" @click="viewprofile = false">
            <v-icon>chevron_left</v-icon>
          </v-btn>

          <v-toolbar-title>Profile</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="viewprofile = false" class="hidden-xs-only">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <view-profile :user='voterprofile'  id="vprofile"></view-profile>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- PAYMENTS -->
    <v-dialog v-model="upgrade" lazy :persistent="procesing_payment"
      max-width="600px" transition="dialog-transition" content-class="round_top" >
      <v-card class="round_top" flat>
        <v-card-title primary-title class="title secondary white--text">
          Upgrade Account
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, unde iure, quas aliquam quaerat atque
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, unde iure, quas aliquam quaerat atque
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, unde iure, quas aliquam quaerat atque

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
      @change="onFileSelect($event)" accept="image/jpeg,image/png" multiple>
      <!--v-navigation-drawer right temporary v-model="right" fixed></v-navigation-drawer-->
    </v-content>
  </v-app>
</template>

<script>
export default {
  data:()=>({
    title:'Dashboard | Facevote',
    fab:false,
    index: null, // for image gallery viewer
    images: [], // for image gallery viewer
    menu:true,
    show_loading_bar:true,
    new_broadcast: false,
    broadcasts: '',
    timestamp: Date.now(),
    upgrade: false,
    procesing_payment: false,
    viewprofile: false,
    voterprofile: {},
    show_private_chat_window:false,
    show_private_msg_list:false,
    fetching_enrolled:true,
    snackbar:{},
    new_manifesto_dialog: false,
    plan: {
      title: 'SuperUser',
      amount: 5000,
      // plan_code: 'PLN_o4nm592fy4796k9',
      paystack_key:'pk_test_fefaa0524871e5ff35d4ec861974c59197cb42e7',
    },
    navmenus:[
      //{title:'Notifications', icon:'notifications', link:"#"},
      //{title:'Forum', icon:'forum', link:'/forum'},
      {title:'Enroll', icon:'fingerprint', link:'/enroll'},
      {title:'Verify Account', icon:'verified_user', link:'/verify',icon_color:'success'},
    ],
    reference: Date.now() + btoa(Math.random()).substring(0,12),
    drawer:true,
  }),
  components:{
    ViewProfile,
    LoadingBar,
    PrivateMsgList,
    PrivateChatWindow,
    Navigation,
    NewManifesto,
    paystack,
    Gallery,
    NewBroadcast,
    ViewBroadcasts
  },
  computed: {
    // Mix your getter(s) into computed with the object spread operator
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getRecentBroadcasts',
      'getMyEnrolled',
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
      'curRoomId',
      'no_of_unread_msgs'
    ]),
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
    
    // myContests(){
    //   // get user contests from his enrolled elections
    //   return this.getMyEnrolled.filter(election =>{
    //     return election.contestants.indexOf(this.getUser.uid) != -1
    //   })
    // }
  },
  
  methods:{
    onScroll (e) {
      console.log(e.target.scrollTop)
    },
    setCurRoom(rooms){
      // SETS THE DEFAULT OR CURRENT ROOM/ELECTION
      // let dirty = this.curRoom ? this.curRoom.electionId != room.electionId : true

      let found = rooms.find(room => room.electionId == this.curRoomId)
      if(found){
        // why? bcs malicious user can change room from localstorage (bcs its persisted).
        // So we need to check if that room is actually valid (if it exists or user has access to it)
        this.$store.dispatch('curRoom', found)
      }else{
        // either room not set or modified and not matching any valid room
        this.$store.dispatch('curRoom', rooms[0])
      }
      
      
      // dirty ? window.location.reload() : ''
    },
    verifyTxn(data){
      // verfy on the server that the transaction is ok
      this.procesing_payment = true
      return firebase.auth().currentUser.getIdToken()
      .then(async (token)=>{
        return api().post('dashboard/verifyTxn', {
          token,
          reference:data.reference,
          amount:this.plan.amount * 100,
          upgrade_user: true
        }).then(res=>{
          // transaction is ok
          firebase.auth().currentUser.getIdToken(true).then(idToken=>{
            console.log(idToken)
            function b64DecodeUnicode(str) {
              return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
                  var code = p.charCodeAt(0).toString(16).toUpperCase();
                  if (code.length < 2) {
                      code = '0' + code;
                  }
                  return '%' + code;
              }));
            }
            const payload = JSON.parse(b64DecodeUnicode(idToken.split('.')[1]));
            console.log(payload)
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
          //this.creating_election_dialog = false;
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
          file.type == 'image/jpg' || file.type == 'image/png'){
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

      const usersRef = db.collection('moreUserInfo'); // Get a reference to the Users collection;
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
    pUnreadMsgs(){
      db.collection('private_conversations')
      .where('reciever','==',this.getUser.uid).where('status','==','unread')
      .onSnapshot(snapshot=>{
        let msgs = []
        snapshot.forEach(doc=>{
          msgs.push(doc.data())
        })
      
        this.$store.dispatch('pUnreadMsgs', msgs)
        //console.log(msgs)
      })
    },
    getBroadcasts(){
      return new Promise((resolve, reject)=>{
        if(this.curRoom){

          return db.collection('broadcasts')
          .where('elecRef', '==', this.curRoom.electionId)
          .onSnapshot(docs =>{
            let d = []
            docs.forEach(doc =>{
              doc.data().by != this.getUser.uid ?
              d.push(doc.data()) : ''
            })
            this.$store.dispatch('setBroadcasts', d)
            console.log(d)
          }, error => console.log(error))
        }
        else{
          
        }
      })
    },
    userDetails(){
      return new Promise((resolve,reject)=>{
        db.collection('moreUserInfo').doc(this.getUser.uid).get()
        .then(doc=>{
          // console.log(doc.data())
          this.$store.dispatch('setUserInfo',doc.data())
          resolve(doc.data())
        }).catch(err => reject(err))
      })
      
    },
    async myEnrolled(user){
      // console.log(this.getUserInfo)
      this.userDetails().then(async userInfo =>{
        // console.log(userInfo.enrolled)
        this.fetching_enrolled = true
        let arr = []
        for(const electionId of userInfo.enrolled){
          // console.log(electionId)
          let p = await db.collection('elections').doc(electionId).get()
          arr.push(p.data())
        }
        this.$store.dispatch('setMyEnrolled', arr.sort((a,b)=> b.dateCreated - a.dateCreated))

        this.fetching_enrolled = false

        // set current room if there is none (and if there are rooms to set)
        if(this.getMyEnrolled && this.getMyEnrolled.length > 0){
          this.setCurRoom(this.getMyEnrolled)
          // console.log('setting current room by force')
        }
        if(this.curRoom){
          this.getBroadcasts()
        }
        // console.log(arr)
        return arr
      })
      
    }
  },
  async mounted(){
    //console.log(firebase.firestore.FieldValue.serverTimestamp().seconds)
    document.getElementById('welcome_logo').style.display = 'none'

    this.$eventBus.$on('Toggle_Left_Drawer', data=>{
      this.drawer = !this.drawer
    })
    
    
    this.$eventBus.$on('Open_Private_Chat_Window', (data)=>{
      this.broadcasts = data
      this.show_private_chat_window = true
      this.show_private_msg_list = false
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

    this.$eventBus.$on('bdialog', ()=> this.new_broadcast = false)
    // show loading animation for some seconds
    setTimeout(() => {
      this.show_loading_bar = false
    }, 2500);
    
    this.$eventBus.$on('Snackbar', data =>{
      this.snackbar = data
    })
   
  //  firebase.auth().currentUser.getIdToken()
  //   .then(async (token)=>{
  //     api().post('dashboard/downgradeUser', {token: token}).then(data =>{
    
  //       firebase.auth().currentUser.getIdToken(true).then(idToken=>{
  //         console.log(idToken)
  //         function b64DecodeUnicode(str) {
  //           return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
  //               var code = p.charCodeAt(0).toString(16).toUpperCase();
  //               if (code.length < 2) {
  //                   code = '0' + code;
  //               }
  //               return '%' + code;
  //           }));
  //         }
  //         const payload = JSON.parse(b64DecodeUnicode(idToken.split('.')[1]));
  //         console.log(payload)
  //       })
  //       console.log(data)
  //     }).catch(err => console.log(err))
  //   })

  // api().post('dashboard/listAllUsers').then(data=>{
  //   console.log(data)
  // }).catch(err => console.log(err))
   
  },
  async created(){

    firebase.auth().onAuthStateChanged(async (user)=>{
      if (user) {
        // User is signed in.
        this.$store.dispatch('setUser', user)
        
        // this.myEnrolled(user)
        this.presenceWatcher()
        this.getBroadcasts()

      } else {
        this.$store.dispatch('logout')
        // eslint-disable-next-line
        // console.log('No user is signed in.')
      }
    });

    firebase.auth().currentUser.getIdTokenResult()
    .then((idTokenResult) => {
      
      console.log(idTokenResult.claims)
      let state = idTokenResult.claims.superuser
      this.$store.dispatch('subscriberState', state)
      
    })
    .catch((error) => {
      console.log(error);
    });
    this.$vuetify.breakpoint.smAndDown ? this.drawer = false : this.drawer = true
    
    this.$eventBus.$on('Change_Title', (data)=>{
      //console.log('changing the title')
      this.title = data
    })

  }
}

import { mapGetters, mapState } from 'vuex'
  import api from '@/services/api'
  import ViewProfile from '@/components/ViewProfile'
  import LoadingBar from '@/spinners/LoadingBar'
  import PrivateMsgList from '@/components/PrivateMsgList'
  import PrivateChatWindow from '@/components/PrivateChatWindow'
  import Navigation from '@/components/Navigation'
  import NewManifesto from '@/components/profile/NewManifesto'
  import paystack from 'vue-paystack'
  import Gallery from 'vue-gallery';
  import NewBroadcast from '@/components/NewBroadcast'
  import ViewBroadcasts from '@/components/ViewBroadcasts'
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' >
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

.v-dialog--fullscreen{
  background:#fff !important;
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
