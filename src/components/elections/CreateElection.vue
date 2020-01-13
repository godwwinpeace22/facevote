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
            <v-stepper-step :complete="step > 3" step="3">Contestants and Roles</v-stepper-step>
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
                        persistent-hint
                        hint="Only students can create school elections"
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
                            :allowed-dates="allowedDates" 
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
                          <v-time-picker v-if="modal2" format="ampm" 
                            v-model="form.time" header-color='primary'
                            :allowed-hours="allowedHours">
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
													scrollable :allowed-dates="allowedDates2" 
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

												<v-time-picker v-if="modal3" format="ampm" 
                          :allowed-hours="allowedHours2" 
                          v-model="form.endtime" 
                          header-color='primary'>
													<v-spacer></v-spacer>

														<v-btn text  @click="modal3 = false">Cancel</v-btn>
														<v-btn text color="success" outlined 
                              @click="$refs.dialog3.save(form.endtime)">
                              OK</v-btn>
												</v-time-picker>

											</v-dialog>
										</v-col>

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

                         <v-btn text color="success" 
                          @click.native="addrole" 
                          :disabled="!role_input.trim()">
                          Add role</v-btn>
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

                  <v-subheader class="font-weight-bold mb-2 pl-0">Who can contest for this election?</v-subheader>
                  <v-radio-group class="" v-model="form.who_can_contest" mandatory>
                    <v-radio label="Everyone" value="everyone"></v-radio>
                    <v-radio label="Everyone with access token" value="everyone_with_access"></v-radio>
                    <v-radio label="Manual selection" value="manual"></v-radio>
                  </v-radio-group>

                  <v-checkbox light 
                    label="Automatically enroll me into this election" 
                    v-model="form.auto_enroll_admin" value>
                  </v-checkbox>
                  
                </v-container>
                
              </v-card>
              <v-card-actions>
                 <v-btn text @click="step = 2" color="grey">
                  <v-icon small>mdi-chevron-left</v-icon>
                  Previous
                </v-btn>
                <v-btn color="success" depressed @click="step = 4" v-if="!disabled_step_three">
                  Next step <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-actions>
              
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card color="" flat class="mb-5" light>
                <v-card-text>

                  <v-subheader class="font-weight-bold mb-2">Who Can Vote</v-subheader>
                  
                  <v-radio-group class="ml-4" v-model="form.who_can_vote" mandatory>
                    
                    <v-radio 
                      label="Anyone can vote ananymouosly" 
                      value="anyone"></v-radio>
                    <!-- <v-radio 
                      label="Only those with access token can vote" 
                      value="anyone_with_access"></v-radio> -->
                    <v-radio 
                      label="Only those added manually can vote" 
                      value="manual"></v-radio>
                  </v-radio-group>

                  <v-subheader class="font-weight-bold mb-2">Voter Verification Method</v-subheader>
                  
                  <v-radio-group class="ml-4" v-model="form.verification_method" mandatory>
                    
                    <v-radio 
                      label="Default - the default level of verification" 
                      value="default"></v-radio>
                    <v-radio 
                      label="BVN Verification (Nigeria Only)" 
                      value="bvn"></v-radio>
                    <v-radio 
                      label="Face recognition (Soon)" 
                      value="face_rec" disabled></v-radio>
                    <v-radio
                      label="Finger print (Soon)" 
                      value="face_rec" disabled></v-radio>
                  </v-radio-group>

                  <v-divider class="m"></v-divider>

                  <v-list three-line subheader>
                    <v-subheader class="font-weight-bold mb-0">Voting</v-subheader>
                    <v-list-item :disabled="form.type != 'Others'">
                      <v-list-item-action>
                        <v-checkbox 
                          :disabled="form.type != 'Others'"
                          v-model="form.allow_multiple_voting"
                          class="mt-0"
                          color="success">
                        </v-checkbox>
                        
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Allow multiple voting</v-list-item-title>
                        <v-list-item-subtitle>Voters vote more than once</v-list-item-subtitle>
                        <!-- <v-list-item-subtitle 
                          class="warning--text">
                          Note: This option is not available for school and government elections.
                        </v-list-item-subtitle> -->
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
               <v-btn depressed @click="step = 5" color="primary">
                Next
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>

            </v-stepper-content>

            <v-stepper-content step="5">
              <v-card flat outlined>
                <div class="v-card__title">Complete your setup</div>
                <v-card-text>
                  <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                    Fugit laboriosam a cum, accusantium labore quidem dolorem fuga 
                    quia temporibus ad perferendis? Dignissimos
                  </p>

                  <v-row justify="center">
                    <v-col cols="12" sm="4" md="3" v-for="plan in plans" :key="plan.amount + '-a'">
                      <v-card outlined>
                        <v-card-title primary-title :class="[plan.color, 'white--text']">
                          {{plan.title}}
                        </v-card-title>
                        <div class="v-card__title">
                          <span>$ {{plan.amount}}</span> 
                          <!-- <small class="ml-3">per election</small> -->
                        </div>
                        <v-divider></v-divider>
                          <v-list three-line>
                            <v-list-item >
                              <!-- <v-list-item-action>
                                <v-icon>mdi-home</v-icon>
                              </v-list-item-action> -->
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-icon color="success" small>mdi-check</v-icon>
                                  # of contests
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                  {{plan.feature1.text}}
                                </v-list-item-subtitle>

                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item >
                              <!-- <v-list-item-action>
                                <v-icon>mdi-home</v-icon>
                              </v-list-item-action> -->
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-icon color="success" small>mdi-check</v-icon>
                                  # of voters
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                  {{plan.feature2.text}}
                                </v-list-item-subtitle>

                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item >
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-icon color="success" small>mdi-check</v-icon>
                                  Duration of contest
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                  {{plan.feature3.text}}
                                </v-list-item-subtitle>

                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn v-if="plan.amount == 'Custom'"
                            color="info" block depressed target="_blank"
                            href="https://voteryte.com/contact">
                            Let's talk
                          </v-btn>
                          <v-btn v-else
                            color="info" block depressed 
                            @click="selected_plan = plan; plan_dialog = true;">
                            Select
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                  
                  <v-btn text href="https://voteryte.com/pricing" 
                    color="primary" target="_blank">
                    See detailed pricing
                    <v-icon small class="ml-1">mdi-open-in-new</v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
              

              <v-btn text @click="step = 4" color="grey">
                <v-icon small>mdi-chevron-left</v-icon>
                Previous
              </v-btn>
            </v-stepper-content>

          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-container>
    <!--stepper -->

    <v-dialog v-model="plan_dialog" max-width="500">
      <v-card>
        <v-card-title primary-title>
          Selected Plan
        </v-card-title>
        <v-card-text>
          oriosam a cum, accusantium labore quidem dolorem fuga 
          quia temporibus ad perferendis? Dignissimos
          {{selected_plan}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <paystack 
            v-if="selected_plan.amount > 0"
            :amount="selected_plan.amount * 100"
            :email="getUser.email"
            :metadata="metadata"
            :paystackkey="$paystackKey"
            :reference="$helpers.getRandomString()"
            :callback="verifyTxn"
            :close="onClose"
            :embed="false"
          >
            <v-btn class="ml-0 mt-3" depressed block color="primary">Make Payment</v-btn>
          </paystack>
            <v-btn class="ml-0 mt-3" 
              depressed block 
              v-else @click="createNewElection"
              color="primary">
              Create
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- < Creating Election Progress Dialog> -->
    <v-dialog v-model="progress_dialog"
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
  import { mapGetters, mapState } from 'vuex'
  import paystack from 'vue-paystack'

export default {
  data: ()=>({
    title: 'Create new election | Voteryte',
    description: '',
    snackbar: {},
    plan_dialog: false,
    selected_plan: 'a',
    price_per_voter: 8,
    no_of_voters: 500,
    newElec: {}, // the newly created election
    loading: false,
    dialog: false,
    dialog3: false,
    dialog2: false,
    modal5: false,
    p_text: 'Verifying...',
    progress_dialog: false,
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
      who_can_vote: 'manual',
      voter_list: [],
      who_can_contest: 'everyone_with_access',
      allow_multiple_voting: false,
      realtime_results: true,
      results_visible_to_all: true,
      verification_method: 'default',
    },
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

  }),
  watch: {
    'form.date': function(e){
     
      this.form.enddate = ''
      this.form.endtime = ''
    },
    'form.enddate': function(e){
     
      this.form.endtime = ''
    },
    'form.time': function(e){
     
      this.form.enddate = ''
      this.form.endtime = ''
    }
  },
  computed: {
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    plans(){
      return [
        {amount: 0, title: 'Free', color: 'orange', max_voters: 200,
          feature1: {title: 'Number of contests', text: 'One contest'},
          feature2: {title: 'Voters', text: 'Up to 200 voters'},
          feature3: 'Unlimited contest duration'
        },
        {amount: 15000, title: 'Jam', color: 'primary', max_voters: 5000,
          feature1: {title: 'Number of contests', text: 'One contest'},
          feature2: {title: 'Voters', text: 'Up to 5,000 voters'},
          feature3: {title: 'Contest duration', text: 'Unlimited contest duration'}
        },
        {amount: 65000, title: 'Legion', color: 'success', max_voters: 30000,
          feature1: {title: 'Number of contests', text: 'One contest'},
          feature2: {title: 'Voters', text: 'Up to 30,000 voters'},
          feature3: {title: 'Contest duration', text: 'Unlimited contest duration'},
        },
        {amount: 'Custom', title: 'Swarm', color: 'cyan',
          feature1: {title: 'Number of contests', text: 'One contest'},
          feature2: {title: 'Voters', text: 'Up to 1000 voters'},
          feature3: {title: 'Contest duration', text: 'Unlimited contest duration'}
        },
      ]
    },
    metadata(){
      return {
        orderid: this.$helpers.getRandomString(),
        custom_fields: [
          {
            display_name: "Amount Paid",
            variable_name: "amount_paid",
            value: this.selected_plan.amount
          },
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: this.getUser.name
          },
          {
            display_name: "CustomerId",
            variable_name: "customer_id",
            value: this.getUser.username
          }
        ]
      }
    },
    electionTypes(){
      return [

        {text:'School', disabled: !this.getUser.is_student},
        // {text:'Organizations', disabled: false},
        {text:'Governement - comming soon',disabled: true},
        {text:'Others', disabled: false},
      ]
    },
    disabled_step_one(){
      return !this.form.title.trim() || this.form.title.trim().length > 100 || !this.form.type || 
      (this.form.type == 'School' && !this.form.level) || (this.form.type == 'Governement' && !this.form.level)
       
    },
    disabled_step_two(){
      return this.form.timed && 
      (!this.form.date || 
      !this.form.time || 
      !this.form.enddate || 
      !this.form.endtime || 
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
    allowedDates2(val){
			// only allow dates greater than or equal to today
			let startdate = new Date(this.form.date).getTime()
      
			let enddate = new Date(val).getTime()
	
			return startdate <= enddate
    },
    allowedHours(val){
      // only allow hours that are not yet past
      let curHour = new Date().getHours()
			let today = (new Date()).toISOString().substring(0,10)
      if(this.form.date == today){

				return curHour < val
			}
			else {
				return true
			}
    },
    allowedHours2(val){
    
      let starttime = this.form.time.split(':')[0]
      // console.log(starttime, val)

      if(this.form.date == this.form.enddate){
        return starttime < val
      }
      else {
        return true
      }
      
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
    createNewElection(){
      // create an election

      this.progress_dialog = true
      this.p_text = 'Creating Election...'

      let electionId = this.$uuidv4()

      this.form.fullStartDate = (new Date(this.form.date + ' ' + this.form.time)).toISOString()
      this.form.title = this.$sanitize(this.form.title)

      let election_data = {
        title: this.form.title,
        type: this.form.type,
        level: this.form.level,
        timed: this.form.timed,
        electionId: electionId,
        sch: this.getUser.sch,
        fac: this.getUser.fac,
        dept: this.getUser.dept,
        startDate: this.form.date,
        endDate: this.form.enddate,
        fullStartDate: this.form.fullStartDate,
        startTime: this.form.time,
        endTime: this.form.endtime,
        contestants_count: 0,
        voters_count: this.form.auto_enroll_admin ? 1 : 0,
        voterSize: this.selected_plan.max_voters,
        votersByDept: {},
        who_can_vote: this.form.who_can_vote,
        allow_multiple_voting: this.form.type != 'Others' ? false : this.form.allow_multiple_voting,
        realtime_results: this.form.realtime_results,
        results_visible_to_all: this.form.results_visible_to_all,
        verification_method: this.form.verification_method,
        who_can_contest: this.form.who_can_contest,
        cont_access_token: this.$helpers.getRandomString(),
        voter_access_token: this.$helpers.getRandomString(),
        enable_forum: true,
        allow_manifestos: true,
        dateCreated: this.$Gun.state(),
        status: 'not_started',
        official: false,
        plan: this.selected_plan.title
      }

      // create the election
      let election = this.$gun.get('elections')
        .get(electionId)
        .put(election_data)


      // set the admin for the election
      let user = this.$gun.get('users').get(this.getUser.username)
      election.get('admin').put(this.getUser.username)
      election.get('admins').set(user)

      // add the roles
      let temp_role = []
      this.form.roles.forEach(role=>{
        let new_token = this.$uuidv4()
        
        election.get('roles')
        .get(this.$uuidv4())
        .put({
          title: role.title,
          description: role.description,
          value: new_token,
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
      let u = this.$gun.get('users').get(this.getUser.username)
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
          
          
    
          this.progress_dialog = false;
          this.plan_dialog = false;
    
          //this.loading = !this.loading
          this.snackbar = {
            show: true,
            message: 'Election created successfully',
            color: 'success'
          }

          this.$router.push(`/elections/${electionId}/manager`)
          // this.step = 5
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
    onClose(res){
      
    },
    verifyTxn(res){
      // verfy on the server that the transaction is ok
      this.progress_dialog = true
      this.p_text = 'Verifying...'
      
      this.$helpers.verifyTxn({
        amount: this.selected_plan.amount,
        ref: res.reference,
        token: this.getUser.token
      })
      .then(d => {
        this.createNewElection()
      })
      .catch(err => {

        console.log(err)

        this.snackbar = {
          show: true,
          message: 'Transaction not completed',
          color: 'error'
        }
      })
      
    },
  },
  components: {
    
    paystack,
  },
  created(){

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
  
  //.v-stepper{
   // min-height:100vh;
  //}
  
</style>
)