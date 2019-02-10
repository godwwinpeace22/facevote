<template>
  <div>
    <navigation>
      <span>Dashboard</span>
    </navigation>

  
    <v-stepper v-model="e5" d-flex style="">
      <v-stepper-header class="teal white--text">
        <v-stepper-step :complete="e5 > 1" step="1">Verify your account</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2">Finish</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>

        <v-stepper-content step="1">
          <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;"  flat tile>
            <v-card-text>
              <div v-if="$store.getters.getUser.isVerified">Your account is verified</div>
              <template v-else>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus animi quibusdam ad consequuntur laborum qui eaque ducimus aut alias id tenetur commodi, recusandae quos pariatur magni cupiditate sint perferendis eius!
                You will need to do this only once
              </template>
            </v-card-text>
            <v-card-actions>
              <v-btn color="secondary" @click="verify_dialog = true; startCamera()">Next</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-5" color="grey lighten-5" style="min-height:200px;" flat tile>
            <v-card-text >
              <span class="subheading"></span>
              <v-divider></v-divider>
              </v-card-text>
              <v-spacer></v-spacer>
            <v-card-text>
              <p>Verification Done!</p>
              
              
            </v-card-text>
          </v-card>

          <v-btn flat @click="e5 = 2">Previous</v-btn>
          <v-btn color="primary" @click="e5 = 2"> Finish</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <v-layout row justify-center>
      <v-dialog v-model="verify_dialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
        <v-card>
          <v-toolbar dark color="secondary">
            <v-btn icon @click.native="verify_dialog = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Verify Account</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="verify_dialog = false; ctrack.stop();">Close</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          
          <v-card class="mb-5" color="grey lighten-5"  style="min-height:200px;" flat tile>
            <v-card-text>
              <div class="text-xs-center">Position your face on the box</div>
            </v-card-text>
            <v-container grid-list-xs>
              <v-layout row wrap justify-center justify-space-around>
                <v-flex xs12 sm4>
                  <v-card>
                    
                    <!--div id="video-container">
                      <video id="camera-stream" autoplay width="100%"></video>
                    </div>
                    <canvas style="display:none"></canvas>
                    <img src="" alt="" id="canvasImg"-->

                    <video id="videoel" width="400" height="300" preload="auto" loop playsinline autoplay>
                    </video>
                    <canvas id="overlay" width="400" height="300"></canvas>

                    <v-card-actions>
                      <v-btn color="secondary" @click="startVideo" :loading="loading">Capture</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>

        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
export default {
  data:()=>({
    e5:1,
    verify_dialog:false,
    loading:false,
    vid:'',
    ctrack:'',
    trackingStarted:false,
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
    startCamera(){
      /*if (navigator.getUserMedia) {
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

      }
      else {
        alert('Sorry, your browser does not support getUserMedia');
      }*/


      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
      // set up video
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({video : true}).then(this.gumSuccess).catch(this.gumFail);
      } else if (navigator.getUserMedia) {
        navigator.getUserMedia({video : true}, gumSuccess, gumFail);
      } else {
        alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
      }

      
      this.ctrack = new clm.tracker();
      this.ctrack.init();
      this.trackingStarted = false;
      console.log(this.ctrack)
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
    startVideo() {
      // start video
      var vid = document.getElementById('videoel');
      var vid_width = vid.width;
      var vid_height = vid.height;
      var overlay = document.getElementById('overlay');
      var overlayCC = overlay.getContext('2d');
      
      vid.play();
      // start tracking
      this.ctrack.start(vid);
      this.trackingStarted = true;
      console.log('trackingStarted: ', this.trackingStarted)
      // start loop to draw face
      this.drawLoop();
    },
    async verify(){
      try {
        this.loading = true
        const canvas = document.createElement('canvas'); // create a canvas
        const ctx = canvas.getContext('2d'); // get its context
        canvas.width = 200; // set its size to the one of the video
        canvas.height = 200;
        ctx.drawImage(this.vid, 0,0); // the video
        let base64Img = canvas.toDataURL('image/png')
        document.getElementById('canvasImg').src = base64Img
        //console.log(base64Img)
        
        
        this.processImage(base64Img)

        //let result = await api().post(`dashboard/verify/${this.$store.getters.getUser.uid}`)
        //console.log(result)
        //this.loading = false
        //document.getElementById('canvasImg').src = URL.createObjectURL(blob)
        /*let formData = new FormData();
        formData.append('image',this.makeblob(base64Img));
        formData.append('user',this.$store.getters.getUser._id)
        let payload = {image:this.makeblob(base64Img),user:this.$store.getters.getUser._id}
        let res = await api().post(`dashboard/recognize/${this.electionId}/${this.$store.getters.getToken}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        console.log(res.data)
        
        

       */
       /*let requestUrl = 'http://api.kairos.com/detect'
       var payload  = { "image" : "https://media.kairos.com/liz.jpg" };

        let res = await api().post(requestUrl, 
          JSON.stringify(payload),
          {
            headers: {
              "Content-Type": "application/json",
              "app_id":"",
              "api_key":"",
            }
        })
          
       console.log(res)*/
      } catch (err) {
        console.log(err)
        console.log(err.response)
        this.loading = false

      }
    },
    adjustVideoProportions() {
      // resize overlay and video if proportions of video are not 4:3
      // keep same height, just change width
      console.log('adjust proportions')
      var vid = document.getElementById('videoel');
      var vid_width = vid.width;
      var vid_height = vid.height;
      var overlay = document.getElementById('overlay');
      var overlayCC = overlay.getContext('2d');

      var proportion = vid.videoWidth/vid.videoHeight;
      vid_width = Math.round(vid_height * proportion);
      vid.width = vid_width;
      overlay.width = vid_width;
    },
    gumSuccess( stream ) {
      // add camera stream if getUserMedia succeeded
      var vid = document.getElementById('videoel');
      if ("srcObject" in vid) {
        vid.srcObject = stream;
      } else {
        vid.src = (window.URL && window.URL.createObjectURL(stream));
      }
      console.log('gumSuccess')
      vid.onloadedmetadata = ()=>{
        this.adjustVideoProportions();
        vid.play();
      }
      vid.onresize = ()=>{
        this.adjustVideoProportions();
        if (this.trackingStarted) {
          this.ctrack.stop();
          this.ctrack.reset();
          this.ctrack.start(vid);
        }
      }
    },
    gumFail() {
      // fall back to video if getUserMedia failed
      alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
    },
    drawLoop(){
      var vid = document.getElementById('videoel');
      var vid_width = vid.width;
      var vid_height = vid.height;
      var overlay = document.getElementById('overlay');
      var overlayCC = overlay.getContext('2d');

      requestAnimationFrame(this.drawLoop)
      overlayCC.clearRect(0, 0, vid_width, vid_height);
      if (this.ctrack.getCurrentPosition()) {
        //console.log(this.ctrack.getCurrentPosition())
        this.ctrack.draw(overlay);
      }
      //console.log('drawLoop')
    },
    processImage(sourceImageUrl) {
        
        var subscriptionKey = "";

        var uriBase =
            "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

        // Request parameters.
        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes":
                "age,gender,headPose,smile,facialHair,glasses,emotion," +
                "hair,makeup,occlusion,accessories,blur,exposure,noise"
        };

        fetch(sourceImageUrl)
          .then(res => res.blob())
          .then(blobData => {
            // attach blobData as the data for the post request
            api().post(uriBase + "?" + $.param(params),
            '{"url": ' + '"' + blobData + '"}', {
                headers: {
                  "Content-Type":"application/octet-stream",
                  "Ocp-Apim-Subscription-Key":subscriptionKey
                }
            }).then(rf=>{
              console.log(rf)
              this.loading = false
            }).catch(err=>{
              console.log(err)
              console.log(err.response)
              this.loading = false
            })
          })
        // Display the image.
        //var sourceImageUrl = document.getElementById("inputImage").value;
        //document.querySelector("#sourceImage").src = sourceImageUrl;
        //var sourceImageUrl = 'https://www.eurekalert.org/multimedia/pub/web/169764_web.jpg'

        
        // Perform the REST API call.
        
        /*
        $.ajax({
            url: uriBase + "?" + $.param(params),

            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",

            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',
        })

        .done(function(data) {
            // Show formatted JSON on webpage.
            console.log(JSON.stringify(data, null, 2));
        })

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ?
                "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ?
                "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message :
                        jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });*/
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
  mounted(){
    
  },
  components:{
    Navigation
  }
}
import api from '@/services/api'
import axios from 'axios'
import Navigation from '@/components/Navigation'
import unirest from 'unirest'
import clm from 'clmtrackr'
//const Kairos =  require('@/assets/kairos.js')
//import { promisfy } from "@/helpers/promisify";
</script>


<style lang="scss" scoped>
  #videoel, #overlay{
    position: absolute;
  }
</style>
