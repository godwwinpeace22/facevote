<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="bdialog" lazy persistent scrollable
        :fullscreen="$vuetify.breakpoint.xsOnly" transition="dialog-bottom-transition" 
        :overlay="false" max-width="500">
        <v-card>
          <v-toolbar dark color="teal" dense flat>
            <v-btn icon @click.native="$eventBus.$emit('bdialog')" dark class="hidden-sm-and-up">
              <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-toolbar-title>New Broadcast Message</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat class="hidden-xs-only" @click.native="$eventBus.$emit('bdialog')">close</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-textarea placeholder="Type your message" color="secondary" 
              outline label="Broadcast message" v-model="message">
            </v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" depressed :loading="loading" :disabled="disabled" @click="newBroadcast">
              Send <v-icon class="ml-2">send</v-icon>
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
    }
  },
  methods: {
    newBroadcast(){
      this.loading = true
      // create new broadcast message
      let broadcastRef = db.collection('broadcasts').doc()

      let data = {
        onr: ['name', 'photoURL','email','sch','fac','dept','uid']
          .reduce((a, e) => (a[e] = this.getUserInfo[e], a), {}),

        body: this.message.trim(),
        type: 'broadcast', // can be 'default' or 'broadcast'
        tstamp: Date.now(),
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
</script>
