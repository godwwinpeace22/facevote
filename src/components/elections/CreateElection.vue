<template>
  <div>
    <vue-headful :title="title" :description="description"/>
    <navigation>
      <span slot="title">Create Election</span>
    </navigation>

    <v-snackbar v-model="snackbar.show" dark :timeout="5000" :color="snackbar.color" top right>
      {{snackbar.message}}
      <v-btn dark color="white" text @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <v-container>
      <v-card outlined>
        <v-stepper v-model="step" class="white elevation-0">
          <v-stepper-header class="elevation-0">
            <v-stepper-step :complete="step > 1" step="1">
              Election info
              <!-- <small>General information about the election</small> -->
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="step > 2" step="2">Add a Schedule</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="step > 3" step="3">Contestats and Roles</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="step > 4" step="4">Voting and results</v-stepper-step>
            <v-stepper-step :complete="step > 5" step="5">Payment</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="step > 6" step="6">Done</v-stepper-step>
          </v-stepper-header>
        
          <v-stepper-items >

            <v-stepper-content step="1">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-row>

                    <v-col cols="12" sm="6">
                      <v-subheader class="pl-0 font-weight-bold">Title of Election</v-subheader>
                      <v-text-field color="primary"
                        :rules="[rules.counter]" label="Title" outlined 
                        v-model="form.title" maxlength="100" counter small
                        hint="e.g NAPPS Elections 2019">
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-subheader class="pl-0 font-weight-bold">Election Type
                        <v-dialog bottom max-width="500">
                          <template v-slot:activator="{on}">
                            <v-icon class="ml-3" v-on="on">mdi-help-circle</v-icon>
                          </template>
                          <span>
                            <v-card>
                              <v-card-title >
                                What election type should I use
                              </v-card-title>
                              <v-card-text>
                                <v-subheader class="font-weight-bold pl-0">School election</v-subheader>
                                <p>Use this if you are creating election for department, faculty, or campus-wide/general elections,
                                  post-graduate elections.
                                </p>
                                <v-subheader class="font-weight-bold pl-0">Governement election</v-subheader>
                                <p>For local, state, and federal governement elections, senate elections.
                                </p>
                                <v-subheader class="font-weight-bold pl-0">Others</v-subheader>
                                <p>For peagentries, reality shows, political parties, other groups and organizations.
                                </p>
                              </v-card-text>
                            </v-card>
                          </span>
                        </v-dialog>
                      </v-subheader>
                      <v-select required
                        v-model="form.type" outlined
                        :items="electionTypes"
                        item-text="text"
                        item-value="text"
                        item-disabled="disabled"
                        color="primary"
                        label="Select type"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="12" v-show="form.type == 'Government' || form.type == 'School'">
                      <v-subheader class="pl-0 font-weight-bold">
                        Election Level
                      </v-subheader>
                      <v-select required outlined v-model="form.level" 
                        :items="form.type == 'School' ? levels[0]: form.type == 'Governement' ? levels[1] : levels[2]"  
                        color="primary" label="Level" 
                        persistent-hint
                        hint="Note: You can create elections only in your department, faculty, or school.">
                      </v-select>
                    </v-col>

                  </v-row>
                </v-col>

                      
              </v-row>
              
              <template v-if="!is_verified">
                <v-btn color="error" to="/verify">
                  Verify your Account <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
                <small class="d-block ml-2">Verify your account before you can create elections</small>
              </template>

              <v-btn color="success" @click="step = 2" v-if="!disabled_step_one">
                Next step <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-row>
                <v-col cols="12" sm="8">
                  <v-card class="mb-5 mr-1 ml-1 mt-3 pa-3" flat light>
                    <v-subheader class="title primary--text pl-0 mb-0">Schedule Election</v-subheader>
                    
                    <v-row>
                      
                      <v-col cols="6" sm="6" :class="$vuetify.breakpoint.xsOnly ? ['px-2'] : ''">
                        <v-subheader class="font-weight-bold mb-0 pl-0">Start date</v-subheader>

                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.date"
                          persistent width="290px" >
                          
                          <template v-slot:activator="{on}">
                            <v-text-field v-on="on" color="primary" v-model="form.date"
                              label="Choose date" readonly outlined>
                              <v-icon color="primary" slot="prepend-inner">mdi-calendar</v-icon>
                            </v-text-field>
                          </template>

                          <v-date-picker v-model="form.date" 
                            scrollable :allowed-dates="allowedDates" 
                            header-color="primary">
                            <v-spacer></v-spacer>
                             <v-btn text   @click="modal = false">Cancel</v-btn>

                             <v-btn text small outlined color="success" 
                              @click="$refs.dialog.save(form.date)">OK
                            </v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-col>

                      <v-col cols="6" sm="6" :class="$vuetify.breakpoint.xsOnly ? ['mr-0','px-2'] : ['px-2']">
                        <v-subheader class="mb-0 pl-0 font-weight-bold">Start time</v-subheader>

                        <v-dialog ref="dialog2" v-model="modal2" :return-value.sync="form.time"
                          persistent width="290px">

                          <template v-slot:activator="{on}">
                            <v-text-field  v-on="on" v-model="form.time"  
                              label="Time" color="primary" readonly outlined>
                              <v-icon color="primary" slot="prepend-inner">mdi-clock</v-icon>
                            </v-text-field>
                          </template>
                          <v-time-picker v-if="modal2" format="ampm" v-model="form.time" header-color='primary'>
                            <v-spacer></v-spacer>
                             <v-btn text  @click="modal2 = false">Cancel</v-btn>
                             <v-btn text color="success" outlined @click="$refs.dialog2.save(form.time)">OK</v-btn>
                          </v-time-picker>
                        </v-dialog>
                      </v-col>

                      <v-col cols="6" sm="6">
											<v-subheader class="font-weight-bold mb-0 pl-0">End date</v-subheader>

											<v-dialog ref="dialog6" v-model="modal5" :return-value.sync="form.enddate"
												persistent width="290px" >
												
												<template v-slot:activator="{on}">
													<v-text-field v-on="on" color="primary" v-model="form.enddate"
														label="Choose date" readonly outlined>
														<v-icon color="primary" slot="prepend-inner">mdi-calendar</v-icon>
													</v-text-field>
												</template>

												<v-date-picker v-model="form.enddate" 
													scrollable :allowed-dates="allowedDates" 
													header-color="primary">
													<v-spacer></v-spacer>
														<v-btn text   @click="modal5 = false">Cancel</v-btn>

														<v-btn text small outlined color="success" 
														@click="$refs.dialog6.save(form.enddate)">OK
													</v-btn>
												</v-date-picker>
											</v-dialog>
										</v-col>

										<v-col cols="6" sm="6" :class="$vuetify.breakpoint.xsOnly ? ['mr-0','px-2'] : ['px-2']">
											<v-subheader class="mb-0 pl-0 font-weight-bold">Start time</v-subheader>

											<v-dialog ref="dialog3" v-model="modal3" :return-value.sync="form.endtime"
												persistent width="290px">

												<template v-slot:activator="{on}">
													<v-text-field  v-on="on" v-model="form.endtime"  
														label="Time" color="primary" readonly outlined>
														<v-icon color="primary" slot="prepend-inner">mdi-clock</v-icon>
													</v-text-field>
												</template>
												<v-time-picker v-if="modal3" format="ampm" v-model="form.endtime" header-color='primary'>
													<v-spacer></v-spacer>
														<v-btn text  @click="modal3 = false">Cancel</v-btn>
														<v-btn text color="success" outlined @click="$refs.dialog3.save(form.endtime)">OK</v-btn>
												</v-time-picker>
											</v-dialog>
										</v-col>

                      <!-- <v-col sm="6">
                        <v-subheader class='font-weight-bold mb-0 pl-0'>Duration
                          <v-tooltip right max-width="300" dark class="d-inline-block mt-3">
                            <template v-slot:activator="{on}">
                              <v-icon v-on="on" small class="ml-2">mdi-help-circle</v-icon>
                            </template>
                            <span>How long the election should run</span>
                          </v-tooltip>
                        </v-subheader>
                        <v-slider 
                          v-model="form.electionDuration" 
                          thumb-color="primary"
                          :thumb-size="24" ticks thumb-label 
                          :label="form.electionDuration + ' hrs'" 
                          :min="1" :max='24'>
                        </v-slider>
                      </v-col> -->

                      <v-col sm="12" style="padding-bottom:0px;">
                        <v-subheader class="font-weight-bold pl-0 mb-0">Auto start </v-subheader>
                        <v-switch 
                          class="mt-0"
                          v-model="form.timed" 
                          label="Election begins and ends automatically at the selected date and time"
                          color="success">
                        </v-switch>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>

               <v-btn text @click="step = 1" color="grey">
                <v-icon small>mdi-chevron-left</v-icon>
                Previous
              </v-btn>
              <v-btn color="success" @click="step = 3" v-if="!disabled_step_two">
                Next step <v-icon>mdi-chevron-right</v-icon>
              </v-btn>

            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card outlined class="ma-0 mb-5 mx-1" style="min-height:200px;" light>
                <v-toolbar light flat height="50px">
                  <v-toolbar-title class="">Select Roles</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn 
                    color="primary" class="text-capitalize"
                    depressed left 
                    @click.native.stop="dialog = !dialog">
                    <v-icon>mdi-plus</v-icon>
                    New Role
                  </v-btn>
                </v-toolbar>
                <v-container>

                  <v-dialog v-model="dialog" max-width="500px">
                    <v-card>
                      <v-card-title primary-title class="title mb-0 pb-0">Create A New Role</v-card-title>
                      <v-card-text>
                        <v-text-field label="Role title" v-model="role_input" color="primary" 
                          hint="e.g president, secretary, vice-chancellor"></v-text-field>
                        <small class="grey--text"></small>
                        <p>
                          <small class="grey--text">* try not to use abbreviations</small>
                        </p>
                        <v-divider></v-divider>
                        <v-textarea v-model="role_input_desc"
                          label="Role description (optional)" outlined
                          name="name" color="primary" hint="e.g what this role can do"
                        ></v-textarea>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                         <v-btn text @click.native="dialog = false">Cancel</v-btn>
                         <v-btn text color="success" @click.native="addrole" :disabled="!role_input.trim()">Add role</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-select class="mt-4" deletable-chips
                    v-model="form.roles" dense
                    :items="form.roles" return-object
                    item-text="title" cache-items
                    color="primary"
                    chips label="Roles"
                    multiple outlined
                  ></v-select>
                  <v-checkbox light label="Automatically enroll me into this election" v-model="form.auto_enroll_admin" value></v-checkbox>
                  
                </v-container>
                
              </v-card>
              <v-card-actions>
                 <v-btn text @click="step = 2" color="grey">
                  <v-icon small>mdi-chevron-left</v-icon>
                  Previous
                </v-btn>
                <v-btn color="success" @click="step = 4" v-if="!disabled_step_three">
                  Next step <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-actions>
              
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card color="" flat class="mb-5" light>
                <v-card-text>

                  <v-subheader class="font-weight-bold mb-2">Voter registration</v-subheader>
                  <p class="ml-4">How would you register voters?</p>
                  <v-radio-group class="ml-4" v-model="form.self_registration" mandatory>
                    
                    <v-radio label="Voters register by themselves" :value="true"></v-radio>
                    <v-radio label="Add voters manually" :value="false"></v-radio>
                  </v-radio-group>

                  <v-card flat v-if="form.self_registration" max-width="900">
                    <v-card-text>
                      
                      <p class="">Estimated number of voters</p>
                      <v-slider 
                        :label="no_of_voters.toString()"
                        color="primary" 
                        :min="100" :max="50000" 
                        v-model="no_of_voters">
                      </v-slider>

                    </v-card-text>
                  </v-card>

                  <v-card v-else flat width="500" class="grey lighten-4">
                    <v-card-text>
                      <span class="v-card--title">
                        List of voters
                      </span>
                      <v-textarea rows="10" 
                        label="Enter comma seperated list of phone numbers"
                        outlined>
                      </v-textarea>
                      
                    </v-card-text>
                  </v-card>

                  <v-divider class="m"></v-divider>

                  

                  <v-list three-line subheader>
                    <v-subheader class="font-weight-bold mb-0">Voting</v-subheader>
                    <v-list-item>
                      <v-list-item-action>
                        <v-checkbox 
                          :readonly="form.type == 'School'"
                          v-model="form.allow_multiple_voting"
                          class="mt-0"
                          color="success">
                        </v-checkbox>
                        
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Allow multiple voting</v-list-item-title>
                        <v-list-item-subtitle>This is useful for peagentries, tv shows, e.t.c</v-list-item-subtitle>
                        <v-list-item-subtitle class="warning--text">Note: This option is not available for school elections.</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-action>
                        <v-checkbox 
                          :readonly="form.type == 'School'"
                          class="mt-0"
                          v-model="form.secret_ballot"
                          color="success">
                        </v-checkbox>
                        
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Secret ballot</v-list-item-title>
                        <v-list-item-subtitle>Votes are anonymous - votes can't be linked with voters.</v-list-item-subtitle>
                        <v-list-item-subtitle class="warning--text">Note: This option is mandatory for school elections</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>

                  <v-divider></v-divider>
                  <v-list three-line subheader>
                    <v-subheader class="font-weight-bold mb-0">Result</v-subheader>
                    <v-list-item>
                      <v-list-item-action>
                        <v-checkbox v-model="form.realtime_results"></v-checkbox>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Real-time results</v-list-item-title>
                        <v-list-item-subtitle>Show results in real time as votes are casted, otherwise after the election.</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-action>
                        <v-checkbox v-model="form.results_visible_to_all"></v-checkbox>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Result visibility</v-list-item-title>
                        <v-list-item-subtitle>Results are visible to all voters and contestants</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                
                </v-card-text>
              </v-card>

               <v-btn text @click="step = 3" color="grey">
                <v-icon small>mdi-chevron-left</v-icon>
                Previous
              </v-btn>
               <v-btn text @click="step = 5" depressed color="primary">
                Next
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>

            </v-stepper-content>

            <v-stepper-content step="5">
              <v-card flat max-width="800">
                <v-subheader>Complete your setup</v-subheader>
                <v-card-text>
                  <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                    Fugit laboriosam a cum, accusantium labore quidem dolorem fuga 
                    quia temporibus ad perferendis? Dignissimos
                  </p>

                  <v-select
                    class="mt-5"
                    :items="verification_methods"
                    v-model="form.verification_method"
                    label="Select voter verification method"
                  ></v-select>

                  <div class="font-weight-bold text-center title">
                    <div>Amount due:</div>
                    NGN {{(no_of_voters * price_per_voter).toLocaleString()}}
                  </div>
                  
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                    <!-- <paystack
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
                  </paystack> -->
                  <v-btn color="success" @click="create">Create Election</v-btn>
                </v-card-actions>
              </v-card>

              <v-btn text @click="step = 4" color="grey">
                <v-icon small>mdi-chevron-left</v-icon>
                Previous
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="6">
              <v-card light>
                <v-card-text>
                  <p>Election Created successfully!</p>
                  
                </v-card-text>
                <v-card-actions :class="[{'d-block': $vuetify.breakpoint.xsOnly}]">
                  
                  <v-btn color="success" to="/elections/manager" 
                    :block="$vuetify.breakpoint.xsOnly" 
                    :class="[{'mb-2 ml-0': $vuetify.breakpoint.xsOnly}]">
                    Election Manager
                  </v-btn>
                  <v-btn color="success" to="/elections/vote" 
                    :block="$vuetify.breakpoint.xsOnly" 
                    :class="[{'mb-2 ml-0': $vuetify.breakpoint.xsOnly}]">
                    Election page
                  </v-btn>
                  
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
      persistent width="300"  >
      <v-card color="primary" dark class="justify-center">
        <v-card-text>
          <v-row row wrap justify-space-around align-center>
            <v-col>
              {{p_text}}
            </v-col>
            <v-col>
              <v-progress-circular
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-circular>
            </v-col>
          </v-row>
          
          
        </v-card-text>
      </v-card>
      
    </v-dialog>

  </div>
</template>
<script>
import api from '@/services/api'
  import api2 from '@/services/api2'
  import { mapGetters, mapState } from 'vuex'
  import Navigation from '@/components/Navigation'
  import paystack from 'vue-paystack'
  import randomWords from 'random-words'
  // import {firebase, db, database} from '@/plugins/firebase'

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
    dialog3: false,
    dialog2: false,
    modal5: false,
    p_text: 'Verifying...',
    creating_election_dialog: false,
    role_input: '',
    role_input_desc: '',
    modal: false,
    modal2: false,
    modal3: false,
    today: new Date().getTime(),
    step: 1,
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
      enddate: '',
      endtime: '',
      time: '',
      electionDuration: 5,
      auto_enroll_admin: true,
      // public: true,
      roles: [
        {title:'president', value:'president', description:''},
        {title:'secretary', value:'secretary', description:''},
        {title:'treasurer', value:'treasurer', description:''},
        {title:'financial secretary', value:'financial secretary', description:''},
        {title:'director of sports', value:'director of sports', description:''},
        {title:'provost', value:'provost', description:''},
        {title:'vice president', value:'vice president',description:''},
        {title:'director of socials', value:'director or socials', description:''}
      ],
      self_registration: false,
      voter_list: [],
      allow_multiple_voting: false,
      secret_ballot: true,
      realtime_results: true,
      results_visible_to_all: true,
      verification_method: 'phone',
    },
    verification_methods: [
      {text: 'Bvn verification (high security)', value: 'bvn'},
      {text: 'Phone number verification (moderate security)', value: 'phone'}
    ],
    electionTypes: [
      {text:'School', disabled: false},
      // {text:'Organizations', disabled: false},
      {text:'Governement - comming soon',disabled: true},
      {text:'Others', disabled: false},
    ],
    levels: [
      [
        {text: 'Students Council Election', value: 'General'},
        {text: 'Faculty Election', value: 'Faculty'},
        {text: 'Departmental Election', value: 'Department'}
      ],
      ['Federal', 'State','Local governement'],
      ['General']
    ],
    rules: {
      counter: value => value.length <= 100 || 'Max 100 characters',
    },
    reference: reference(), //Date.now() + btoa(Math.random()).substring(0,12)

  }),
  computed: {
    breakpoint(){
      return this.$vuetify.breakpoint
    },
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
      // (this.form.type == 'School' && !this.form.school) ||
      // (this.form.level == 'Faculty' && !this.form.faculty) ||
      // (this.form.level == 'Department' && !this.form.department) || 
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
      'getMyEnrolled'
    ]),
    ...mapState([
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
          this.step = 6
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
    createNewElection(){
      // create an election

      this.creating_election_dialog = true
      this.p_text = 'Creating Election...'

      let electionId = randomWords({exactly: 2, join: '-'})

      this.form.fullStartDate = (new Date(this.form.date + ' ' + this.form.time)).toISOString()
      this.form.title = this.$sanitize(this.form.title)

      let election_data = {
        title: this.form.title,
        type: this.form.type,
        level: this.form.level,
        timed: this.form.timed,
        electionId: electionId,
        contestants_count: 0,
        sch: this.getUser.sch,
        fac: this.getUser.fac,
        dept: this.getUser.dept,
        startDate: this.form.date,
        endDate: this.form.enddate,
        fullStartDate: this.form.fullStartDate,
        startTime: this.form.time,
        endTime: this.form.endtime,
        duration: this.form.electionDuration,
        voterSize: this.no_of_voters,
        voters_count: this.form.auto_enroll_admin ? 1 : 0,
        votersByDept: {},
        self_registration: false,
        // voter_list: [],
        allow_multiple_voting: this.form.type == 'School' ? false : this.form.allow_multiple_voting,
        secret_ballot: this.form.type == 'School' ? false : this.form.secret_ballot,
        realtime_results: this.form.realtime_results,
        results_visible_to_all: this.form.results_visible_to_all,
        verification_method: this.form.verification_method,
        dateCreated: Date.now(), // ** TO DO **
        status: 'inRegistration',
        // public: this.form.public,
        official: false
      }

      // create the election
      let election = this.$gun.get('elections')
        .get(electionId)
        .put(election_data)


      // set the admin for the election
      let user = this.$gun.get(this.getUser.username)
      election.get('admin').put(user)
      election.get('admins').set(user)

      // add the roles
      let temp_role = []
      this.form.roles.forEach(role=>{
        let new_token = randomWords({exactly:2, join: '-'})
        
        election.get('roles')
        .get(this.$uuidv4())
        .put({
          title: role.title,
          description: role.description,
          value: new_token,
          token: new_token
        })
      })

      // add the payment plan
      // election.get('plan')
      //   .put({
      //     range: `0 to ${this.no_of_voters}`,
      //     max_voters: this.no_of_voters,
      //     amount: this.no_of_voters * this.price_per_voter
      //   })

      // save the election for the creator
      let u = this.$gun.get(this.getUser.username)
      let el = this.$gun.get('elections').get(electionId)

      user.get('created')
        .set(el)

      if(this.form.auto_enroll_admin){
        
        // enroll the creator

        election.get('voters')
          .set(u)
        user.get('enrolled')
          .set(el)
      }

      // get the new election
      election.once(d => {

        // console.log({d})

          this.$store.dispatch('setMyEnrolled', {
            election: d,
            merge: true
          })
    
          this.$store.dispatch('curRoom', d)
          
          
    
          this.creating_election_dialog = false;
          this.plan_dialog = false;
    
          //this.loading = !this.loading
          this.snackbar = {
            show: true,
            message: 'Election created successfully',
            color: 'success'
          }
          this.step = 5
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
      this.verifyTxn(res)
      // this.create(res)
    },
    close(res){
      // this.reference = Date.now() + btoa(Math.random()).substring(0,12)
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
      this.p_text = 'Verifying...'

      firebase.auth().currentUser.getIdToken()
      .then((token)=>{
        api().post('/verifyTxn', {
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

      // this.createPaymentRef(data).then(doc=>{
        // this.reference = Date.now() + btoa(Math.random()).substring(0,12)
        // this.createElection()
      // })
      this.createNewElection()
    }
  },
  components: {
    Navigation,
    paystack,
  },
  created(){

    // this.setThingsUp()
  }
}

function reference(){
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( let i=0; i < 10; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
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
  
  //.v-stepper{
   // min-height:100vh;
  //}
  
</style>
)