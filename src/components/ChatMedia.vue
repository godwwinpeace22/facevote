<template>
  <div>
    <v-container grid-list-sm>
      <v-layout row wrap>
        <v-subheader v-show="$store.getters.getChatMedia.length == 0">No items</v-subheader>
        <v-flex xs6 sm4 md2 v-for="(image,i) in $store.getters.getChatMedia" :key="i">
          <v-card height="150" class="mb-1" flat>
            <v-img :src='image' height="150" @click="carouselDialog($store.getters.getChatMedia,i)"></v-img>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- carousel dialog -->
    <!-- <v-dialog v-model="carousel_dialog"
      fullscreen transition="dialog-transition">
      <v-toolbar dense flat color="dark" tile>
        <v-toolbar-title class="white--text">Media files</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="" dark large icon @click="carousel_dialog = false">
          <v-icon large>close</v-icon>
        </v-btn>
      </v-toolbar>
      <template>
        <v-card color="" dark
          flat tile>
          <v-layout align-center justify-center fill-height>
            <v-flex xs1 v-if="$vuetify.breakpoint.smAndUp">
              <v-btn color="" depressed icon @click="prev">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm10 md4>
              <v-window v-model="onboarding">
                <v-window-item v-for="(image,n) in carousel_images" :key="`card-${n}`">
                  <v-card color="transparent" max-height="500" flat>
                    <v-layout
                      align-center
                      justify-center
                      fill-height
                      tag="v-card-text"
                    >
                    
                    <v-flex xs12>
                      <v-img :src='image' min-height='300'></v-img>
                    </v-flex>
                    
                    </v-layout>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-flex>
            <v-flex xs1 v-if="$vuetify.breakpoint.smAndUp">
              <v-btn depressed icon @click="next">
                <v-icon>chevron_right</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-card-actions v-if="$vuetify.breakpoint.xsOnly" style="position:fixed;width:100%;bottom:0;">
            <v-btn color="" depressed icon @click="prev">
              <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn depressed icon @click="next">
              <v-icon>chevron_right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog> -->

  </div>
</template>
<script>
export default {
  data:()=>({
    carousel_dialog:false,
    carousel_images:[],
    onboarding:0,
  }),
  props:[],
  methods:{
    carouselDialog(images,index){
      // this.carousel_dialog = true
      // this.carousel_images = images
      // this.onboarding = index
      this.$eventBus.$emit('Open_Image_Gallery', {
        images, index
      })
    },
    next () {
      this.onboarding = this.onboarding + 1 === this.carousel_images.length
        ? 0
        : this.onboarding + 1
    },
    prev () {
      this.onboarding = this.onboarding - 1 < 0
        ? this.carousel_images.length - 1
        : this.onboarding - 1
    },
  },
  mounted(){

  }
}
</script>
