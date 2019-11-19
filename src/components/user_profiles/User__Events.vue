<template>
  <div>
    <v-container class="pt-8">
      <v-row justify="center" align="center">
        <v-col cols="12" md="9">
          <v-row>
            <v-col cols="12" sm="4" md="4" v-for="(event, i) in events" :key="event.eventId + i">
              <v-card
                class="mx-auto"
                max-width="344"
                outlined
              >
                <v-list-item three-line>
                  <v-list-item-content>
                    <!-- <div class="overline mb-4">OVERLINE</div> -->
                    <!-- <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title> -->
                    <v-list-item-subtitle>{{event.title}}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-avatar
                    tile
                    size="80"
                    color="grey"
                  ></v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text small class="text-capitalize">55 Going</v-btn>
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
    events: []
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
      return await this.$gun.get(this.username)
        .then()
    },
  },
  methods: {
    getEvents(){
      this.$gun.get(this.username)
        .get('events')
        .map().once(async event => {
          if(event.eventId){
            
            event.author = await this.user;
            console.log(event)
            
            this.events.find(e => e.eventId == event.eventId) ? '' : 
            this.events.push(event)
          }
        })
    },
    initialize(){
      this.getEvents()
    }
  },
  mounted(){
    this.initialize()
  }
}

import { mapState, mapGetters } from "vuex";
</script>
