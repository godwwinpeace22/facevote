<template>
  <div>
    <v-subheader v-if="events.length == 0">No recent events</v-subheader>
    <v-list two-line dense class="grey lighten-3">
      <template v-for="event in events">
        <v-list-item :key="event.eventId" :to="`/events/${event.eventId}`">
          <v-list-item-avatar>
            <img :src="event.imgSrc">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{event.title}}</v-list-item-title>
            <v-list-item-subtitle>
              {{new Date(event.date + ' ' + event.time).toLocaleString('en-US', options)}}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="event.eventId + 'k'"></v-divider>
      </template>
    </v-list>

    <v-btn text small  
      color="primary" 
      class="text-capitalize"
      v-if="!isLastEvent && events.length >= 5"
      @click="moreEvents"
      :loading="loading_more_events"
      >See More
    </v-btn>
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
    loading_more_events: false,
    isLastEvent: false,
  }),
  watch: {
    'curRoom': function(to, from) {
      
      this.getEvents()
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ])
  },
  methods: {
    moreEvents(){
      this.loading_more_events = true
      let lastEvent = this.events[this.events.length - 1]
      db.collection('events').doc(lastEvent.eventId).get().then(documentSnapshot => {
        let lastVisible = documentSnapshot;
        
        db.collection("events")
          .where('elecRef', '==', this.curRoom.electionId)
          .orderBy('dateCreated')
          .startAfter(lastVisible)
          .limit(5)
          .get().then(docs=>{
            docs.forEach(doc=>{
              
              this.events.push(doc.data())
            })

            this.loading_more_events = false
            
            if(docs.empty){
              this.isLastEvent = true
            }
          }).catch(err=>{
            // console.log(err)
          })
      })
    },
    getEvents(){
      db.collection('events').where('elecRef', '==', this.curRoom.electionId)
      .limit(5).orderBy('dateCreated')
      .get().then(docs => {
        let events = []
        docs.forEach(doc => {
          events.push(doc.data())
        })
        // console.log(events)
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
