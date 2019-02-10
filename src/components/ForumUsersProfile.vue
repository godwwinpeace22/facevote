<template>
  <div>

    <v-snackbar :color="snackbar.color" top right
      v-model="snackbar.show" absolute>
      {{snackbar.message}}
      <v-btn dark flat @click.native="snackbar = {}">Close</v-btn>
    </v-snackbar>

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
            :height="$vuetify.breakpoint.xsOnly ? 300 : $vuetify.breakpoint.smOnly ? 400 : 200" aspect-ratio="2.75">
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
            <v-subheader class="ma-0 pa-0" style="height:30px;" v-if="getRole()"><i class="mr-1">for </i><strong class="secondary--text"> {{getRole().role}}</strong></v-subheader>
            
          </v-container>
          <v-card-actions v-if="isModerator(getUser.uid) && !isModerator(user.uid)">
            <v-btn v-if="!banned(user.uid)" color="orange" outline small @click="suspend_member_dialog = {show:true,user:user}">
              <v-icon small class="mr-2">block</v-icon>
              Suspend
            </v-btn>
            <v-btn v-if="banned(user.uid)" color="orange" outline small @click="suspend_member_dialog = {show:true,user:user,banned:true}">
              <v-icon small class="mr-2">block</v-icon>
              Restore
            </v-btn>
            <v-btn color="success" small outline @click="makeModerator(user)" :loading="making_moderator">Make admin</v-btn>
          </v-card-actions>
          <v-dialog v-model="dialog" v-if="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <profile-settings :dialog='dialog'></profile-settings>
          </v-dialog>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- BAN USER FROM CURRENT ROOM DIALOG-->
    <v-dialog v-model="suspend_member_dialog.show"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="500px" persistent
      transition="dialog-transition" >
      <v-card dark>
        <div style="position:absolute;top:10px;right:10px;">
          <v-icon @click="suspend_member_dialog = {}">close</v-icon>
        </div>
        <v-card-title primary-title>
          <span v-if="suspend_member_dialog.banned == true">Restore Member</span>
          <span v-else>Suspend Member</span>
        </v-card-title>
        <v-card-text>
          <span v-if="suspend_member_dialog.banned == true">Restore this voter to allow them send messages in this chat room</span>
          <span v-else>Ban this voter to prevent them from making sending messages in this chat room</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="suspend_member_dialog.banned" color="success" small @click="unsuspend" :loading="loading">Restore</v-btn>
          <v-btn v-else color="orange" small @click="suspend" :loading="loading">suspend</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    snackbar:{},
    user:'', // NOTE: this is not neccesarily the curr logged in user, but the user who's profile is bein viewed
    currUser:{}, // this is the logged in user, used here primarily for convenience
    dialog:false,
    suspend_member_dialog:{},
    loading:false,
    making_moderator:false,
    disabled:false,
    members2:'', //just to avoid directly mutating the members prop
  }),
  props:['email','members', 'thisGroup'],
  computed:{
    ...mapGetters([
      'getUser',
      'getUserInfo',
    ]),
    isAccOwner(){
      return this.$store.getters.getUser.email == this.email ? true : false
    },
    
  },
  methods:{
    extractUser(email){ // lets the get this user from the list of regVoters
      let found = this.members2.find(item=> item.email == this.email)
      if(found){
        this.user = found;
        this.show_profile = true
      }
      this.currUser = this.$store.getters.getUser
    },
    isModerator(userId){
      let found = this.thisGroup.moderators ?
      this.thisGroup.moderators.find(id => id == userId) : false
      //console.log(found,this.thisGroup)
      return found ? true : false
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
    banned(userId){
      let banned = this.thisGroup.bif ? 
      this.thisGroup.bif.find(uid => uid == userId) : false;
      //console.log(this.thisGroup.bif, userId)
      return banned ? true : false;
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
    suspend(){
      // suspend a user, prevent them from sending messages in chatroom

      // first check if current user is admin, only admins can ban people.
      // Admin, please don't ban yourself :)
      if(this.thisGroup.moderators && this.thisGroup.moderators.find(ids => ids == this.getUser.uid)){
        this.loading = true

        db.collection('elections').doc(this.thisGroup.electionId)
        .update({// bif ==> banned in forum
          bif:firebase.firestore.FieldValue.arrayUnion(this.suspend_member_dialog.user.uid)
        }).then(done=>{
          this.thisGroup.bif ? this.thisGroup.bif.push(this.suspend_member_dialog.user.uid) :
          this.thisGroup.bif = [this.suspend_member_dialog.user.uid]

          this.suspend_member_dialog = {}; this.loading = false;
          this.snackbar = {
            show:true,message:'User suspended',color:'purple'
          }
          //console.log(this.thisGroup.bif)
        }).catch(err=>{
          this.snackbar = {
            show:true,message:'Something went wrong', color:'error'
          }
          //console.log(err)
        })
      }

    },
    unsuspend(){
      if(this.thisGroup.moderators && this.thisGroup.moderators.find(ids => ids == this.getUser.uid)){
        this.loading = true

        db.collection('elections').doc(this.thisGroup.electionId)
        .update({// bif ==> banned in forum
          bif:firebase.firestore.FieldValue.arrayRemove(this.suspend_member_dialog.user.uid)
        }).then(done=>{
          this.thisGroup.bif.splice(this.thisGroup.bif.indexOf(this.suspend_member_dialog.user.uid),1)
          this.suspend_member_dialog = {};
          this.loading = false;
          //console.log(this.thisGroup.bif)
          this.snackbar = {
            show:true,message:'User restored!', color:'purple'
          }
        }).catch(err=>{
          this.snackbar = {
            show:true,message:'Something went wrong', color:'error'
          }
          //console.log(err)
        })
      }
    },
    makeModerator(user){
      // make a user and admin
      // TODO: NOTIFY USER HE HAS BEEN MADE AN ADMIN
      this.making_moderator = true
      db.collection('elections').doc(this.thisGroup.electionId)
      .update({
        moderators:firebase.firestore.FieldValue.arrayUnion(user.uid)
      }).then(done=>{
        this.thisGroup.moderators.push(user.uid)
        this.making_moderator = false
        this.snackbar = {
          show:true,message:user.name + ' is now a moderator',
          color:'purple'
        }
      }).catch(err=>{
        this.snackbar = {
          show:true,message:'Something went wrong',color:'error'
        }
      })
    },
    follow(event){
      if(this.user.followers.indexOf(this.currUser.uid) == -1){
        this.disabled = true
        //console.log(event)
        this.user.followers.push(this.currUser.uid)
        document.getElementById('follow').innerText = 'following'

        db.collection('moreUserInfo').doc(this.user.uid).update({
          followers:firebase.firestore.FieldValue.arrayUnion(this.currUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.currUser.uid).update({
            following:firebase.firestore.FieldValue.arrayUnion(this.user.uid)
          })
          this.disabled = false
          
        })
      }
      else{
        this.disabled = true
        this.user.followers.splice(this.user.followers.indexOf(this.currUser.uid), 1)
        
        document.getElementById('follow').innerText = 'follow'

        db.collection('moreUserInfo').doc(this.user.uid).update({
          followers:firebase.firestore.FieldValue.arrayRemove(this.currUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.currUser.uid).update({
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
//import api from "@/services/api";
import ProfileSettings from '@/components/ProfileSettings'
import {mapGetters} from 'vuex'
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

