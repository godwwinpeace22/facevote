<template>
  
    <v-card>

      <v-toolbar dense flat dark color="teal">
        <v-subheader class="white--text">Compose</v-subheader>
        <v-spacer></v-spacer>
        <v-btn depressed small outline @click="$eventBus.$emit('HideNewPostDialog',true)">Cancel</v-btn>
      </v-toolbar>
      <v-card-text class="px-0">
        <v-stepper v-model="e14" vertical class="elevation-0">
          <v-stepper-step step="1">
            Your Message
            <small>Compose your message</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-card color="" flat tile :class="{'mb-5':type == 'post'}" min-height="200px">
              <v-textarea auto-grow color="secondary"
                label="Type your message" v-model="form.message"
                name="broadcast" outline
              ></v-textarea>

              <!-- Selected images preview -->
              <v-container grid-list-sm px-0 v-if="type == 'post'">
                <v-layout row wrap v-if="blob_urls">
                  <v-flex xs3 v-for="(blob_url,i) in blob_urls" :key="i">
                    <v-card height="100" class="mb-1">
                      <v-img :src='blob_url' height="100"></v-img>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
              
              <v-chip color="teal" text-color="white" v-if="type == 'post'" @click="triggerFileSelector">
                <v-avatar>
                  <v-icon color="">insert_photo</v-icon>
                </v-avatar>
                Add Photos
              </v-chip>
              <v-chip color="grey" text-color="white" v-if="type == 'post' && blob_urls.length > 0" @click="blob_urls = [];selected_files = []">
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
                  <v-select class="mt-3" outline color="secondary" v-if="type == 'post'"
                    label="Select group" v-model="form.group"
                    :items="myContests" item-value="electionId"
                    item-text="title"
                  ></v-select>
                  <v-text-field v-else
                    name="name"
                    label="Group"
                    value="Current Election"
                    disabled
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card>
            <v-btn flat @click="e14 = 1" :disabled="loading">Previous</v-btn>
            <v-btn color="success" outline :disabled="p_group_rules" :loading="loading" flat @click="newPost">Finish</v-btn>
          </v-stepper-content>
          <v-divider inset vertical></v-divider>
        </v-stepper>
      </v-card-text>

      <input type="file" name="file" id="post_img" multiple style="visibility:hidden;" @change="onPostFileSelect($event)" accept="image/jpeg,image/png">
    </v-card>
</template>
<script>
export default {
  data:()=>({
    snackbar:{},
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
  props:{
    user:Object,
    myContests:Object,
    type:{
      type:String,
      default:'post'
    }
  },
  computed:{
    p_msg_rules(){
      return !this.form.message.trim()
    },
    p_group_rules(){
      return 
      this.type == 'post' ? 
      !this.form.group.trim() : 
      true
    },
  },
  methods:{
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
        
        throw new Error(error || error.response)
        
      }
      
    },
    async newPost(){
      try{
        this.loading = true
        let images = this.selected_files.length > 0 ? await this.uploadImages() : []
        console.log(images)

        let postRef = db.collection('posts').doc()
        let post = {
          id:postRef.id,
          message:this.form.message,
          images:images,
          group:this.type == 'post' ? this.form.group : this.$route.params.electionId,
          dateCreated:Date.now(),
          seenBy:[],
          type:this.type,
          reactions:{
            like:[],love:[],haha:[]
          },
          comments:[],
          department:this.user.department,
          faculty:this.user.faculty,
          school:this.user.school,
          createdBy:this.$store.getters.getUser.uid
        }
        
        let res = await postRef.set(post)
        //console.log(res)
        this.loading = false
        //this.posts.push(post)
        this.$eventBus.$emit('HideNewPostDialog',true)
        this.$eventBus.$emit('PushNewPost',post)
        
        this.e14 = 1;
        this.form = {message:'',group:''}
        
        this.$eventBus.$emit('ShowSnackbar',{
          show:true,
          color:'success',
          message:'Post was created successfully'
        })
        
      }catch(err){
        console.log(err)
        this.loading = false
        this.$eventBus.$emit('ShowSnackbar',{
          show:true,
          color:'error',
          message:'Sorry, something went wrong, try again'
        })
      }
    },
  }
}
import api from '@/services/api'
</script>
