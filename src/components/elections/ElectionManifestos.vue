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
        <v-row>

          <v-col v-for="(manifesto, i) in manifestos" 
            :key="i + 'manifestos'" cols="12" sm="4"
            >

            <v-card  outlined height=""
              :to="`/manifestos/${manifesto.soul}`"
            >

              <v-card-title>
                {{$helpers.truncateText(manifesto.title, 28)}}
              </v-card-title>
              <div class="v-card__subtitle"> By {{manifesto.author.name}}</div>
              <v-card-text>
                <div v-html="$helpers.truncateText(manifesto.body, 200)"></div>
                
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                
                <v-icon class="mr-1" small>mdi-heart</v-icon>
                <small class="subheading mr-2">256</small>
                <span class="mr-1">·</span>
                <v-icon class="mr-1" small>mdi-share</v-icon>
                <small class="subheading">45</small>
                
              </v-card-actions>

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
    manifestos: [],
  }),
  computed: {
    electionId(){
      return this.$route.params.electionId
    }
  },
  methods: {
    initialize(){
      // setTimeout(() => this.showUi = true, 1000)
      this.getManifestos()
      this.showUi = true
    },
    getManifestos(){
      this.$gun.get('elections')
        .get(this.electionId)
        .get('manifestos')
        .map()
        .once(async (d,key)=> {

          let username = d.author['#']

          let author = await this.$gun.get(username).then()
          // console.log({d})
          this.manifestos.find(m => m.manifestoId == d.manifestoId) ? '' : 
          this.manifestos.push({
            ...d,
            author,
            manifestoId: key,
            soul: d['_']['#']
          })
        })
    }
  },
  mounted(){
    this.initialize()
  }
}
</script>

<style>

</style>