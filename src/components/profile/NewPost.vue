<template>
  
    <v-card>

      <v-toolbar dense flat dark color="teal">
        <v-btn flat icon class="hidden-md-and-up" 
          @click="$eventBus.$emit('HideNewPostDialog',true)">
          <v-icon>chevron_left</v-icon>
        </v-btn>

        <v-subheader class="white--text">Compose</v-subheader>
        <v-spacer></v-spacer>
        <v-btn depressed small icon class="hidden-sm-and-down"
          @click="$eventBus.$emit('HideNewPostDialog',true)">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="">
        
        <v-card color="" flat tile class="{'mb-5':type == 'post'}" min-height="200px">
          <v-textarea auto-grow color="secondary"
            label="Type your message" v-model="form.message"
            name="broadcast" outline
          ></v-textarea>

          <!-- Selected images preview -->
          <v-container grid-list-sm px-0 v-if="type == 'post' && blob_urls">
            <v-layout row wrap>
              <v-flex xs3 v-for="(blob_url,i) in blob_urls" :key="i">
                <v-card height="100" class="mb-1">
                  <v-img :src='blob_url' height="100"></v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          
          <v-chip color="teal" text-color="white" v-if="type == 'post'" @click="$helpers.trigFileSelector">
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
            
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" :disabled="p_msg_rules" :loading="loading" @click="newPost">Create</v-btn>
      </v-card-actions>
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
      message:''
    },
    loading:false,
    cloudinary:{
      cloud_name:'unplugged',
      upload_preset:'pe4iolek'
    },
  }),
  props:{
    user:Object,
    type:{
      type:String,
      default:'post'
    }
  },
  computed:{
    p_msg_rules(){
      return !this.form.message.trim()
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
    async newPost(){
      try{
        this.loading = true
        let images = this.selected_files.length > 0 ? 
        await this.$helpers.uploadImage(this.selected_files, this.cloudinary) : []
        console.log(images)

        let postRef = db.collection('posts').doc()
        let userRef = db.collection('moreUserInfo').doc(this.getUser.uid)
        let post = {
          docId: postRef.id,
          body: this.form.message,
          imgs: images,
          elecRef: this.curRoom.electionId,
          tstamp: Date.now(),
          type: this.type,
          reactions: 0,
          comments: 0,
          dept: this.user.dept,
          fac: this.user.fac,
          sch: this.user.sch,
          onr: ['name', 'photoURL','email','sch','fac','dept','uid']
            .reduce((a, e) => (a[e] = this.getUserInfo[e], a), {}),
        }
        
        let res = postRef.set(post).then(()=>{
          userRef.update({
            posts: this.getUserInfo.posts ? this.getUserInfo.posts * 1 + 1 : 1
          }).then(()=> {
            this.loading = false
          
            this.$eventBus.$emit('HideNewPostDialog',true)
            this.$eventBus.$emit('PushNewPost',post)
            
            this.e14 = 1;
            this.form = {message:'',group:''}
            
            this.$eventBus.$emit('ShowSnackbar',{
              show:true,
              color:'success',
              message:'Post was created successfully'
            })
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
          
          
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
  },
  mounted(){
    this.$eventBus.$on('Selected_Files', data=>{
			this.selected_files = data.selected_files,
			this.blob_urls = data.imgSrc
		})
  }
}
import {mapGetters, mapState} from 'vuex'
</script>
