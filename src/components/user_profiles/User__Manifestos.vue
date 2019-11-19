<template>
  <div>
    <v-container class="mt-12">
      <v-row justify="center">
        <v-col cols="12" sm="10">
          <!-- <v-text-field
            name="title"
            label="Title"
            id="title"
          ></v-text-field> -->
          <div class="editable"></div>

        </v-col>
        <v-col cols="12" sm="10">
          <div class="editable"></div>

        </v-col>
        <v-btn color="success" @click="save">Save</v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    
  }),
  methods: {
    
    save(){
      
    },
    initialize(){

    }
  },
  mounted(){
    this.initialize()
  },
  components: {
    // 'medium-editor': editor
  }
}

</script>

<style>

</style>