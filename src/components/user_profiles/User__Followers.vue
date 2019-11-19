<template>
  <div>
    <v-container >
      <v-row justify="center">
        <v-col sm="12" md="8">

          <div class="text-center" v-if="followers.length == 0">No followers yet</div>
          <v-card outlined v-else min-height="300">

            <v-list>
              <template v-for="(follower,i) in followers">
                <v-list-item :key="follower.username">
                  <v-list-item-avatar :color="$helpers.colorMinder(follower.name.charAt(0))">
                    <span>{{follower.name.charAt(0)}}</span>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{follower.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      @{{follower.username}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn color="accent" rounded depressed small outlined>Follow</v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider :key="follower.username + 'c'" v-if="i < 4"></v-divider>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    followers: [],
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([

    ]),
    async user(){
      return await this.$gun.get(this.username)
        .then()
    },
    username(){
      return this.$route.params.username
    },
  },
  methods: {
    initialize(){
      this.getFollowers()
    },
    async getFollowers(){
      let followerRef = this.$gun
        .get(this.username)
        .get('followers')

        followerRef
        .map()
        .once(d => {
          console.log('followers: => ', d)
          this.followers.find(f => f.username == d.username) ? '' : 
          this.followers.push(d)
        })
      this.showUi = true
        
    },
  },
  mounted(){
    this.initialize()
  }
}

import { mapState, mapGetters } from "vuex";
</script>
