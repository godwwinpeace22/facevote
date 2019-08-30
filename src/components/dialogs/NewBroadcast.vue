<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="bdialog" lazy persistent scrollable
        :fullscreen="$vuetify.breakpoint.xsOnly" :transition="switchTransition2" 
        :overlay="false" max-width="500">
        <v-card>
          <v-toolbar dark color="teal" dense flat>
            <v-btn icon @click.native="$eventBus.$emit('bdialog')" dark class="hidden-sm-and-up">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-toolbar-title>New Broadcast Message</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat class="hidden-xs-only" @click.native="$eventBus.$emit('bdialog')">close</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-textarea placeholder="Type your message" color="secondary" 
              outline label="Broadcast message" v-model="message" hide-details>
            </v-textarea>
            <small>Audience: {{curRoom.title}}</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" depressed :loading="loading" :disabled="disabled" @click="newBroadcast">
              Send <v-icon class="ml-2">mdi-send</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
export default {
  data(){
    return {
      bdialog: true,
      message: '',
      loading: false,
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ]),
    disabled(){
      return !this.message.trim()
    },
    switchTransition2(){
      return this.$vuetify.breakpoint.xsOnly ? 
      'slide-x-reverse-transition' : 
      'dialog-transition'
    },
    
  },
  methods: {
    newBroadcast(){
      this.loading = true
      // create new broadcast message
      let broadcastRef = db.collection('broadcasts').doc()
      let {name, photoURL = false, email, sch=false, fac=false, dept=false, uid, is_student} = this.getUserInfo

      let data = {
        onr: {
          name,
          photoURL,
          email,
          sch,
          fac,
          dept,
          uid,
          is_student
        },

        body: this.$sanitize(this.message.trim()),
        type: 'broadcast', // can be 'default' or 'broadcast'
        tstamp: firebase.firestore.FieldValue.serverTimestamp(),
        by: this.getUserInfo.uid,
        docId: broadcastRef.id,
        elecRef: this.curRoom.electionId
        // status:'unread'
      }
      broadcastRef.set(data).then(()=>{
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Broadcast Sent',
          // color: 'success'
        })
        this.loading = false
        this.$eventBus.$emit('bdialog')
      })
    }
  }
  
}

import { mapGetters, mapState } from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
</script>
