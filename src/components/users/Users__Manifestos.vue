<template>
  <div>

    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi" height="40vh">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>

      <div v-else>
        <v-col cols="12" sm="10">
          <v-card class="" outlined>
            <v-toolbar dense flat>
              <v-subheader class="pl-0 mt-0 font-weight-bold">{{isSameUser ? 'Your' : ''}} Manifestos</v-subheader>
              <v-spacer></v-spacer>
              
              <v-btn color="secondary" 
                icon small v-if="curRoom && canCreateManifesto" 
                class="text-capitalize" 
                @click="$eventBus.$emit('OpenNewManifestoDialog')">
                <v-icon>mdi-plus</v-icon>
              </v-btn>

              <v-btn color="secondary" 
                icon small v-if="isSameUser && !isSuperUser" 
                class="text-capitalize" 
                @click="$eventBus.$emit('Show_Upgrade_Dialog', {from:'new_manifesto'})"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text class="navdrawr" style="max-height:310px;overflow:auto;">
              <v-list dense>
                <v-subheader v-if="manifestos.length == 0">No manifestos</v-subheader>
                <template v-for="(manifesto,i) in manifestos" >
                  <v-list-item :key="i" >
                    <v-list-item-content>
                      <v-list-item-title v-html="manifesto.title"
                        @click="$router.push(`/elections/${manifesto.elecRef}/manifestos/${manifesto.key}`)">
                      </v-list-item-title>
                      
                    </v-list-item-content>
                    <v-list-item-action>
                        
                      <v-dialog v-model="deleteDialog" 
                        persistent max-width="290" 
                        v-if="manifesto.author.username == getUser.username">

                        <template v-slot:activator="{on}">
                          <v-icon color="orange" small v-on="on" >mdi-delete</v-icon>
                        </template>
                        <v-card>
                          <v-card-title class=" red white--text headline">Delete Manifesto</v-card-title>
                          <v-card-text>Are you sure you want to delete this manifesto ?</v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="" text @click.native="deleteDialog = false">Cancel</v-btn>
                            <v-btn color="orange" text @click.native="deleteManifesto(manifesto)" :loading="deleting">Delete</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider :key="`div-${i}`"></v-divider>
                </template>
              </v-list>
            </v-card-text>
            <v-card-actions>
            </v-card-actions>
          </v-card>
        </v-col>

      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data: () => ({
    showUi: false,
    all_manifestos: [],
    manifestoRef: '',
    deleting: false,
    deleteDialog: false,
    view_manifesto: false,
    viewing: {},
    fullscreen: false,
  }),
  props: {
    userId: {
      type: String
    }
  },
  watch: {
    'user'(to,from){
      
      this.getManifestos()
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified',
      'curRoom',
      'curProfile'
    ]),
    manifestos(){
      return uniqBy(this.all_manifestos, 'key')
    },
    user(){
      return this.curProfile
    },
    isSameUser(){
      return this.getUser.username == this.user.username
    },
    canCreateManifesto(){
      return this.isSameUser && 
      this.isSuperUser && 
      !this.manifestos.find(manifesto => manifesto.elecRef == this.curRoom.electionId)
    },
  },
  methods: {
    deleteManifesto(manifesto){
      if(this.isSameUser){
        try {
          
          let userRef = this.$gun.get(this.getUser.username)
          this.deleting = true
  
          userRef.get('manifestos')
            .get(manifesto.key)
            .put(null)
  
          this.snackbar = {
            show: true,
            message: 'Manifesto deleted',
            color: 'dark'
          }
          this.deleteDialog = false
          this.deleting = false

        } catch (error) {
          console.log(error)
        }
        
        
      }
    },
    
    async getManifestos(){
      try {
        // get a user's manifestos
        let userRef = this.$gun.get(this.getUser.username)

        userRef
          .get('manifestos')
          .map()
          .on((m,k) => {

            
            console.log({m,k})
            
            m.author = this.user
            m.key = k
            this.all_manifestos.push(m)
          })

          
        
        this.showUi = true

      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted(){
    this.user ? this.getManifestos() : ''
  }
}
import { mapGetters, mapState } from 'vuex'
import { uniqBy } from "lodash";
</script>
