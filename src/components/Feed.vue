<template>
  <div>
    <vue-headful :title="title"/>

    <navigation></navigation>

    <!--loading-bar spinnerType='circle' v-if="!ready">
      <div slot="loading_info">Loading posts...</div>
    </loading-bar-->

    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" top>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <!-- LOADING WIREFRAME -->
    <v-container grid-list-xl v-if="!ready" fluid>
      <v-layout row wrap justify-space-between>
        <v-flex xs12 sm12 md4 order-md2>
          <v-card :height="$vuetify.breakpoint.smAndDown ? 150 : 400" flat class="elevation-0" elevation-0>
            <v-list two-line dense>
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  
                  <v-avatar color="grey lighten-3" size="40" tile>
                    
                  </v-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content class="px-0">
                  <div class="grey lighten-3 wireframe mb-2" style="width:40%;height:12px;"></div>
                  <div class="grey lighten-3 wireframe" style="width:30%;height:12px;"></div>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md7 >
          <v-card  v-for="(post,i) in 2" :key="i" flat
            height="250" class="mb-3 pb-2">
            
            <v-list two-line dense>
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  
                  <v-avatar color="grey lighten-3" size="40">
                    
                  </v-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content class="px-0">
                  <div class="grey lighten-3 wireframe mb-2" style="width:40%;height:12px;"></div>
                  <div class="grey lighten-3 wireframe" style="width:30%;height:12px;"></div>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>

            <div class="grey lighten-3 wireframe mx-3 mb-3 mt-4" style="width:70%;height:12px;"></div>
            <div class="grey lighten-3 wireframe mx-3 mb-3" style="width:90%;height:12px;"></div>
            <div class="grey lighten-3 wireframe mx-3 mb-3" style="width:50%;height:12px;"></div>
           
          </v-card>
        </v-flex>
        
      </v-layout>
    </v-container>


    <v-container grid-list-xl v-if="ready">
      <v-layout row wrap justify-space-between>
        <!-- POST ACTIONS -->
        <v-flex sm12 md7>
          <v-card class="" height="50" color="grey lighten-4" flat>
            <v-chip color="teal" text-color="white" @click="new_post_dialog = true">
              <v-avatar>
                <v-icon>add_circle</v-icon>
              </v-avatar>
              Create A Post
            </v-chip>
            <v-menu offset-y content-class="round">
              <v-chip color="secondary" slot="activator" class="linkify" text-color="white">
                <v-avatar>
                  <v-icon>filter_list</v-icon>
                </v-avatar>
                Filter Posts
              </v-chip>
              <v-list dense dark class="">
                <v-list-tile class="orange--text">
                  <v-list-tile-title>Show posts from:</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile v-for="item in filter_items"
                  :key="item.key" @click="filterPostsBy(item.val)">
                  <v-list-tile-title>{{ item.text }}
                    <v-icon v-if="getFeedFilter && item.val == getFeedFilter.key" small color="success">check</v-icon>
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
            
          </v-card>
        </v-flex>

        <v-flex xs12 sm12 md4 order-md2>
          <v-card :height="$vuetify.breakpoint.smAndDown ? 150 : 400" 
            flat class="elevation-0" elevation-0 style="overflow-y:scroll;">
            <v-subheader class="font-weight-bold">Popular Elections</v-subheader>
           <v-list two-line dense>
             <v-list-tile avatar :to="`/elections/watch/${election.electionId}`" v-for="election in elections" :key="election.electionId">
               <v-list-tile-avatar>
                 <v-icon class="amber white--text">call_to_action</v-icon>
               </v-list-tile-avatar>
               <v-list-tile-content>
                 <v-list-tile-title class="secondary--text">
                  {{election.title}}</v-list-tile-title>
                 <v-list-tile-sub-title>{{election.followers.length}} followers</v-list-tile-sub-title>
               </v-list-tile-content>
             </v-list-tile>
             
           </v-list>
          </v-card>
        </v-flex>
        
        <!-- POSTS -->
        <v-flex xs12 sm12 md7 >
          <v-subheader v-if="posts.length == 0">No posts for the applied filter</v-subheader>
          <v-card  v-for="(post,i) in posts" :key="i" 
            height="" elevation-1 class="mb-3 pb-2 elevation-1">
            
            <v-list two-line dense>
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="extractStudent(post.createdBy).photoURL" v-if="extractStudent(post.createdBy).photoURL">
                  <v-avatar v-else :color="$helpers.colorMinder(extractStudent(post.createdBy).name.charAt(0))" size="40">
                    <span class="white--text headline">{{extractStudent(post.createdBy).name.charAt(0)}}</span>
                  </v-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="secondary--text linkify" style="width:fit-content" @click="profileDialog = true; userProfile = extractStudent(post.createdBy)">
                    {{extractStudent(post.createdBy).name}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>{{new Date(post.dateCreated).toLocaleString('en-us',date_options)}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-progress-circular v-if="waiting" :value="10"  class="d-inline-block" color="grey" indeterminate></v-progress-circular>
                  <v-menu offset-y top left>
                   <v-icon color="grey" slot="activator">more_horiz</v-icon>
                    
                    <v-list dense>
                      <v-list-tile  @click="followUser($event,post.createdBy)">
                        <v-list-tile-title>
                          {{isFollowing(extractStudent(post.createdBy)) ? 'Following ' + 
                          extractStudent(post.createdBy).name : 
                          'Follow ' + extractStudent(post.createdBy).name}}
                          
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>

            <v-card-text>
              <span v-if="readmore.find(id=>id == post.id)">{{post.message}}</span>
              <span v-else>{{$helpers.truncateText(post.message,200)}}</span>
              <span @click="readmore.push(post.id)" class="secondary--text linkify" 
                style="text-decoration:none;" v-show="post.message.length > 200 && !readmore.find(id=>id == post.id)">
                ..Read more
              </span>
              <v-container grid-list-sm class="px-0" v-if="post.images.length > 0">
                <v-layout row wrap>
                  <v-flex v-for="(image,i) in post.images" :key="i" class="px-2" 
                    :class="{'xs3':post.images.length >=3,'xs12':post.images.length == 1,'xs6':post.images.length == 2}">
                    <v-card dark max-height="500px" :height="post.images.length == 1 ? 'initial' : $vuetify.breakpoint.xsOnly ? 100 : '200'" class="mb-3">
                      <v-img :src="image" :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`" 
                        alt="" class="grey lighten-2 linkify" height="100%" width="100%"
                        @click="carouselDialog(post.images,i)">
                        
                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                      </v-img>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-divider class="mx-3"></v-divider>
            <v-card-actions>
              <div style="width:fit-content;" class="text-xs-center">
                <div class="round">
                  <span class="mr-2">{{[...post.reactions['love'], ...post.reactions['like'], ...post.reactions['haha']].length}}</span>
                  <v-btn color="secondary" icon small @click="addReaction(post,'like')" 
                    v-show="post.reactions['like'].length > 0"><v-icon small>
                    thumb_up</v-icon>
                  </v-btn>

                  <v-btn color="red" icon dark small style="margin-left:-6px;" 
                    @click="add_reaction(post,'love')" v-show="post.reactions['love'].length > 0">
                    <v-icon small>favorite</v-icon>
                  </v-btn>
                  <v-btn color="yellow" icon dark small style="margin-left:-6px;"
                    @click="add_reaction(post,'haha')" v-show="post.reactions['haha'].length > 0">
                    <span class="emojis">😃</span>
                  </v-btn>
                  
                </div>
                <v-menu offset-y hover right open-on-hover content-class='round'>
                  <v-btn color="secondary" slot="activator" flat style="border:1px solid;" 
                    class="mt-1 round" depressed>
                    <v-icon>thumb_up</v-icon>
                    <span class="ml-2">Like</span>
                  </v-btn>
                  <div class="white pa-1">
                    <v-btn icon small @click="add_reaction(post,'like')">
                      <v-icon  color="secondary" >thumb_up</v-icon>
                    </v-btn>
                    <v-btn icon small @click="add_reaction(post,'love')">
                      <v-icon  color="red">favorite</v-icon>
                    </v-btn>
                    <v-btn icon small @click="add_reaction(post,'haha')">
                      <span class="emojis">😃</span>
                    </v-btn>
                    
                  </div>
                </v-menu>
                
              </div>
              <v-spacer></v-spacer>
              <div style="width:fit-content;" class="text-xs-center">
                <div>{{post.comments.length}}</div>
                <v-btn color="grey" dark class="round mt-1" depressed 
                  @click="expand(i)">
                  <v-icon>insert_comment</v-icon>
                  <span class="ml-2">Comment</span>
                </v-btn>
              </div>
            </v-card-actions>

            <v-expand-transition>
              <div v-if="expanded.indexOf(i) != -1">
                <v-container class="px-1">
                  <v-card flat>
                    <v-card-text class="px-2">
                      <v-textarea auto-grow color="secondary" rows="1"
                        name="comment" outline :append-outer-icon="comment.trim() ? 'send' : ''"
                        label="Add a comment" v-model="comment" @click:append-outer="submitComment(post.id)"
                      >
                      </v-textarea>
                    </v-card-text>
                    <v-card-actions>
                      
                    </v-card-actions>

                    <v-divider></v-divider>

                    <v-card-title class="font-weight-bold px-2">Comments</v-card-title>
                    <v-card-text class="px-2" v-for="comment in post.comments" :key="comment.id">
                      <v-layout row wrap>
                        <v-flex :class="{'xs2':$vuetify.breakpoint.xsOnly, 'xs1':$vuetify.breakpoint.smAndUp}">
                          <v-avatar size="40" :color="$helpers.colorMinder(extractStudent(comment.by).name.charAt(0))" class="white--text">
                            <img :src="extractStudent(comment.by).photoURL" v-if="extractStudent(comment.by).photoURL" alt="alt">
                            <span v-else>{{extractStudent(comment.by).name.charAt(0)}}</span>
                          </v-avatar>
                        </v-flex>
                        <v-flex :class="{'xs10':$vuetify.breakpoint.xsOnly,'xs11':$vuetify.breakpoint.smAndUp}">
                          <v-card flat class="round grey lighten-3">
                            <v-list class="round grey lighten-3">
                              <v-list-tile>
                                
                                <v-list-tile-content>
                                  <v-list-tile-title style="width:fit-content;" class="secondary--text linkify"
                                    @click="profileDialog = true; userProfile = extractStudent(comment.by)">
                                    {{extractStudent(comment.by).name}}
                                  </v-list-tile-title>
                                  <v-list-tile-sub-title>{{new Date(comment.dateCreated).toLocaleString('en-us',date_options)}}</v-list-tile-sub-title>
                                </v-list-tile-content>
                              </v-list-tile>
                            </v-list>
                            <v-card-text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo inventore quis sunt cum incidunt mollitia molestiae eligendi libero quam repellat laudantium nulla earum non pariatur ipsum a tempora, omnis vel!</v-card-text>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-container>
                
              </div>
            </v-expand-transition>
            
          </v-card>
        </v-flex>
        
      </v-layout>
    </v-container>

    <!-- VIEW PROFILE -->
    <v-dialog v-model="profileDialog" :overlay="false"
      max-width="350px" transition="dialog-transition">
      <v-card>
        <v-toolbar dense flat>
          <span>Profile</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="profileDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <view-profile :user="userProfile"></view-profile>
      </v-card>
      
    </v-dialog>

    <!-- carousel dialog -->
    <v-dialog v-model="carousel_dialog" lazy
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
              <v-flex xs1 v-if="$vuetify.breakpoint.smAndUp" class="linkify"
                @click="prev">
                <v-btn color="" depressed icon>
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
                        <v-img :src='image' max-height='500' 
                          style="margin:auto;" min-height='300' 
                          :max-width="$vuetify.breakpoint.xsOnly ? '100%' : '80%'">
                        </v-img>
                      </v-flex>
                      
                      </v-layout>
                    </v-card>
                  </v-window-item>
                </v-window>
              </v-flex>
              <v-flex xs1 v-if="$vuetify.breakpoint.smAndUp" class="linkify"
                @click="prev">
                <v-btn depressed icon>
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
      scrollable lazy
      persistent :fullscreen='$vuetify.breakpoint.smAndDown'
      max-width="850px"
      transition="slide-y-transition">

      <new-post :user='getUserInfo' :myContests='myContests'></new-post>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Home | Facevote',
    posts:[],
    snackbar:false,
    elections:[],
    expanded:[],
    readmore:[],
    loading:[],
    waiting:false,
    userProfile:{},
    new_post_dialog:false,
    profileDialog:false,
    carousel_dialog:false,
    carousel_images:[],
    onboarding:0,
    comment:'',
    date_options:{
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    },
    students:[],
    ready:false,
  }),
  components:{
    Navigation,
    ViewProfile,
    NewPost
  },
  computed:{
    ...mapGetters([
      'isAuthenticated',
      'getUser',
      'getUserInfo',
      'getFeedFilter',
      'getMyEnrolled'
    ]),
    filter_items(){
      return [
        {val:'department',text:'My department only'},
        {val:'faculty',text:'My faculty only'},
        {val:'school',text:'Show all posts'}
      ]
    },
    myContests(){
      let enrolled = []
      this.getMyEnrolled.forEach(election=>{
        if(election.contestants.find(contestant => contestant == this.getUser.uid)){
          enrolled.push(election)
        }
      })
      return enrolled
    }
  },
  methods:{
    expand(doc_id){
      if(this.expanded.indexOf(doc_id) == -1){
        //this.expanded = []
        this.expanded.push(doc_id)
      }
      else{
        this.expanded.splice(this.expanded.indexOf(doc_id),1)
      }
      
    },
    extractStudent(uid){
      let found = this.students.find(student => student.uid == uid)
      return found ? found : {}
    },
    filterPostsBy(filter){
      
      let args = {
        key:filter,
        value:filter == 'department' ? this.getUserInfo.department : 
        filter == 'faculty' ? this.getUserInfo.faculty : 
        this.getUserInfo.school,
        u:this.getUser.uid
      }
      // save the filter chosen in local storage
      this.$store.dispatch('saveFeedFilter', args)
      
      // filter the posts from the feed
      
      this.ready = false
      this.latestPosts(this.getUserInfo).then(posts=>{
        this.ready = true;
      })
    },
    async submitComment(docId){
      this.loading.push(docId)
      let currPost = this.posts.find(post=>post.id == docId)
      currPost ? currPost.comments.push({
        by:this.getUser.uid,
        message:this.comment,
        dateCreated:Date.now(),
      }) : ''
      
      let docRef = db.collection('posts').doc(docId)
      docRef.update({
        comments:firebase.firestore.FieldValue.arrayUnion({
          by:this.getUser.uid,
          id:docRef.id,
          message:this.comment,
          dateCreated:Date.now(),
        }),
      }).then(done=>{
        this.comment = ''
        this.loading.splice(this.loading.indexOf(docId),1)
      })
      
    },
    async schoolMembers(){
      return db.collection('moreUserInfo')
      .where('school','==',this.getUserInfo.school)
      .get().then(docs=>{
        docs.forEach(doc=>{
          this.students.push(doc.data())
        })
        console.log(this.students)
        return Promise.resolve(this.students)
      })
    },
    latestPosts(user){
      let key,value;

      if(this.getFeedFilter && this.getFeedFilter.u == this.getUser.uid){
        key = this.getFeedFilter ? this.getFeedFilter.key : 'school'
        value = this.getFeedFilter ? this.getFeedFilter.value : user.school
      }
      else{
        key = 'school'
        value = user.school
      }
      
      console.log(key,value,user)
      return new Promise((resolve,reject)=>{
        db.collection('posts')
        .where(key,'==',value)
        .get().then(docs=>{
          this.posts = []
          docs.forEach(doc => {
            //console.log(doc.data().id)
            this.posts.push(doc.data())
          });
          //console.log(this.posts)
          resolve(this.posts)
        }, err=> reject(err))
      })
    },
    allElections(user){
      // Elections in user school
      db.collection('elections').where('school','==',user.school)
      .where('public','==',true)
      .get().then(docs=>{
        this.elections = [];
        docs.forEach(doc=>{
          this.elections.push(doc.data())
        })
      })
    },
    async add_reaction(post,reaction){
      try {
        console.log(post,reaction)
        let a_reaction = post.reactions[reaction]
        //console.log(a_reaction)
        let me = this.getUser.uid

        if(a_reaction.indexOf(me) != -1){ // if current user has reacted in same way before
          
          a_reaction.splice(a_reaction.indexOf(me)) // this is reactive, so views are updated immediately
          
          
          db.collection('posts').doc(post.id).update({
            reactions:post.reactions
          })
        }
        else if(a_reaction.indexOf(me) == -1){ // if current user hasn't reacted same way before
          a_reaction.push(this.getUser.uid) // this is reactive, so view are updated immediately
          db.collection('posts').doc(post.id).update({
            reactions:post.reactions
          })
          //$('chat_home').scrollTop($('#chat_home')[0].scrollHeight);
        }
        else{}
  
      } catch(err) {
        console.log(err)
      }
    },
    isFollowing(user){
      return user.followers.indexOf(this.getUser.uid) == -1 ? false : true
    },
    followUser(event,userId){
      let user = this.extractStudent(userId)
      console.log(event)
      if(this.isFollowing(user)){
        //this.disabled.push(user.uid)
        user.followers.push(this.getUser.uid)

        db.collection('moreUserInfo').doc(user.uid).update({
          followers:firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.uid).update({
            following:firebase.firestore.FieldValue.arrayUnion(user.uid)
          })
          
          event.target.innerHTML = 'Following ' + user.name
          //this.disabled.splice(this.disabled.indexOf(user.uid),1)
          //this.$refs[user.uid][0].innerText = `you are following ${user.name}`
          ////console.log(res.data)
          //this.disabled.splice(this.disabled.indexOf(user.uid),1)
          
        })
      }
      else{
        //this.disabled.push(user.uid)
        user.followers.splice(user.followers.indexOf(this.getUser.uid), 1)
        
        //event.target.innerText = `(${user.followers.length - 1})  follow`
        db.collection('moreUserInfo').doc(user.uid).update({
          followers:firebase.firestore.FieldValue.arrayRemove(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.uid).update({
            following:firebase.firestore.FieldValue.arrayRemove(user.uid)
          })
          event.target.innerHTML = 'Follow ' + user.name
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    carouselDialog(images,index){
      this.carousel_dialog = true
      this.carousel_images = images
      this.onboarding = index
    },
    next(){
      this.onboarding = this.onboarding + 1 === this.carousel_images.length
        ? 0
        : this.onboarding + 1
    },
    prev(){
      this.onboarding = this.onboarding - 1 < 0
        ? this.carousel_images.length - 1
        : this.onboarding - 1
    },
  },
  mounted(){
    this.$eventBus.$on('HideNewPostDialog', data=>{
      this.new_post_dialog = false
    })
    this.$eventBus.$on('ShowSnackbar', data=>{
      this.snackbar = data
    })
    this.$eventBus.$on('PushNewPost',data=>{
      this.posts.push(data)
    })
  },
  async created(){
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        if(this.getUserInfo){

          this.latestPosts(this.getUserInfo).then(async posts=>{
            console.log(posts);
            await this.schoolMembers().then(students=>{
              console.log(students)
              this.ready = true;
            })
            
          }).catch(err=>console.log(err))
          
          this.allElections(this.getUserInfo)
        }
        else{
          console.log(user)
          db.collection('moreUserInfo')
          .doc(user.uid).get().then(async doc=>{
            this.$store.dispatch('setUserInfo',doc.data())
            await this.schoolMembers()
            this.latestPosts(doc.data()).then(posts=>{
              this.ready = true;
            })
            this.allElections(doc.data())
          }).catch(err=>console.log(err))
        }
      } else {
        console.log('No user is signed in.')
      }
    });

  }
}
import Navigation from '@/components/Navigation'
import ViewProfile from '@/components/ViewProfile'
import NewPost from '@/components/profile/User__posts_new'
import {mapGetters} from 'vuex'
</script>
<style lang="scss" scoped>
  a{
    text-decoration: none;
  }
  .linkify{
    cursor: pointer;
  }
  .emojis{
    font-size: 22px;
  }
  .wireframe::after{
    content: '';
    position: absolute;
    width: 40%;
    height: 12px;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(255,255,255, 15%), rgba(0, 0, 0, 0));
    transform: translateX(-10%);
    animation: loading 1.5s infinite;
  }

  @keyframes loading{
    100%{
      transform: translateX(100%)
    }
  }
</style>
