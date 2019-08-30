<template>
  <div>
    <v-container grid-list-xs class="px-0" v-if="imgs.length > 0">
      <v-layout row wrap>
        <v-flex :class="{xs6: imgs.length == 2, xs12: imgs.length == 1 || imgs.length > 2}">
          <v-card flat dark :height="imgHeight">
            <v-img :src="imgs[0]" :lazy-src="`https://picsum.photos/10/6?image=${5 + 10}`" 
              alt="" class="grey lighten-2 magnify" max-height="300" aspect-ratio="2" height="100%" width="100%"
              @click="carouselDialog(imgs,0)">
              
              <template v-slot:placeholder>
                <v-layout fill-height align-center justify-center ma-0>
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
              </template>
            </v-img>
          </v-card>
        </v-flex>
        
        <v-flex v-for="(image,i) in imgs.slice(1,4)" :key="i" style="position: relative"
          :class="{'xs6': imgs.length < 4,'xs4': imgs.length >= 4}">
          <v-card flat dark max-height="400px" :height="imgHeight2">
            <v-img :src="image" :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`" 
              alt="" class="grey lighten-2 magnify" height="100%" width="100%"
              @click="carouselDialog(imgs, i+1)">
              
              <template v-slot:placeholder>
                <v-layout fill-height align-center justify-center ma-0>
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
              </template>
            </v-img>
          </v-card>
          <div class="overlay" v-if="i == 2 && imgs.length > 4">
            
            <v-card 
              :height="imgs.length == 1 ? '100%' : breakpoint.xsOnly ? 100 : '150'" 
              class="mb-3 linkify" color="transparent" @click="carouselDialog(imgs, 3)">
              <div class="title text-xs-center white--text" style="padding-top: 35%;">+ {{imgs.length - 4}} more</div>
            </v-card>
          </div>
        </v-flex>
        
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () => ({

  }),
  props: ['imgs'],
  computed: {
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    imgHeight(){
      // console.log(this.imgs.length)
      let len = this.imgs.length == 1 ? '300' : this.breakpoint.xsOnly ? '150' : '250'
      // console.log({len})
      return len
    },
    imgHeight2(){
      return this.imgs.length == 2 ? 
        this.breakpoint.xsOnly ? '150' : 
        '250' : this.breakpoint.xsOnly ? 
        '100' : '150'
    },
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
<style lang="scss" scopped>
  .overlay {
    height: 98%;
    width: 98%;
    background: rgba(0,0,0,.4);
    position: absolute;
    top: 1px;
  }
</style>
