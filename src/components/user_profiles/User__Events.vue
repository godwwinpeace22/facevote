<template>
  <div>
    <v-container class="pt-8">
      <v-row justify="center" align="center">
        <v-col cols="12">
          <v-row>
            <v-subheader v-if="events.length == 0">No recent events</v-subheader>
            <v-col cols="12" sm="6" md="6" v-for="(event, i) in events" :key="event.eventId + i">
              <v-card
                class="mx-auto"
                max-width="344"
                outlined
              >
                <v-list-item three-line @click="$router.push(`/events/${event.eventId}`)">
                  <v-list-item-content>
                    <v-list-item-subtitle>{{event.title}}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-avatar
                    tile
                    size="80"
                    color="grey"
                  >
                    <v-img :src="event.imgSrc"></v-img>
                  </v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn text small @click="deleteEvent(event)">Delete</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn text small>55 Going</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
export default {
  data: () => ({
    events: [],
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([

    ]),
    username(){
      return this.$route.params.username
    },
    async user(){
      return await this.$gun.get('users')
        .get(this.username)
        .then()
    },
  },
  methods: {
    getEvents(){
      this.$gun.get('users').get(this.username)
        .get('events')
        .map()
        .once(async (event,key) => {
          if(event.eventId){
            
            event.author = await this.user;
            console.log(event, key)
            
            this.events.find(e => e.eventId == event.eventId) ? '' : 
            this.events.push(event)
          }
        })
    },
    deleteEvent(event){
      let ref = this.$gun.get('events')
        .get(event.eventId)
        // .once((d,k) =>console.log({k}))
        // .put(null)
        
      let u = this.$gun.get('users')
        .get(this.getUser.username)
        .get('events')
        .unset(event.eventId)

        // console.log(ref, u)
        // ref.put(null)
    },
    initialize(){
      this.getEvents()
    }
  },
  mounted(){
    this.initialize()

  },
  components: {
    
  }
}

import { mapState, mapGetters } from "vuex"
</script>
