<template>
  <div>
    <v-toolbar dense flat>
      <v-btn icon :to="'/dashboard/forum/' + $route.params.electionId">
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout>
      <v-flex xs12 px-2 v-if="show_profile">
        <v-card flat>
          <v-img :alt="`${user.name}'s profile_img`" :src="user.imgSrc ||  `https://ui-avatars.com/api/?name=${user.name}&size=300`" height="200" aspect-ratio="2.75"></v-img>
          <v-card-title primary-title>
            <div class="d-block">
              <span class="title mb-0 text-capitalize success--text">{{user.name}}</span>
              <span id="online_badge" v-if="checkIfOnline()"></span>
            </div>
            <v-subheader v-if="user.username == $store.getters.getUser.username">
              {{user.followers.length}} | Followers</v-subheader>
              
          </v-card-title>
          
          <v-card-actions>
            <v-btn flat outline small color="success" class="text-capitalize" dark @click="dialog = true" v-if='$store.getters.getUser.username == user.username'>Edit Profile</v-btn>
            <v-btn flat outline small color="success" class="text-capitalize" v-else @click="openPrivateChatWindow">Message</v-btn>
            <v-btn flat outline small color="success" class="text-capitalize" :to="`/users/${user.username}`">Explore</v-btn>
            
          </v-card-actions>
          <v-card-actions>
            <v-btn flat outline small color="success" class="text-capitalize" @click="follow"
              :disabled='disabled.indexOf(user._id) != -1 ? true : false'
              v-if="user.username != $store.getters.getUser.username">
              {{user.followers.length}}&nbsp; | &nbsp;<span id="follow">
                {{user.followers.indexOf(currUser._id) == -1 ? ' Follow' : ' Following'}}</span>
            </v-btn>
          </v-card-actions>
          <v-container ma-0 pa-2>
            <v-subheader class="ma-0 pa-0" style="height:30px;"><strong>Department:&nbsp;</strong> {{user.department}}</v-subheader>
            <v-subheader class="ma-0 pa-0" style="height:30px;"><strong>Faculty:&nbsp;</strong>{{user.faculty}}</v-subheader>
            <v-subheader class="ma-0 pa-0" style="height:30px;" v-if="getRole(user)"><strong>Contesting:&nbsp;</strong> {{getRole().contesting}}</v-subheader>
            <v-subheader class="ma-0 pa-0" style="height:30px;" v-if="getRole(user)"><strong>Role:&nbsp;</strong>{{getRole().role}}</v-subheader>
            
          </v-container>
          <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <profile-settings :dialog='dialog'></profile-settings>
          </v-dialog>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  data:()=>({
    show_profile:false, // hides this view temporarily until required data is available
    drawerRight: true,
    right: null,
    left: null,
    right_sidebar:true,
    user:'', // NOTE: this is not neccesarily the curr logged in user, but the user who's profile is bein viewed
    currUser:{}, // this is the logged in user, used here primarily for convenience
    dialog:false,
    disabled:[],
    regVoters2:null, //just to avoid directly mutating the regVoters prop
  }),
  props:['username','regVoters', 'contestants'],
  methods:{
    extractUser(username){ // lets the get this user from the list of regVoters
      this.user = this.regVoters2.find(item=> item.username == this.username)
      this.currUser = this.$store.state.logged_in_user
      this.show_profile = true // open up this view since enough data is available
    },
    isAccOwner(){
      return this.$store.getters.getUser.username == this.username ? true : false
    },
    openPrivateChatWindow(){
      this.$eventBus.$emit('Open_Private_Chat_Window', {
        ...this.user,
        last_msg_status:'unknown'
      })
    },
    checkIfOnline(){
      let those_online = this.$store.state.those_online
      let found = those_online.find(data => data.username == this.user.username)
      return found ? true : false
    },
    getRole(){
      let found = this.contestants.find(item => item.userId.username == this.user.username)
      return found ? {contesting:'Yes', role:found.role} : false
    },
    follow(event){
      if(this.user.followers.indexOf(this.currUser._id) == -1){
        this.disabled.push(this.user._id)
        //console.log(event)
        this.user.followers.push(this.currUser._id)
        document.getElementById('follow').innerText = 'following'
        api().post(`dashboard/followContestant/${this.user._id}/${this.currUser._id}`, {token:this.$store.getters.getToken}).then(res=>{
          if(res){
            this.disabled.splice(this.disabled.indexOf(this.user._id),1)
            //this.$refs[contestant._id][0].innerText = `you are following ${contestant.userId.name}`
            //console.log(res.data)
          }
        })
      }
      else{
        this.disabled.push(this.user._id)
        this.user.followers.splice(this.user.followers.indexOf(this.currUser._id), 1)
        
        document.getElementById('follow').innerText = 'follow'
        api().post(`dashboard/unfollowContestant/${this.user._id}/${this.currUser._id}`, {token:this.$store.getters.getToken}).then(res=>{
          if(res){
            this.disabled.splice(this.disabled.indexOf(this.user._id),1)
            //this.$refs[contestant._id][0].innerText = `Follow ${contestant.userId.name}`
            //console.log(res.data)
          }
        })
      }
    },
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.regVoters ? this.extractUser(to.params.username) : ''
    }
  },
  components:{
    ProfileSettings,
  },
  async mounted(){
    this.regVoters2 = this.regVoters // just to avoid directly mutating the regVoters prop
    //this.extractUser(this.$route.params.username)
    if(this.regVoters){
      this.extractUser()
    }else{
      let elec = await api().post(`dashboard/getId/${this.$route.params.electionId}`, {token:this.$store.getters.getToken})
      this.regVoters2 = elec.data.regVoters
      this.extractUser()
    }
    this.$eventBus.$on('hide_profile_settings', _=>{
      this.dialog = false
    })
  },
  created(){
    //this.extractUser(this.$route.params.username)
  }
}
import api from "@/services/api";
import ProfileSettings from '@/components/ProfileSettings'
</script>
<style lang="scss" scoped>
  #online_badge{
    display: inline-block;
    background: green;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 5px;
  }
</style>

