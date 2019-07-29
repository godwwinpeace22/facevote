<template>
  <div>
    <v-container grid-list-sm class="px-0" v-if="post.imgs.length > 0">
      <v-layout row wrap>
        <v-flex v-for="(image,i) in post.imgs.slice(0,3)" :key="i" class="" 
          :class="{'xs3': post.imgs.length >=3,'xs6': post.imgs.length < 3}">
          <v-card flat dark max-height="500px" :height="post.imgs.length == 1 ? '70%' : breakpoint.xsOnly ? 100 : '200'" class="mb-3">
            <v-img :src="image" :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`" 
              alt="" class="grey lighten-2 magnify" height="100%" width="100%"
              @click="carouselDialog(post.imgs,i)">
              
              <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-layout>
            </v-img>
          </v-card>
        </v-flex>
        <v-flex xs3>
          <v-card  v-if="post.imgs.length >= 4" 
            :height="post.imgs.length == 1 ? '100%' : breakpoint.xsOnly ? 100 : '200'" 
            class="mb-3 linkify" dark @click="carouselDialog(post.imgs, 3)">
            <div class="title text-xs-center" style="padding-top: 55%;">+ {{post.imgs.length - 3}} more</div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () => ({

  }),
  props: ['post'],
  computed: {
    breakpoint(){
      return this.$vuetify.breakpoint
    }
  },
  methods: {
    carouselDialog(images,index){
      this.$eventBus.$emit('Open_Image_Gallery', {
        images, index
      })
    },
  }
}
</script>
