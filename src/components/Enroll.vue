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
              <v-flex xs12>
                <div id="video-container">
                  <video id="camera-stream" width="500" autoplay></video>
                </div>
                <canvas style="display:none"></canvas>
                <img src="" alt="" id="canvasImg">
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-btn flat @click="e5 = 1">Previous</v-btn>
        <v-btn color="primary" @click="enroll">Enroll</v-btn>
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
    vid:'',
    cloudinary: {
       uploadPreset: 'izcl0gzg',
       cloudName: 'unplugged',
       folder: 'securepoll',
        transformation:[
          {width: 400, height: 400, crop: "thumb", gravity:"face"},
        ],
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
          this.startCamera()
        }
        
      } catch (error) {
        console.log(error.response)
      }
    },
    async enroll(){
      try {
        if(this.election.regVoters.indexOf(this.$store.getters.getUser._id) != -1){
          alert('you have already enrolled for this election');
        }
        else{
          let res = await api().post(`dashboard/enroll/${this.electionId}`, {user:this.$store.getters.getUser,token:this.$store.getters.getToken})
          console.log(res)
          alert('enrollement successfull');
        }
        
      } catch (error) {

        console.log(error.response)
        if(error.response.status = 401){
          alert('you have already enrolled for this election')
        }
        
      }
    },
    startCamera(){
      if (navigator.getUserMedia) {
          // Request the camera.
          let $self = this
          navigator.getUserMedia({	video: true}, function(localMediaStream) {
              // Get a reference to the video element on the page.
              var vid = document.getElementById('camera-stream');
              $self.vid = vid
              // Create an object URL for the video stream and use this to set the video source.
              vid.srcObject = localMediaStream
            },
            function(err) {
              console.log('The following error occurred when trying to use getUserMedia: ' + err);
            }
          );

        } else {
          alert('Sorry, your browser does not support getUserMedia');
        }
    },
    makeblob(dataURL) {
			const BASE64_MARKER = ';base64,';
			const parts = dataURL.split(BASE64_MARKER);
			const contentType = parts[0].split(':')[1];
			const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      console.log(rawLength);
			const uInt8Array = new Uint8Array(rawLength);

			for (let i = 0; i < rawLength; ++i) {
					uInt8Array[i] = raw.charCodeAt(i);
			}
      
			return new Blob([uInt8Array], { type: contentType });
		},
    
    async verify(){
      try {
        
        const canvas = document.createElement('canvas'); // create a canvas
        const ctx = canvas.getContext('2d'); // get its context
        canvas.width = 500; // set its size to the one of the video
        canvas.height = 500;
        ctx.drawImage(this.vid, 0,0); // the video
        let base64Img = canvas.toDataURL('image/png')
        document.getElementById('canvasImg').src = base64Img
        //console.log(base64Img)
        
      
        //document.getElementById('canvasImg').src = URL.createObjectURL(blob)
        let formData = new FormData();
        formData.append('image',this.makeblob(base64Img));
        formData.append('user',this.$store.getters.getUser._id)
        let payload = {image:this.makeblob(base64Img),user:this.$store.getters.getUser._id}
        let res = await api().post(`dashboard/recognize/${this.electionId}/${this.$store.getters.getToken}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        console.log(res.data)
        
        
      } catch (err) {
        console.log(err)
        console.log(err.response)
        

      }
    },

    takeASnap(){
        const canvas = document.createElement('canvas'); // create a canvas
        const ctx = canvas.getContext('2d'); // get its context
        canvas.width = this.vid.videoWidth; // set its size to the one of the video
        canvas.height = this.vid.videoHeight;
        ctx.drawImage(this.vid, 0,0); // the video
        return new Promise((res, rej)=>{
          canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
        });
      },
    download(blob){
        // uses the <a download> to download a Blob
        let a = document.createElement('a'); 
        a.href = URL.createObjectURL(blob);
        a.download = 'screenshot.jpg';
        document.body.appendChild(a);
        a.click();
      },
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
