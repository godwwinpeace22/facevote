<template>
  
    <v-card>

      <v-toolbar flat color="grey lighten-3">
        <v-btn text icon class="hidden-md-and-up" 
          @click="$eventBus.$emit('HideNewPostDialog',true)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        

        <v-subheader class="black--text">Create a Post</v-subheader>
         
        <v-toolbar-items>
          <template v-for="item in toolbarItems">

            <v-btn :color="form.post_type == item.type ? 'white' : 'grey lighten-3'" 
              :disabled="loading" depressed :key="item.type"
              @click.native="form.post_type = item.type">
              <v-icon :color="form.post_type == item.type ? 'info lighten-1' : 'grey'">
                {{item.icon}}
              </v-icon>
            </v-btn>

          </template>

        </v-toolbar-items>


        <v-spacer></v-spacer>
        <v-btn depressed small icon class="hidden-sm-and-down"
          @click="$eventBus.$emit('HideNewPostDialog',true)"
          :disabled="loading">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        
        <v-card color="" flat tile class="mt-6" min-height="200px">
          <v-textarea auto-grow color="primary"
            label="Type your message" v-model="form.message"
            name="broadcast" outlined
          ></v-textarea>

          <v-file-input show-size counter v-if="form.post_type == 'image'"
            outlined append-icon="mdi-image" prepend-icon=""
            multiple label="Select images" chips accept="image/jpeg,image/png,image/gif"
            v-model="selected_files">

            <template v-slot:selection="{ index, text }">
              <v-chip
                v-if="index < 3"
                color="deep-purple accent-4"
                dark
                label
                small
              >
                {{ text }}
              </v-chip>

              <span
                v-else-if="index > 3"
                class="overline grey--text text--darken-3 mx-2"
              >
                +{{ selected_files.length - 3 }} File(s)
              </span>
            </template>
          </v-file-input>

          <v-file-input show-size counter
            v-if="form.post_type == 'video'"
            outlined append-icon="mdi-video" prepend-icon=""
            label="Select video" chips accept="video/mp4"
            v-model="video_file">
          </v-file-input>

          <!-- <v-select
            :items="getMyEnrolled"
            v-model="audience"
            item-value="electionId"
            item-text="title"
            label="Select your audience"
            outlined dense
          ></v-select> -->
        </v-card>
            
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="success" 
          :disabled="p_msg_rules" 
          :loading="loading" 
          @click="create">
          Publish
        </v-btn>

      </v-card-actions>
    </v-card>
</template>
<script>
export default {
  data:()=>({
    snackbar: {},
    file_modal: false,
    video_file: null,
    e14: 1,
    blob_urls: [],
    selected_files: [],
    form: {
      message: '',
      post_type: 'text'
    },
    toolbarItems: [
      {icon: 'mdi-pencil', type: 'text'},
      {icon: 'mdi-image', type: 'image'},
      {icon: 'mdi-video', type: 'video'}
    ],
    loading: false,
  }),
  props: {
    user: Object,
    type: {
      type: String,
      default: 'post'
    }
  },
  computed: {
    p_msg_rules(){
      if(this.form.post_type == 'text'){
        return !this.form.message || !this.audience
      }
      if(this.form.post_type == 'image'){
        return this.selected_files.length == 0 || !this.audience || !this.form.message
      }
      if(this.form.post_type == 'video'){
        return !this.video_file || !this.audience || !this.form.message
      }
    },
    audience(){
      return this.curRoom.electionId
    },
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom'
    ])
  },
  methods:{
    selectVideo(e){
      let file = e.target.files[0]
      
      if(file && file.size > 15500000){
        alert('Video size should be less than 15mb')
        // e.target.files = ''
        this.video_file = null
      }
      else {
        
        file ? this.video_file = file : ''

      }
    },
    create(){

      this.loading = true
      console.log(this.selected_files)

      let options = {
        files: this.form.post_type == 'video' ? [this.video_file] : this.selected_files,
        path: `posts/${this.audience}/${this.form.post_type}s`
      }

      let uploaded = []
      
      if(this.form.post_type == 'image' || this.form.post_type == 'video'){
        if(this.selected_files.length > 0){

          this.$helpers.uploadMedia(options).then(async uploaded => {
            console.log(await uploaded)
            this.createPost(await uploaded)
          })
        }
        else {

          this.createPost()
        }
      }
      else {
        this.createPost()
      }
    },
    async createPost(uploaded){
      
      this.loading = true
      let postId = this.$uuidv4()

      let user = this.$gun.get('users').get(this.getUser.username)
      let postRef = this.$gun.get('elections')
        .get(this.audience)
        .get('posts')
        .get(postId)

      let body = this.$sanitize(this.form.message)
      // console.log(user)
      
      let post_data = {
        docId: postId,
        body: body,
        author: this.getUser.username,
        elecRef: this.audience,
        tstamp: Date.now(),
        type: this.type,
        videoSrc: false,
        post_type: this.form.post_type,
        dept: this.getUser.dept,
        fac: this.getUser.fac,
        sch: this.getUser.sch,
        weight: 0,
      }

      let post = postRef
        .put(post_data)
        // .get('author')
        // .put(user)

      if(uploaded && uploaded.length > 0){
        
        // add images and videos
        uploaded.forEach(u => {
          if(this.form.post_type == 'image'){
            postRef.get('imgs').set(u)
          }
        })
  
        if(this.form.post_type == 'video'){
          postRef.get('videoSrc').put(uploaded[0])
        }
      }
      

      // save for user
      user.get('posts').set(postRef)

      this.loading = false
      this.$eventBus.$emit('HideNewPostDialog',true)
    }
  },
  mounted(){
    this.$eventBus.$on('Selected_Files', data=>{
			this.selected_files = data.selected_files,
			this.blob_urls = data.imgSrc
    })
    
    // this.$gun.get('users').get(this.getUser.username)
    // .get('enrolled')
    // .map()
    // .get('posts')
    // .map()
    // .once(u => console.log(u))
  }
}
import {mapGetters, mapState} from 'vuex'
</script>
