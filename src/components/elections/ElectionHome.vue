<template>
  <div>
    <navigation :show_extension="true" color="primary"
      extension_height="50"
      :prominent="true"
      >
			<template v-slot:title>
        <span>{{currElection.title}}</span>
      </template>

      <template v-slot:extension>
        
        <v-slide-group show-arrows>
          <v-slide-item
            v-for="item in menu_items"
            :key="item.text"
            v-slot:default="{ active, toggle }"
          >
            <v-btn 
              v-if="!item.hidden"
              class="mr-1 text-capitalize" tile
              :input-value="active" color="#ffffff99"
              active-class="primary lighten-1 white--text"
              text exact :class="item.class"
              :to="item.link"
              @click="toggle"
            >
              {{ item.text }}
            </v-btn>
          </v-slide-item>
        </v-slide-group>

        <v-spacer></v-spacer>

        <v-fab-transition>
          <v-btn v-if="isAdmin"
            key="activefab"
            color="success"
            fab large dark
            @click="$router.push(`/elections/${electionId}/manager`)"
            bottom right
            class="mt-10"
          >
            <v-icon>mdi-settings</v-icon>
          </v-btn>
        </v-fab-transition>

      </template>
    </navigation>
    
    <vue-headful
      :title="title"
    />

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data: () => ({
    currElection: {},
    showUi: false,
    elecRef: '',
  }),
  props:['electionId'],
  computed: {
    title(){
      return `Vote | ${this.$appName}`
    },
    description(){return ''},
    menu_items(){

      let baseUrl = `/elections/${this.electionId}`
      return [
        {text: 'About', link: `${baseUrl}`,},
        {text: 'Contestants', link: `${baseUrl}/contestants`,},
        {text: 'Voters', link: `${baseUrl}/voters`, class: ['hidden-xs-only'], hidden: this.currElection.type == 'Others'},
        {text: 'Manifestos', link: `${baseUrl}/manifestos`, class: ['hidden-xs-only'], hidden: !this.currElection.allow_manifestos},
        {text: 'Results', link: `${baseUrl}/results`, class: ['hidden-xs-only'], hidden: !this.isAdmin && !this.currElection.results_visible_to_all},
        {text: 'Terms', link: `${baseUrl}/terms`}
      ]
    },
    isAdmin(){
      // console.log(this.k)
      return this.currElection.admin &&
      this.currElection.admin == this.getUser.username
    },
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
    setup(){
      if(this.electionId){
        
        this.$gun.get('elections')
        .get(this.electionId)
        .on(election => {
          
          if(election){
            this.currElection = election
            
          }
          else {

          }
          
        })
      }
    }
  },
  mounted(){
    
    this.setup()

  },
  destroyed(){
    // this.elecRef.off()
  },
  components: {
    Navigation
  }
}

import Navigation from '@/components/Navigation'
import { mapGetters } from 'vuex'
</script>
