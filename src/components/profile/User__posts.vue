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
        <v-container class="px-0 grey lighten-3">
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
                      Lorem ipsum dolor sit, amet consectetur adipisicing qui nam corrupti natus. Cupiditate adipisci architecto suscipit veniam autem quo, voluptatum nemo exercitationem, inventore vero deserunt
                      
                      {{$helpers.truncateText(post.message)}}
                      
                      <v-card-actions>
                        <v-btn  icon small>
                          <v-icon color="red">thumbs_up</v-icon>
                        </v-btn>
                        <v-btn icon small>
                          <v-icon color="secondary">share</v-icon>
                        </v-btn>
                        <v-btn icon small>
                          <v-icon color="secondary">insert_comment</v-icon>
                        </v-btn>
                      </v-card-actions>
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
      max-width="850px" transition="dialog-transition">
      <v-toolbar dense>
        Read post
        <v-spacer></v-spacer>
        <v-btn flat icon color="success" @click="read = false;">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card tile>
        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt earum nam vel quod assumenda. Sunt vero unde perspiciatis aut, eum minima, quidem necessitatibus odit sit facere nisi natus eius debitis.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt earum nam vel quod assumenda. Sunt vero unde perspiciatis aut, eum minima, quidem necessitatibus odit sit facere nisi natus eius debitis.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt earum nam vel quod assumenda. Sunt vero unde perspiciatis aut, eum minima, quidem necessitatibus odit sit facere nisi natus eius debitis.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt earum nam vel quod assumenda. Sunt vero unde perspiciatis aut, eum minima, quidem necessitatibus odit sit facere nisi natus eius debitis.
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
                        <v-img :src='image' max-height='500' min-height='300' width="100%"></v-img>
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

      <new-post :user='user' :myContests='myContests'></new-post>
    </v-dialog>
    
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
    
  },
  components:{
    NewPost
  },
  mounted(){
    
    this.$eventBus.$on('HideNewPostDialog', data=>{
      this.new_post_dialog = false
    })
    this.$eventBus.$on('ShowSnackbar', data=>{
      this.snackbar = data
    })
  },
}
import NewPost from '@/components/profile/User__posts_new'
</script>
