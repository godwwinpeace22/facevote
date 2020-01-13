<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="bdialog" persistent scrollable
        :fullscreen="$vuetify.breakpoint.xsOnly" 
        max-width="500">
        <v-card>
          <v-toolbar dark color="teal" dense flat>
            <v-btn icon @click.native="$eventBus.$emit('bdialog')" dark class="hidden-sm-and-up">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-toolbar-title>New Broadcast Message</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn text class="hidden-xs-only" @click.native="$eventBus.$emit('bdialog')">close</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-textarea placeholder="Type your message" class="mt-5" 
              outlined label="Broadcast message" v-model.trim="message">
            </v-textarea>
            <!-- <v-select
              name="audience" class="mb-3"
              label="Target Audience"
              :items="getMyEnrolled"
              v-model="audience"
              outlined item-text="title"
              item-value="electionId"
              placeholder="Select your target audience"
            ></v-select> -->

            <small>Audience: {{curRoom.title}}</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" depressed :loading="loading" :disabled="disabled" @click="createBroadcast">
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
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ]),
    audience(){
      return this.curRoom.electionId
    },
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
    createBroadcast(){
      this.loading = true

      // create new broadcast message
      let broadcastId = this.$uuidv4()
      let broadcastRef = this.$gun.get('broadcasts')
        .get(broadcastId)

      let userRef = this.$gun.get(this.getUser.username)
      let electionRef = this.$gun.get('elections')
        .get(this.audience)

      let data = {
        
        body: this.$sanitize(this.message),
        date_created: Date.now(),
        from: this.getUser.username,
        docId: broadcastId,
        elecRef: this.audience,
        status:'unread'
      }

      // save in broadcaster's outbox
      let broadcast = userRef.get('broadcasts')
        .get('outbox')
        .get(broadcastId)
        .put(data)
      broadcast.get('author')
        .put(userRef)

      
      electionRef.get('broadcasts')
        .set(broadcast)
      
      // electionRef.get('voters')
      // .map().once(voter => {

      //   console.log({voter})
      //   if(voter.username != this.getUser.username){

      //     this.$gun.get(voter.username)
      //       .get('broadcasts')
      //       .get('inbox')
      //       .get(broadcastId)
      //       .put(broadcast)
      //   }

      // })


      this.$eventBus.$emit('Snackbar', {
        show: true,
        message: 'Broadcast Sent',
        // color: 'success'
      })
      this.loading = false
      this.$eventBus.$emit('bdialog')
      
    }
  }
  
}

import { mapGetters, mapState } from 'vuex'
// import {firebase, db, database} from '@/plugins/firebase'
</script>
