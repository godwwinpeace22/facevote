<template>
  <div>
    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi" height="40vh">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>

      <v-card v-else class="" flat height="400" >
        <v-subheader v-if="followers.length == 0">No followers</v-subheader>
        <v-list dense two-line v-for="follower in followers" :key="follower.uid">
          <v-list-tile avatar @click="$eventBus.$emit('ViewProfile', follower.onr)">
            <v-list-tile-avatar :color="$helpers.colorMinder(follower.onr.name.charAt(0))" class="white--text">
              <img :src="follower.onr.photoURL" v-if="follower.onr.photoURL">
              <span v-else>{{follower.onr.name.charAt(0)}}</span>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="text-capitalize">{{follower.onr.name}}</v-list-tile-title>
              <v-list-tile-sub-title :class="$helpers.colorMinder(follower.onr.name.charAt(0)) + '--text'">
                {{follower.onr.dept}} 
              </v-list-tile-sub-title>
            </v-list-tile-content>
            
          </v-list-tile>
          <v-divider inset></v-divider>
        </v-list>
        <v-card-actions>
          <v-btn color="secondary" flat small @click="moreFollowers" v-if="followers.length >= 10 && user.followers > followers.length"
            :loading="loading_more_followers" style="text-transform: initial">
            See more
          </v-btn>
        </v-card-actions>
      </v-card>

    </transition>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    followers: [],
    followers_offset: 25,
    loading_more_followers: false,
  }),
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified',
      'curRoom',
      'curProfile'
    ]),
    user(){
      return this.curProfile
    }
  },
  watch: {
    'user'(to,from){
      
      this.getFollowers()
    }
  },
  methods: {
    moreFollowers(){
      this.loading_more_followers = true
      db.collection('ufollowers').where('followee','==',this.user.uid)
      .startAfter(this.followers_offset)
      .limit(10).get().then(querySnapshot =>{
        
        querySnapshot.forEach(doc => {
          this.followers.push(doc.data())
        });
        this.followers_offset = querySnapshot.docs[querySnapshot.docs.length-1];

        this.loading_more_followers = false
      }).catch(err => {
        // console.log(err)
      })
    },
    async getFollowers(){
      return db.collection('ufollowers')
      .where('followee','==',this.user.uid)
      .limit(10)
      .get().then(querySnapshot=>{
        let arr = []
        querySnapshot.forEach(doc=>{
          arr.push(doc.data())
        })

        this.followers_offset = querySnapshot.docs[querySnapshot.docs.length-1];
        this.followers = arr

        this.showUi = true
        return arr
      })
      // .catch(err => console.log)
    },
  },
  mounted(){
    this.user ? this.getFollowers() : ''
  }
}
import { mapGetters, mapState } from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
</script>

