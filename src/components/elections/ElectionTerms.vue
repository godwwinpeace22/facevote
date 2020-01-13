<template>
  <div>
    <v-container class="my-2 pt-1">
      <transition name="fade">
        <v-card min-height="320" v-if="showUi" outlined>
          <v-subheader >Terms and Conditions</v-subheader>
          <v-card-text>
            {{currElection.terms}}
          </v-card-text>
          
        </v-card>
      </transition>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    currElection: {},
  }),
  computed: {
    electionId(){
      return this.$route.params.electionId
    },
    ...mapState([
      
    ]),
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
    async getElection(){
      
      let voters = []
      this.$gun.get('elections')
        .get(this.electionId)
        .once(el => {
          this.currElection = el

          this.showUi = true
        })
      
      
    },
  },
  mounted(){
    this.getElection()
    
  },
  destroyed(){
    // this.votersRef.off()
  }
}

import { mapGetters, mapState } from "vuex";
import { uniqBy } from "lodash";
</script>

