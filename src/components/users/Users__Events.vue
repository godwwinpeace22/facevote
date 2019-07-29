<template>
  <div>
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
  </div>
</template>
<script>
export default {
  data: () => ({
    events: [],
  }),
  props: ['username', 'user'],
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
      'curRoom'
    ]),
  },
  methods: {
    getEvents(){
      // get all users events
      db.collection('events')
      .where('onr.uid', '==', this.user.uid)
      .get().then(docs => {
        let events = []
        docs.forEach(doc => {
          events.push(doc.data())
        })
        this.events = events
        // console.log({events})
      })
    },
  },
  mounted(){
    this.getEvents()
  }
}
import { mapGetters, mapState } from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
</script>
