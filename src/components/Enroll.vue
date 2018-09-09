<template>
  <v-stepper v-model="e5" >
    <v-stepper-header>
      <v-stepper-step :complete="e5 > 1" step="1">Select election</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="e5 > 2" step="2">Face Recognition</v-stepper-step>
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
                <v-text-field type="file" label="Select image" v-model="voter.image"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-btn flat @click="e5 = 1">Previous</v-btn>
        <v-btn color="primary" @click="verify">Next</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;" flat tile>
          <v-card-text v-if="election.length != 0">
            <span class="subheading">{{election.title}}</span>
            <v-divider></v-divider>
            </v-card-text>
            <v-spacer></v-spacer>
          <v-card-text>
            <p>Tells us more about you</p>
            
            
          </v-card-text>
        </v-card>

        <v-btn flat @click="e5 = 2">Previous</v-btn>
        <v-btn color="primary" @click="e5 = 2"> Finish</v-btn>
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
    },
    voter:{
      image:''
    },
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
    async verify(){
      try {
        // do face rec with Kairos API
        /*let headers = {
          "Content-type": "application/json",
          "app_id"  : process.env.VUE_APP_APP_ID,
          "app_key" : process.env.VUE_APP_APP_KEY
        };
        let payload  = {
          "image" : this.voter,
          "gallery_name": this.electionId
          
        };

        const instance = axios.create({
          baseURL: 'https://api.kairos.com/',
          headers: headers
        });

        let yt = await instance.post('verify', payload)
        console.log(yt)*/
        //console.log(kairos)
        //var kairos = new Kairos(process.env.VUE_APP_APP_ID, process.env.VUE_APP_APP_KEY);
        //console.log(Kairos)
        //this.e5 = 3;
        // make request 

        let headers = {
          "Content-type": "application/json",
          "app_id"  : process.env.VUE_APP_APP_ID,
          "app_key" : process.env.VUE_APP_APP_KEY
        };
        let payload  = {
          "image" : this.voter,
          "gallery_name": this.electionId
          
        };

        $.ajax('https://api.kairos.com/verify', {
          headers  : headers,
            type: "POST",
            data: JSON.stringify(payload),
            dataType: "text"
        }).done(function(response){
          console.log(response);
        });
        
      } catch (err) {
        console.log(err)
        console.log(err.response)
        

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
import axios from 'axios'
const Kairos =  require('@/assets/kairos.js')
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
