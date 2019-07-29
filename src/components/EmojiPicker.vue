<template>
  <div>
      <v-tabs v-model="active"
        color="cyan"
        dark show-arrows>
        <v-tabs-slider color="yellow"></v-tabs-slider>

        <v-tab v-for="category in emojiData" 
          :key="category.name" ripple 
          class="text-capitalize"
          :href="'#tab-' + category.name">
          {{ category.name }}
        </v-tab>
        <v-tabs-items>
          <v-tab-item :value="'tab-' + emoji.name"
            v-for="(emoji, i) in emojiData"
            :key="i + 'e'"
          >
            <v-card flat style="overflow: auto;" height="300" class="navdrawr emoji-picker">
              <v-card-text class="pa-1">
                <v-btn icon small 
                  @click="emitEvent($event, emoji)" 
                  v-for="(emoji, i) in emojiData[i].emojis" 
                  :key="i" style="font-size: 20px;" class="ma-0">

                  {{emoji}}
                </v-btn>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
  </div>
</template>
<script>
export default {
  data: () =>({
    emojiData: emojiData,
    active: 'tab-People'
  }),
  computed: {
    active_tab(){
      return this.emojiData
    }
  },
  methods: {
    emitEvent(e, emoji){
      // console.log(e, emoji)
      this.$emit('append-emoji', emoji)
    }
  },
  created(){
    // console.log(emojiData)
  }
}

import emojiData from '@/components/emojiData'
</script>

<style>
  .picker-card {
    overflow: auto;
  }
</style>
