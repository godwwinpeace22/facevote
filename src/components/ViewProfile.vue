<template>
  <v-layout d-flex>
    <v-flex xs12 d-flex>
      <v-card flat tile>
        <v-img class="ma-2" :src="user.photoURL || 
        `https://ui-avatars.com/api/?name=${user.name}&size=300`" 
        :height="$vuetify.breakpoint.smAndDown ? 300 : 200" aspect-ratio="2.75"
          lazy-src="'https://picsum.photos/10/6?image=15'"></v-img>

        <v-card-title primary-title style="position:absolute;top:150px;" class="white--text">
          <div>
            <h3 class="title mb-0 text-capitalize d-inline">{{user.name}}</h3>
            <v-tooltip top v-if="user.isVerified">
              <v-icon color="success" slot="activator">verified_user</v-icon>
              <span>Verified account</span>
            </v-tooltip>
          </div>
        </v-card-title>
        
        <v-card-actions>
          
          <template v-if='$store.getters.getUser.uid != user.uid && $store.state.isSuperUser'>
            <!-- <v-btn flat outline small color="success" class="text-capitalize"  @click="openPrivateChatWindow">Message</v-btn> -->
            <v-btn flat outline small color="success" class="text-capitalize"
              :to="`/users/${user.email}`">View Profile</v-btn>
          </template>
          <v-btn flat outline small color="success" class="text-capitalize" v-else dark @click="dialog = true" >Edit Profile</v-btn>
           
        </v-card-actions>
        <v-list dense>
          <v-list-tile @click="''">
            <v-icon color="teal" class="pr-3">email</v-icon>
            <v-list-tile-content>{{user.email}}</v-list-tile-content>
          </v-list-tile>
          <!-- <v-list-tile @click="''">
            <v-icon color="teal" class="pr-3">phone</v-icon>
            <v-list-tile-content>{{user.phone || '(650) 555-1234'}}</v-list-tile-content>
          </v-list-tile> -->

          <template v-if="user.sch || user.school">
            <v-list-tile @click="''">
              <v-icon color="teal" class="pr-3">school</v-icon>
              <v-list-tile-content>School: {{user.sch || user.school}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="''">
              <v-icon color="teal" class="pr-3">domain</v-icon>
              <v-list-tile-content>Faculty: {{user.fac || user.faculty}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="''" exact>
              <v-icon color="teal" class="pr-3">layers</v-icon>
              <v-list-tile-content>Dept.: {{user.dept || user.department}}</v-list-tile-content>
            </v-list-tile>
          </template>
          <template v-if="user.uid != $store.getters.getUser.uid">
            <v-tooltip top dark class="" color="black" max-width="300"> 
              <v-list-tile slot="activator" @click="flagUser" >
                
                <v-icon color="red" class="pr-3" small>flag</v-icon>
                <v-list-tile-title>Report this user</v-list-tile-title>
              </v-list-tile>
              <span >Flag this person as suspicous</span>
            </v-tooltip>
          </template>
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
    ...mapState([
      'isSuperUser'
    ]),
  },
  methods:{
    openPrivateChatWindow(){
      this.$eventBus.$emit('Open_Private_Chat_Window', {
        username:this.user,
        ...this.user,
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

import {mapGetters, mapState} from 'vuex'
import ProfileSettings from '@/components/ProfileSettings'
</script>

