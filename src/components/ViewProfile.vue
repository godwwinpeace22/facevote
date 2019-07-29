<template>
  <v-layout d-flex>
    <v-flex xs12 d-flex>
      <v-card flat tile :class="{'round_top': $vuetify.breakpoint.smAndUp}" >
        <v-sheet :class="{'round_top': $vuetify.breakpoint.smAndUp}" width="100%" height="120" :color="$helpers.colorMinder(user.name.charAt(0)) + ' lighten-3'">

        </v-sheet>
        <v-sheet width="61%" height="124" style="position: absolute;top: 50px;left: 20%;" color="transparent">
          <v-avatar
            size="124"
            color="white"
            class="elevation-1 d-block mx-auto"
            style="padding-top: 2px;"
          >
            
            <v-avatar class="d-block mx-auto"
              size="120"
              :color="$helpers.colorMinder(user.name.charAt(0))"
            >
              <img :src="user.photoURL" :alt="user.name" v-if="user.photoURL">
              <span v-else style="padding-top: 36px;" class="d-block white--text display-2">{{user.name.charAt(0)}}</span>
            </v-avatar>
          </v-avatar>
        </v-sheet>
      
        <v-card-text class="text-xs-center mt-5">
          <v-tooltip right>
            <v-icon color="success" slot="activator" v-if="is_verified">mdi-check-decagram</v-icon>
            <span>User is verified</span>
          </v-tooltip>
          <span class="title text-capitalize">{{user.name | capitalize}}</span>
          <span class="online_badge" :class="user.online ? 'success' : 'orange'"></span>
          <div class="" v-if="user.is_student">Student at <strong>{{user.sch}}</strong>,</div>
          <div class="" v-if="user.is_student">Department of <strong>{{user.dept}}</strong></div>
          <!-- <div class="mt-3">{{user.email}}</div> -->
          <div class="mt-3">
            <div class="d-inline-block">
              <v-btn depressed color="info" 
                class="round text-capitalize"
                :loading="loading"
                @click="getUserProfile"
              >
                View Profile
                <template v-slot:loader>
                  <span>Loading...</span>
                </template>
              </v-btn>
            </div>

            <v-btn depressed
              color="success" class="d-inline-block round text-capitalize" 
              v-if='$store.getters.getUser.uid == user.uid'
              dark @click="dialog = true;" 
            >
              Edit Profile
            </v-btn>
          </div>
        </v-card-text>

        <!-- <v-list dense>
          <template v-if="user.uid != $store.getters.getUser.uid">
            <v-tooltip top dark class="" color="black" max-width="300"> 
              <v-list-tile slot="activator" @click="flagUser" >
                
                <v-icon color="red" class="pr-3" small>flag</v-icon>
                <v-list-tile-title>Report this user</v-list-tile-title>
              </v-list-tile>
              <span >Flag this person as suspicous</span>
            </v-tooltip>
          </template>
        </v-list> -->

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
    dialog: false,
    disabled: false,
    loading: false,
  }),
  props:['user'],
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      let arr = []
      value.split(' ').map((item,index)=>
        arr.push(item.charAt(0).toUpperCase() + item.slice(1))
      )
      return arr.toString().split(',').join(' ')
    },
  },
  computed:{
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified'
    ]),
  },
  methods:{
    getUserProfile(){

      this.loading = true
      
      if(this.user.uid == this.getUser.uid){
        
        this.loading = false
        this.$router.push(`/users/${this.getUserInfo.username}`)
        this.$eventBus.$emit('CloseProfile')
      }
      else {
        
        db.collection('moreUserInfo').doc(this.user.uid).get()
        .then(doc => {
  
          this.loading = false
          if(doc.exists){
            this.$router.push(`/users/${doc.data().username}`)
            this.$eventBus.$emit('CloseProfile')
          }else{
  
          }
        })
      }
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
import {firebase, db, database} from '@/plugins/firebase'
</script>

<style lang="scss" scoped>
  
</style>
