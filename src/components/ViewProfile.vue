<template>
  <v-layout d-flex>
      <v-flex xs12 d-flex>
        <v-card :flat="$vuetify.breakpoint.smAndDown" tile>
          <v-img class="ma-2" :src="user.photoURL || 
          `https://ui-avatars.com/api/?name=${user.name}&size=300`" 
          :height="$vuetify.breakpoint.smAndDown ? 300 : 200" aspect-ratio="2.75"
            lazy-src="'https://picsum.photos/10/6?image=15'"></v-img>

          <v-card-title primary-title>
            <div>
              <h3 class="title mb-0 text-capitalize d-inline">{{user.name}}</h3>
              <v-tooltip top v-if="user.isVerified">
                <v-icon color="success" slot="activator">verified_user</v-icon>
                <span>Verified account</span>
              </v-tooltip>
            </div>
          </v-card-title>
          
          <v-card-actions>
            <v-btn flat outline small color="success" class="text-capitalize"  :to='`/users/${user.email}`'>View Profile</v-btn>
            <template v-if='$store.getters.getUser.uid != user.uid'>
              <v-btn flat outline small color="success" class="text-capitalize"  @click="openPrivateChatWindow">Message</v-btn>
              <!--v-btn flat outline small color="success" class="text-capitalize" >Explore</v-btn-->
            </template>
            <v-btn flat outline small color="success" class="text-capitalize" v-else dark @click="dialog = true" >Edit Profile</v-btn>
            
            <!-- FLAGGING USERS -->
            <v-tooltip top dark class="ml-3" color="black" max-width="300">
              <v-btn icon slot="activator" :color="flaggedByYou ? 'error' : 'secondary'" 
                small >
                <v-icon small @click="flagUser" :disabled="disabled || flaggedByYou" >flag</v-icon>
              </v-btn>
              
              <span class="error--text" v-if="flaggedByYou">You flagged this voter</span>
              <span v-else>Don't recognize this person? Flag them to raise an alarm! Do this with caution</span>
            </v-tooltip>
          </v-card-actions>
          <v-list dense>
            <!--v-tooltip top>
              <v-list-tile slot="activator" to="/dashboard/verify" v-if="!user.isVerified">
                <v-list-tile-action style="">
                  <v-icon color="error">error</v-icon>
                </v-list-tile-action>
                <v-list-tile-content style="color:red;">
                  Verify your account
                </v-list-tile-content>
              </v-list-tile>
              <span>Verify your account to participate in elections</span>
            </v-tooltip-->
            <v-list-tile @click="''">
              <v-icon color="teal" class="pr-3">email</v-icon>
              <v-list-tile-content>{{user.email}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="''">
              <v-icon color="teal" class="pr-3">phone</v-icon>
              <v-list-tile-content>{{user.phone || '(650) 555-1234'}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="''">
              <v-icon color="teal" class="pr-3">domain</v-icon>
              <v-list-tile-content>Faculty: {{user.faculty}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="''" exact>
              <v-icon color="teal" class="pr-3">layers</v-icon>
              <v-list-tile-content>Dept.: {{user.department}}</v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-dialog v-model="dialog" lazy fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <profile-settings :dialog='dialog'></profile-settings>
          </v-dialog>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>
</template>
<script>
export default {
  data: ()=>({
    dialog:false,
    disabled:false,
  }),
  props:['user'],
  computed:{
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    flaggedByYou(){
      let flagged = this.user.flaggedBy && 
      this.user.flaggedBy.find(uid => uid == this.getUser.uid) ? 
      true : false
      return flagged
    }
  },
  methods:{
    openPrivateChatWindow(){
      this.$eventBus.$emit('Open_Private_Chat_Window', {
        username:this.user,
        name:this.user.name,
        imgSrc:this.user.imgSrc,
        last_msg_status:null
      })
    },
    flagUser(){
      // mark the user as flagged
      //console.log('flagging...')
      this.disabled = true
      this.user.flaggedBy ?
      this.user.flaggedBy.push(this.getUser.uid) :
      this.user.flaggedBy = [this.getUser.uid]
      
      db.collection('moreUserInfo')
      .doc(this.user.uid).update({
        flaggedBy:firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
      }).then(()=>{
        //this.disabled = false
      }).catch(err=>{
        
      })
    }
  },
  components:{
    ProfileSettings,
  },
  mounted(){
    this.$eventBus.$on('hide_profile_settings', _=>{
      this.dialog = false
    })
  }
}

import {mapGetters} from 'vuex'
import ProfileSettings from '@/components/ProfileSettings'
</script>

