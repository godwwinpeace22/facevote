<template>
  <div>
    <vue-headful :title="title"/>

    <navigation>
      <span slot="title">Dashboard</span>
      <h1 slot="extended_nav">Enroll</h1>
    </navigation>
    <v-container grid-list-xl dark>
      <v-card class="round black--text">
        <v-stepper v-model="e5" dark class="white" style="min-height:300px;">
          <v-stepper-header class="grey" dark style="color:#fff;">
            <v-stepper-step :complete="e5 > 1" step="1">Enroll</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e5 > 2" step="2">Select election</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e5 > 3" step="3">Choose</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Finish</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card light>
                <v-card-text>
                  <p>{{lorem}}</p>
                  <p>{{lorem}}</p>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="success" depressed @click="e5 = 2">Next</v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card class="mb-5" light color="grey lighten-5" style="min-height:200px;"  flat tile>
                <v-card-text>Insert the Id of the election you want to contest for below</v-card-text>
                <v-container>
                  <v-layout row>
                    <v-flex xs6>
                      <v-text-field label="Election Id" name="electionId" :value="electionId" 
                        hint="e.g gray-fighter-2187" v-model="electionId" browser-autocomplete="electionId">
                      </v-text-field>
                      
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-card-actions>
                  <v-btn depressed @click="e5 = 1">Previous</v-btn>
                  <v-btn color="success" @click="getElection" :disabled="!electionId">Submit</v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-5" light color="grey lighten-5"  style="min-height:200px;" flat tile>
                <v-card-text v-if="election.length != 0">
                  <span class="subheading">{{election.title}}</span>
                  <v-divider></v-divider>
                  <h3 v-if="hide">{{error_msg}}</h3>
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

              <v-btn flat @click="e5 = 2">Previous</v-btn>
              <v-btn color="secondary" @click="enroll" :disabled="hide" v-if="!hide">Enroll</v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
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

              <v-btn flat @click="e5 = 3">Previous</v-btn>
              <v-btn color="primary" @click="e5 = 1"> Finish</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-container>
    
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Enroll | Facevote',
    e5:1,
    snackbar:{},
    electionId:null,
    election:{},
    contestant:{
      acstoken:'',
      role:''
    },
    lorem:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, temporibus! Ex, eligendi! Blanditiis repellendus dolorum dolor excepturi sed reprehenderit iusto, incidunt tempora, ad aliquid quas, aut inventore nobis ratione eaque.',
    voter:{
      image:''
    },
    error_msg:'',
    hide:false,
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
    async getElection(){
      try {
        let details = db.collection('moreUserInfo').doc(this.$store.getters.getUser.email);

        let doc = await details.get()
        let user = doc.data()
        console.log(user)
        // prevent making unneccessary api calls
        if(!this.electionId){
          alert('Id is required') 
        }
        else{
          let electionRef = db.collection('elections').doc(this.electionId)
          let id = await electionRef.get()
          console.log(id.data())
          if(!id.data()){
            this.snackbar = {
              show:true,message:'Sorry, election not found', color:'error'
            }
          }
          else{
            this.election = id.data()
            this.e5 = 2
            //this.startCamera()

            // disable enrollment if election has started or has ended
            // make sure to do this on the server to since the date on client machine might be behind
            let countDownDate = new Date(this.election.startDate + ' ' + this.election.startTime).getTime();
            //let countDownDate2 = countDownDate + this.election.duration * 1000 * 60 * 60
            let now = Date.now()
            
            if(now > countDownDate){
              this.hide = true; this.error_msg = 'Sorry, enrollment has ended'
            } // election is in progress or ended

            else if(this.election.regVoters.find(item=> item == this.$store.getters.getUser.uid)){
              console.log(this.election.regVoters.find(item=> item == this.$store.getters.getUser.uid))
              this.error_msg = 'Sorry, you have already enrolled for this election'
              this.hide = true
            }
            else{
              if(this.election.type == 'School' && user.school == this.election.school){
                if(this.election.level == 'Department' && user.department != this.election.department){
                  this.error_msg = 'Sorry, you can only vote in your department'
                  this.hide = true
                }
                else if(this.election.level == 'Faculty' && user.faculty != this.election.faculty){
                  this.error_msg = 'Sorry, you can only vote in your faculty'
                  this.hide = true
                }
                else{
                  this.hide = false
                }
              }
              else if(this.election.type == 'School' && user.school != this.election.school){
                console.log(user, this.election)
                this.error_msg = 'Sorry, you can only vote in your school'
                this.hide = true
              }
              else{
                this.hide = false
              }
            }
          }
        }
        
      } catch (error) {
        console.log(error)
        console.log(error.response)
        error.response.status == 404 ? this.snackbar = {
          show:true,message:error.response.data.message, color:'error'
        } : ''
      }
    },
    async enroll(){
      try {
        if(this.election.regVoters.indexOf(this.$store.getters.getUser.uid) != -1){
          
          this.snackbar = {
            show:true,message:'Sorry, you are already enrolled for this election', color:'error'
          }
        }
        else{
          // Update election
          var electionRef = db.collection('elections').doc(this.election.electionId);
          var arrUnion = await electionRef.update({
            regVoters: firebase.firestore.FieldValue.arrayUnion(this.$store.getters.getUser.uid)
          });

          //update User details
          let userRef = db.collection('moreUserInfo')
          .doc(this.$store.getters.getUser.email);
          await userRef.update({
            enrolled:firebase.firestore.FieldValue.arrayUnion(this.election.electionId)
          });

          // create new activity
          await db.collection('activities').add({
            type:'voter_registered',
            by:this.$store.getters.getUser.uid,
            dateCreated:Date.now(),
            text:'enrolled for this election',
            electionRef:this.selectedElection.electionId
          })

          this.snackbar = {
            show:true,message:'Enrollement successfull!', color:'success'
          }
        }
        
      } catch (error) {
        $NProgress.done()
        console.log(error.response)

        if(error.response){
          //alert(error.response.data.message)
          this.snackbar = {
            show:true,message:error.response.data.message, color:'error'
          }
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
    Navigation
  }
}
import api from '@/services/api'
import axios from 'axios'
import Navigation from '@/components/Navigation'
</script>
<style lang="scss">
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  .round{
    @include borderRadius(15px)
  }
</style>

