<template>
  <div>
    <v-card outlined tile style="height:calc(100vh - 79px);">
      <v-card-text>
        <div class="title">Your forums</div>
        <v-list dense shaped nav>
          <template v-for="(item,i) in getMyEnrolled">
            <v-list-item 
              :key="item.electionId + i"
              :to="`/forum/${item.electionId}`">
              <v-list-item-title>
                {{item.title}}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
        
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({

  }),
  computed: {
    ...mapGetters([
      'getMyEnrolled'
    ]),
    ...mapState([
      'is_verified'
    ])
  }
}

import { mapGetters, mapState } from "vuex";
</script>

<style>

</style>