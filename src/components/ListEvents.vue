<template>
  <div>
    <v-list two-line dense class="grey lighten-3">
      <template v-for="event in events">
        <v-list-tile avatar :key="event.eventId" :to="`/events/${event.eventId}`">
          <v-list-tile-avatar>
            <img :src="event.imgSrc">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{event.title}}</v-list-tile-title>
            <v-list-tile-sub-title>{{new Date(event.date + ' ' + event.time).toLocaleString('en-US', options)}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider :key="event.eventId + 'k'"></v-divider>
      </template>
    </v-list>
  </div>
</template>
<script>
export default {
  data: () => ({
    events: [],
    options: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    },
  }),
  watch: {
    'curRoom': function(to, from) {
      
      this.getEvents()
    }
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
    ])
  },
  methods: {
    getEvents(){
      db.collection('events').where('elecRef', '==', this.curRoom.electionId)
      .limit(25).orderBy('dateCreated')
      .get().then(docs => {
        let events = []
        docs.forEach(doc => {
          events.push(doc.data())
        })
        console.log(events)
        this.events = events
      })
    }
  },
  mounted(){
    this.curRoom ? this.getEvents() : ''
  }
}
import {mapGetters, mapState} from 'vuex'
  import {firebase, db, database} from '@/plugins/firebase'
</script>
