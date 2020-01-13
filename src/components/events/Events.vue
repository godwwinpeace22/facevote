<template>
  <div>
    <vue-headful :title="title"/>
    
    <navigation :show_extension="true" color="primary"
      extension_height="30"
      :prominent="true"
      >
      <template v-slot:title>
        <span>{{eventData.title}}</span>
      </template>

      <template v-slot:extension>

        <v-tabs
          align-with-title
          v-model="tabsValue"
          background-color="transparent"
          slider-color="#fff"
          >
          <v-tab href="#tab-1" class="text-capitalize"> About</v-tab>
          <v-tab href="#tab-2" class="text-capitalize" :disabled="!eventData.started"> Chat</v-tab>
          <v-tab href="#tab-3" class="text-capitalize" v-if="eventData.author && eventData.author.username == getUser.username">
            Settings
          </v-tab>
        </v-tabs>
      </template>
    </navigation>

    <transition name='fade'>

    <v-container v-if="showUi" class="px-sm-2">
      <v-row justify="center">
        <v-col sm="12" md="10">
          <v-card flat>

              <v-tabs-items v-model="tabsValue">

                <v-tab-item value="tab-1">
                  <v-card outlined>
                    <v-img
                      :src="eventData.imgSrc ? eventData.imgSrc : ''" 
                      height="300px" width="100%"
                      class="d-block mx-auto grey lighten-2"
                      style="cursor: zoom-in;"
                      @click="eventData.imgSrc ? $eventBus.$emit('Open_Image_Gallery', {images: [eventData.imgSrc], index: 0}) : ''">
                    </v-img>
                    
                    <div class="v-card__title">
                      {{eventData.title}}
                      <span class="pl-4 red--text" v-if="eventData.live || eventData.ended">
                        <v-icon color="red">mdi-access-point</v-icon>
                        {{ eventData.live ? 'Live Now' : 'Ended'}}
                      </span>
                    </div>
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-action>
                          <v-icon color="primary">mdi-clock-outline</v-icon>
                        </v-list-item-action>
                        <v-list-item-title>
                          {{(new Date(eventData.date + ' ' + eventData.time))
                          .toLocaleString('en-US',options)}}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-action>
                          <v-icon color="primary">mdi-map-marker-outline</v-icon>
                        </v-list-item-action>
                        <v-list-item-title>
                          {{eventData.online ?  'Online' : eventData.venue}}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>

                    <v-card-actions>
                      <v-btn color="info" depressed small>
                        <v-icon small >mdi-star</v-icon>
                        <span class="ml-1 mr-2">Interested</span>
                        <span>{{eventData.interested}}</span>
                      </v-btn>
                      <v-btn color="purple" 
                        depressed small dark
                        @click="eventData.started ? tabsValue = 'tab-2' : ''">
                        <v-icon small>mdi-forum</v-icon>
                        <span class="ml-2">Join chat</span>
                      </v-btn>
                      <div>
                        
                      </div>
                    </v-card-actions>

                    
                    <v-divider v-show="show"></v-divider>

                    <v-slide-y-transition>
                      <v-card-text v-show="show">
                        <v-subheader class="pl-0 font-weight-bold">About Event</v-subheader>
                        <div v-html="eventData.desc">
                          
                        </div>

                        <v-subheader class="pl-0 mt-5 font-weight-bold">About Organizer</v-subheader>
                        <div>
                          <v-list two-line>
                            <v-list-item 
                              class="pl-0" 
                              @click="$router.push('/users/' + organizer.username)">
                              <v-list-item-avatar size="60">
                                <v-img v-if="organizer.photoURL" :src="organizer.photoURL"></v-img>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title class="text-capitalize">
                                  {{organizer.name}}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                  {{organizer.username}}
                                </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </div>

                      </v-card-text>
                    </v-slide-y-transition>
                  </v-card>
                </v-tab-item>

                <v-tab-item value="tab-2" v-if="eventData.started" :style="chatHeight">
                  <v-card height="100%" outlined>
                    <v-card-text class="pa-0 pt-2">
                      <interactive-window 
                        :event-id="eventId"
                        :tabs-value="tabsValue">
                      </interactive-window>

                      <div id="form-wrapper">
                        <v-form style="background:#fff;" class="px-2">
                          <v-textarea v-model="message" v-on:keyup.enter="sendMessage" color="deep-purple" 
                            id="form" :disabled="!canSendMessages"
                            :label="canSendMessages ? 'Type a message' : eventData.ended ? 'Event Ended' : 'Event not started'" outlined 
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

                <v-tab-item value="tab-3" v-if="eventData.author && eventData.author.username == getUser.username">
                  <v-card outlined>
                    <v-card-text>
                      <v-subheader class="pl-0 font-weight-bold primary--text">Start event</v-subheader>
                      <p>Go live. </p>
                        <v-switch :label="eventData.live ? 'Event started' : 'Go live'" 
                          color="success" @change="goLive"
                          v-model="event_update.live"
                          :readonly="eventData.live || eventData.ended">
                        </v-switch>

                        <v-divider></v-divider>

                      <v-subheader class="pl-0 font-weight-bold primary--text">End event</v-subheader>
                      <p>Bring this event to an end. Prevent guests from sending new messages.</p>
                        <v-switch :label="eventData.ended ? 'Event Ended' : 'End Event'" 
                          color="orange" @change="endEvent"
                          v-model="event_update.ended"
                          :readonly="eventData.ended || !eventData.live">
                        </v-switch>
                        <v-divider></v-divider>
                        <v-subheader class="pl-0 mt-5 font-weight-bold primary--text">Update event details</v-subheader>
                        <v-row row wrap justify-space-between>
                          <v-col cols="12" sm="7">
                            <v-card flat>
                              <v-text-field
                                name="event_title"
                                label="Event title"
                                color="primary" outlined
                                v-model.trim="event_update.title"
                              ></v-text-field>

                              <v-textarea
                                name="event_desc"
                                label="Event description"
                                color="primary"
                                outlined
                                v-model.trim="event_update.desc"
                              ></v-textarea>

                              <v-row row wrap>
                                <v-col cols="12" sm="6">
                                  <v-menu ref="menu"
                                    v-model="date_dialog"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="event_update.date"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px">
                                    <template v-slot:activator="{ on }">
                                      <v-text-field
                                        v-model.trim="event_update.date"
                                        label="Start date"
                                        prepend-inner-icon="mdi-calendar"
                                        readonly color="primary" outlined
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="event_update.date" no-title scrollable>
                                      <v-spacer></v-spacer>
                                      <v-btn text color="primary" @click="date_dialog = false">Cancel</v-btn>
                                      <v-btn text color="primary" @click="$refs.menu.save(event_update.date)">OK</v-btn>
                                    </v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-menu ref="menu2"
                                    v-model="time_dialog"
                                    persistent
                                    :return-value.sync="event_update.time"
                                    transition="scale-transition"
                                    offset-y
                                    width="290px">
                                    <template v-slot:activator="{ on }">
                                      <v-text-field
                                        v-model="event_update.time"
                                        label="Start time"
                                        prepend-inner-icon="mdi-calendar"
                                        readonly color="primary" outlined
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-time-picker v-model="event_update.time" scrollable color="primary">
                                      <v-spacer></v-spacer>
                                      <v-btn text color="primary" @click="time_dialog = false">Cancel</v-btn>
                                      <v-btn text color="primary" @click="$refs.menu2.save(event_update.time)">OK</v-btn>
                                    </v-time-picker>
                                  </v-menu>
                                </v-col>
                              </v-row>
                              
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
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-card max-height="350" class="pt-3" outlined>
                              <v-img 
                                :src="blob_urls[0] || eventData.imgSrc" 
                                max-height="250" width="90%" 
                                class="mx-auto d-block" />

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
                          </v-col>
                        </v-row>
                    </v-card-text>
                  </v-card>

                  <v-card outlined class="mt-5">
                    <v-card-title>
                      Danger zone
                    </v-card-title>
                    <v-card-actions>
                      
                      <v-dialog
                        v-model="delete_dialog"
                        persistent :overlay="false"
                        max-width="500px"
                        transition="dialog-transition"
                      >
                        <template v-slot:activator="{on}">
                          <v-btn 
                            color="error" v-on="on"
                            depressed>
                            Delete event
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-title >
                            Delete this event
                          </v-card-title>
                          <v-card-text>
                            Are your sure?
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                              depressed
                              @click="delete_dialog = false">
                              Cancel</v-btn>

                            <v-btn color="error"
                              depressed
                              @click="deleteEvent">
                              Delete</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>

                    </v-card-actions>
                  </v-card>
                </v-tab-item>
                
              </v-tabs-items>
          </v-card>
        </v-col>

      </v-row>
    </v-container>

    </transition>

    <!-- FILE DIALOG -->
    <v-dialog v-model="file_dialog" style="background:#fff;" :persistent="progress_dialog"
      max-width="600" hide-overlay :fullscreen="breakpoint.xsOnly">
      <v-toolbar dense flat>
        <v-toolbar-title>Upload images</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text icon @click="file_dialog = false" :disabled="progress_dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="white">
        <v-card flat>
          <!-- Selected images preview -->
          <v-container grid-list-sm class="px-0">
            <v-row row wrap>
              <v-col cols="3" v-for="(blob_url,i) in blob_urls" :key="i">
                <v-card height="100" class="mb-1">
                  <v-img :src='blob_url' height="100" ></v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <div class="mt-4">
            <v-textarea v-model="file_message" box color="deep-purple"
              label="Add a caption" outlined
              rows="4" auto-grow
            ></v-textarea>
          </div>
          <v-card-actions>
            <v-btn depressed small color="primary" @click="uploadImages">Upload Images</v-btn>
          </v-card-actions>
          
        </v-card>
      </v-container>
      
    </v-dialog>

    <!-- File uplaod progres dialog -->
    <v-dialog v-model="progress_dialog" max-width="300" persistent>
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text icon :disabled="progress_dialog">
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
    show: true,
    message: '',
    delete_dialog: false,
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
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ]),
    user(){
      return this.getUser
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
      return !this.event_update.title || 
        !this.event_update.date || 
        !this.event_update.time || 
        !this.event_update.desc
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
        
        let eventRef = this.$gun.get('events')
          .get(this.eventId)

        eventRef.get('live')
          .put(true)
        eventRef.get('started')
          .put(true)
        eventRef.get('ended')
          .put(false)
        
  
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Event is Live!',
          color: 'purple'
        })
        
      }
    },
    endEvent(){
      if(this.eventData.live){
        // end event

        let eventRef = this.$gun.get('events')
          .get(this.eventId)

        eventRef.get('live')
          .put(false)
        eventRef.get('ended')
          .put(true)

          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Event ended!',
            color: 'purple'
          })
        
      }
    },
    saveChanges(){
      // update the event
      this.saving_changes = true

      this.event_update.title = this.$sanitize(this.event_update.title)
      this.event_update.desc = this.$sanitize(this.event_update.desc)

      // console.log(this.event_update)
      let eventRef = this.$gun.get('events')
        .get(this.eventId)
        .put({
          title: this.event_update.title,
          desc: this.event_update.desc,
          date: this.event_update.date,
          time: this.event_update.time
        })

      this.saving_changes = false
      this.$eventBus.$emit('Snackbar', {
        show: true,
        message: 'Event Updated',
        color: 'success'
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
        let {name, photoURL = false, email, sch=false, fac=false, dept=false, username, is_student} = this.getUser
        let author = {
            name,
            photoURL,
            email,
            sch,
            fac,
            dept,
            username,
            is_student
          }

        let data = {
          author: author,
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
      this.$gun
        .get('events')
        .get(this.eventId)
        .on(async e => {
          
          // console.log({e})
          let event = Object.assign({}, e)

          if(e){
            
            event.author =  e.author
              
            this.eventData = event
  
            this.organizer = e.author
            this.showUi = true
            // console.log(this.eventData)
            Object.assign(this.event_update, this.eventData)
          }

        })

    },
    
    interestStatus(){
      let eventRef = db.collection('events').doc(this.eventId)
      let interestedRef = eventRef.collection('interested').doc(this.getUser.username)
      interestedRef.onSnapshot(doc => {
        this.isInterested = doc.exists
      })
    },
    showInterest(){
      // i'am interested in this event
      this.showing_interest = true
      let batch = db.batch()

      let eventRef = db.collection('events').doc(this.eventId)
      let interestedRef = eventRef.collection('interested').doc(this.getUser.username)

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
      this.$helpers.uploadMedia({
        files: [this.files[0]],
        options: {
          height: 300,
          width: 800
        }
      })
      .then(uploaded => {

        // update the event banner
        this.$gun.get('events').get(this.eventId)
        .get('imgSrc').put(uploaded[0])

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Event banner updated',
          color: 'success'
        })

        this.uploading = false
        this.files = []

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
    deleteEvent(){
      this.$gun.get('events')
        .get(this.eventId)
        .put(null)
        
      this.$gun.get('users')
        .get(this.getUser.username)
        .get('events')
        .unset(this.eventData['_']['#'])

      this.$router.push('/')
    }
    
  },
  mounted(){
    this.getCurrentEvent()
    // this.interestStatus()
    
    this.$eventBus.$on('Selected_Files', data=>{
      
      this.tabsValue == 'tab-2' ? this.file_dialog = true : ''
			this.files = data.selected_files,
      this.blob_urls = data.imgSrc
      
		})
  },
  components: {
    InteractiveWindow,
    EmojiPicker,
  }
  
}
import InteractiveWindow from '@/components/events/InteractiveWindow'
import EmojiPicker from '@/components/emojis/EmojiPicker'
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
