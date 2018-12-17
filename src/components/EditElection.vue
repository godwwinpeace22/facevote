<template>
  <v-layout>
    
    <v-flex>
      <vue-headful
        :title="title"
      />
    <v-stepper v-model="e6" vertical non-linear>
      <v-stepper-step :complete="e6 > 1" step="1">
        Election info
        <small>General information about the election</small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-layout>
          <v-flex xs12 sm10>
            <v-card class="mb-5" flat>
              <v-card-text>{{text}}
                <v-divider></v-divider>
              </v-card-text>
              
              <v-layout row wrap>
                <v-flex xs12 sm4>
                  <v-subheader class="pl-0 font-weight-bold">Title for the election</v-subheader>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="Title" :height="50" outline v-model="form.title" small color="secondary"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm4>
                  <v-subheader class="pl-0 font-weight-bold">The type of election to create</v-subheader>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select required small outline v-model="form.type" 
                  :items="electionTypes" color='secondary' label="Election type" >
                </v-select>
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="form.type == 'School'">
                <v-flex xs12 sm4>
                  <v-subheader class="pl-0 font-weight-bold">Select your institution</v-subheader>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select required outline
                    v-model="selected_school"
                    :items="schools" return-object
                    color="secondary"
                    label="School or College"
                  ></v-select>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12  sm4>
                  <v-subheader class="pl-0 font-weight-bold">Election level</v-subheader>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select required small outline v-model="form.level" 
                  :items="form.type == 'School' ? levels[0]: levels[1]" 
                  color="secondary"  label="Level" ></v-select>
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="form.type == 'School' && (form.level == 'Faculty' || form.level == 'Department')">
                <v-flex xs12 sm4>
                  <v-subheader class="pl-0 font-weight-bold">Faculty name</v-subheader>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select required small v-model="selected_faculty"
                  :items="selected_school.faculties"  outline return-object
                  color="secondary" label="Select faculty">
                </v-select>
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="form.type == 'School' && form.level == 'Department'">
                <v-flex xs12 sm4>
                  <v-subheader class="pl-0 font-weight-bold">Department name</v-subheader>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select required small outline
                    v-model="selected_department" return-object
                    :items="selected_faculty ? selected_faculty.departments : []"
                    color="secondary"
                    label="Select department"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
        <v-btn color="success" @click="e6 = 2" :disabled="disabled_step_one">Next step</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2" >Add a scheldule</v-stepper-step>

      <v-stepper-content step="2">
        <v-layout>
          <v-flex xs12 sm10>
            <v-card class="mb-5 mr-1 ml-2 mt-3" min-height="200px">
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
                  <v-dialog
                    ref="dialog" v-model="modal" :return-value.sync="form.date" min="2018-07-18" persistent lazy full-width width="290px">
                    <v-text-field :disabled="!timed" slot="activator" v-model="form.date" label="Election start date" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="form.date" scrollable header-color="secondary">
                      <v-spacer></v-spacer>
                      <v-btn flat @click="modal = false">Cancel</v-btn>
                      <v-btn flat color="success" outline @click="$refs.dialog.save(form.date)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>

                <v-flex sm4 mr-4>
                  <v-dialog ref="dialog2" v-model="modal2" :return-value.sync="form.time" persistent lazy full-width width="290px">
                    <v-text-field slot="activator" v-model="form.time" label="Time" prepend-icon="access_time" readonly></v-text-field>
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
                  <v-subheader class="font-weight-bold">Duration</v-subheader>
                </v-flex>
                <v-flex sm6 mr-4>
                  <v-slider color="secondary" v-model="form.electionDuration" thumb-color="primary" thumb-label :thumb-size="24" :label="form.electionDuration + ' hrs'"  max='24'></v-slider>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
        <v-btn flat @click="e6 = 1">Previous</v-btn>
        <v-btn color="success" @click="e6 = 3" :disabled="disabled_step_two">Next step</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3">Add roles</v-stepper-step>

      <v-stepper-content step="3">
        <v-layout>
          <v-flex xs12 sm10>
            <v-card color="" class="mb-5 ml-2" style="min-height:200px;">
              <v-toolbar color="grey" light flat height="50px">
                <v-btn fab small color="white" bottom left absolute @click.native.stop="dialog = !dialog">
                  <v-icon>add</v-icon>
                </v-btn>
                <v-toolbar-title class="white--text font-weight-bold">Create new roles</v-toolbar-title>
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
                      <v-btn color="success" outline @click.native="addrole" :disabled="!role_input">Add role</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-select class="mt-4" deletable-chips
                  v-model="form.roles" dense
                  :items="form.roles"
                  item-text="title" cache-items
                  item-value="title"
                  color="secondary"
                  chips label="Roles"
                  multiple outline
                ></v-select>
              </v-container>
              
            </v-card>
          </v-flex>
        </v-layout>
        <v-btn flat @click="e6 = 2">Previous</v-btn>
        <v-btn color="success" @click="editElection" :disabled="disabled_step_three">Save</v-btn>
      </v-stepper-content>
    </v-stepper>
 
  </v-flex>
  </v-layout>
</template>
<script>
export default {
  data:()=>({
    title:'Edit election | Facevote',
    dialog:false,
    role_input:null,
    role_input_desc:null,
    modal:false,
    modal2:false,
    election:[],
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
      roles:[]
    },
    electionTypes:['School','Governement','Organizations','Others'],
    levels:[
      ['General', 'Faculty','Department'],
      ['Federal', 'State','Local governement']
    ],
    selected_school:'',
    selected_faculty:'',
    selected_department:'',
    schools:[
      {
        text:'UNN',
        value:'Unn',
        faculties:[
          {
            text:'Physical science',
            value:'Physical_science',
            departments:[
              {
                text:'Physics and Astronomy',
                value:'phy'
              },
              {
                text:'Computer Science',
                value:'cs',
              },
              {
                text:'Geology',
                value:'geology'
              },
              {
                text:'Chemistry',
                value:'chemistry'
              },
              {
                text:'Statistics',
                value:'statistics'
              }
            ]
          },
          {
            text:'Biological Sciences',
            value:'biological_sciences',
            departments:[
              {
                text:'Biochemistry',
                value:'biochemistry',
              },
              {
                text:'Microbiology',
                value:'microbiology'
              }
            ]
          }
        ]
      }
    ],

  }),
  props:['jump_step'],
  computed:{

    disabled_step_one(){
      return !this.form.title.trim() || !this.form.type || !this.form.level || 
      (this.form.type == 'School' && !this.selected_school) ||
      (this.form.level == 'Faculty' && !this.selected_faculty) ||
      (this.form.level == 'Department' && !this.selected_department)
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
  },
  methods:{
    addrole(){
      if(this.role_input.length == 0){
        alert("Add a role")
        return 
      }
      this.dialog = false;
      this.form.roles.push({
        title:this.role_input,
        description:this.role_input_desc
      })
      this.role_input = '' //empty it
      this.role_input_desc = ''
    },
    async editElection(event){
      try {
        // when a role is deleted the value becomes 'false'. Trim all those 'false' items
        //this.form.roles = this.form.roles.filter(role => role != false)
        this.form.school = this.selected_school.text
        this.form.faculty = this.selected_faculty.text
        this.form.department = this.selected_department.text
        let res = await api().post(`dashboard/editElection/${this.$route.params.electionId}/${this.$store.getters.getUser.username}`,
          {token:this.$store.getters.getToken, ...this.form}
        )
        console.log(res.data)
        alert('election updated succesfully')
        } catch (error) {
        console.log(error.response)
      }
    }
  },
  async mounted(){
    let res = await api().post(`dashboard/getElectionByAdmin/${this.$store.getters.getUser.username}`, 
      {token:this.$store.getters.getToken}
    )
  
    this.election = res.data
    for(let item in this.form){
      this.form[item] = this.election[item]
    }
    
    this.form.date = this.election.startDate
    this.form.time = this.election.startTime
    this.form.electionDuration = this.election.duration
    
    let found = this.schools.find(item => item.value == this.election.school)
    //console.log(found)
    found ? this.selected_school = found : ''
    if(found){
      this.selected_faculty = this.selected_school.faculties.find(item => item.text == this.election.faculty)
      console.log(this.selected_faculty)
      this.selected_faculty ? 
      this.selected_department = this.selected_faculty.departments.find(item => item.text == this.election.department) : ''
    }

    //console.log(this.form,res.data)
    this.jump_step ? this.e6 = 3 : ''

  },
  created(){
    //document.title = 'Edit Election'
  }
}
import api from '@/services/api'
</script>
<style lang="scss" scoped>
  .theme--light.v-text-field--outline .v-input__slot {
    border: 1px solid rgba(115, 114, 114, 0.54);
  }
</style>

