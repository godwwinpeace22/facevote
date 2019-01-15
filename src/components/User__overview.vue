<template>
  <div>
    <loading-bar v-if="!open"></loading-bar>
    <v-container grid-list-md v-if="open">
      <v-layout row wrap>
        <v-flex xs12 md4 d-flex>
          <v-card style='min-height:200px;'>
            <v-img :src="user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&size=300`" height="300"/>
            <v-subheader class="font-weight-bold grey--text">About</v-subheader>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-tile v-for="item in about_user" :key="item" @click="''">
                <v-flex xs4 class="text-capitalize font-weight-bold">{{item}}:</v-flex>
                <v-flex xs8 :class="item != 'email' ? 'text-capitalize text-truncate' : 'text-truncate'">
                  {{truncateText(user[item])}}
                </v-flex>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 md8 d-flex>
          <v-container grid-list-md pt-0 px-0 mt-0>
            <v-layout row wrap>
              <v-flex xs12>
                <v-card style='min-height:200px;' class="mb-4" height="300">
                  <v-toolbar dense flat color="white" scroll-target="#scroll_target">
                    <v-subheader class="font-weight-bold grey--text">Contests</v-subheader>
                    <v-spacer></v-spacer>
                    <v-btn color="success" small icon>
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-divider></v-divider>
                  <v-list two-line dense style="max-height:250px;overflow:auto;" class="scrollbar" id="scroll_target">
                    <v-subheader v-if="myContests.length <= 0">No contests yet</v-subheader>
                    <div v-for="(contest, index) in myContests" :key="index">
                      <v-list-tile  :key="contest._id" avatar>
                        <v-list-tile-avatar>
                          <img :src="contest.electionRef ? contest.electionRef.logo : '' || `https://ui-avatars.com/api/?name=el+s}`">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title>{{contest.title}}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn :color="index%2 > 0 ? 'success' : 'primary'" depressed small class="text-capitalize">{{getRole(contest)}}</v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      
                      <v-divider  :inset="true" :key="index"></v-divider>
                    </div>
                  </v-list>
                </v-card>
                <v-card style='min-height:200px;'>
                  <v-tabs
                    v-model="follower_tab"
                    color=""
                    slider-color="success"
                  >
                  <v-tab class="text-capitalize" href="#followers">Followers</v-tab>
                  <v-divider inset vertical></v-divider>
                  <v-tab class="text-capitalize" href="#following">Following</v-tab>
                  <v-tab-item value="followers" style="max-height:250px;overflow-y:auto;" class="scrollbar">
                    <v-list two-line dense>
                      <v-subheader v-if="followers.length == 0">No followers yet</v-subheader>
                      <div v-for="(follower, index) in followers" :key="index">
                        <v-list-tile  :key="follower.name" avatar>
                          <v-list-tile-avatar>
                            <img :src="follower.photoURL || `https://ui-avatars.com/api/?name=${follower.name}`">
                          </v-list-tile-avatar>

                          <v-list-tile-content>
                            <v-list-tile-title>{{follower.name}}</v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider  :inset="true" :key="index"></v-divider>
                      </div>
                    </v-list>
                  </v-tab-item>
                  <v-tab-item value="following" style="max-height:250px;overflow-y:auto;" class="scrollbar">
                    <v-list two-line dense>
                      <v-subheader v-if="followings.length <= 0">No followings</v-subheader>
                      <div v-for="(following, index) in followings" :key="index">
                        <v-list-tile  :key="following.name" avatar>
                          <v-list-tile-avatar>
                            <img :src="following.photoURL || `https://ui-avatars.com/api/?name=${following.name}`">
                          </v-list-tile-avatar>

                          <v-list-tile-content>
                            <v-list-tile-title>{{following.name}}</v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider  :inset="true" :key="index"></v-divider>
                      </div>
                    </v-list>
                  </v-tab-item>
                  </v-tabs>
                  <v-divider></v-divider>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          
        </v-flex>
      </v-layout>
    </v-container>
    
  </div>
</template>
<script>
export default {
  data: ()=>({
    follower_tab:1,
    followers:[],
    followings:[],
    about_user:[
      'name','email','school','faculty','department'
    ],
  }),
  props:['myContests','user','broadcasts'],
  computed:{
    open(){
      return this.user.uid ? true : false
    },
  },
  methods:{
    truncateText(text){
      return text.replace(/(.{20})..+/, "$1...");
    },
    getRole(contest){
      let currContest = this.user.contestsRef.find(item => item.electionRef == contest.electionId)
      
      return contest.roles.find(item=> item.token == currContest.role).title
    },
    getFollowers(){
      db.collection('moreUserInfo').where('following','array-contains',this.user.uid)
      .get().then(querySnapshot=>{
        this.followers = []
        querySnapshot.forEach(doc=>{
          this.followers.push(doc.data())
        })
        //console.log(this.followers)
      })
    },
    getFollowings(){
      db.collection('moreUserInfo').where('followers','array-contains',this.user.uid)
      .get().then(querySnapshot=>{
        this.followings = []
        querySnapshot.forEach(doc=>{
          this.followings.push(doc.data())
        })
        console.log(this.followings)
      })
    }
  },
  components:{
    LoadingBar,
  },
  mounted(){
    this.user.uid ? this.getFollowers() : ''
    this.user.uid ? this.getFollowings() : ''
  }
}
import LoadingBar from '@/spinners/LoadingBar'
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

