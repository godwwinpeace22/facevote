<template>
  <!--stepper -->
  <v-stepper v-model="e6" vertical>
    <v-stepper-step :complete="e6 > 1" step="1">
      Election info
      <small>General information about the election</small>
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-card class="mb-5 ma-2" hover>
        <v-card-text>{{text}}</v-card-text>
        <v-divider></v-divider>
        <v-layout row mx-3>
          <v-flex xs4>
            <v-subheader>Title for the election</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-text-field label="Title" v-model="form.title" small color="pink"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row mx-3>
          <v-flex xs4>
            <v-subheader>What type of election do you want to create ?</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-select required small
              v-model="form.type"
              :items="electionTypes"
              color="pink"
              label="Election type"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row mx-3 v-if="form.type == 'School'">
          <v-flex xs4>
            <v-subheader>Select your institution</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-select required small
              v-model="form.school"
              :items="schools"
              color="pink"
              label="School or College"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row mx-3>
          <v-flex xs4>
            <v-subheader>Election level</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-select required small
              v-model="form.level"
              :items="form.type == 'School' ? levels[0]: levels[1]"
              color="pink"
              label="Level"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row mx-3 v-if="form.level == 'Faculty'">
          <v-flex xs4>
            <v-subheader>Faculty name</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-select required small
              v-model="form.faculty"
              :items="faculties[form.school]"
              color="pink"
              label="Select faculty"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row mx-3 v-if="form.level == 'Department'">
          <v-flex xs4>
            <v-subheader>Department name</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-select required small
              v-model="form.department"
              :items="departments[form.school]"
              color="pink"
              label="Select department"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-card>
      <v-btn color="primary" @click="e6 = 2">Next step</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 2" step="2">Add a scheldule</v-stepper-step>

    <v-stepper-content step="2">
      <v-card class="mb-5 ma-2 mt-3" min-height="200px">
        <!--schedule elections --> 
        <v-layout row >
          <v-flex sm10 ><v-subheader class="font-weight-bold">Create timed election</v-subheader></v-flex>
          <v-flex sm2 style="padding-bottom:0px;">
            <v-switch value v-model="timed" color="orange"></v-switch>
          </v-flex>
        </v-layout>
        <v-divider v-show="timed"></v-divider>
        <v-layout row v-show="timed">
          <v-flex sm4>
            <v-subheader>Start time</v-subheader>
          </v-flex>
          <v-flex sm4>
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="form.date"
              min="2018-07-18"
              persistent
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                :disabled="!timed"
                slot="activator"
                v-model="form.date"
                label="Election start date"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="form.date" scrollable header-color="orange">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.dialog.save(form.date)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>

          <v-flex sm4 mr-4>
            <v-dialog
              ref="dialog2"
              v-model="modal2"
              :return-value.sync="form.time"
              persistent
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="form.time"
                label="Time"
                prepend-icon="access_time"
                readonly
              ></v-text-field>
              <v-time-picker v-if="modal2" v-model="form.time" header-color='orange'>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="modal2 = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.dialog2.save(form.time)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </v-flex>
        </v-layout>
        <v-divider v-show="timed"></v-divider>
        <!-- duration -->
        <v-layout row v-show="timed">
          <v-flex sm4>
            <v-subheader>Duration</v-subheader>
          </v-flex>
          <v-flex sm8 mr-4>
            <v-slider
              v-model="form.electionDuration"
              thumb-color="primary"
              thumb-label="always"
              :label="form.electionDuration + ' hrs'"
              max='24'
            ></v-slider>
          </v-flex>
        </v-layout>
      </v-card>
      <v-btn flat @click="e6 = 1">Previous</v-btn>
      <v-btn color="primary" @click="e6 = 3">Next step</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 3" step="3">Add roles</v-stepper-step>

    <v-stepper-content step="3">
      <v-card color="" class="mb-5 ma-2" height="200px">
        <v-toolbar color="grey" light flat height="50px">
          <v-btn fab small color="white" bottom left absolute @click.native.stop="dialog = !dialog">
            <v-icon>add</v-icon>
          </v-btn>
          <v-toolbar-title class="white--text">Election roles/positions</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-text>
                <v-text-field label="New role" v-model="role_input"></v-text-field>
                <small class="grey--text">e.g president, secretary,vice-chancellor</small>
                <p>
                  <small class="grey--text">* try not to use abbreviations</small>
                </p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click.native="addrole">Add role</v-btn>
                <v-btn flat color="primary" @click.native="dialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-chip close v-for="(role, i) in form.roles" :key="role" v-model="form.roles[i]">
            <v-avatar><v-icon>account_circle</v-icon></v-avatar>
            {{role}}
          </v-chip>
        </v-container>
        
      </v-card>
      <v-btn flat @click="e6 = 2">Previous</v-btn>
      <v-btn color="primary" @click="e6 = 4">Next step</v-btn>
    </v-stepper-content>

    <v-stepper-step step="4" :complete="e6 > 4">Select billing plan</v-stepper-step>
    <v-stepper-content step="4">
      <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
      <v-btn flat @click="e6 = 3">Previous</v-btn>
      <v-btn color="primary" @click="createElection">Next step</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>
<script>
import api from '@/services/api'
import { promisfy } from "@/helpers/promisify";
import * as VCard from 'vuetify/es5/components/VCard'
import * as VAvatar from 'vuetify/es5/components/VAvatar'
import * as VSubheader from 'vuetify/es5/components/VSubheader'
import * as VDivider from 'vuetify/es5/components/VDivider'
import * as VTabs from 'vuetify/es5/components/VTabs'
import * as VMenu from 'vuetify/es5/components/VMenu'
import * as VTooltip from 'vuetify/es5/components/VTooltip'
import * as VTextField from 'vuetify/es5/components/VTextField'
import * as VSelect from 'vuetify/es5/components/VSelect'
import * as VSwitch from 'vuetify/es5/components/VSwitch'
import * as VDatePicker from 'vuetify/es5/components/VDatePicker'
import * as VTimePicker from 'vuetify/es5/components/VTimePicker'
import * as VDialog from 'vuetify/es5/components/VDialog'
import * as VStepper from 'vuetify/es5/components/VStepper'
import * as VSlider from 'vuetify/es5/components/VSlider'
import * as VChip from 'vuetify/es5/components/VChip'
export default {
  data:()=>({
    dialog:false,
    role_input:'',
    modal:false,
    modal2:false,
    timed:true,
    e6:1,
    text:'Lorem, ipsum dolo iquid laborum non nihil quasi id error, corrupti voluptatem consequatur nostrum blanditiis expedita omnis accusantium vitae veritatis aut?',
    form:{
      title:'',
      type:'',
      school:'',
      level:'',
      faculty:'',
      department:'',
      date:null,
      time:null,
      electionDuration:5,
      roles:[]
    },
    electionTypes:['School','Governement','Organizations','Others'],
    schools:['Unn','Funai','Unilag','Uniuyo'],
    levels:[
      ['General', 'Faculty','Department'],
      ['Federal', 'State','Local governement']
    ],
    faculties:{
      Unn:['Physical science','Pharmacy','Social science'],
      Funai:['Phy','Pha'],
      Unilag:['Ab','Cd'],
      Uniuyo:['Ef','Gh']
    },
    departments:{
      Unn:['Cs','Phy','Chem','Bio'],
      Funai:['Phy','Chem'],
      Unliag:['Bio','Lab'],
      Uniuyo:['Eng','Med']
    },
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 6 || 'Min 6 characters',
      emailMatch: () => 'The email and password you entered don\'t match'
    },

  }),
  methods:{
    addrole(){
      if(this.role_input.length == 0){
        alert("Add a role")
        return 
      }
      this.dialog = false;
      this.form.roles.push(this.role_input)
      this.role_input = '' //empty it
    },
    async createElection(event){
      console.log(event.timeStamp)
      let res = await api().post(`dashboard/newelection/${this.$store.getters.getUser._id}`, this.form)
      console.log(res)
      console.log(res.data)
    }
  },
  components:{
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu,
    ...VTextField,
    ...VSelect,
    ...VSwitch,
    ...VDatePicker,
    ...VTimePicker,
    ...VDialog,
    ...VStepper,
    ...VSlider,
    ...VChip
  },
}
</script>
