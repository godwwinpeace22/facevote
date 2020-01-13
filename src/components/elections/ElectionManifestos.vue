<template>
  <div>
    <transition name="fade">
      <v-overlay v-if="!showUi"
        :absolute="true" opacity=".3"
        :value="!showUi"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <v-container class="my-2" v-else>
          <v-subheader v-if="manifestos.length == 0">No data</v-subheader>
          <v-btn 
            color="success" outlined
            class="mb-3"
            v-if="currElection.allow_manifestos"
            @click="openDialog">
            <v-icon class="mr-2">mdi-plus-circle</v-icon>
            Create New
          </v-btn>
        <v-row>
          
          <v-col v-for="(manifesto, i) in manifestos" 
            :key="i + 'manifestos'" cols="12" sm="4"
            >

            <v-card  outlined height=""
              @click="dialog = true; manifestoId = manifesto.soul"
            >

              <v-card-title>
                {{$helpers.truncateText(manifesto.title, 28)}}
              </v-card-title>
              <div class="v-card__subtitle"> By {{manifesto.author.name}}</div>
              <v-card-text>
                <div v-html="$helpers.truncateText(manifesto.body, 200)"></div>
                
              </v-card-text>

              <!-- <v-card-actions>
                <v-spacer></v-spacer>
                
                <v-icon class="mr-1" small>mdi-heart</v-icon>
                <small class="subheading mr-2">256</small>
                <span class="mr-1">·</span>
                <v-icon class="mr-1" small>mdi-share</v-icon>
                <small class="subheading">45</small>
                
              </v-card-actions> -->

            </v-card>
          </v-col>
        </v-row>
      </v-container>


    </transition>

    <v-dialog
      v-model="dialog"
      fullscreen 
      persistent :overlay="false"
      transition="dialog-transition"
    >
      <v-card flat tile>
        <v-toolbar flat color="primary" dark>
          <v-spacer></v-spacer>
          <v-btn icon large @click.native="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <manifestos 
          v-if="dialog"
          :currElection="currElection" 
          :electionId="electionId" 
          :manifestoId="manifestoId"
          @close-dialog="dialog = false"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    manifestos: [],
    currElection: {},
    dialog: false,
    manifestoId: 'new'
  }),
  computed: {
    electionId(){
      return this.$route.params.electionId
    },
    ...mapState([
      'isSuperUser'
    ])
  },
  methods: {
    initialize(){
      // setTimeout(() => this.showUi = true, 1000)
      this.getManifestos()
      this.getElection()
      this.showUi = true
    },
    getElection(){
      this.$gun.get('elections')
        .get(this.electionId)
        .once(e => {
          this.currElection = e
        })
    },
    getManifestos(){
      this.$gun.get('elections')
        .get(this.electionId)
        .get('manifestos')
        .map()
        .on(async (d,key)=> {

          let username = d.author['#']

          let author = await this.$gun.get(username).then()
          // console.log(d.manifestoId)

          let manifesto = this.manifestos.find(m => m.manifestoId == d.manifestoId)

          if(manifesto){
            // replace it
            this.manifestos.splice(manifesto)
            this.manifestos.push({
              ...d,
              author,
              soul: d['_']['#']
            })
          }
          else {
            this.manifestos.push({
              ...d,
              author,
              soul: d['_']['#']
            })
          }
        })
    },
    openDialog(){
      if (this.isSuperUser){
        this.dialog = true; 
        this.manifestoId = 'new'
      }
      else {
        this.$router.push('/upgrade')
      }
    }
  },
  mounted(){
    this.initialize()
  },
  components: {
    Manifestos
  }
}
import Manifestos from "@/components/elections/Manifestos";
import { mapState } from 'vuex'
</script>

<style>

</style>