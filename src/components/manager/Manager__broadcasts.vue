<template>
  <div>
    <v-container grid-list-xl>
      <v-card flat tile>
        <v-toolbar dense flat color="teal" dark>
          <v-subheader class="font-weight-bold white--text">Recent Posts</v-subheader>
          <v-spacer></v-spacer>
          <v-btn color="" right small outline @click="dialog = true">
            <v-icon>add</v-icon>
            New post</v-btn>
        </v-toolbar>
        <v-layout row wrap>
          <v-flex sm6 v-for="item of broadcasts" :key="item.dateCreated">
            <v-card class=" mb-3" height="150" flat tile>
              <v-layout>
                <v-flex xs4 style="background:;" d-flex>
                  <v-img src='https://ui-avatars.com/api/?name=following+name' height="150"></v-img>
                </v-flex>
                <v-flex xs8 d-flex>
                  <v-card-text style="height:150px;">
                    <v-card-title primary-title>
                      Title
                    </v-card-title>
                    {{item.message}}
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>

        <!-- NEW BROADCAST DIALOG -->
        <v-dialog
          v-model="dialog"
          scrollable 
          persistent
          max-width="850px"
          transition="slide-y-transition">
          <new-post :user='user' type='broadcast'></new-post>
        </v-dialog>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data: ()=>({
    dialog:false,
    broadcasts:[],
    snackbar:{},
    e13: 1,
    form:{
      message:'',
      type:'post',
      audience:'everyone',
      togroup:'',
    },
    radio:null,
    group:[],
    groups:[],
  }),
  props:[],
  computed:{
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    getContests(){
      return this.groups
    }
  },
  methods:{
    getBroadcasts(){
      db.collection('posts')
      .where('type','==','broadcast')
      .where('group','==',this.$route.params.electionId)
      .get().then(docs=>{
        let arr = []
        docs.forEach(doc=>{
          arr.push(doc.data())
        })
        this.broadcasts = arr
      })
    },
    userInfo(){
      db.collection('moreUserInfo')
      .doc(this.$store.getters.getUser.uid)
      .get().then(doc=>{
        
        this.user = doc.data()
        
      })
    }
  },
  mounted(){
    this.$eventBus.$on('HideNewPostDialog', data=>{
      this.dialog = false
    })
    this.$eventBus.$on('ShowSnackbar', data=>{
      this.snackbar = data
    })
    this.$eventBus.$on('PushNewPost',data=>{
      this.broadcasts.push(data)
    })

    this.getBroadcasts()

    if(this.getUserInfo){
      this.user = this.getUserInfo
    }else{
      this.userInfo()
    }
  },
  components:{
    NewPost
  }
}
import api from '@/services/api'
import {mapGetters} from 'vuex'
import NewPost from '@/components/profile/User__posts_new'
</script>
<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;

  /* --scrollbar --*/
  .scrollbar::-webkit-scrollbar {
      width: 10px;
      background-color: #d7d7df ;
      @include borderRadius(10px)
    }
  .scrollbar::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #d7d7df ;
    @include borderRadius(10px)
  }
  .scrollbar::-webkit-scrollbar-thumb {
    background-color:#87899c ;
    @include borderRadius(10px);
  }
</style>
