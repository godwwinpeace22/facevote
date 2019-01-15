<template>
  <v-container grid-list-xl
    justify-center justify-space-around>
    <v-card class="round mt-3 pa-5 elevation-2">
      <v-container grid-list-xs>
        <v-layout row wrap justify-space-around>
          <v-flex xs12 sm10>
            <v-card flat tile>
              <v-layout row wrap justify-space-around>
                <v-flex xs12 sm4 d-flex class="">
                  <v-card flat tile class="transparent" :class="{'py-5': shouldPad}">
                    <v-avatar
                      size="150"
                      class="d-block" style="margin:auto;"
                    >
                      <img width="100%" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" alt="alt">
                    </v-avatar>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm8 d-flex class="">
                  <v-card :class="{'py-5': shouldPad}" tile flat>
                    <div class="title text-xs-center text-sm-left">
                      <p style="color:#000000de;font-size:16px; line-height:20px;">{{text.data}}</p>
                    </div>
                    <v-card-actions>
                      <v-btn color="secondary text-xs-center" 
                        :style="$vuetify.breakpoint.xsOnly? {margin:'auto' } : '' " class="round" 
                        depressed :to="text.action.action_link">
                        {{text.action.text}}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data:()=>({

  }),
  props:['text'],
  computed:{
    shouldPad(){
      return this.$vuetify.breakpoint.xsOnly ? false : true
    },
  },
}
</script>
