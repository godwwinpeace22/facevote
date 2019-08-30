<template>
  <div>
    <v-toolbar color="secondary" dark>
      <v-toolbar-title>Create New Event</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="" icon @click.native="$emit('close-event-drawer', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-stepper v-model="stepper" vertical>
      <v-stepper-step :complete="stepper > 1" step="1">
        Event Title
        <small>Choose a nice title</small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card color="grey lighten-5" flat class="mb-5" height="200">
          <v-card-text>
            <p>What would be the title of your new event?<p>
            <p>Events can be webiners, online interactive sessions e.t.c</p>
            <v-text-field outline color="secondary"
              name="title" counter
              label="Title" :rules="[rules.counter]"
              v-model="new_event.title"
            ></v-text-field>
          </v-card-text>
        </v-card>
        <v-btn color="secondary" @click="stepper = 2" depressed 
          class="text-capitalize"
          :disabled="!new_event.title.trim() || new_event.title.length > 100">
          Next step
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="stepper > 2" step="2">
        Event Description
        <small>Summarize</small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card color="grey lighten-5" class="mb-5" flat height="">
          <v-card-text>
            <p>Write a brief description about this event.</p>
            <v-textarea
              name="summary" v-model="new_event.desc"
              label="Describe your event"
              color="secondary" outline
            ></v-textarea>
          </v-card-text>
          
        </v-card>
        <v-btn flat @click.native="stepper = 1">Previous</v-btn>
        <v-btn color="secondary" @click="stepper = 3" 
          depressed class="text-capitalize"
          :disabled="!new_event.desc.trim()">
          Next step
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="stepper > 3" step="3">Cover image</v-stepper-step>
      <v-stepper-content step="3">
        <v-card color="grey lighten-5" flat class="mb-5" height="">
          <v-card-text>
            <p>Upload a high quality cover image or banner of your event</p>
            <p>Recommended size of image is 800x300</p>
            <v-img :src="blob_url" v-if="selected_file" width="200" height="200"/>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" v-if="!selected_file" 
              @click.native="$helpers.trigFileSelector" class="mb-2">
              Select event banner</v-btn>


            <v-btn color="" v-if="selected_file" @click.native="selected_file = null; 
              blob_url = []; uploaded = false" class="mb-2" depressed :disabled="uploading">
              <v-icon class="pr-2">mdi-close</v-icon>
              Remove</v-btn>
            
            <v-btn color="success" v-if="selected_file" @click.native="uploadBanner"
              depressed class="mb-2" :loading="uploading" :disabled="!!uploaded">
              <v-icon class="pr-2">mdi-cloud-upload</v-icon>
              Upload</v-btn>
            
          </v-card-actions>
        </v-card>
        <v-btn flat @click.native="stepper = 2">Previous</v-btn>
        <v-btn color="secondary" @click="stepper = 4" 
          depressed class="text-capitalize"
          :disabled="uploaded == false">
          Next step
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-stepper-content>


      <v-stepper-step :complete="stepper > 4" step="4">Schedule</v-stepper-step>

      <v-stepper-content step="4">
        <v-card color="grey lighten-5" flat class="mb-5" height="">
            <v-subheader>Select date and time for the event</v-subheader>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-menu ref="menu"
                  v-model="date_dialog"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="new_event.date"
                  lazy transition="scale-transition"
                  offset-y full-width
                  min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="new_event.date"
                      label="Start date"
                      prepend-inner-icon="mdi-calendar"
                      readonly color="secondary" outline
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="new_event.date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="date_dialog = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(new_event.date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 class="pl-3">
                <v-dialog ref="menu2"
                  v-model="time_dialog"
                  persistent
                  :return-value.sync="new_event.time"
                  lazy transition="scale-transition"
                  offset-y full-width
                  width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="new_event.time"
                      label="Start time"
                      prepend-inner-icon="mdi-calendar"
                      readonly color="secondary" outline
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-model="new_event.time" scrollable color="secondary">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="time_dialog = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu2.save(new_event.time)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            

            <v-subheader class="pl-0">Venue for event</v-subheader>
            <v-radio-group v-model="new_event.online" row>
              <v-radio label="Online" :value="true"></v-radio>
              <v-radio label="Offline" :value="false"></v-radio>
            </v-radio-group>

            <v-text-field outline color="secondary"
              name="venue" v-if="!new_event.online"
              label="Venue"
              v-model="new_event.venue"
            ></v-text-field>

          </v-card-text>
        </v-card>
        <template v-if="!event_created">
          <v-btn flat @click="stepper = 3" :disabled="loading">Previous</v-btn>
          <v-btn color="secondary" :loading="loading" 
            @click="createEvent" depressed 
            class="text-capitalize"
            :disabled="!new_event.date || !new_event.time || (!new_event.online && !new_event.venue.trim())">
            Create event
          </v-btn>
        </template>
        <v-btn color="info" depressed @click.native="$router.push(`/events/${eventId}`); $emit('close-event-drawer', false)" 
          v-if="event_created" class="text-capitalize">
          Visit Event page
        </v-btn>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
export default {
  data: ()=> ({
    stepper: 1,
    date_dialog: false,
    time_dialog: false,
    new_event: {
      title: '',
      date: '',
      time: '',
      desc: '',
      online: false,
      venue: '',
    },
    rules: {
      counter: value => value.length <= 100 || 'Max 100 characters',
    },
    loading: false,
    eventId: null,
    event_created: false,
    selected_file: null,
    blob_url: [],
    uploading: false,
    uploaded: false,
    cloudinary:{
      cloud_name:'unplugged',
      upload_preset:'pe4iolek'
    }
  }),
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo',
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ])
  },
  methods: {
    uploadBanner(){
      return new Promise((resolve, reject) =>{
        this.uploading = true

        this.$helpers.uploadImage([this.selected_file], this.cloudinary)
        .then(uploaded => {
          this.uploading = false
          this.uploaded = uploaded[0]
          resolve(uploaded[0])

          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Image uploaded',
            color: 'success'
          })
          document.getElementById('file_img').value = null
        }).catch(err => {

          this.uploading = false
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Upload failed',
            color: 'error'
          })
          reject(err)
        })
      })
    },
    createEvent(){
      this.loading = true
      this.$emit('persist-drawer')

      function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      }
      
      let eventId = `${randomWords({exactly: 2, maxLength: 5, join: '-'})}-${getRandomNumber(10000, 99999)}`
      this.eventId = eventId
      // console.log(eventId)

      let eventRef = db.collection('events').doc(this.eventId)
      this.new_event.title = this.$sanitize(this.new_event.title)
      this.new_event.desc = this.$sanitize(this.new_event.desc)
      this.new_event.venue = this.$sanitize(this.new_event.venue)
      
      eventRef.set({
        eventId: this.eventId,
        onr: {
          uid: this.getUser.uid,
        },
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        ...this.new_event,
        imgSrc: this.uploaded,
        elecRef: this.curRoom.electionId,
        interested: 0,
        started: false,
        live: false,
        ended: false,
        
      }).then(() => {
        this.loading = false
        this.event_created = true

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Event Created',
          color: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.loading = false
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Something went wrong. Try again',
          color: 'error'
        })
      })
    }
  },
  mounted(){
    this.$eventBus.$on('Selected_Files', data => {
      this.selected_file = data.selected_files[0],
      this.blob_url = data.imgSrc[0]
    })
  }
}
import {mapGetters, mapState} from 'vuex'
  import {firebase, db, database} from '@/plugins/firebase'
  import randomWords from 'random-words'
</script>