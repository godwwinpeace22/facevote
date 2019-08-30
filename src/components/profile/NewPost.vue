<template>
  
    <v-card>

      <v-toolbar dense flat color="grey lighten-3">
        <v-btn flat icon class="hidden-md-and-up" 
          @click="$eventBus.$emit('HideNewPostDialog',true)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        

        <v-subheader class="black--text">New Post</v-subheader>
        <v-toolbar-items>
          
          <v-btn :color="form.post_type == 'text' ? 'grey' : ''" 
            :disabled="loading" depressed 
            @click.native="form.post_type = 'text'">
            <v-icon :color="form.post_type == 'text' ? 'white' : 'grey lighten-1'">mdi-pencil</v-icon>
          </v-btn>

          <v-btn :color="form.post_type == 'image' ? 'grey' : ''"
            :disabled="loading" depressed
            @click.native="form.post_type = 'image'">
            <v-icon :color="form.post_type == 'image' ? 'white' : 'grey lighten-1'">mdi-image</v-icon>
          </v-btn>

          <v-btn :color="form.post_type == 'video' ? 'grey lighten-1' : ''" 
            :disabled="loading" depressed tile 
            @click.native="form.post_type = 'video'">
            <v-icon :color="form.post_type == 'video' ? 'white' : 'grey lighten-1'">mdi-video</v-icon>
          </v-btn>
        </v-toolbar-items>


        <v-spacer></v-spacer>
        <v-btn depressed small icon class="hidden-sm-and-down"
          @click="$eventBus.$emit('HideNewPostDialog',true)"
          :disabled="loading">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text v-if="form.post_type == 'image'">
        <v-textarea auto-grow color="secondary" rows="1"
          label="Image caption" v-model="form.message"
          name="broadcast" outline
        ></v-textarea>

          <v-container grid-list-sm px-0 v-if="type == 'post' && blob_urls">
            <v-layout row wrap>
              <v-flex xs3 v-for="(blob_url,i) in blob_urls" :key="i">
                <v-card height="100" class="mb-1">
                  <v-img :src='blob_url' height="100"></v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          
          <v-btn round dark 
            class="teal text-capitalize" 
            :disabled="loading" flat
            v-if="type == 'post'" 
            @click="$helpers.trigFileSelector">
            <v-icon class="mr-2">mdi-image</v-icon>
            
            Select Photos
          </v-btn>

          <v-btn round dark 
            class="grey text-capitalize" 
            :disabled="loading" 
            v-if="type == 'post' && blob_urls.length > 0" 
            @click="blob_urls = [];selected_files = []">

            <v-icon color="error" class="mr-2">mdi-close</v-icon>
            Clear All
          </v-btn>
      </v-card-text>

      <v-card-text v-if="form.post_type == 'video'">
        <v-textarea auto-grow color="secondary" rows="1"
          label="Video caption" v-model="form.message"
          name="broadcast" outline
        ></v-textarea>

        <v-text-field
          name="video_file"
          label="Select video"
          @change.native="selectVideo($event)"
          type="file" outline persistent-hint
          hint="Max video size is 15mb"
        ></v-text-field>
      </v-card-text>

      <v-card-text class="" v-if="form.post_type == 'text'">
        
        <v-card color="" flat tile class="" min-height="200px">
          <v-textarea auto-grow color="secondary"
            label="Type your message" v-model="form.message"
            name="broadcast" outline
          ></v-textarea>
        </v-card>
            
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" :disabled="p_msg_rules" :loading="loading" @click="newPost">Publish</v-btn>
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
        return !this.form.message.trim()
      }
      if(this.form.post_type == 'image'){
        return this.selected_files.length == 0
      }
      if(this.form.post_type == 'video'){
        return !this.video_file
      }
    },
    
    ...mapGetters([
      'getUser',
      'getUserInfo'
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
    async newPost(){
      // Create a new posts
      try{

        this.loading = true
        let options = {
          files: this.form.post_type == 'video' ? [this.video_file] : this.selected_files,
          path: `posts/${this.curRoom.electionId}/${this.form.post_type}s`
        }
        // console.log(options)

        let uploaded = []

        if(this.form.post_type == 'image' || this.form.post_type == 'video'){

          uploaded = await this.$helpers.upload(options)
        }
        
        

        let postRef = db.collection('posts').doc()
        let userRef = db.collection('moreUserInfo').doc(this.getUser.uid)
        let {name, photoURL = false, email, sch=false, fac=false, dept=false, uid, is_student} = this.getUserInfo
        let onr = {
          name,
          photoURL,
          email,
          sch,
          fac,
          dept,
          uid,
          is_student
        }

        let post = {
          docId: postRef.id,
          body: this.$sanitize(this.form.message),
          imgs: this.form.post_type == 'image' ? uploaded : false,
          videoSrc: this.form.post_type == 'video' ? uploaded[0] : false,
          elecRef: this.curRoom.electionId,
          tstamp: firebase.firestore.FieldValue.serverTimestamp(),
          type: this.type,
          post_type: this.form.post_type,
          reactions: 0,
          comments: 0,
          dept: this.user.dept,
          fac: this.user.fac,
          sch: this.user.sch,
          onr: onr,
          weight: 0,
        }

        // Get a new write batch
        let batch = db.batch()

        batch.set(postRef, post)
        // batch.update(userRef, {
        //   posts: firebase.firestore.FieldValue.increment(1)
        // })
        
        batch.commit().then(()=>{
          this.loading = false
          
          this.$eventBus.$emit('HideNewPostDialog',true)
          this.$eventBus.$emit('PushNewPost',post)
          
          this.e14 = 1;
          this.form = {message: '', post_type: 'text'}
          
          this.$eventBus.$emit('ShowSnackbar',{
            show:true,
            color:'success',
            message:'Post was created successfully'
          })
        }).catch(err => {
          this.loading = false
        })
        
        
      }catch(err){
        // console.log(err)
        this.loading = false
        this.$eventBus.$emit('Snackbar',{
          show:true,
          color:'error',
          message:'Sorry, something went wrong, try again'
        })
      }
    },
  },
  mounted(){
    this.$eventBus.$on('Selected_Files', data=>{
			this.selected_files = data.selected_files,
			this.blob_urls = data.imgSrc
		})
  }
}
import {mapGetters, mapState} from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
</script>
