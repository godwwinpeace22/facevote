<template>
  <div>
    <transition name="fade">
      <v-container class='election_details' v-if="showUi">
        <v-row row wrap>
          <v-col cols="12" :sm="currElection.type == 'Others' ? 12 : 6">
            <v-card outlined min-height="400">
              <v-subheader class="font-weight-bold">About</v-subheader>
              <v-card-text>
                <pre>
                  {{currElection.about}}
                </pre>
              </v-card-text>
              <v-subheader class="font-weight-bold">Terms and conditions</v-subheader>
              <v-card-text>
                Read the 
                <router-link :to="`/elections/${currElection.electionId}/terms`">
                  terms and conditions
                </router-link>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" v-if="currElection.type != 'Others'">
            <v-card outlined>
              <v-subheader class="font-weight-bold">Recent Activities</v-subheader>
              <div style="height:350px;overflow-y:auto;">
                <v-timeline align-top dense>
                  <v-timeline-item :color="getColor(activity)" small v-for="(activity, i) in activities" :key="i + 'activity'">
                    <v-row pt-3>
                      <v-col>
                        <strong>
                          <span class="secondary--text linkify" @click="$eventBus.$emit('ViewProfile', activity.onr)">
                            {{activity.onr.uid == currElection.admin ? 'Admin' : 
                            activity.onr.name}}
                          </span>
                          {{activity.body}}</strong>
                        <div class="caption">{{new Date(activity.tstamp.toMillis()).toDateString('en-Us',{day:'numeric'})}}</div>
                      </v-col>
                    </v-row>
                  </v-timeline-item>
                </v-timeline>
                <v-btn color="secondary" text small @click="moreActivities" v-if="activities.length >= 25 && !isLastActivity"
                  :loading="loading_more_activities" style="text-transform: initial">
                  See more
                </v-btn>
              </div>
            </v-card>
          </v-col>
          
          
        </v-row>
      </v-container>
    </transition>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    currElection: {},
    activities: [],
    elecRef: '',
  }),
  computed: {
    electionId(){
      return this.$route.params.electionId
    },
  },
  methods: {
    initialize(){
      this.$gun.get('elections')
        .get(this.electionId)
        .on(e => {
          this.currElection = e;

          this.showUi = true
        })
    },
    getColor(activity){
      switch (activity.type) {
        case 'voter_registered':
          return 'purple'
        case 'election_created':
          return 'primary'
        case 'election_updated':
          return 'error'
        case 'logo_updated':
          return 'secondary'
        case 'new_contestant':
          return 'teal'
        case 'voter_registered':
          return 'orange'
        case 'vote_casted':
          return 'success'
        case 'contestant_suspended':
          return 'black'
        case 'contestant_restored':
          return 'success'
        default:
          return 'white'
      }
    },
  },
  async mounted(){
    this.initialize()
  },
  destroyed(){
    // this.elecRef.off()
  },
  components: {
    
  }
}

</script>


