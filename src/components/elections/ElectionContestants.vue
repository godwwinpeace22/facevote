<template>
  <v-container>

    <transition name="fade">
      <v-card class="pa-4" flat v-if="showUi">
        <v-subheader v-if="contestants && contestants.length == 0">No contestants</v-subheader>

        <carousel v-if="showCarousel && contestants && contestants.length > 0" :nav='true' :responsive="{0:{items:1,nav:false},600:{items:3,nav:true},800:{items:4,nav:true}}" >

          <v-card class="round_top mr-2 mb-2" 
            outlined
            height="320" v-for="contestant in contestants" 
            :key="contestant.author.email" 
            style="position: relative">

            <v-sheet width="100%" height="80" 
              :color="$helpers.colorMinder(contestant.author.name.charAt(0)) + ' lighten-3'">

            </v-sheet>
            
            <div style="width: 41%; height: 100px;" class="mx-auto mt-n12" color="transparent">
              <v-avatar
                size="100"
                :color="$helpers.colorMinder(contestant.author.name.charAt(0))"
              >
                <img :src="contestant.author.photoURL" v-if="contestant.author.photoURL">
                <span v-else class="white--text display-1 text-capitalize">
                  {{contestant.author.name.charAt(0)}}
                </span>
              </v-avatar>
            </div>

            <v-card-text class="px-1 text-center" :id="contestant.author.username + 'cont'"
              @click.stop="$helpers.openProfile($event, contestant.author)">
              <div class="subheading font-weight-bold mb-0 text-capitalize .text-truncate hover">
                {{contestant.author.name}}
                <span class="online_badge success" v-if="contestant.author.online"></span>
              </div>
              <div>
                <i>for</i> {{contestant.role.title}}
              </div>
            </v-card-text>
            <v-card-actions>

              <v-btn color="teal" outlined dark 
                class="mx-auto text-capitalize" 
              >
                {{(contestant.author.followers_count || 0).toLocaleString()}} Follow
              </v-btn>

            </v-card-actions>
          </v-card>
          
        </carousel>
      </v-card>
    </transition>

  </v-container>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    contestants: [],
    showCarousel: false,
    disabled: [],
  }),
  computed: {
    electionId(){
      return this.$route.params.electionId
    },
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
    async getContestants(){
      // get contestants
      
      let contestants = []
      this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .map()
        .on(async (data,key) => {
          // console.log({data,key})

          let role = await this.getRole(key)
          let author = await this.getPerson(key)
          data.author = author;
          data.role = role;
          data.username = author.username
          contestants.push(data)
        })

        // console.log({contestants})
      // this.contestants = uniqBy(contestants, 'username')
      this.contestants = contestants
      this.showCarousel = true;

    },
    async getRole(username){

      // get the role of a contestant
      return await this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .get(username)
        .get('role')
        .then()
          
    },
    async getPerson(username){
      return await this.$gun
        .get(username)
        .then()
    },
    follow(event,contestant){

      this.disabled.push(contestant.username)

      this.$helpers.followUser(this.getUser, contestant)
      .then(data =>{
        this.disabled.splice(this.disabled.indexOf(contestant.username),1)
        // console.log(this.$refs)
        if(data.following){
          // contestant.followers += 1

          this.$refs[contestant.username][0].innerText = `You are following ${contestant.name}`
        }
        else{
          // contestant.followers -= 1
          this.$refs[contestant.username][0].innerText = `Follow ${contestant.name}`
        }
      })
      .catch(err => {
        // console.log(err)
        // contestant.followers += 1
        this.disabled.splice(this.disabled.indexOf(contestant.username),1)
      })
       
    },
  },
  mounted(){
    this.getContestants().then(() => {
      this.showUi = true;
    })
  },
  components: {
    carousel
  }
}

import { mapGetters, mapState } from "vuex";
import { uniqBy } from "lodash";
import carousel from 'vue-owl-carousel'
</script>


