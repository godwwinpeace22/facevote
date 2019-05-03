<template>
  <div>
    <vue-headful :title="title"/>

    <navigation>
      <span slot="title">{{$vuetify.breakpoint.smAndUp ? 'Dashboard' : 'Enroll'}}</span>
      <h1 slot="extended_nav" v-if="$vuetify.breakpoint.smAndUp">Enroll</h1>
    </navigation>

    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" top right>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <transition name="fade">
      <v-container grid-list-xl :pa-0="$vuetify.breakpoint.xsOnly" :mt-4="$vuetify.breakpoint.smAndUp">
        <v-card class="black--text" :class="{round:$vuetify.breakpoint.smAndUp}">
          <v-stepper v-model="e5"  class="" style="min-height:300px;">
            <v-stepper-header :class="{'teal': $vuetify.breakpoint.xsOnly}" >
              <!-- <v-stepper-step :complete="e5 > 1" step="1">Intro</v-stepper-step> -->
              <!-- <v-divider></v-divider> -->
              <v-stepper-step :complete="e5 > 1" step="1" color="secondary">Select election</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e5 > 2" step="2" color="secondary">Enroll</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e5 > 3" step="3" color="secondary">Finish</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items :style="style_stepper_items">
              
              <v-stepper-content step="1">
                <v-card class="mb-5" light color="grey lighten-5" style="min-height:200px;"  flat tile>
                  <v-card-text>Insert the Id of the election you want to enroll for below</v-card-text>
                  <v-container>
                    <v-layout row>
                      <v-flex xs12 sm6>
                        <v-text-field label="Election Id" outline color="secondary" name="electionId" :value="electionId" 
                          hint="e.g gray-fighter-2187" v-model="electionId" browser-autocomplete="electionId">
                        </v-text-field>
                        
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <v-card-actions>
                    
                    <v-btn color="success" @click="getElection" 
                      :disabled="!electionId" :loading="loading">
                      Submit
                      <v-icon small>chevron_right</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-5" light color="grey lighten-5"  style="min-height:200px;" flat tile>
                  <v-card-text v-if="election.length != 0">
                    <span class="subheading">{{election.title}}</span>
                    <v-divider></v-divider>
                    <h3 v-if="hide" class="error--text">{{error_msg}}</h3>
                  </v-card-text>
                </v-card>

                <v-btn color="grey lighten-1" depressed @click="e5 = 1" :disabled="loading">
                  <v-icon small>chevron_left</v-icon>
                  Previous
                </v-btn>
                <v-btn color="secondary" @click="enroll" 
                v-if="!hide" :loading="loading" depressed>Enroll</v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card class="mb-5" light color="grey lighten-5" style="min-height:200px;" flat tile>
                  <v-card-text v-if="election.length != 0">
                    <span class="subheading">{{election.title}}</span>
                    <v-divider></v-divider>
                    </v-card-text>
                  <v-card-text>
                    <h3>You have successfully enrolled for this election</h3>
                    <p>Whats next?</p>
                    
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="secondary" @click="$store.dispatch('curRoom', election)"
                      v-if="election.title && curRoom && curRoom.electionId != election.electionId">
                      Switch current election
                    </v-btn>
                    <template v-if="curRoom && curRoom.electionId == election.electionId">
                      <v-btn color="success" to="/forum">Join the conversation</v-btn>
                      <v-btn color="success" to="/contest">Contest</v-btn>
                    </template>
                  </v-card-actions>
                </v-card>
                
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>

        <v-dialog
          v-model="dialog"
          
          persistent
          max-width="500px"
          transition="dialog-transition"
        >
          <v-card height="400" flat class="round_top">
            <v-toolbar flat color="teal">
              <div class="title white--text">Enroll</div>
            </v-toolbar>
            <v-container grid-list-xs>
              <v-flex>
                <loading-bar height="30vh">
                  <div class="title mb-2" slot="loading_info">
                    Enrolling...
                  </div>
                </loading-bar>
              </v-flex>
            </v-container>
          </v-card>
        </v-dialog>
      </v-container>
    </transition>
    
  </div>
</template>
<script>
export default {
  data:()=>({
    title: 'Enroll | Facevote',
    e5: 1,
    snackbar: {},
    dialog: false,
    loading: false,
    message: 'Enrolling...',
    electionId: null,
    election: {},
    contestant: {
      acstoken: '',
      role: ''
    },
    voter: {
      image:''
    },
    error_msg: '',
    hide: false,
    vid: '',
    cloudinary: {
       uploadPreset: 'izcl0gzg',
       cloudName: 'unplugged',
       folder: 'securepoll',
        transformation:[
          {width: 400, height: 400, crop: "thumb", gravity:"face"},
        ],
     }, 
  }),
  computed:{
    style_stepper_items(){
      if(this.$vuetify.breakpoint.xsOnly){
        return {
          "min-height": 'calc(100vh - 128px) !important'
        }
      }
    },
    ...mapGetters([
      'getUserInfo',
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom'
    ])
  },
  methods:{
    async getElection(){
      try {
        
        // prevent making unneccessary api calls
        if(!this.electionId){
          alert('Id is required') 
        }
        else if(this.curRoom && this.curRoom.electionId == this.electionId.trim()){
          this.error_msg = 'Sorry, you have already enrolled for this election'
          this.hide = true
          this.e5 = 2
        }
        else if(this.getUserInfo && this.getUserInfo.enrolled && !!this.getUserInfo.enrolled.find(id => id == this.electionId)){
          this.error_msg = 'Sorry, you have already enrolled for this election'
          this.hide = true
          this.e5 = 2
        }
        else{
          this.loading = true
          let details = db.collection('moreUserInfo').doc(this.$store.getters.getUser.uid);
          let doc, user

          user = this.getUserInfo
          $NProgress.start()

          let electionRef = db.collection('elections').doc(this.electionId)
          
          let id = await electionRef.get()
          // console.log(id.data())
          
          if(!id.exists){
            this.snackbar = {
              show:true,message:'Sorry, election not found', color:'error'
            }
            this.loading = false
            $NProgress.done()
          }
          else if(this.getUserInfo && this.getUserInfo.enrolled && !!this.getUserInfo.enrolled.find(id => id == this.electionId)){
            this.error_msg = 'Sorry, you have already enrolled for this election'
            this.hide = true
          }
          else{
            $NProgress.done()
            this.election = id.data()
            this.loading = false
            this.e5 = 2

            if(this.election.type == 'School' && user.sch == this.election.sch){
              if(this.election.level == 'Department' && user.dept != this.election.dept){
                this.error_msg = 'Sorry, you can only vote in your department'
                this.hide = true
              }
              else if(this.election.level == 'Faculty' && user.fac != this.election.fac){
                this.error_msg = 'Sorry, you can only vote in your faculty'
                this.hide = true
              }
              else{
                this.hide = false
              }
            }
            else if(this.election.type == 'School' && user.sch != this.election.sch){
              // console.log(user, this.election)
              this.error_msg = 'Sorry, you can only vote in your school'
              this.hide = true
            }
            else{
              this.hide = false
            }
          }
        }
        
      } catch (error) {
        // console.log(error)
        // console.log(error.response)
        error.response ? error.response.status == 404 ? this.snackbar = {
          show:true,message:error.response.data.message, color:'error'
        } : '' : ''
      }
    },
    async enroll(){
      firebase.auth().currentUser.getIdToken().then((token)=>{
        this.loading = true
        this.dialog = true
        api().post('dashboard/enroll',{
          electionId:this.election.electionId,
          idToken:token
        }).then(result =>{
          this.message = 'Done'
          this.$store.dispatch('setMyEnrolled', {election: this.election, merge: true})

          this.snackbar = {
            show:true,message:'Enrollement successfull!', color:'success'
          }

          this.loading = false
          this.dialog = false
          this.e5 = 3
        }).catch(error=>{
          $NProgress.done()
          this.loading = false
          // console.log(error)
          // console.log(error.response)

          if(error.response){
            this.snackbar = {
              show:true,message:error.response.data.message, color:'error'
            }
          }else{
            this.snackbar = {
              show:true,message:'Something went wrong, check your internet connection and try again', color:'error'
            }
          }
          
        })
      })
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
              // console.log('The following error occurred when trying to use getUserMedia: ' + err);
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
      // console.log(rawLength);
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
        // console.log(res.data)
        
        
      } catch (err) {
        // console.log(err)
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
  created(){
    
    
  },
  components:{
    Navigation,
    LoadingBar
  }
}
import api from '@/services/api'
import axios from 'axios'
import Navigation from '@/components/Navigation'
import { mapGetters, mapState } from 'vuex';
import LoadingBar from '@/spinners/LoadingBar'
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

