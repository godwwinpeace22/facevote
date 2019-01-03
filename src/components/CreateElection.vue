<template>
  <div>
    <vue-headful :title="title" :description="description"/>
    <navigation>
      <span slot="title">Dashboard</span>
      <h1 slot="extended_nav">Create Election</h1>
    </navigation>
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <v-container>
      <v-card class="round">
        <v-stepper v-model="e6" vertical>
          <v-stepper-step :complete="e6 > 1" step="1">
            Election info
            <small>General information about the election</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-layout>
              <v-flex xs12 sm10>
                <v-card class="mb-5 ma-2" flat>
                  <v-card-text class="pl-0">{{text}}
                    <v-divider></v-divider>
                  </v-card-text>
                  
                  <v-layout row wrap class="mb-3">
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 font-weight-bold">Title for the election</v-subheader>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-text-field color="secondary" label="Title" outline v-model="form.title" small></v-text-field>
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
                        :disabled="electionTypes.disabled"
                        color="secondary"
                        label="Election type"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap v-if="form.type == 'School'" class="mb-3">
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 font-weight-bold">Select your institution</v-subheader>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-select required outline disabled
                        v-model="form.school"
                        :items="getSchools" return-object
                        color="secondary"
                        label="School or College"
                      ></v-select>
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
                      <v-subheader class="pl-0 font-weight-bold">Faculty name</v-subheader>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-select required small v-model="form.faculty" disabled
                        :items="form.school.faculties"  outline return-object
                        color="secondary" label="Select faculty">
                      </v-select>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap v-if="form.type == 'School' && form.level == 'Department'" class="mb-3">
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 font-weight-bold">Department name</v-subheader>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-select required small outline disabled
                        v-model="form.department" return-object
                        :items="form.faculty.departments"
                        color="secondary"
                        label="Select department"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
            <v-btn color="success" @click="e6 = 2" :disabled="disabled_step_one">Next step <v-icon>chevron_right</v-icon></v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="e6 > 2" step="2">Add a schedule</v-stepper-step>

          <v-stepper-content step="2">
            <v-layout>
              <v-flex xs12 sm8>
                <v-card class="mb-5 mr-1 mt-3">
                  <!--schedule elections --> 
                  <v-layout row >
                    <v-flex sm10 ><v-subheader class="font-weight-bold">Create timed election</v-subheader></v-flex>
                    <v-flex sm2 style="padding-bottom:0px;">
                      <v-switch value v-model="timed" color="success"></v-switch>
                    </v-flex>
                  </v-layout>
                  <v-divider v-show="timed"></v-divider>
                  <v-layout row v-show="timed">
                    <v-flex sm4>
                      <v-subheader class="font-weight-bold">Start time</v-subheader>
                    </v-flex>
                    <v-flex sm4>
                      <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.date"
                        :min="new Date()" persistent lazy full-width width="290px" >

                        <v-text-field :disabled="!timed" slot="activator" color="secondary" v-model="form.date"
                          label="Date" prepend-icon="event" readonly>
                        </v-text-field>
                        <v-date-picker v-model="form.date" scrollable header-color="secondary">
                          <v-spacer></v-spacer>
                          <v-btn flat   @click="modal = false">Cancel</v-btn>
                          <v-btn flat small outline color="success" @click="$refs.dialog.save(form.date)">OK</v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-flex>

                    <v-flex sm4 mr-4>
                      
                      <v-dialog ref="dialog2" v-model="modal2" :return-value.sync="form.time"
                        persistent lazy full-width width="290px" >

                        <v-text-field  slot="activator" v-model="form.time"  label="Time" color="secondary"
                          prepend-icon="access_time" readonly >
                        </v-text-field>
                        <v-time-picker v-if="modal2" v-model="form.time" header-color='secondary'>
                          <v-spacer></v-spacer>
                          <v-btn flat  @click="modal2 = false">Cancel</v-btn>
                          <v-btn flat color="success" outline @click="$refs.dialog2.save(form.time)">OK</v-btn>
                        </v-time-picker>
                      </v-dialog>
                    </v-flex>
                  </v-layout>
                  <v-divider v-show="timed"></v-divider>
                  <!-- duration -->
                  <v-layout row v-show="timed">
                    <v-flex sm4>
                      <v-subheader class='font-weight-bold'>Duration</v-subheader>
                    </v-flex>
                    <v-flex sm8 mr-4>
                      <v-slider v-model="form.electionDuration" thumb-color="secondary"
                        :thumb-size="24" thumb-label :label="form.electionDuration + ' hrs'" :max='7'>
                      </v-slider>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
            <v-btn flat @click="e6 = 1">Previous</v-btn>
            <v-btn color="success" @click="e6 = 3" :disabled="disabled_step_two">Next step <v-icon>chevron_right</v-icon></v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="e6 > 3" step="3">Add roles</v-stepper-step>

          <v-stepper-content step="3">
            <v-card color="" class=" ma-0 mb-5 mx-1" style="min-height:200px;">
              <v-toolbar color="grey" light flat height="50px">
                <v-btn fab  small color="white" bottom left absolute @click.native.stop="dialog = !dialog">
                  <v-icon>add</v-icon>
                </v-btn>
                <v-toolbar-title class="white--text">Create new roles</v-toolbar-title>
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
              </v-container>
              
            </v-card>
            <v-btn flat @click="e6 = 2">Previous</v-btn>
            <v-btn color="success" @click="e6 = 4" :disabled="disabled_step_three">Next step <v-icon>chevron_right</v-icon></v-btn>
          </v-stepper-content>

          <v-stepper-step step="4" :complete="e6 > 4">Select billing plan</v-stepper-step>
          <v-stepper-content step="4">
            <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
            <v-btn flat @click="e6 = 3">Previous</v-btn>
            <v-btn color="success" @click="createElection" :loading="loading">Next step <v-icon>chevron_right</v-icon></v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-container>
    <!--stepper -->
    

  </div>
</template>
<script>
import api from '@/services/api'
import randomWords from 'random-words'
import {VTimePicker} from 'vuetify'
import { mapGetters } from 'vuex'
import Navigation from '@/components/Navigation'
//import { promisfy } from "@/helpers/promisify";
export default {
  data:()=>({
    title:'Create new election',
    description:'',
    snackbar:{},
    loading:false,
    dialog:false,
    role_input:null,
    role_input_desc:null,
    modal:false,
    modal2:false,
    timed:true,
    e6:1,
    text:'Lo consequatur nostrum blanditiis expedita omnis accusantium vitae veritatis aut?',
    form:{
      title:'',
      type:'',
      school:'',
      level:'',
      faculty:'',
      department:'',
      date:'',
      time:'',
      electionDuration:5,
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

  }),
  computed:{

    disabled_step_one(){
      return !this.form.title.trim() || !this.form.type || !this.form.level || 
      (this.form.type == 'School' && !this.form.school) ||
      (this.form.level == 'Faculty' && !this.form.faculty) ||
      (this.form.level == 'Department' && !this.form.department)
    },

    disabled_step_two(){
      return this.timed && (!this.form.date || !this.form.time || this.form.electionDuration == 0)
      
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
      'getSchools'
      // ...
    ]),
  },
  methods:{
    async allSchools(){
      try {
        let schls = await api().post('dashboard/getSchools')
        this.$store.dispatch('setSchools', schls.data)
        //this.schools = schls.data
        console.log(schls.data)
        this.setThingsUp()
      } catch (error) {
        console.log(error)
      }
    },
    addrole(){
      if(this.role_input.length == 0){
        alert("Add a role")
        return 
      }
      this.dialog = false;
      this.form.roles.push({
        title:this.role_input,
        value:this.role_input,
        description:this.role_input_desc
      })
      this.role_input = '' //empty it
      this.role_input_desc = ''
    },
    async createElection(event){

      this.loading = !this.loading
      this.form.school = this.form.school.text
      this.form.faculty = this.form.faculty.text
      this.form.department = this.form.department.text
      console.log(this.form)
      try {

        let electionId = randomWords({ exactly: 2, join: '-' })
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
          electionId:electionId,
          admin:this.getUser.email,
          followers:[],
          school:this.form.school,
          faculty:this.form.faculty,
          department:this.form.department,
          startDate:this.form.date,
          startTime:this.form.time,
          duration:this.form.electionDuration,
          roles:temp_role,
          dateCreated:Date.now(),
          status:'inRegistration',
          contestants:[],
          regVoters:[],
          voted:[],
        })

        // create new activity
        db.collection('activities').add({
          type:'election_created',
          by:this.getUser.uid,
          dateCreated:Date.now(),
          text:'created this election',
          electionRef:electionId
        })

        this.loading = !this.loading
        this.snackbar = {
          show:true,
          message:'Election created successfully',
          color:'success'
        }
        this.e6 = 1
      } catch (error) {
        this.snackbar = {
          show:true,
          message:'Something went wrong, try again',
          color:'error'
        }
      }
      
    },
    setThingsUp(){
      let this_user
      console.log(this.getUser.email)
      let userDetails = db.collection('moreUserInfo').doc(this.getUser.email);
      var getDoc = userDetails.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
            this_user = doc.data()
            console.log('Document data:', doc.data());
            this.form.school = this.getSchools.find(
              item => item.text == this_user.school
            )
            console.log(this.form.school.text.toLowerCase())
            this.form.faculty = this.form.school.faculties.find(
              item => item.text == this_user.faculty
            )

            this.form.department = this.form.faculty.departments.find(
              item => item.text == this_user.department
            )
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
    },
  },
  components:{
    Navigation
  },
  async created(){
    
    if(this.getSchools.length > 0){
      this.setThingsUp()
    }
    else{
      await this.allSchools()
    }
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
  .v-stepper{
    min-height:100vh;
  }
  
</style>
)