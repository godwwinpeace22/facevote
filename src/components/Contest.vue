<template>
  <v-stepper v-model="e5" >
    <v-stepper-header>
      <v-stepper-step :complete="e5 > 1" step="1">Select election</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="e5 > 2" step="2">Choose a position</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3">Finish</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;"  flat tile>
          <v-card-text>Insert the Id of the election you want to contest for below</v-card-text>
          <v-container>
            <v-layout row>
              <v-flex xs6>
                <v-text-field label="Election Id" :value="electionId" hint="e.g gray-fighter-2187" v-model="electionId"></v-text-field>
                
              </v-flex>
            </v-layout>
          </v-container>
          
        </v-card>

        <v-btn color="primary" @click="getId">Submit</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-5" color="grey lighten-5"  style="min-height:200px;" flat tile>
          <v-card-text v-if="election.length != 0">
            <span class="subheading">{{election.title}}</span>
            <v-divider></v-divider>
          </v-card-text>
          
          <v-spacer></v-spacer>
          <v-container>
            <v-layout row wrap>
              <v-flex xs6>
                <v-select :items="election.roles" label="Select role" v-model="contestant.role"></v-select>
                <span>If you are authorized to contest, you will be given a token, provide the token below</span>
                <v-text-field label="token"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-btn flat @click="e5 = 1">Previous</v-btn>
        <v-btn color="primary" @click="e5 = 3">Next</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;" flat tile>
          <v-card-text v-if="election.length != 0">
            <span class="subheading">{{election.title}}</span>
            <v-divider></v-divider>
            </v-card-text>
            <v-spacer></v-spacer>
          <v-card-text>
            <p>You are applying to contest for the position of the <strong> {{contestant.role}} </strong>in this election</p>
            <p>Make sure you complete your profile info as this will be used to complete your application</p>
          
          </v-card-text>
        </v-card>

        <v-btn flat @click="e5 = 2">Previous</v-btn>
        <v-btn color="primary" @click="contest"> Finish</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
export default {
  data:()=>({
    e5:1,
    electionId:null,
    election:{},
    contestant:{
      acstoken:'',
      role:''
    }
  }),
  methods:{
    async getId(){ // this actually gets the election instead of just the id
      try {
        // prevent making unneccessary api calls
        if(!this.electionId){
          alert('Id is required') 
        }
        else if(this.election.electionId == this.electionId){
          this.e5 = 2
        }
        else{
          let id = await api().get(`dashboard/getId/${this.electionId}`)
          console.log(id)
          this.election = id.data
          this.e5 = 2
        }
        
      } catch (error) {
        console.log(error.response)
      }
    },
    async contest(){
      try {
        let contestant = {...this.contestant, userId:this.$store.getters.getUser._id, electionRef:this.election._id,token:this.$store.getters.getToken}
        console.log(contestant)
        let res =await api().post(`dashboard/addcontestant/${this.electionId}`, contestant)
        console.log(res)
        alert('Success!')
        
      } catch (err) {
        console.log(err.response)
        if(err.response && err.response.data.success == false){
          alert('You have already contested for this election')
        }

      }
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
    ...VChip,
    ...VForm
  }
}
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
import * as VForm from 'vuetify/es5/components/VForm'
</script>
