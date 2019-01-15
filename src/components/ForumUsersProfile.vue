<template>
  <div>
    <v-toolbar dense flat>
      <v-btn icon :to="'/forum/' + $route.params.electionId">
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <!--v-btn v-show="$vuetify.breakpoint.smAndDown" icon @click="$eventBus.$emit('Toggle_drawerRight', false)">
        <v-icon>close</v-icon>
      </v-btn-->
    </v-toolbar>
    <v-layout>
      <v-flex xs12 px-2 v-if="show_profile">
        <v-card flat>
          <v-img :alt="`${user.name}'s profile_img`" 
            :src="user.photoURL ||  `https://ui-avatars.com/api/?name=${user.name}&size=300`" 
            :height="$vuetify.breakpoint.smAndDown ? 400 : 200" aspect-ratio="2.75">
          </v-img>
          <v-card-title primary-title>
            <div class="d-block">
              <span class="title mb-0 text-capitalize success--text">{{user.name}}</span>
              <span id="online_badge" v-if="checkIfOnline()"></span>
            </div>
            <v-subheader v-if="user.email == currUser.email">
              {{user.followers.length}} | Followers</v-subheader>
              
          </v-card-title>
          
          <v-card-actions>
            <v-btn flat outline small color="success" 
              class="text-capitalize" dark @click="dialog = true" 
              v-if='currUser.uid == user.uid'>
              Edit Profile
            </v-btn>
            <v-btn flat outline small color="success" class="text-capitalize" v-else @click="openPrivateChatWindow">Message</v-btn>
            <v-btn flat outline small color="success" class="text-capitalize" :to="`/users/${user.email}`">Explore</v-btn>
            
          </v-card-actions>
          <v-card-actions>
            <v-btn flat outline small color="success" class="text-capitalize" @click="follow"
              :disabled='disabled'
              v-if="user.uid != currUser.uid">
              {{user.followers.length}}&nbsp; | &nbsp;<span id="follow">
                {{user.followers.indexOf(currUser.uid) == -1 ? ' Follow' : ' Following'}}</span>
            </v-btn>
          </v-card-actions>
          <v-container ma-0 pa-2>
            <v-subheader class="ma-0 pa-0" style="height:30px;"><strong>Department:&nbsp;</strong> {{user.department}}</v-subheader>
            <v-subheader class="ma-0 pa-0" style="height:30px;"><strong>Faculty:&nbsp;</strong>{{user.faculty}}</v-subheader>
            <v-subheader class="ma-0 pa-0" style="height:30px;" v-if="getRole()"><strong>Contesting:&nbsp;</strong> {{getRole().contesting}}</v-subheader>
            <v-subheader class="ma-0 pa-0" style="height:30px;" v-if="getRole()"><strong>Role:&nbsp;</strong>{{getRole().role}}</v-subheader>
            
          </v-container>
          <v-dialog v-model="dialog" v-if="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
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
    disabled:false,
    members2:'', //just to avoid directly mutating the members prop
  }),
  props:['email','members', 'thisGroup'],
  computed:{
    isAccOwner(){
      return this.$store.getters.getUser.email == this.email ? true : false
    },
  },
  methods:{
    extractUser(email){ // lets the get this user from the list of regVoters
      this.user = this.members2.find(item=> item.email == this.email)
      this.currUser = this.$store.getters.getUser
      this.show_profile = true // open up this view since enough data is available
      //console.log(this.user)
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
      if(this.user.contestsRef){
        let res = this.user.contestsRef.find(contest=>contest.electionRef == this.thisGroup.electionId)
        //console.log(res)
        let found = this.thisGroup.roles.find(role => role.value == res.role)
        return found ? {role:found.title,contesting:'Yes'} : false
      }
      else{
        return false
      }
    },
    follow(event){
      if(this.user.followers.indexOf(this.currUser.uid) == -1){
        this.disabled = true
        //console.log(event)
        this.user.followers.push(this.currUser.uid)
        document.getElementById('follow').innerText = 'following'

        db.collection('moreUserInfo').doc(this.user.email).update({
          followers:firebase.firestore.FieldValue.arrayUnion(this.currUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.currUser.email).update({
            following:firebase.firestore.FieldValue.arrayUnion(this.user.uid)
          })
          this.disabled = false
          
        })
      }
      else{
        this.disabled = true
        this.user.followers.splice(this.user.followers.indexOf(this.currUser.uid), 1)
        
        document.getElementById('follow').innerText = 'follow'

        db.collection('moreUserInfo').doc(this.user.email).update({
          followers:firebase.firestore.FieldValue.arrayRemove(this.currUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.currUser.email).update({
            following:firebase.firestore.FieldValue.arrayRemove(this.user.uid)
          })
          
          this.disabled = false
        })
      }
    },
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.members ? this.extractUser(to.params.email) : ''
    }
  },
  components:{
    ProfileSettings,
  },
  async mounted(){
    this.members2 = this.members // just to avoid directly mutating the regVoters prop
    //console.log(this.email)
    
    this.extractUser()
    
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

