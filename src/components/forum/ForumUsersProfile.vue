<template>
  <div id="forum_user_profile" style="overflow:auto;height:100%;">

    <v-snackbar :color="snackbar.color" top right
      v-model="snackbar.show" absolute>
      {{snackbar.message}}
      <v-btn dark flat @click.native="snackbar = {}">Close</v-btn>
    </v-snackbar>

    <v-toolbar dense flat>
      <v-btn icon to="/forum">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout>
      <v-flex xs12 px-2 v-if="show_profile">
        <v-card flat>
          <v-img :alt="`${user.name}'s profile_img`" 
            :src="user.photoURL ||  require('@/assets/avatar.png')" 
            :height="$vuetify.breakpoint.xsOnly ? 300 : $vuetify.breakpoint.smOnly ? 400 : 200" aspect-ratio="2.75">
          </v-img>

          <v-card-title>
            <span class="title mb-0 text-capitalize success--text">{{user.name}}</span>
            <span id="online_badge" v-if="user.online"></span>
          </v-card-title>

          <v-btn class="mt-0" v-if="user.uid == currUser.uid" depressed>
            {{user.followers}} Followers
          </v-btn>

          <v-card-actions>
            <v-btn flat outline small color="success" 
              class="text-capitalize" dark @click="$eventBus.$emit('show_profile_settings')" 
              v-if='currUser.uid == user.uid'>
              Edit Profile
            </v-btn>

            <!-- <v-btn flat outline small color="success" class="text-capitalize" v-else @click="openPrivateChatWindow">Message</v-btn> -->
            
            <v-btn flat outline small color="success" class="text-capitalize" 
              :to="`/users/${user.uid}`" >
              View Profile
            </v-btn>
            
            <v-btn flat outline small color="success" class="text-capitalize" @click="follow"
              :disabled='disabled'
              v-if="user.uid != currUser.uid">
              {{user.followers}}&nbsp; | &nbsp;<span id="follow">
                Followers</span>
            </v-btn>
            
          </v-card-actions>
          <v-container ma-0 pa-2>
            <v-subheader class="ma-0 pa-0" style="height:30px;"><strong>Department:&nbsp;</strong> {{user.dept}}</v-subheader>
            <v-subheader class="ma-0 pa-0" style="height:30px;"><strong>Faculty:&nbsp;</strong>{{user.fac}}</v-subheader>
            <v-subheader class="ma-0 pa-0" style="height:30px;" v-if="getRole()"><i class="mr-1">for </i><strong class="secondary--text"> {{getRole().role}}</strong></v-subheader>
            
          </v-container>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  data:()=>({
    show_profile: false, // hides this view temporarily until required data is available
    drawerRight: true,
    right: null,
    left: null,
    right_sidebar: true,
    snackbar:{},
    user:'', // NOTE: this is not neccesarily the curr logged in user, but the user who's profile is bein viewed
    currUser:{}, // this is the logged in user, used here primarily for convenience
    // suspend_member_dialog:{},
    loading: false,
    // making_moderator: false,
    disabled: false,
    members2:'', //just to avoid directly mutating the members prop
  }),
  props:['userId','members', 'thisGroup'],
  computed:{
    ...mapGetters([
      'getUser',
      'getUserInfo',
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom'
    ]),
    isAccOwner(){
      return this.getUser.uid == this.userId ? true : false
    },
    
  },
  methods:{
    extractUser(){ // lets the get this user from the list of regVoters
      let found = this.members2.find(item=> item.uid == this.userId)
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
    banned(userId){
      let banned = this.thisGroup.bif ? 
      this.thisGroup.bif.find(uid => uid == userId) : false;
      //console.log(this.thisGroup.bif, userId)
      return banned ? true : false;
    },
    getRole(){
      if(this.user.contestsRef){
        let found = this.user.contestsRef.find(contest=>contest.electionRef == this.thisGroup.electionId)
        //console.log(res)
        let role = found ? this.thisGroup.roles.find(role => role.value == found.role) : false
        return found ? {role: role.title, contesting:'Yes'} : false
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
      this.disabled = true;
      this.$helpers.followUser(this.getUserInfo, this.user).then(done =>{
      
        if(done.following){
          this.user.followers++
        }
        if(!done.following){
          this.user.followers--
        }
        this.disabled = false
      })
      .catch(err => {
        this.disabled = false
        // console.log(err)
      })
    },
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.members ? this.extractUser() : ''
    }
  },
  components:{
    
  },
  async mounted(){
    this.members2 = this.members // just to avoid directly mutating the regVoters prop
    
    
    this.extractUser()
    
  },
  created(){
  }
}
import {mapGetters, mapState} from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
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

