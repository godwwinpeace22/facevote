<template>
  <div>
    <vue-headful :title="title" :description="description"/>
    <navigation>
      <span slot="title">Dashboard</span>
      <h1 slot="extended_nav">Create Election</h1>
    </navigation>
    <v-snackbar v-model="snackbar.show" dark :timeout="5000" :color="snackbar.color" top right>
      {{snackbar.message}}
      <v-btn dark color="white" flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <v-container :class="noPadding">
      <v-card class="round" >
        <v-stepper v-model="e6" dark class="white">
          <v-stepper-header class="grey">
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
        
          <v-stepper-items>

            <v-stepper-content step="1">
              <v-layout>
                <v-flex xs12 sm10>
                  <v-card class="mb-5 ma-2" flat light>
                    <v-card-text class="pl-0">{{text}}
                      <v-divider></v-divider>
                    </v-card-text>
                    
                    <v-layout row wrap class="mb-3">
                      <v-flex xs12 sm4>
                        <v-subheader class="pl-0 font-weight-bold">Title for the election</v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field color="secondary"
                          :rules="[rules.counter]" label="Title" outline 
                          v-model="form.title" maxlength="100" counter small>
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap class="mb-3">
                      <v-flex xs12 sm4>
                        <v-subheader class="pl-0 font-weight-bold">The type of election to create</v-subheader>
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
                    <v-layout row wrap class="mb-3">
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
                        <v-subheader class="pl-0 font-weight-bold">Your Faculty</v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field required small v-model="form.faculty" disabled
                          outline color="secondary" label="Your faculty">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap v-if="form.type == 'School' && form.level == 'Department'" class="mb-3">
                      <v-flex xs12 sm4>
                        <v-subheader class="pl-0 font-weight-bold">Your Department</v-subheader>
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
              <v-btn color="success" @click="e6 = 2" v-if="!disabled_step_one">
                Next step <v-icon>chevron_right</v-icon>
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-layout>
                <v-flex xs12 sm8>
                  <v-card class="mb-5 mr-1 ml-1 mt-3 pa-3 orange white--text round" dark>
                    <!--schedule elections --> 
                    <v-layout row >
                      <v-flex sm10 ><v-subheader class="font-weight-bold">Create timed election</v-subheader></v-flex>
                      <v-flex sm2 style="padding-bottom:0px;">
                        <v-switch value v-model="form.timed" color="success"></v-switch>
                      </v-flex>
                    </v-layout>
                    <v-divider v-show="form.timed"></v-divider>
                    <v-layout row wrap v-show="form.timed">
                      <v-flex xs12 sm4>
                        <v-subheader class="font-weight-bold">Start time</v-subheader>
                      </v-flex>
                      <v-flex xs6 sm4 :class="$vuetify.breakpoint.xsOnly ? ['px-2'] : ''">
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.date"
                          persistent lazy full-width width="290px" >

                          <v-text-field :disabled="!form.timed" slot="activator" color="secondary" v-model="form.date"
                            label="Date" readonly>
                            <v-icon color="secondary" slot="prepend-inner">event</v-icon>
                          </v-text-field>
                          <v-date-picker v-model="form.date" scrollable header-color="secondary">
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
                            <v-icon color="secondary" slot="prepend-inner">access_time</v-icon>
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
                        <v-subheader class='font-weight-bold'>Duration</v-subheader>
                      </v-flex>
                      <v-flex sm8 mr-4>
                        <v-slider v-model="form.electionDuration" thumb-color="secondary"
                          :thumb-size="24" thumb-label :label="form.electionDuration + ' hrs'" :min="1" :max='7'>
                        </v-slider>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-btn flat @click="e6 = 1" color="grey">
                <v-icon small>chevron_left</v-icon>
                Previous
              </v-btn>
              <v-btn color="success" @click="e6 = 3" v-if="!disabled_step_two">
                Next step <v-icon>chevron_right</v-icon>
              </v-btn>

            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card color="" class=" ma-0 mb-5 mx-1" style="min-height:200px;" light>
                <v-toolbar color="cyan" light flat height="50px">
                  <v-btn fab  small color="white" bottom left absolute @click.native.stop="dialog = !dialog">
                    <v-icon>add</v-icon>
                  </v-btn>
                  <v-toolbar-title class="white--text">Select Roles</v-toolbar-title>
                </v-toolbar>
                <v-container>

                  <v-dialog v-model="dialog" max-width="500px">
                    <v-card>
                      <v-card-title primary-title class="mb-0 pb-0">Create A New Role</v-card-title>
                      <v-card-text>
                        <v-text-field label="Role title" v-model="role_input" color="secondary"></v-text-field>
                        <small class="grey--text">e.g president, secretary,vice-chancellor</small>
                        <p>
                          <small class="grey--text">* try not to use abbreviations</small>
                        </p>
                        <v-divider></v-divider>
                        <v-textarea v-model="role_input_desc"
                          label="Role description" outline
                          name="name" color="secondary"
                        ></v-textarea>
                        <small class="grey--text">e.g what this role can do</small>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat @click.native="dialog = false">Cancel</v-btn>
                        <v-btn flat color="success" @click.native="addrole" :disabled="!role_input">Add role</v-btn>
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
                  <v-checkbox light label="Make this election public" class="d-inline-block" v-model="form.public" value></v-checkbox>
                  <v-tooltip right max-width="300" dark class="d-inline-block" style="margin-top:-5px;">
                    <v-icon slot="activator" small>help</v-icon>
                    <span>This means that everyone can see the election activites but only registerd voters can vote or contest</span>
                  </v-tooltip>
                </v-container>
                
              </v-card>
              <v-card-actions>
                <v-btn flat @click="e6 = 2" color="grey">
                  <v-icon small>chevron_left</v-icon>
                  Previous
                </v-btn>
                <v-btn color="success" @click="e6 = 4" v-if="!disabled_step_three">
                  Next step <v-icon>chevron_right</v-icon>
                </v-btn>
              </v-card-actions>
              
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card color="grey lighten-3" flat class="mb-5" light>
                <v-card-text>
                  <v-card-title>
                    Select a payment plan based on the number of voters you are expecting
                  </v-card-title>

                  <!-- ==SMALL CARDS== -->
                  <v-container grid-list-xl :class="$vuetify.breakpoint.xsOnly ? ['px-0'] : ''">
                    <v-layout row wrap>
                      <v-flex xs12 sm4 md3 d-flex v-for="(plan,i) in Plans" :key="i">
                        <v-card class="mt-3 mx-auto round" hover @click="selectPlan(plan)">
                          <v-sheet
                            class="v-sheet--offset ml-3" :class="{'orange':i==0,'primary':i==1,'success':i==2,'cyan':i==3}"
                            color="" elevation="2"
                            max-width="35%" height="80">
                            <v-icon class='mx-auto d-block ma-auto' 
                              style="width:50px;padding-top:15%;" size="50" color="white">
                              
                            </v-icon>
                          </v-sheet>

                          <v-card-text class="pt-0">
                            <div class="subheading font-weight-light grey--text mb-2">{{plan.range}} max voters</div>
                            <div class="subheading font-weight-light text-xs-right">{{plan.amount}}</div>
                            <v-divider class="my-2"></v-divider>
                            <v-icon class="mr-2" small></v-icon>
                            <span class="caption grey--text font-weight-light">Plan: {{plan.title}}</span>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>

              <v-btn flat @click="e6 = 3" color="grey">
                <v-icon small>chevron_left</v-icon>
                Previous
              </v-btn>
              <!--v-btn color="success" @click="e6 = 5" >
                Next step <v-icon small>chevron_right</v-icon>
              </v-btn-->

            </v-stepper-content>

            <v-stepper-content step="5">
              <v-card light>
                <v-card-text>
                  <p>Election Created successfully!</p>
                  <p>Whats next ?</p>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="success" flat :to="'/elections/manage/'+ electionId">Go to election Manager</v-btn>
                  <v-btn color="success" flat :to="'/forum/' + electionId">Go to forum</v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-container>
    <!--stepper -->
    
    <v-dialog
      v-model="plan_dialog"
      max-width="600px"
      transition="dialog-transition"
    >
      <v-card height="350" flat>
        <v-container grid-list-xs fluid>
          <v-layout align-center justify-center fill-height>
            <v-flex xs12 height="150">
              <v-card flat>
                <v-card-text>
                  You have selected the {{selected_plan.title}} plan.
                  <p>Amount: {{selected_plan.amount}}</p>
                </v-card-text>
                <div class="" style="width:fit-content">
                  <v-btn color="success" v-if="selected_plan.title == 'Basic'" @click="create">Create Election</v-btn>
                  <paystack v-else
                      :amount="selected_plan.amount * 100"
                      :email="getUser.email"
                      :metadata="metadata"
                      :paystackkey="paystack_key"
                      :reference="reference"
                      :callback="callback"
                      :close="close"
                      :embed="false"
                  >
                    <v-icon color="success">payment</v-icon>
                    Make Payment
                  </paystack>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

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
import randomWords from 'random-words'
import { mapGetters } from 'vuex'
import Navigation from '@/components/Navigation'
import paystack from 'vue-paystack';
//import { promisfy } from "@/helpers/promisify";
export default {
  data:()=>({
    title:'Create new election',
    description:'',
    snackbar:{},
    plan_dialog:false,
    selected_plan:{},
    loading:false,
    dialog:false,
    p_text:'Verifying...',
    creating_election_dialog:false,
    paystack_key:'pk_test_fefaa0524871e5ff35d4ec861974c59197cb42e7',
    role_input:null,
    role_input_desc:null,
    modal:false,
    modal2:false,
    e6:1,
    text:'Lo consequatur nostrum blanditiis expedita omnis accusantium vitae veritatis aut?',
    electionId:null,
    form:{
      title:'',
      type:'',
      school:'',
      level:'',
      timed:true,
      faculty:'',
      department:'',
      date:'',
      time:'',
      electionDuration:5,
      auto_enroll_admin:true,
      public:true,
      roles:[
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
    electionTypes:[
      {text:'School',disabled:false},
      {text:'Governement - comming soon',disabled:true},
      {text:'Organizations - comming soon',disabled:true},
      {text:'Others - comming soon',disabled:true}
    ],
    levels:[
      ['General', 'Faculty','Department'],
      ['Federal', 'State','Local governement']
    ],
    rules:{
      counter: value => value.length <= 100 || 'Max 100 characters',
    }

  }),
  computed:{
    noPadding(){
      return this.$vuetify.breakpoint.xsOnly ? ['px-1'] : ''
    },
    currDate(){
      let d = new Date()
      let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      console.log(date)
      return date.toString()   
    },
    reference(){
      return this.getUser.uid +Date.now() + btoa(Math.random()).substring(0,12)
    },
    Plans(){
      return [
        {range:'0 - 500',max_voters:500, amount:'Free',title:'Basic'},
        {range:'500 - 1500', max_voters:1500, amount:14999,title:'Spark'},
        {range:'1500 - 5000', max_voters:5000, amount:24999,title:'Chubby'},
        {range:'5000 - 10000', max_voters:10000, amount:34999,title:'Robbust'},
      ]
    },
    metadata(){
      return {
        plan_type: this.selected_plan.title,
        orderid: this.reference,
        custom_fields: [
          {
            display_name: "Plan_type",
            variable_name: "plan",
            value: this.selected_plan.title
          },
          {
            display_name: "Amount Paid",
            variable_name: "amount_paid",
            value: this.selected_plan.amount
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
      return !this.form.title.trim() || this.form.title.trim().length > 100 || !this.form.type || !this.form.level || 
      (this.form.type == 'School' && !this.form.school) ||
      (this.form.level == 'Faculty' && !this.form.faculty) ||
      (this.form.level == 'Department' && !this.form.department)
    },

    disabled_step_two(){
      return this.form.timed && (!this.form.date || !this.form.time || this.form.electionDuration == 0)
      
    },
    disabled_step_three(){
      return this.form.roles.filter(role => role != false).length == 0
    },
    disabled_step_four(){
      return true
    },
    ...mapGetters([
      'isAuthenticated',
      'getToken',
      'getUser',
      'getSchools',
      'getUserInfo',
      // ...
    ]),
  },
  methods:{
    
    addrole(){
      if(this.role_input.length == 0){
        alert("Text should not be empty")
        return 
      }else{
        this.dialog = false;
        this.form.roles.push({
          title:this.role_input,
          value:this.role_input,
          description:this.role_input_desc
        })
        this.role_input = '' //empty it
        this.role_input_desc = ''
        }
      
    },
    async createElection(event){

      this.creating_election_dialog = true
      this.p_text = 'Creating Election...'
     
      try {

        let electionId = randomWords({ exactly: 2, join: '-' })
        this.electionId = electionId
        let temp_role = []
        this.form.roles.forEach(role=>{
          let new_token = randomWords({exactly:2, join: '-'})
          temp_role.push({
            title:role.title,
            description:role.description,
            value:new_token,
            token:new_token
          })
        })

        console.log(electionId)
        let electionRef = db.collection('elections')
        electionRef.doc(electionId).set({
          title:this.form.title,
          type:this.form.type,
          level:this.form.level,
          timed:this.form.timed,
          electionId:electionId,
          admin:this.getUser.uid,
          admins:[this.getUser.uid],
          followers:[this.getUser.uid],
          school:this.form.school,
          faculty:this.form.faculty,
          department:this.form.department,
          startDate:this.form.date,
          startTime:this.form.time,
          duration:this.form.electionDuration,
          voterSize:this.selected_plan.max_voters,
          plan:this.selected_plan,
          roles:temp_role,
          dateCreated:Date.now(),
          status:'inRegistration',
          contestants:[],
          regVoters:this.form.auto_enroll_admin ? [this.getUser.uid] : [],
          voted:[],
          public:this.form.public,
        })

        // create new activity
        db.collection('activities').add({
          type:'election_created',
          by:this.getUser.uid,
          dateCreated:Date.now(),
          text:'created this election',
          electionRef:electionId
        }).then(done=>{
          if(this.form.auto_enroll_admin){
            this.enrollAdmin(electionId,this.getUser.uid).then(d=>{
              console.log('resolved d: ', d)

              this.creating_election_dialog = false;
              this.plan_dialog = false;

              //this.loading = !this.loading
              this.snackbar = {
                show:true,
                message:'Election created successfully',
                //color:'success'
              }
              this.e6 = 5
            })
          }else{
            this.creating_election_dialog = false;
            this.plan_dialog = false;

            //this.loading = !this.loading
            this.snackbar = {
              show:true,
              message:'Election created successfully',
              color:'success'
            }
            this.e6 = 5
          }
          
        })
      } catch (error) {
        this.snackbar = {
          show:true,
          message:'Something went wrong, try again',
          color:'error'
        }
      }
      
    },
    enrollAdmin(electionId,uid){
      return new Promise((resolve,reject)=>{
        this.p_text = 'Enrolling Admin...'
        //update User details
        db.collection('moreUserInfo').doc(uid)
        .update({
          enrolled:firebase.firestore.FieldValue.arrayUnion(electionId)
        }).then(result=>{
          // create new activity
          db.collection('activities').add({
            type:'voter_registered',
            by:uid,
            dateCreated:Date.now(),
            text:'enrolled for this election',
            electionRef:electionId
          }).then(reslt=>{
            resolve([result,reslt])
          }).catch(err=> reject(err))
        }).catch(err => reject(err))
      })
    },
    prefillForm(user){
      this.form.school = user.school
      this.form.faculty = user.faculty

      this.form.department = user.department
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
              console.log(error)
            }
            
          }
          
        } else {
          console.log('No user is signed in.')
        }
      });   
    },
    selectPlan(plan){
      console.log(plan)
      this.selected_plan = plan
      this.plan_dialog = true
    },
    callback(res){
      this.verifyTxn(res)
    },
    close(res){
      console.log('closed dialog')
    },
    createPaymentRef(data){
      return new Promise((resolve,reject)=>{
        this.p_text = 'Initializing...'
        db.collection('paymentRefs').add({
          ...data,
          by:this.getUser.uid,
          plan_type:this.selected_plan.title,
          plan_amount:this.selected_plan.amount,
          trxn_date:Date.now()
        }).then(doc=>resolve(doc))
        .catch(err=> reject(err))
      })
    },
    verifyTxn(data){
      // verfy on the server that the transaction is ok
      this.creating_election_dialog = true
      firebase.auth().currentUser.getIdToken()
      .then((token)=>{
        api().post('dashboard/verifyTxn', {
          token,
          reference:data.reference,
          amount:this.selected_plan.amount * 100
        }).then(res=>{
          // transaction is ok, create election
          this.create(data)
          
        }).catch(error=>{
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
      console.log(data)
      if(this.selected_plan.title == 'Basic'){
        this.createElection()
      }
      else{
        this.createPaymentRef(data).then(doc=>{
          console.log(doc);
          this.createElection()
        })
      }
    
    }
  },
  components:{
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