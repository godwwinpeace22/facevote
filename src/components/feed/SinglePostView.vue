<template>
  <div>
    <vue-headful :title="title"/>

    <navigation/>

    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>

      <v-container grid-list-xs v-else>
        <v-row row wrap>
          <v-col cols="12" md="8">
            <post-template :posts="[post]" :expanded="[0]" view_type="single_post"/>
            
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
    post: {}
  }),
  props: ['postId'],
  watch: {
    'postId': function(to, from){
      this.initialize()
    }
  },
  computed: {
    title(){
      return this.$appName
    },
    ...mapState([
      'curRoom',
      'isSuperUser'
    ])
  },
  methods: {
    getPost(){
      db.collection('posts').doc(this.postId)
      .onSnapshot(doc => {

        this.post = doc.data()
        this.showUi = true
      })
    },
    initialize(){
      this.getPost()
    }
  },
  mounted(){
    this.getPost()
  },
  components: {
    Navigation,
    PostTemplate
  }
}

import Navigation from '@/components/Navigation'
import PostTemplate from '@/components/feed/PostTemplate'
// import { db } from '@/plugins/firebase'
import { mapState, mapGetters } from 'vuex'
</script>
