<template>
  <div>
    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi" height="40vh">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>

      <v-card v-else class="" flat height="400" >
        <v-subheader v-if="followers.length == 0">No followers</v-subheader>
        <v-list dense two-line v-for="follower in followers" :key="follower.uid">
          <v-list-item @click="$eventBus.$emit('ViewProfile', follower)">
            <v-list-item-avatar :color="$helpers.colorMinder(follower.name.charAt(0))" class="white--text">
              <img :src="follower.photoURL" v-if="follower.photoURL">
              <span v-else>{{follower.name.charAt(0)}}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="text-capitalize">{{follower.name}}</v-list-item-title>
              <v-list-item-subtitle :class="$helpers.colorMinder(follower.name.charAt(0)) + '--text'">
                {{follower.dept}} 
              </v-list-item-subtitle>
            </v-list-item-content>
            
          </v-list-item>
          <v-divider inset></v-divider>
        </v-list>
        <v-card-actions>
          <v-btn color="secondary" text small @click="moreFollowers" v-if="followers.length >= 10 && user.followers > followers.length"
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
  props: ['username'],
  computed: {
    ...mapGetters([
      'getUser',
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
      let followerRef = this.$gun
        .get(this.username)
        .get('followers')

        followerRef
        .map()
        .once(d => {
          console.log('followers: => ', d)
          this.followers.push(d)
        })
      this.showUi = true
        
    },
  },
  mounted(){
    this.user ? this.getFollowers() : ''
  }
}
import { mapGetters, mapState } from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
</script>

