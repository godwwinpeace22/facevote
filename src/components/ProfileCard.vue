<template>
  <div>
    <v-dialog
      v-model="show_profile"
      :close-on-content-click="false"
      max-width="300"
      >
      <v-card height="" width="" tile >
        <v-card-text class="">
          <v-row class="pt-2" justify="center">
            <v-col class="pa-0 pt-1" cols="6">
              <v-avatar
                class="profile ro"
                color="grey"
                size="130"
                
              >
                <v-img 
                  :src="selectedProfile ? selectedProfile.photoURL || `https://picsum.photos/seed/${1}/130/130?random` : ''" 
                  height="100%" width="100%">
                </v-img>
              </v-avatar>
            </v-col>
            <v-col class="py-0 text-center" cols="12">
              <div>
                
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="title" style="co: #FF5722">
                        {{selectedProfile ? selectedProfile.name : ""}}
                        <span class="online_badge" 
                          :class="selectedProfile.online ? 'success' : 'orange'">
                        </span>
                      </v-list-item-title>
                      <v-list-item-subtitle>{{selectedProfile ? selectedProfile.dept : ''}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <!-- <v-btn text small 
                  :color="voted(selectedProfile) ? 'success' : ''">
                  {{voted(selectedProfile) ? 'Voted' : 'Not Voted'}}
                </v-btn> | -->
                <v-btn text small>{{ selectedProfile.followers_count || 0}} Followers</v-btn> | 
                <v-btn text small>{{ selectedProfile.followings_count || 0}} Following</v-btn>
                <v-btn text small>@{{selectedProfile.username}}</v-btn>

              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pl-0">
              <v-card-actions class="pl-0">
                <v-btn color="info" outlined 
                  v-if="selectedProfile.username != getUser.username"
                  class="mx-auto text-capitalize"
                  :disabled="disabled"
                  @click="follow">
                  {{isFollowing ? 'Unfollow' : 'Follow'}}
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
          
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    show_profile: false,
    disabled: false,
  }),
  watch: {
    'selectedProfile': function(to, from){
      
      this.show_profile = !!to.name
    },
    show_profile: function(to,from){
      
      if(to == false){
        this.$store.dispatch('openProfile', {})
      }
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getSchools',
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified',
      'selectedProfile'
    ]),
    center(){
      return {
        x: document.body.clientWidth/2,
        y: document.body.clientHeight/2
      }
    },
    followers(){
      let arr = []
      this.$gun.get(this.selectedProfile.username)
        .get('followers')
        .map()
        .on((f,key)=> {
          
          f ? arr.push(f) : ''
          // console.log({f,key})
        })
      return uniqBy(arr, 'username')
    },
    isFollowing(){
      let is_following = !!this.followers
      .find(f => f.username == this.getUser.username)
      // console.log(is_following)
      return is_following
    },

  },
  methods: {
    voted(voter){
      if(this.currElection){
        let voted = voter.voted ? voter.voted.find(eId => eId == this.currElection.electionId) : false
        return voted ? true : false
      }
      else{
        return false
      }
    },
    async follow(){
      this.disabled = true

      this.$helpers.followUser(this.getUser, this.selectedProfile)
      .then(data =>{
        this.disabled = false
        
      })
      .catch(err => {
        console.log(err)
      })
    },
  }
}
import { mapState, mapGetters } from 'vuex';
import { uniqBy } from "lodash";
</script>