<template>
  <div>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm4 d-flex>
          <v-card style='min-height:200px;'>
            <v-subheader class="font-weight-bold grey--text">About</v-subheader>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-tile v-for="item in about_user" :key="item">
                <v-flex xs4>{{item}}:</v-flex>
                <v-flex xs8 :class="item != 'email' ? 'text-capitalize text-truncate' : 'text-truncate'"> {{user[item] || '(234) 345 4567'}}</v-flex>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 sm8 d-flex>
          <v-card style='min-height:200px;' height="300">
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
                    <img :src="contest.electionRef ? contest.electionRef.logo : '' || `https://ui-avatars.com/api/?name=${contest.electionRef ? contest.electionRef.title : 'a+b'}`">
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{contest.electionRef ? contest.electionRef.title : ''}}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn :color="index%2 > 0 ? 'success' : 'primary'" depressed small class="text-capitalize">{{contest.role}}</v-btn>
                  </v-list-tile-action>
                </v-list-tile>
                
                <v-divider  :inset="true" :key="index"></v-divider>
              </div>
            </v-list>
            
            <v-divider></v-divider>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 d-flex>
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
                <v-subheader v-if="user ? user.followers.length <= 0 : ''">No followers yet</v-subheader>
                <div v-for="(follower, index) in user.followers" :key="index">
                  <v-list-tile  :key="follower.name" avatar>
                    <v-list-tile-avatar>
                      <img :src="follower.imgSrc || `https://ui-avatars.com/api/?name=${follower.name}`">
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
                <v-subheader v-if="myContests.length <= 0">No followings</v-subheader>
                <div v-for="(following, index) in user.followers" :key="index">
                  <v-list-tile  :key="following.name" avatar>
                    <v-list-tile-avatar>
                      <img :src="following.imgSrc || `https://ui-avatars.com/api/?name=${following.name}`">
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
    <v-container grid-list-xl>
      <v-card flat>
        <v-toolbar dense flat>
          <v-subheader class="font-weight-bold">Recent Posts</v-subheader>
          <v-spacer></v-spacer>
          <v-btn color="success" right small outline>
            <v-icon>add</v-icon>
            New post</v-btn>
        </v-toolbar>
        <v-layout row wrap>
          <v-subheader v-if="broadcasts.length == 0">No recent post</v-subheader>
          <v-flex sm6 v-for="item of broadcasts" :key="item.dateCreated">
            <v-card class=" mb-3" height="150" flat>
              <v-layout>
                <v-flex xs4 style="background:;" d-flex>
                  <v-img src='https://ui-avatars.com/api/?name=following+name' height="150"></v-img>
                </v-flex>
                <v-flex xs8 d-flex>
                  <v-card-text style="height:150px;">
                    <v-card-title primary-title>
                      Title
                    </v-card-title>
                    Lorem ipsum dolor sit amet consectetur adipisici quae neque culpa id rerum vel soluta quod ea ullam fuga.
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data: ()=>({
    follower_tab:1,
    about_user:[
      'name','email','phone','school','faculty','department'
    ],
  }),
  props:['myContests','user','broadcasts']
}
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

