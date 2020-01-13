<template>
  <div>
    <vue-headful :title="_title"/>

    <transition name="fade" appear>
      <!-- <v-overlay v-if="!showUi"
        absolute opacity=".3"
        :value="!showUi"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay> -->

      <v-container class="white">
        <v-card flat min-height="500">
          <v-fab-transition>
            <v-btn
              v-if="isOwner"
              :key="activeFab.icon"
              :color="activeFab.color"
              fab large dark
              @click.native="activeFab.action"
              absolute
              right :loading="loading"
            >
              <v-icon>{{ activeFab.icon }}</v-icon>
            </v-btn>
          </v-fab-transition>

          <v-row justify="center">
            <v-col md="6">
              <v-card flat class="pb-3">
                <div class="display-1 text-cent" 
                  :contenteditable="!readonly" 
                  v-text="title" ref="title">
                </div>
                
                <v-list v-if="manifestoId != 'new' && manifesto.author">
                  <v-list-item class="pl-0" 
                    @click="$helpers.openProfile($event, manifesto.author)">
                    <v-list-item-avatar color="grey lighten-3">
                      <img :src="`${manifesto.author.photoURL}`" 
                        v-if="manifesto.author.photoURL" alt="author_img"/>
                      <span class="text-capitalize" v-else>
                        {{manifesto.author.name.charAt(0)}}
                      </span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="text-capitalize">
                        {{manifesto.author ? manifesto.author.name : ''}}
                      </v-list-item-title>
                      <v-list-item-subtitle >
                        <span class="mr-2">{{formatDate(manifesto.date_created)}}</span>
                        <!-- <span class="mr-1">·</span> -->
                        <!-- <span class="mr-2">8 min read</span> -->
                        <!-- <span class="mr-1">·</span>
                        <v-icon class="mr-1" small>mdi-heart</v-icon>
                        <small class="subheading mr-2">256</small>
                        <span class="mr-1">·</span>
                        <v-icon class="mr-1" small>mdi-share</v-icon>
                        <small class="subheading">45</small> -->
                      </v-list-item-subtitle>

                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
              <v-divider></v-divider>
            </v-col>

            <v-col md="10">
              <v-card flat>
                <div style="min-height: 300px;">
                  <div class="editable" ref="editable"></div>
                  
                  <!-- <v-divider></v-divider> -->
                  <!-- <div v-html="manifesto_body"></div> -->

                </div>

                <!-- <v-card-actions v-if="manifestoId != 'new'">

                  <v-btn color="info" text>
                    <v-icon color="red">mdi-heart</v-icon>
                    Like
                  </v-btn>
                  <v-btn color="info" text>
                    <v-icon>mdi-share</v-icon>
                    Share
                  </v-btn>

                  <v-spacer></v-spacer>

                  <v-icon class="mr-1">mdi-heart</v-icon>
                  <span class="subheading mr-2">256</span>
                  <span class="mr-1">·</span>
                  <v-icon class="mr-1">mdi-share</v-icon>
                  <span class="subheading">45</span>

                </v-card-actions> -->
              </v-card>
            </v-col>
          </v-row>
          
        </v-card>
      </v-container>
    </transition>
  </div>
</template>
<script>
export default {
  data: () => ({
    showUi: false,
    readonly: true,
    manifesto: {},
    manifesto_body: '',
    title: 'Click to edit title',
    loading: false,
    created: false,
    editor: '',
  }),
  props: ['electionId', 'manifestoId', 'currElection'],
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    _title(){
      return `${this.manifestoId == 'new' ? 'Create ' : 'Edit '} Manifesto | ${this.$appName}`
    },
    // manifestoId(){
    //   return this.$route.params.manifestoId
    // },
    // electionId(){
    //   return this.$route.params.electionId
    // },
    activeFab () {
      switch (this.readonly) {
        case false: return { color: 'primary', icon: 'mdi-content-save', action: this.save }
        default: return { color: 'success', icon: 'mdi-square-edit-outline', action: this.edit }
      }
    },
    isOwner(){
      if(this.manifestoId == 'new'){
        return true
      }
      else if(this.manifesto.author){
        return this.manifesto.author.username == this.getUser.username
      }
      else {return false}
    }
  },
  components: {
    Navigation
  },
  methods: {
    initialize(){
      
      if(this.manifestoId == 'new'){
        this.readonly = false
        // this.edit()
        this.showUi = true;
        this.initializeEditor()
      }
      else {
        this.readonly = true
        this.getManifesto()
        this.showUi = true
        // console.log(this.manifesto)
      }
      // console.log(this.manifestoId)

    },
    getManifesto(){
      // console.log(this.manifestoId)
      this.$gun.get(this.manifestoId)
        .once(async (d,k) => {

          let username = d.author['#']
          console.log(d)

          let author = await this.$gun.get(username).then()
          this.manifesto = {
            ...d,
            author,
            manifestoId: k,
            soul: d['_']['#']
          }

          this.manifesto_body = d.body
          this.title = d.title
          this.$refs['editable'].innerHTML = d.body
        })
    },
    initializeEditor(){

      this.editor = new MediumEditor('.editable', {
        delay: 1000,
        targetBlank: true,
        autoLink: true,
        toolbar: {
            buttons: ['bold', 'strikethrough', 'h1', 'h2','h3', 'italic','orderedlist','unorderedlist', 'quote','underline','anchor'],
            diffLeft: 25,
            diffTop: 10,
        },
        anchor: {
          // placeholderText: 'Type a link',
          // customClassOption: 'btn',
          // customClassOptionText: 'Create Button',
          linkValidation: true
        },
        paste: {
          cleanPastedHTML: true,
          cleanAttrs: ['style', 'dir'],
          cleanTags: ['label', 'meta'],
          unwrapTags: ['sub', 'sup']
        },
        // anchorPreview: {
        //   hideDelay: 300
        // },
        placeholder: {
          text: 'Compose an epic'
        }
      })

      let _this = this
      // console.log(this.editor)
      this.editor.subscribe('editableInput', function (event, editable) {
        // console.log(editable)
        _this.manifesto_body = editable.innerHTML
      })

    },
    save(){
      this.manifestoId == 'new' ?
      this.create() : 
      this.update()
    },
    async create(){

      this.loading = true

      let userRef = this.$gun.get('users')
        .get(this.getUser.username)
      let manifestoId = this.$uuidv4()

      let manifesto_data = {
        body: this.manifesto_body,
        title: this.title,
        manifestoId: manifestoId,
        date_created: this.$Gun.state(),
        last_updated: this.$Gun.state()
      }

      let electionRef = this.$gun.get('elections')
        .get(this.electionId)

      let manifesto = userRef.get('manifestos')
        .get(this.electionId) // can't have two manifestos for same election
        .put(manifesto_data)

      manifesto.get('author')
        .put(userRef)
      manifesto.get('electionRef')
        .put(electionRef)
      electionRef
        .get('manifestos')
        .set(manifesto)


      setTimeout(() => {
        this.readonly = true
        this.loading = false
        this.$emit('close-dialog')

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Saved',
          color: 'success'
        })
      }, 1000)

      this.editor.destroy()

    },
    update(){
      this.loading = true

      let manifestoId = this.manifestoId

      let manifesto = this.$gun.get(manifestoId)

      let title = this.$refs.title.innerText

      manifesto.get('title')
        .put(title)
      manifesto.get('body')
        .put(this.manifesto_body)
      manifesto.get('last_updated')
        .put(this.$Gun.state())

      setTimeout(() => {
        this.readonly = true
        this.loading = false

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Saved',
          color: 'success'
        })
      }, 1000)

      this.editor.destroy()
    },
    edit(){
      this.readonly = false

      if(this.editor){
        this.editor.setup()
      }
      else {
        this.initializeEditor()
      }
    },
    formatDate(date){
      return new Date(date).toLocaleString('en-Us', {
        month: 'short',
        year: 'numeric',
        day: 'numeric'
      })
    }
  },
  mounted(){
    this.initialize()
    
  },
  beforeDestroy(){
    this.editor ? this.editor.destroy() : ''
  }
}

import Navigation from '@/components/Navigation'
import MediumEditor from 'medium-editor'
// import editor from 'vue2-medium-editor'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/beagle.min.css'
import { mapGetters } from 'vuex'
</script>
<style >
  .editable {
    min-height: 300px;
    padding: 15px;
  }
</style>