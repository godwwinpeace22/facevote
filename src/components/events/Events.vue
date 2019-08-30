<template>
  <div>
    <vue-headful :title="title"/>
    
    <navigation>
      <v-tabs slot="extension"
        v-model="tabsValue"
        slider-color="#fff"
        color="transparent"
      >
        <v-tab href="#tab-1"> About</v-tab>
        <v-tab href="#tab-2" :disabled="!eventData.started"> Chat</v-tab>
        <v-tab href="#tab-3" v-if="eventData.onr && eventData.onr.uid == getUser.uid">
          Settings
        </v-tab>
        <v-tab href="#tab-4" v-if="$vuetify.breakpoint.smAndDown">
          Organizer
        </v-tab>
      </v-tabs>
    </navigation>

    <loading-bar v-if="!showUi"></loading-bar>

    <v-container grid-list-md v-else :class="{'px-2': $vuetify.breakpoint.smAndDown}">
      <v-layout row wrap>
        <v-flex sm12 md9>
          <v-card class="round_top">

              <v-tabs-items v-model="tabsValue">

                <v-tab-item value="tab-1">
                  <v-card>
                    <v-img :src="eventData.imgSrc || require('@/assets/webinar.jpg')" height="300px" width="100%" class="d-block mx-auto">
                    </v-img>
                    <v-card-title primary-title>
                      <div>
                        <div class="headline">{{eventData.title}}</div>
                        <span class="grey--text">
                          <v-icon class="mr-1" style="margin-bottom: -3px; font-size: 20px;" color="" >mdi-clock</v-icon>
                          {{(new Date(eventData.date + ' ' + eventData.time)).toLocaleString('en-US',options)}}
                          <span class="pl-4 red--text" v-if="eventData.live || eventData.ended">
                            {{ eventData.live ? 'Live Now' : 'Ended'}}</span>
                        </span>
                        <div class="mt-2">
                          <v-icon class="mr-1" style="margin-bottom: -3px;font-size: 20px" color="">mdi-map-marker</v-icon>
                          <span class="grey--text">{{eventData.online ?  'Online' : eventData.venue}}</span>
                        </div>
                      </div>
                    </v-card-title>

                    <v-card-actions>
                      <v-btn flat class="text-capitalize">{{eventData.interested}} Interested</v-btn>
                      <v-btn depressed color="purple" 
                         class="white--text text-capitalize" :class="{success: isInterested}"
                        :loading="showing_interest" :disabled="eventData.ended"
                        @click="showInterest"> 
                        {{ isInterested ? "Interested" : "Show Interest"}}
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn flat @click="show = !show" class="text-capitalize">
                        See Details
                        <v-icon>{{ show ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
                      </v-btn>
                    </v-card-actions>

                    <v-slide-y-transition>
                      <v-card-text v-show="show">
                        <v-subheader class="pl-0">About</v-subheader>
                        <pre style="font-family: 'Roboto', sans-serif; white-space: pre-wrap">{{eventData.desc}}</pre>
                      </v-card-text>
                    </v-slide-y-transition>
                  </v-card>
                </v-tab-item>

                <v-tab-item value="tab-2" v-if="eventData.started" :style="chatHeight">
                  <v-card height="100%">
                    <v-card-text class="pa-0 pt-2">
                      <interactive-window 
                        :event-id="eventId"
                        :tabs-value="tabsValue">
                      </interactive-window>

                      <div id="form-wrapper">
                        <v-form style="background:#fff;" class="px-2">
                          <v-textarea v-model="message" v-on:keyup.enter="sendMessage" color="deep-purple" 
                            id="form" :disabled="!canSendMessages"
                            :label="canSendMessages ? 'Type a message' : eventData.ended ? 'Event Ended' : 'Event not started'" outline 
                            rows="1" auto-grow hide-details
                          >
                          <v-tooltip top slot="append" v-show="!message.trim()">
                            <v-btn icon slot="activator" @click='$helpers.trigFileSelector'>
                              <v-icon color="success">mdi-camera</v-icon>
                            </v-btn>
                            <span>Send a photo</span>
                          </v-tooltip>
                          
                          <v-tooltip top slot="append-outer" v-if="message.trim()">
                            <v-btn icon slot="activator" @click="sendMessage">
                              <v-icon color="teal">{{message.trim() ? 'mdi-send' : '' }}</v-icon>
                            </v-btn>
                            <span>Send message</span>
                          </v-tooltip>

                          <!-- EMOJIS DIALOG-->
                          <v-menu max-width="300" :close-on-content-click='false'
                            slot="prepend-inner" max-height="" top offset-y>

                            <v-btn slot="activator" icon >
                              <v-icon color="success">mdi-emoticon-outline</v-icon>
                            </v-btn>
                            <v-card class="">
                              <emoji-picker @append-emoji="appendEmoji"/>
                            </v-card>
                          </v-menu>
                          
                          </v-textarea>
                          
                        </v-form>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item value="tab-3" v-if="eventData.onr && eventData.onr.uid == getUser.uid">
                  <v-card>
                    <v-card-text>
                      <v-subheader class="pl-0 font-weight-bold secondary--text">Start event</v-subheader>
                      <p>Go live. </p>
                        <v-switch :label="eventData.live ? 'Event started' : 'Go live'" 
                          color="success" @change="goLive"
                          v-model="event_update.live"
                          :readonly="eventData.live || eventData.ended">
                        </v-switch>

                        <v-divider></v-divider>

                      <v-subheader class="pl-0 font-weight-bold secondary--text">End event</v-subheader>
                      <p>Bring this event to an end. Prevent guests from sending new messages.</p>
                        <v-switch :label="eventData.ended ? 'Event Ended' : 'End Event'" 
                          color="orange" @change="endEvent"
                          v-model="event_update.ended"
                          :readonly="eventData.ended || !eventData.live">
                        </v-switch>
                        <v-divider></v-divider>
                        <v-subheader class="pl-0 mt-5 font-weight-bold secondary--text">Update event details</v-subheader>
                        <v-layout row wrap justify-space-between>
                          <v-flex xs12 sm7>
                            <v-card flat>
                              <v-text-field
                                name="event_title"
                                label="Event title"
                                color="secondary"
                                v-model="event_update.title"
                              ></v-text-field>

                              <v-textarea
                                name="event_desc"
                                label="Event description"
                                color="secondary"
                                outline
                                v-model="event_update.desc"
                              ></v-textarea>

                              <v-layout row wrap>
                                <v-flex xs12 sm6>
                                  <v-menu ref="menu"
                                    v-model="date_dialog"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="event_update.date"
                                    lazy transition="scale-transition"
                                    offset-y full-width
                                    min-width="290px">
                                    <template v-slot:activator="{ on }">
                                      <v-text-field
                                        v-model="event_update.date"
                                        label="Start date"
                                        prepend-inner-icon="mdi-calendar"
                                        readonly color="secondary" outline
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="event_update.date" no-title scrollable>
                                      <v-spacer></v-spacer>
                                      <v-btn flat color="primary" @click="date_dialog = false">Cancel</v-btn>
                                      <v-btn flat color="primary" @click="$refs.menu.save(event_update.date)">OK</v-btn>
                                    </v-date-picker>
                                  </v-menu>
                                </v-flex>
                                <v-flex xs12 sm6>
                                  <v-menu ref="menu2"
                                    v-model="time_dialog"
                                    persistent
                                    :return-value.sync="event_update.time"
                                    lazy transition="scale-transition"
                                    offset-y full-width
                                    width="290px">
                                    <template v-slot:activator="{ on }">
                                      <v-text-field
                                        v-model="event_update.time"
                                        label="Start time"
                                        prepend-inner-icon="mdi-calendar"
                                        readonly color="secondary" outline
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-time-picker v-model="event_update.time" scrollable color="secondary">
                                      <v-spacer></v-spacer>
                                      <v-btn flat color="primary" @click="time_dialog = false">Cancel</v-btn>
                                      <v-btn flat color="primary" @click="$refs.menu2.save(event_update.time)">OK</v-btn>
                                    </v-time-picker>
                                  </v-menu>
                                </v-flex>
                              </v-layout>
                              
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="info" depressed 
                                  :disabled="disabledSave" 
                                  @click="saveChanges"
                                  :loading="saving_changes">
                                  Save Changes
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-flex>
                          <v-flex xs12 sm4>
                            <v-card max-height="350" class="pt-3">
                              <v-img :src="blob_urls[0] || eventData.imgSrc" max-height="250" width="90%" class="mx-auto d-block" />

                              <v-card-actions class="mt-4">

                                <v-btn class="text-capitalize" 
                                  depressed :disabled="uploading"
                                  @click="$helpers.trigFileSelector">
                                  Change
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn class="text-capitalize" 
                                  color="info" depressed 
                                  v-if="files[0] || uploading" :loading="uploading"
                                  @click="updateBanner">
                                  Update banner
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-flex>
                        </v-layout>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item value="tab-4" v-if="$vuetify.breakpoint.smAndDown">
                  <event-organizer :organizer="organizer"/>
                </v-tab-item>
              </v-tabs-items>
          </v-card>
        </v-flex>
        <v-flex sm12 md3 d-flex v-if="$vuetify.breakpoint.mdAndUp">
          <v-card height="">
            <!-- ORGANIZER -->
            <event-organizer :organizer="organizer"/>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- FILE DIALOG -->
    <v-dialog v-model="file_dialog" style="background:#fff;" :persistent="progress_dialog"
      max-width="600" hide-overlay :fullscreen="breakpoint.xsOnly">
      <v-toolbar dense flat>
        <v-toolbar-title>Upload images</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat icon @click="file_dialog = false" :disabled="progress_dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="white">
        <v-card flat>
          <!-- Selected images preview -->
          <v-container grid-list-sm px-0>
            <v-layout row wrap>
              <v-flex xs3 v-for="(blob_url,i) in blob_urls" :key="i">
                <v-card height="100" class="mb-1">
                  <v-img :src='blob_url' height="100" ></v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>

          <div class="mt-4">
            <v-textarea v-model="file_message" box color="deep-purple"
              label="Add a caption" outline
              rows="4" auto-grow
            ></v-textarea>
          </div>
          <v-card-actions>
            <v-btn depressed small color="secondary" @click="uploadImages">Upload Images</v-btn>
          </v-card-actions>
          
        </v-card>
      </v-container>
      
    </v-dialog>

    <!-- File uplaod progres dialog -->
    <v-dialog v-model="progress_dialog" max-width="300" persistent>
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat icon :disabled="progress_dialog">
            <v-icon @click="progress_dialog = false">mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-container class="mt-0">
          <v-subheader >Uploading images</v-subheader>
          <v-progress-linear :indeterminate="true" ></v-progress-linear>
        </v-container>
      
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data: ()=> ({
    showUi: false,
    tabsValue: 'tab-1',
    eventData: {},
    organizer: {},
    show: false,
    message: '',
    file_dialog: false,
    file_message: '',
    files: [],
    blob_urls: [],
    disabled_follow: false,
    options: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    },
    date_dialog: false,
    time_dialog: false,
    start_event: false,
    event_update: {
      title: '',
      desc: '',
      date: '',
      time: '',
      live: '',
      ended: ''
    },
    isInterested: false,
    showing_interest: false,
    saving_changes: false,
    uploading: false,
    progress_dialog: false,
    cloudinary:{
      cloud_name:'unplugged',
      upload_preset:'pe4iolek'
    }
  }),
  props: ['eventId'],
  watch: {
    
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo',
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ]),
    user(){
      return this.getUserInfo
    },
    title(){
      return `${this.eventData.title} - Events | ${this.$appName}`
    },
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    styleInput(){
      if(this.breakpoint.smAndDown){
        return {position:'fixed',bottom:'5px',width:'100%'}
      }else{
        return {position:'fixed',bottom:'5px',width:'calc(100% - 530px)'}
      }
    },
    canSendMessages(){
      return this.eventData.live
    },
    disabledSave(){
      // return Object.values(this.event_update).map(item => item && !!item.trim())
      return !this.event_update.title.trim() || 
        !this.event_update.date.trim() || 
        !this.event_update.time.trim() || 
        !this.event_update.desc.trim()
    },
    chatHeight(){
      if(this.$vuetify.breakpoint.xsOnly){
        return {height: '80vh'}
      }
      else if(this.$vuetify.breakpoint.smAndDown){
        return {height: '86vh'}
      }
      else {
        return {height: '470px'}
      }
    }
  },
  methods: {
    goLive(){
      // make event live
      if(!this.eventData.live){

        db.collection('events').doc(this.eventId)
        .update({
          live: true,
          started: true,
          ended: false
        }).then(() => {
  
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Event is Live!',
            color: 'purple'
          })
        })
      }
    },
    endEvent(){
      if(this.eventData.live){
        // end event
        db.collection('events').doc(this.eventId)
        .update({
          live: false,
          ended: true
        }).then(() => {

          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Event ended!',
            color: 'purple'
          })
        })
      }
    },
    saveChanges(){
      // update the event
      this.saving_changes = true
      let batch = db.batch()

      let eventRef = db.collection('events').doc(this.eventId)
      this.event_update.title = this.$sanitize(this.event_update.title)
      this.event_update.desc = this.$sanitize(this.event_update.desc)

      batch.update(eventRef, {
        ...this.event_update
      })

      batch.commit().then(() => {
        this.saving_changes = false
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Event Updated',
          color: 'success'
        })
      }).catch(err => {
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Something went wrong. Try again',
          color: 'error'
        })
      })

    },
    sendMessage () {
      if(this.message.trim() && this.canSendMessages){
        this.submit(this.message, null)
      }
    },
    async submit(message,images){
      try{
        let docRef = db.collection('event_messages').doc()
        let {name, photoURL = false, email, sch=false, fac=false, dept=false, uid, is_student} = this.getUserInfo
        let onr = {
            name,
            photoURL,
            email,
            sch,
            fac,
            dept,
            uid,
            is_student
          }

        let data = {
          onr: onr,
          tstamp: Date.now(),
          body: this.$sanitize(message.trim()),
          imgs: images, // this is for the uploaded image
          docId: docRef.id,
          elecRef: this.curRoom.electionId,
          eventId: this.eventId,
        }
        
        // this.$store.dispatch('saveChatMessage', data)
        
        docRef.set(data)

        // this.scrollChat()
        this.clearMessage()
        // this.$eventBus.$emit('Scroll_Chat', 'data')
      }
      catch(err){
        // console.log(err)
      }
    },
    clearMessage () {
      this.message = ''
    },
    async uploadImages(){
      try {
        this.progress_dialog = true
        let uploaded = await this.$helpers.uploadImage(this.files, this.cloudinary)
        this.progress_dialog = false
        this.file_dialog = false
        this.submit(this.file_message, uploaded)
        
      } catch (error) {
        this.progress_dialog = false
        this.file_dialog = false
        //this.loading = false
        this.snackbar = {
          show: true,
          color: 'error',
          message: 'Sorry, something went wrong, try again.'
        }
        // eslint-disable-next-line
        // console.log(error)
      }
      
    },
    appendEmoji(emoji){
      this.message += emoji
    },
    getCurrentEvent(){
      // get the current event

      db.collection('events').doc(this.eventId)
      .onSnapshot(async doc => {
        this.eventData = doc.data()

        await this.getEventOrganizer()
        this.showUi = true

        Object.assign(this.event_update, this.eventData)

      })
    },
    getEventOrganizer(){
      // retrieve details for this event organizer
      return new Promise((resolve, reject) => {

        db.collection('moreUserInfo').doc(this.eventData.onr.uid).get()
        .then(doc => {
          this.organizer = doc.data()
          resolve(doc.data())
        }).catch(err => reject(err))
      })
    },
    interestStatus(){
      let eventRef = db.collection('events').doc(this.eventId)
      let interestedRef = eventRef.collection('interested').doc(this.getUser.uid)
      interestedRef.onSnapshot(doc => {
        this.isInterested = doc.exists
      })
    },
    showInterest(){
      // i'am interested in this event
      this.showing_interest = true
      let batch = db.batch()

      let eventRef = db.collection('events').doc(this.eventId)
      let interestedRef = eventRef.collection('interested').doc(this.getUser.uid)

      if(this.isInterested){
        batch.delete(interestedRef)
  
        batch.update(eventRef, {
          interested: firebase.firestore.FieldValue.increment(-1)
        })
      }

      else {

        batch.set(interestedRef, {
          interested: true,
          dateCreated: firebase.firestore.FieldValue.serverTimestamp()
        })
  
        batch.update(eventRef, {
          interested: firebase.firestore.FieldValue.increment(1)
        })
      }
      batch.commit().then(() => {
        this.showing_interest = false
      })
    },
    async updateBanner(){
      // update the event banner
      // first upload it
      this.uploading = true
      this.$helpers.uploadImage([this.files[0]], this.cloudinary)
      .then(uploaded => {

        // update the event banner
        db.collection('events').doc(this.eventId)
        .update({
          imgSrc: uploaded[0]
        }).then(() => {

          this.uploading = false
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Event Banner updated',
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
        })
      }).catch(err => {
        this.uploading = false
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Upload failed',
          color: 'error'
        })
      })
      
    },
    scrollChat(){
       let doc = document.getElementById('chat_space_content')
      doc ? doc.scroll({
        top: doc.scrollHeight,
        behavior: 'smooth'
      }) : ''
    },
    
  },
  mounted(){
    this.getCurrentEvent()
    this.interestStatus()
    
    this.$eventBus.$on('Selected_Files', data=>{
      
      this.tabsValue == 'tab-2' ? this.file_dialog = true : ''
			this.files = data.selected_files,
      this.blob_urls = data.imgSrc
      
		})
  },
  components: {
    Navigation,
    LoadingBar,
    InteractiveWindow,
    EmojiPicker,
    EventOrganizer
  }
  
}
import Navigation from '@/components/Navigation'
import LoadingBar from '@/spinners/LoadingBar'
import InteractiveWindow from '@/components/events/InteractiveWindow'
import EventOrganizer from '@/components/events/EventOrganizer'
import EmojiPicker from '@/components/emojis/EmojiPicker'
import {firebase, db, database} from '@/plugins/firebase'
import { mapGetters, mapState } from 'vuex';
</script>

<style scoped>
  #form-wrapper {
    position: absolute;
    width: 100%;
    bottom: 10px;
    background: aliceblue;
  }
</style>
