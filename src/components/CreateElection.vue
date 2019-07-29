<template>
  <div>
    <vue-headful :title="title" :description="description"/>
    <navigation>
      <span slot="title">Create Election</span>
    </navigation>

    <v-snackbar v-model="snackbar.show" dark :timeout="5000" :color="snackbar.color" top right>
      {{snackbar.message}}
      <v-btn dark color="white" flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <v-container  :pa-0="$vuetify.breakpoint.xsOnly">
      <v-card :class="{round: $vuetify.breakpoint.smAndUp}">
        <v-stepper v-model="e6" class="white">
          <v-stepper-header :class="{'grey lighten-3':$vuetify.breakpoint.smAndUp, teal: $vuetify.breakpoint.xsOnly}">
            <v-stepper-step :complete="e6 > 1" step="1">
              Election info
              <small>General information about the election</small>
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e6 > 2" step="2">Add a Schedule</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e6 > 3" step="3">Add Roles</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e6 > 4" step="4">Select Voter Size</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e6 > 5" step="5">Done</v-stepper-step>
          </v-stepper-header>
        
          <v-stepper-items :style="style1">

            <v-stepper-content step="1">
              <v-layout>
                <v-flex xs12 sm10>
                  <v-card class="mb-5 ma-2" flat light>
                    <!-- <v-card-text class="pl-0">{{text}}
                      <v-divider></v-divider>
                    </v-card-text> -->
                    
                    <v-layout row wrap class="mb-3">
                      <v-flex xs12 sm4>
                        <v-subheader class="pl-0 font-weight-bold">Title of Election</v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field color="secondary"
                          :rules="[rules.counter]" label="Title" outline 
                          v-model="form.title" maxlength="100" counter small
                          hint="e.g NAPPS Elections 2019">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap class="mb-3">
                      <v-flex xs12 sm4>
                        <v-subheader class="pl-0 font-weight-bold">Election Type</v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-select required
                          v-model="form.type" outline
                          :items="electionTypes"
                          item-text="text"
                          item-value="text"
                          :disabled="electionTypes.disabled && form.type == 'School' && !getUser.is_student"
                          color="secondary"
                          label="Election type"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap v-if="form.type == 'School'" class="mb-3">
                      <v-flex xs12 sm4>
                        <v-subheader class="pl-0 font-weight-bold">Your institution</v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field required outline disabled
                          v-model="form.school"
                          color="secondary"
                          label="School or College"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap class="mb-3" v-if="form.type == 'School' || form.type == 'Government'">
                      <v-flex xs12 sm4>
                        <v-subheader class="pl-0 font-weight-bold">Election level</v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-select required outline v-model="form.level" 
                          :items="form.type == 'School' ? levels[0]: levels[1]"  color="secondary" label="Level" >
                        </v-select>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap v-if="form.type == 'School' && (form.level == 'Faculty' || form.level == 'Department')" class="mb-3">
                      <v-flex xs12 sm4>
                        <v-subheader class="pl-0 font-weight-bold">Election Faculty</v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field required small v-model="form.faculty" disabled
                          outline color="secondary" label="Your faculty">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap v-if="form.type == 'School' && form.level == 'Department'" class="mb-3">
                      <v-flex xs12 sm4>
                        <v-subheader class="pl-0 font-weight-bold">Election Department</v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field required small outline disabled
                          v-model="form.department"
                          color="secondary"
                          label="Your department"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
              </v-layout>
              <div>
                
              </div>
              <template v-if="!is_verified">
                <v-btn color="error" to="/verify">
                  Verify your Account <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
                <small class="d-block ml-2">Verify your account before you can create elections</small>
              </template>

              <v-btn color="success" @click="e6 = 2" v-if="!disabled_step_one">
                Next step <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-layout>
                <v-flex xs12 sm8>
                  <v-card class="mb-5 mr-1 ml-1 mt-3 pa-3 grey lighten-3 round" light>
                    <!--schedule elections --> 
                    <v-layout row >
                      <v-flex sm10 ><v-subheader class="title secondary--text">Schedule Election</v-subheader></v-flex>
                      <v-flex sm2 style="padding-bottom:0px;">
                        <v-switch value v-model="form.timed" readonly color="success"></v-switch>
                      </v-flex>
                    </v-layout>
                    <v-divider v-show="form.timed"></v-divider>
                    <v-layout row wrap v-show="form.timed">
                      <v-flex xs12 sm4>
                        <div>
                          <v-tooltip right max-width="300" dark class="d-inline-block mt-3">
                            <v-icon slot="activator" small>mdi-help-circle-outline</v-icon>
                            <span>When the election should start</span>
                          </v-tooltip>
                          <v-subheader class="font-weight-bold d-inline-block">Start time</v-subheader>
                        </div>
                      </v-flex>
                      <v-flex xs6 sm4 :class="$vuetify.breakpoint.xsOnly ? ['px-2'] : ''">
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.date"
                          persistent lazy full-width width="290px" >

                          <v-text-field :disabled="!form.timed" slot="activator" color="secondary" v-model="form.date"
                            label="Date" readonly>
                            <v-icon color="secondary" slot="prepend-inner">mdi-calendar</v-icon>
                          </v-text-field>
                          <v-date-picker v-model="form.date" scrollable :allowed-dates="allowedDates" header-color="secondary">
                            <v-spacer></v-spacer>
                            <v-btn flat   @click="modal = false">Cancel</v-btn>
                            <v-btn flat small outline color="success" @click="$refs.dialog.save(form.date)">OK</v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-flex>

                      <v-flex xs6 sm4 :class="$vuetify.breakpoint.xsOnly ? ['mr-0','px-2'] : ['px-2']">
                        
                        <v-dialog ref="dialog2" v-model="modal2" :return-value.sync="form.time"
                          persistent lazy full-width width="290px" >

                          <v-text-field  slot="activator" v-model="form.time"  label="Time" color="secondary" readonly >
                            <v-icon color="secondary" slot="prepend-inner">mdi-clock</v-icon>
                          </v-text-field>
                          <v-time-picker v-if="modal2" format="ampm" v-model="form.time" header-color='secondary'>
                            <v-spacer></v-spacer>
                            <v-btn flat  @click="modal2 = false">Cancel</v-btn>
                            <v-btn flat color="success" outline @click="$refs.dialog2.save(form.time)">OK</v-btn>
                          </v-time-picker>
                        </v-dialog>
                      </v-flex>
                    </v-layout>
                    <v-divider v-show="form.timed"></v-divider>
                    <!-- duration -->
                    <v-layout row v-show="form.timed">
                      <v-flex sm4>
                        <v-tooltip right max-width="300" dark class="d-inline-block mt-3">
                          <v-icon slot="activator" small>mdi-help-circle-outline</v-icon>
                          <span>How long the election should run</span>
                        </v-tooltip>
                        <v-subheader class='font-weight-bold d-inline-block'>Duration</v-subheader>
                      </v-flex>
                      <v-flex sm8 mr-4>
                        <v-slider v-model="form.electionDuration" thumb-color="secondary"
                          :thumb-size="24" ticks thumb-label :label="form.electionDuration + ' hrs'" :min="1" :max='24'>
                        </v-slider>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-btn flat @click="e6 = 1" color="grey">
                <v-icon small>mdi-chevron-left</v-icon>
                Previous
              </v-btn>
              <v-btn color="success" @click="e6 = 3" v-if="!disabled_step_two">
                Next step <v-icon>mdi-chevron-right</v-icon>
              </v-btn>

            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card color="" class=" ma-0 mb-5 mx-1" style="min-height:200px;" light>
                <v-toolbar color="cyan" light flat height="50px">
                  <v-btn fab  small color="white" bottom left absolute @click.native.stop="dialog = !dialog">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-toolbar-title class="white--text">Select Roles</v-toolbar-title>
                </v-toolbar>
                <v-container>

                  <v-dialog v-model="dialog" max-width="500px">
                    <v-card>
                      <v-card-title primary-title class="title mb-0 pb-0">Create A New Role</v-card-title>
                      <v-card-text>
                        <v-text-field label="Role title" v-model="role_input" color="secondary" 
                          hint="e.g president, secretary, vice-chancellor"></v-text-field>
                        <small class="grey--text"></small>
                        <p>
                          <small class="grey--text">* try not to use abbreviations</small>
                        </p>
                        <v-divider></v-divider>
                        <v-textarea v-model="role_input_desc"
                          label="Role description (optional)" outline
                          name="name" color="secondary" hint="e.g what this role can do"
                        ></v-textarea>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat @click.native="dialog = false">Cancel</v-btn>
                        <v-btn flat color="success" @click.native="addrole" :disabled="!role_input.trim()">Add role</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-select class="mt-4" deletable-chips
                    v-model="form.roles" dense
                    :items="form.roles" return-object
                    item-text="title" cache-items
                    color="secondary"
                    chips label="Roles"
                    multiple outline
                  ></v-select>
                  <v-checkbox light label="Automatically enroll me into this election" v-model="form.auto_enroll_admin" value></v-checkbox>
                  <!-- <v-checkbox light label="Make this election public" class="d-inline-block" v-model="form.public" value></v-checkbox>
                  <v-tooltip right max-width="300" dark class="d-inline-block" style="margin-top:-5px;">
                    <v-icon slot="activator" small>help</v-icon>
                    <span>This means that everyone can see the election activites but only registerd voters can vote or contest</span>
                  </v-tooltip> -->
                </v-container>
                
              </v-card>
              <v-card-actions>
                <v-btn flat @click="e6 = 2" color="grey">
                  <v-icon small>mdi-chevron-left</v-icon>
                  Previous
                </v-btn>
                <v-btn color="success" @click="e6 = 4" v-if="!disabled_step_three">
                  Next step <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-actions>
              
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card color="grey lighten-3" flat class="mb-5" light>
                <v-card-text>
                  <v-card-title>
                    Select Voter Size
                  </v-card-title>
                  
                  <v-container fluid grid-list-md>
                    <v-layout column wrap>
                      <v-flex>
                        <v-text-field color="secondary" outline hide-details label="Enter number of voters" :min="50" :max="30000" v-model="no_of_voters" type="number"></v-text-field>
                      </v-flex>
                      <v-flex xs9>
                        <v-slider label="Estimated number of voters" color="secondary" :min="50" :max="30000" v-model="no_of_voters"></v-slider>
                      </v-flex>
                      <v-flex>
                        <strong>You Pay:  NGN {{(no_of_voters * price_per_voter).toLocaleString()}}</strong><br>
                        <paystack
                          :amount="no_of_voters * price_per_voter * 100"
                          :email="getUser.email"
                          :metadata="metadata"
                          :paystackkey="$paystackKey"
                          :reference="reference"
                          :callback="callback"
                          :close="close"
                          :embed="false"
                      >
                        <v-btn class="ml-0 mt-3" color="success">Make Payment</v-btn>
                      </paystack>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>

              <v-btn flat @click="e6 = 3" color="grey">
                <v-icon small>mdi-chevron-left</v-icon>
                Previous
              </v-btn>

            </v-stepper-content>

            <v-stepper-content step="5">
              <v-card light>
                <v-card-text>
                  <p>Election Created successfully!</p>
                  
                </v-card-text>
                <v-card-actions :class="[{'d-block': $vuetify.breakpoint.xsOnly}]">
                  
                  <v-btn color="success" @click="$eventBus.$emit('ShowManager')" :block="$vuetify.breakpoint.xsOnly" :class="[{'mb-2 ml-0': $vuetify.breakpoint.xsOnly}]">Election Manager</v-btn>
                  <v-btn color="success" to="/elections/vote" :block="$vuetify.breakpoint.xsOnly" :class="[{'mb-2 ml-0': $vuetify.breakpoint.xsOnly}]">Election page</v-btn>
                  
                </v-card-actions>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-container>
    <!--stepper -->

    <!-- < Creating Election Progress Dialog> -->
    <v-dialog v-model="creating_election_dialog"
      persistent width="300" full-width>
      <v-card color="secondary" dark class="justify-center">
        <v-card-text>
          <v-layout row wrap justify-space-around align-center>
            <v-flex>
              {{p_text}}
            </v-flex>
            <v-flex>
              <v-progress-circular
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-circular>
            </v-flex>
          </v-layout>
          
          
        </v-card-text>
      </v-card>
      
    </v-dialog>

  </div>
</template>
<script>
import api from '@/services/api'
  import api2 from '@/services/api2'
  import randomWords from 'random-words'
  import { mapGetters, mapState } from 'vuex'
  import Navigation from '@/components/Navigation'
  import paystack from 'vue-paystack'
  import {firebase, db, database} from '@/plugins/firebase'

export default {
  data: ()=>({
    title: 'Create new election | Voteryte',
    description: '',
    snackbar: {},
    plan_dialog: false,
    price_per_voter: 8,
    no_of_voters: 500,
    newElec: {}, // the newly created election
    loading: false,
    dialog: false,
    p_text: 'Verifying...',
    creating_election_dialog: false,
    role_input: '',
    role_input_desc: '',
    modal: false,
    modal2: false,
    today: new Date().getTime(),
    e6: 1,
    electionId: null,
    form: {
      title: '',
      type: '',
      school: '',
      level: '',
      timed: true,
      faculty: '',
      department: '',
      date: '',
      time: '',
      electionDuration: 5,
      auto_enroll_admin: true,
      public: true,
      roles: [
        {title:'president', value:'president', description:''},
        {title:'secretary', value:'secretary', description:''},
        {title:'treasurer', value:'treasurer', description:''},
        {title:'financial secretary', value:'financial secretary', description:''},
        {title:'director of sports', value:'director of sports', description:''},
        {title:'provost', value:'provost', description:''},
        {title:'vice president', value:'vice president',description:''},
        {title:'director of socials', value:'director or socials', description:''}
      ]
    },
    electionTypes: [
      {text:'School',disabled:false},
      {text:'Organizations',disabled:true},
      {text:'Others',disabled:true},
      {text:'Governement - comming soon',disabled:true},
    ],
    levels: [
      [
        {text: 'Students Council Election', value: 'General'},
        {text: 'Faculty Election', value: 'Faculty'},
        {text: 'Departmental Election', value: 'Department'}
      ],
      ['Federal', 'State','Local governement']
    ],
    rules: {
      counter: value => value.length <= 100 || 'Max 100 characters',
    },
    reference: Date.now() + btoa(Math.random()).substring(0,12)

  }),
  computed: {
    style1(){
      if(this.$vuetify.breakpoint.xsOnly){
        return {
          "min-height": 'calc(100vh - 128px) !important'
        }
      }
    },
    plans(){
      return [
        {range:'up to 100',max_voters: 100, amount:'0 (Free)', title: 'Lean', color: 'orange'},
        {range:'up to 1000', max_voters: 1500, amount: 10000, title: 'Jam', color: 'primary'},
        {range:'up to 10,000', max_voters: 10000, amount: 45000, title: 'Legion', color: 'success'},
        {range:'up to 50,000', max_voters: 50000, amount: 150000, title: 'Swarm', color: 'cyan'},
      ]
    },
    metadata(){
      return {
        orderid: this.reference,
        custom_fields: [
          {
            display_name: "No of voters",
            variable_name: "no_of_voters",
            value: this.no_of_voters
          },
          {
            display_name: "Amount Paid",
            variable_name: "amount_paid",
            value: this.no_of_voters * this.price_per_voter
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
    disabled_step_one(){
      return !this.form.title.trim() || this.form.title.trim().length > 100 || !this.form.type || 
      (this.form.type == 'School' && !this.form.level) || (this.form.type == 'Governement' && !this.form.level) || 
      (this.form.type == 'School' && !this.form.school) ||
      (this.form.level == 'Faculty' && !this.form.faculty) ||
      (this.form.level == 'Department' && !this.form.department) || 
      !this.is_verified
    },

    disabled_step_two(){
      return this.form.timed && 
      (!this.form.date || 
      !this.form.time || 
      this.form.electionDuration == 0)
      
    },
    disabled_step_three(){
      return this.form.roles.filter(role => role != false).length == 0
    },
    disabled_step_four(){
      return true
    },
    ...mapGetters([
      'getUser',
      'getSchools',
      'getUserInfo',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ])
  },
  methods:{
    setCurrentRoom(){
      this.$store.dispatch('curRoom', this.newElec)
    },
    allowedDates(val){
			// only allow dates greater than or equal to today
			let today = this.today

			let toAllow = new Date(val).getTime()
	
			return today - toAllow - 24 * 60 * 60 * 1000 <= 0
    },
    allowedHours(val){
      // only allow hours that are not yet past
      let curHour = new Date().getHours()
      // console.log(curHour, val)
      return curHour < val
    },
    addrole(){
      if(this.role_input.length == 0){
        alert("Text should not be empty")
        return 
      }else{
        this.dialog = false;
        this.form.roles.push({
          title: this.$sanitize(this.role_input),
          value: this.$sanitize(this.role_input),
          description: this.$sanitize(this.role_input_desc)
        })
        this.role_input = '' //empty it
        this.role_input_desc = ''
        }
      
    },
    async createElection(event){

      this.creating_election_dialog = true
      this.p_text = 'Creating Election...'

      firebase.auth().currentUser.getIdToken().then((token)=>{
        // set the full start date in utc
        this.form.fullStartDate = (new Date(this.form.date + ' ' + this.form.time)).toISOString()
        this.form.title = this.$sanitize(this.form.title)
        
        api().post('create_election',{
          form: this.form,
          userInfo: this.getUserInfo,
          selected_plan: {
            range: `0 to ${this.no_of_voters}`,
            max_voters: this.no_of_voters,
            amount: this.no_of_voters * this.price_per_voter,
            title: 'payment'
          },
          idToken: token
        }).then(async result =>{

          let electionRef = db.collection('elections').doc(result.data.electionId)
          let newElec = await electionRef.get()
          this.newElec = newElec.data()
          this.$store.dispatch('setMyEnrolled', {
            election: this.newElec,
            merge: true
          })

          this.$store.dispatch('curRoom', this.newElec)
          

          this.creating_election_dialog = false;
          this.plan_dialog = false;

          //this.loading = !this.loading
          this.snackbar = {
            show: true,
            message: 'Election created successfully',
            color: 'success'
          }
          this.e6 = 5
        })
        .catch(err => {
          // console.log(err)
          this.creating_election_dialog = false
          this.plan_dialog = false
          $Nprogress.done()

          this.snackbar = {
            show: true,
            message: 'Something went wrong, try again',
            color: 'error'
          }
        })
      }).catch(err => {
        this.snackbar = {
          show: true,
          message: 'Something went wrong, try again',
          color: 'error'
        }
      })
      
    },
    prefillForm(user){
      this.form.school = user.sch
      this.form.faculty = user.fac

      this.form.department = user.dept
    },
    async setThingsUp(){
      let this_user
      firebase.auth().onAuthStateChanged(async user=>{
        if (user) {
          // User is signed in.
          if(this.getUserInfo){
            this_user = this.getUserInfo
            this.prefillForm(this_user)
          }
          else{
            
            try {
              let userDetails = db.collection('moreUserInfo').doc(user.uid);
              let getDoc = await userDetails.get()
              this_user = getDoc.data()
              this.$store.dispatch('setUserInfo', getDoc.data())
              this.prefillForm(this_user)
            }catch (error) {
              // console.log(error)
            }
            
          }
          
        } else {
          // console.log('No user is signed in.')
        }
      });   
    },
    callback(res){
      // this.verifyTxn(res)
      this.create(res)
    },
    close(res){
      this.reference = Date.now() + btoa(Math.random()).substring(0,12)
    },
    createPaymentRef(data){
      return new Promise((resolve,reject)=>{
        this.p_text = 'Initializing...'
        db.collection('paymentRefs').add({
          ...data,
          by: this.getUser.uid,
          no_of_voters: this.no_of_voters,
          price: this.no_of_voters * this.price_per_voter,
          trxn_date: Date.now()
        }).then(doc=>resolve(doc))
        .catch(err=> reject(err))
      })
    },
    verifyTxn(data){
      // verfy on the server that the transaction is ok
      this.creating_election_dialog = true
      firebase.auth().currentUser.getIdToken()
      .then((token)=>{
        api2().post('dashboard/verifyTxn', {
          token,
          reference: data.reference,
          amount: this.no_of_voters * this.price_per_voter * 100
        }).then(res=>{
          // transaction is ok, create election
          this.create(data)
          
        }).catch(error=>{
          // resets the reference to prevent duplicate trxn reference
          this.reference = Date.now() + btoa(Math.random()).substring(0,12)
          this.$Nprogress.done()

          this.snackbar = {
            show:true,
            message:error.response ? error.response.data.message : 'Transaction failed',
            color:'error'
          }
          this.creating_election_dialog = false;
        })
        
      })
    },
    create(data){
      this.creating_election_dialog = true

      this.createPaymentRef(data).then(doc=>{
        this.reference = Date.now() + btoa(Math.random()).substring(0,12)
        this.createElection()
      })
    }
  },
  components: {
    Navigation,
    paystack,
  },
  created(){

    this.setThingsUp()
  }
}
</script>
<style lang='scss' scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  .round{
    @include borderRadius(15px)
  }
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
  //.v-stepper{
   // min-height:100vh;
  //}
  
</style>
)