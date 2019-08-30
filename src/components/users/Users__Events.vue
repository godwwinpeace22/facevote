<template>
  <div>
    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi" height="40vh">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>

      <div v-else>

        <v-subheader>Your Events</v-subheader>
        <v-layout row wrap style="max-height:350px;overflow:auto;">
          <v-subheader v-if="events.length == 0">No events</v-subheader>
          <v-flex xs12 sm6 v-for="event in events" :key="event.eventId" mb-3>
            <v-card>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-img :src="event.imgSrc || require('@/assets/abstract.png')" height="130" />
                </v-flex>
                <v-flex xs8>
                  <v-list two-line>
                    <v-list-tile avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>{{event.title}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{event.date}}</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                  <v-card-actions>
                    <v-btn flat small class="text-capitalize">{{event.interested}} Interested</v-btn>
                    <v-btn flat color="purple" class="text-capitalize" :to="`/events/${event.eventId}`">Visit page</v-btn>
                    
                  </v-card-actions>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>

        <v-btn flat small 
          color="secondary" 
          class="ml-0 text-normal"
          @click="moreEvents"
          :loading="loading_more_events"
          v-if="!isLastEvent && events.length >= 6"
        >
          See more events
        </v-btn>

      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data: () => ({
    showUi: false,
    events: [],
    loading_more_events: false,
    lastEvent: '',
    isLastEvent: false,
  }),
  watch: {
    'user'(to,from){
      
      this.getEvents()
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified',
      'curRoom',
      'curProfile'
    ]),
    user(){
      return this.curProfile
    }
  },
  methods: {
    getEvents(){
      // get all users events
      db.collection('events')
      .where('onr.uid', '==', this.user.uid)
      .orderBy('dateCreated', 'desc').limit(6)
      .onSnapshot(docs => {
        let events = []
        docs.forEach(doc => {
          events.push(doc.data())
        })
        this.events = events
        this.lastEvent = docs.docs[docs.docs.length - 1]
        this.showUi = true
      })
    },
    moreEvents(){
      if(this.lastEvent != undefined){

        this.loading_more_events = true

        db.collection('events').where('onr.uid', '==', this.user.uid)
        .orderBy('dateCreated', 'desc').limit(6)
        .startAfter(this.lastEvent)
        .get().then(querySnapshots => {

          querySnapshots.forEach(doc => {
            this.events.push(doc.data())
          })

          this.lastEvent = querySnapshots.docs[querySnapshots.docs.length - 1]
          this.isLastEvent = querySnapshots.docs.empty
          this.loading_more_events = false
        })
      }
      else {
        this.isLastEvent = true
      }
    }
  },
  mounted(){

    this.user ? this.getEvents() : ''
  }
}
import { mapGetters, mapState } from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
</script>
