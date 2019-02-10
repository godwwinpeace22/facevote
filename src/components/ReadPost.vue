<template>
  <div>
    <v-container grid-list-xs>
      <v-layout row wrap>
        <v-flex xs12>
          {{postId}}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, explicabo, sequi quae libero voluptate animi aut sint officiis natus necessitatibus omnis quas quasi magnam! Tempora eum fuga fugit non ipsum.
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data:()=>({
    
  }),
  props:['postId']
}
</script>

