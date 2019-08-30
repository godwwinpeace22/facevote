<template>
  <div>

    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi" height="40vh">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>

      <div v-else>
        <v-flex xs12 sm10>
          <v-card class="" >
            <v-toolbar dense flat card>
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
                  <v-list-tile :key="i" @click="viewManifesto(manifesto)">
                    <v-list-tile-content>
                      <v-list-tile-title v-html="manifesto.title"></v-list-tile-title>
                      
                    </v-list-tile-content>
                    <v-list-tile-action>
                        
                      <v-dialog v-model="deleteDialog" persistent max-width="290" v-if="manifesto.onr.uid == getUser.uid">
                        <v-icon color="orange" small slot="activator" >mdi-delete</v-icon>
                        <v-card>
                          <v-card-title class=" red white--text headline">Delete Manifesto</v-card-title>
                          <v-card-text>Are you sure you want to delete this manifesto ?</v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="" flat @click.native="deleteDialog = false">Cancel</v-btn>
                            <v-btn color="orange" flat @click.native="deleteManifesto(manifesto)" :loading="deleting">Delete</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider :key="`div-${i}`"></v-divider>
                </template>
              </v-list>
            </v-card-text>
            <v-card-actions>
            </v-card-actions>
          </v-card>
        </v-flex>

        <!-- VIEW MANIFESTO -->
        <v-dialog v-model="view_manifesto" content-class="white view_dialog"
          v-if="view_manifesto" max-width="500" lazy scrollable 
            :fullscreen="$vuetify.breakpoint.xsOnly || fullscreen">
          <v-card style="min-height: 450px;">
            <v-list dense dark :class="[$helpers.colorMinder(viewing.onr.name.charAt(0))]">
              <v-list-tile avatar>
                <v-list-tile-action class="hidden-sm-and-up" style="min-width: 30px;">
                  <v-btn flat icon @click="view_manifesto = false">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-avatar :color="!viewing.photoURL ? viewing.onr.name.charAt(0) : ''">
                  <img v-if="viewing.onr.photoURL" :src="viewing.onr.photoURL">
                  <span v-else class="white--text">{{viewing.onr.name.charAt(0)}}</span>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="text-capitalize">{{viewing.onr.name}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{$helpers.parseDate(viewing.tstamp)}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action class="hidden-xs-only">
                  <v-btn flat icon @click="fullscreen = !fullscreen">
                    <v-icon>{{fullscreen ? "mdi-fullscreen-exit" : "mdi-fullscreen"}}</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-action class="hidden-xs-only">
                  <v-btn flat icon @click="view_manifesto = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>

            <v-card-text>
              <v-container grid-list-xs>
                <v-layout row wrap justify-center>
                  <v-flex shrink>
                    <v-card flat class="grey lighten-5 pa-3">
                      <div v-html="viewing.body"></div>
                      
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data: () => ({
    showUi: false,
    manifestos: [],
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
      'getUserInfo'
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified',
      'curRoom',
      'curProfile'
    ]),
    user(){
      return this.curProfile
    },
    isSameUser(){
      return this.getUser.uid == this.user.uid
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

        let docRef = db.collection('manifestos')
        .doc(`${this.getUser.uid}-${this.curRoom.electionId}-man`)
        
        this.deleting = true
        docRef.delete().then(d=>{
          this.snackbar = {
            show: true,
            message: 'Manifesto deleted',
            color: 'dark'
          }
          this.deleteDialog = false
          this.deleting = false
        }).catch(err => {
          // console.log(err)
        })
      }
    },
    likeManifesto(manifesto){
      // console.log(manifesto, this.getUser.uid)
      if(manifesto.likes && manifesto.likes.find(id => id == this.getUser.uid)){
        // console.log('liked')
        db.collection('manifestos').doc(manifesto.docId)
        .update({
          likes:firebase.firestore.FieldValue.arrayRemove(this.getUser.uid)
        })
      }
      else{
        // console.log('not liked')
        db.collection('manifestos').doc(manifesto.docId)
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
        })
      }
      
    },
    
    viewManifesto(manifesto){
      // console.log(manifesto.docId)
      this.viewing = manifesto
      this.view_manifesto = true
      
    },
    async getManifestos(){
      this.manifestoRef = db.collection('manifestos')
      .where('onr.uid','==',this.user.uid)
      .onSnapshot(querySnapshot=>{
        let manifestos = []
        querySnapshot.forEach(doc => {
          manifestos.push(doc.data())
        });
        this.manifestos = manifestos
        this.showUi = true
        
      }, err=>{
        // console.log(err)
      })
    },
  },
  mounted(){
    this.user ? this.getManifestos() : ''
  }
}
import { mapGetters, mapState } from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
</script>
