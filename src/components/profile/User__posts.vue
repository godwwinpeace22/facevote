<template>
  <div>
    <v-container grid-list-xl>
      <v-card flat>
        <v-toolbar dense flat color="grey" dark>
          <v-subheader class="font-weight-bold white--text">Recent Posts</v-subheader>
          <v-spacer></v-spacer>
          <v-btn right small outline @click="new_post_dialog = true"
            v-if="user.uid == $store.getters.getUser.uid">
            <v-icon>add</v-icon>
            New post</v-btn>
        </v-toolbar>
        <v-container class="grey lighten-3">
          <v-layout row wrap>
            <v-subheader v-if="posts.length == 0">No recent post</v-subheader>
            <v-flex sm6 v-for="post of posts" :key="post.dateCreated">
              <v-card class="pa-0 mb-3 mt-1" height="" hover @click="read = true; post_to_read = post" tile flat>
                <v-layout row wrap>
                  <v-flex xs12 sm5 md4 class="py-0" d-flex>
                    <v-img :src="post.images[0] || 'https://ui-avatars.com/api/?name=following+name'" height="150"></v-img>
                  </v-flex>
                  <v-flex xs12 sm7 md8 d-flex class="py-0">
                    <div class="pa-2" style="height:150px;overflow:hidden;">
                      {{truncateText(post.message)}}
                    </div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-container>

    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" top>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <!-- READ POST DIALOG -->
    <v-dialog v-model="read" persistent :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="600px" transition="dialog-transition">
      <v-toolbar dense>
        Read post
        <v-spacer></v-spacer>
        <v-btn flat icon color="success" @click="read = false;">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card tile>
        <v-card-text>
          {{post_to_read.message}}
          <v-container grid-list-sm px-0>
            <v-layout row wrap class="mt-3">
              <v-flex xs12 sm6 v-for="(image,i) in post_to_read.images" :key="i">
                <v-img :src='image' height="200" 
                  @click="carouselDialog(post_to_read.images,i)"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- carousel dialog -->
    <v-dialog v-model="carousel_dialog"
      fullscreen transition="dialog-transition">
      <v-toolbar dense flat color="grey" tile>
        <v-toolbar-title class="white--text">Media files</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="" dark icon @click="carousel_dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <template>
        <v-card color="" dark
          flat tile>
          <v-container fluid fill-height d-flex px-0>
            <v-layout align-center justify-center>
              <v-flex xs1 v-if="$vuetify.breakpoint.smAndUp">
                <v-btn color="" depressed icon @click="prev">
                  <v-icon>chevron_left</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12 sm10 md8>
                <v-window v-model="onboarding">
                  <v-window-item v-for="(image,n) in carousel_images" :key="`card-${n}`">
                    <v-card color="transparent" max-height="500" flat>
                      <v-layout
                        align-center
                        justify-center
                        fill-height
                        tag="v-card-text"
                      >
                      
                      <v-flex xs12>
                        <v-img :src='image' min-height='300'></v-img>
                      </v-flex>
                      
                      </v-layout>
                    </v-card>
                  </v-window-item>
                </v-window>
              </v-flex>
              <v-flex xs1 v-if="$vuetify.breakpoint.smAndUp">
                <v-btn depressed icon @click="next">
                  <v-icon>chevron_right</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions v-if="$vuetify.breakpoint.xsOnly" style="position:fixed;width:100%;bottom:0;">
            <v-btn color="" depressed icon @click="prev">
              <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn depressed icon @click="next">
              <v-icon>chevron_right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>


    <!-- New Post Dialog -->
    <v-dialog
      v-model="new_post_dialog"
      scrollable 
      persistent :fullscreen='$vuetify.breakpoint.smAndDown'
      max-width="850px"
      transition="slide-y-transition">
      <v-card>
        <v-toolbar dense flat dark color="teal">
          <v-subheader class="white--text">Compose</v-subheader>
          <v-spacer></v-spacer>
          <v-btn depressed small outline @click="new_post_dialog = false">Cancel</v-btn>
        </v-toolbar>
        <v-card-text class="px-0">
          <v-stepper v-model="e14" vertical class="elevation-0">
            <v-stepper-step step="1">
              Your Message
              <small>Compose your message</small>
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card color="" flat tile class="mb-5" min-height="200px">
                <v-textarea auto-grow color="secondary"
                  label="Type your message" v-model="form.message"
                  name="broadcast" outline
                ></v-textarea>

                <!-- Selected images preview -->
                <v-container grid-list-sm px-0>
                  <v-layout row wrap v-if="blob_urls">
                    <v-flex xs3 v-for="(blob_url,i) in blob_urls" :key="i">
                      <v-card height="100" class="mb-1">
                        <v-img :src='blob_url' height="100"></v-img>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
                
                <v-chip color="teal" text-color="white" @click="triggerFileSelector">
                  <v-avatar>
                    <v-icon color="">insert_photo</v-icon>
                  </v-avatar>
                  Add Photo
                </v-chip>
                <v-chip color="grey" text-color="white" v-if="blob_urls.length > 0" @click="blob_urls = [];selected_files = []">
                  <v-avatar>
                    <v-icon color="error">cancel</v-icon>
                  </v-avatar>
                  Clear All
                </v-chip>
              </v-card>
              <v-btn color="success" outline flat :disabled="p_msg_rules" @click="e14 = 2">Continue</v-btn>
            </v-stepper-content>

            <v-stepper-step step="2">Choose Audience</v-stepper-step>

            <v-stepper-content step="2">
              <v-card flat class="mb-5" min-height="200px">
                <v-layout row wrap>
                  <v-flex xs8>
                    
                    <p class="mt-5">Select the audience for your new post.</p>
                    <v-select class="mt-3" outline color="secondary"
                      label="Select group" v-model="form.group"
                      :items="myContests" item-value="electionId"
                      item-text="title"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-card>
              <v-btn flat @click="e14 = 1">Previous</v-btn>
              <v-btn color="success" outline :disabled="p_group_rules" :loading="loading" flat @click="newPost">Finish</v-btn>
            </v-stepper-content>
            <v-divider inset vertical></v-divider>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
    <input type="file" name="file" id="post_img" multiple style="visibility:hidden;" @change="onPostFileSelect($event)" accept="image/jpeg,image/png">
  </div>
</template>
<script>
export default {
  data:()=>({
    snackbar:{},
    read:false,
    post_to_read:'',
    carousel_images:[],
    carousel_dialog:false,
    onboarding:0,
    new_post_dialog:false,
    file_modal:false,
    e14:1,
    blob_urls:[],
    selected_files:[],
    form:{
      message:'',
      group:''
    },
    loading:false,
    cloudinary:{
      cloud_name:'unplugged',
      upload_preset:'pe4iolek'
    },
  }),
  props:['myContests','user','posts'],
  computed:{
    p_msg_rules(){
      return !this.form.message.trim()
    },
    p_group_rules(){
      return !this.form.group.trim()
    },
  },
  methods:{
    carouselDialog(images,index){
      this.carousel_dialog = true
      this.carousel_images = images
      this.onboarding = index
    },
    next () {
      this.onboarding = this.onboarding + 1 === this.carousel_images.length
        ? 0
        : this.onboarding + 1
    },
    prev () {
      this.onboarding = this.onboarding - 1 < 0
        ? this.carousel_images.length - 1
        : this.onboarding - 1
    },
    truncateText(text){
      return this.$vuetify.breakpoint.smAndDown ?
      text.substr(0,120) + '...' :
      text.substr(0,200) + '...'
    },
    triggerFileSelector(){
      document.getElementById('post_img').click()
    },
    onPostFileSelect(e){
      let stop = true
      let file_sizes = 0
      for(let file of e.target.files){
        if(file.type == 'image/jpeg' || 
          file.type == 'image/jpg' || file.type == 'image/png'){
            stop = false
          
        }
        else{
          stop = true
          break
        }
        file_sizes += file.size
      }

      // Allow only images
      if(!stop){
        let one_mb = 1000000
        // limit total file upload to 1mb
        if(file_sizes < one_mb){
          //console.log(e.target.files)
          for(let file of e.target.files){
            console.log(file)
            this.blob_urls.push(URL.createObjectURL(file))
          }
          this.selected_files = e.target.files
          
        }
        else{
          alert('Please select an image that is less than 1mb')
        }
      }
      else{
        alert('Only images are allowed!')
      }
    },
    async uploadImages(){
      try {
        let clUrl = `https://api.cloudinary.com/v1_1/${this.cloudinary.cloud_name}/upload`
        let formData = new FormData()
        let uploaded = []
        for(let file of this.selected_files){
          formData.append('file', file)
          formData.append('upload_preset',this.cloudinary.upload_preset)

          let response = await api().post( clUrl,
            formData,
            {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
            }
          )

          uploaded.push(response.data.secure_url)
        }
        
        console.log(uploaded)
        return uploaded
      } catch (error) {
        this.loading = false
        this.snackbar.show = true
        this.snackbar.color = 'error'
        this.snackbar.message = 'Sorry, something went wrong, try again.'
        console.log(error)
        console.log(error.response)
      }
      
    },
    async newPost(){
      try{
        this.loading = true
        let images = await this.uploadImages()
        console.log(images)
        let post = {
          message:this.form.message,
          images:images,
          group:this.form.group,
          dateCreated:Date.now(),
          seenBy:[],
          reactions:[],
          comments:[],
          department:this.user.department,
          faculty:this.user.faculty,
          school:this.user.school,
          createdBy:this.$store.getters.getUser.uid
        }
        
        let res = await db.collection('posts').add(post)
        console.log(res)
        this.loading = false
        this.posts.push(post)
        this.new_post_dialog = false

        this.snackbar = {
          show:true,
          color:'success',
          message:'Post was created successfully'
        }
        
      }catch(err){
        console.log(err)
        this.loading = false
      }
    },
  },
  components:{
    MyCarousel
  },
  mounted(){
    
    
  },
}
import api from '@/services/api'
</script>
