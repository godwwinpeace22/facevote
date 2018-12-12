<template>
  <div>
    <v-container grid-list-xl>
      <v-card flat tile style='min-height:100px'>
        <v-toolbar dense flat color="teal" dark>
          <v-subheader class="font-weight-bold white--text">Recent Posts</v-subheader>
          <v-spacer></v-spacer>
          <v-btn color="" right small outline @click="dialog = true">
            <v-icon>add</v-icon>
            New post</v-btn>
        </v-toolbar>
        <v-layout row wrap>
          <v-subheader v-if="broadcasts.length == 0">No recent post</v-subheader>
          <v-flex sm6 v-for="item of broadcasts" :key="item.dateCreated">
            <v-card class=" mb-3" height="150" flat tile>
              <v-layout>
                <v-flex xs4 style="background:;" d-flex>
                  <v-img src='https://ui-avatars.com/api/?name=following+name' height="150"></v-img>
                </v-flex>
                <v-flex xs8 d-flex>
                  <v-card-text style="height:150px;">
                    <v-card-title primary-title>
                      Title
                    </v-card-title>
                    Lorem ipsum dolor sit amet consectetur adipisici quae neque culpa id rerum vel soluta quod ea ullam fuga.
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>

        <v-dialog
          v-model="dialog"
          scrollable 
          persistent :fullscreen='$vuetify.breakpoint.xs'
          max-width="850px"
          transition="slide-y-transition">
          <v-card>
            <v-toolbar dense flat dark color="teal">
              <v-subheader class="white--text">Compose</v-subheader>
              <v-spacer></v-spacer>
              <v-btn depressed small outline @click="dialog = false">Cancel</v-btn>
            </v-toolbar>
            <v-card-text class="px-0">
              <v-stepper v-model="e13" vertical class="elevation-0">
                <v-stepper-step step="1">
                  Your Message
                  <small>Compose your message</small>
                </v-stepper-step>

                <v-stepper-content step="1">
                  <v-card color="" flat tile class="mb-5" min-height="200px">
                    <v-textarea auto-grow clearable color="secondary"
                      label="Type your message" v-model="form.message"
                      name="broadcast" outline
                    ></v-textarea>
                  </v-card>
                  <v-btn color="success" outline flat :disabled="b_msg_rules" @click="e13 = 2">Continue</v-btn>
                </v-stepper-content>

                <v-stepper-step step="2">Choose Audience</v-stepper-step>

                <v-stepper-content step="2">
                  <v-card flat class="mb-5" min-height="200px">
                    <v-layout row wrap>
                      <v-flex xs8>
                        <p>Lorem ipsum dolor lorem sipus idf lsf lsfdfd fdkklsuer ioijsdfhp isf adfiopi  adf ip jadf sadf.</p>
                        <v-select class="mt-3" outline color="secondary"
                          label="Choose broadcast scope" v-model="form.audience"
                          :items="['Everyone','Voters only', 'Contestants only']"
                        ></v-select>
                        <p class="mt-5">Lorem ipsum dolor lorem sipus idf lsf lsfdfd fdkklsuer ioijsdfhp isf adfiopi  adf ip jadf sadf.</p>
                        <v-select class="mt-3" outline color="secondary"
                          label="Select group" v-model="group"
                          :items="getContests" return-object
                          item-text="title"
                        ></v-select>
                        <p class="mt-5">Lorem ipsum dolor lorem sipus idf lsf lsfdfd fdkklsuer ioijsdfhp isf adfiopi  adf ip jadf sadf.</p>
                        <v-radio-group v-model="form.type">
                          <v-radio label="Post" color="success" value="post"></v-radio>
                          <v-radio label="send as private message" color="secondary" value="pmsg"></v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-layout>
                  </v-card>
                  <v-btn flat @click="e13 = 1">Previous</v-btn>
                  <v-btn color="success" outline :disabled="b_audience_rules" flat @click="submit">Finish</v-btn>
                </v-stepper-content>
                <v-divider inset vertical></v-divider>
              </v-stepper>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data: ()=>({
    dialog:false,
    e13: 1,
    form:{
      message:'',
      type:'',
      audience:'everyone',
      togroup:'',
    },
    radio:null,
    group:[],
    groups:[],
  }),
  props:['myContests','user','broadcasts'],
  computed:{
    getContests(){
      return this.groups
    },
    b_msg_rules(){
      return !this.form.message
    },
    b_audience_rules(){
      return !this.form.audience || !this.group || !this.form.type
    },
  },
  methods:{
    async submit(){
      try {
        
        this.form.togroup = this.group._id
        this.form['electionId'] = this.group.electionId
        console.log(this.form)
        /*let res = await api().post(`dashboard/broadcast`, {
          
        })
        console.log(res)*/
        
        this.dialog = false
        this.$eventBus.$emit('Create_Broadcast', {
          token:this.$store.getters.getToken,
          user:this.$store.getters.getUser,
          ...this.form
        })
        console.log('emited')
      } catch (error) {
        console.log(error)
        console.log(error.response)
        alert('Sorry, something went wrong. Try again')
      }
    }
  },
  mounted(){
    console.log(this.myContests)
    this.myContests.forEach(item=>{
      this.groups.push(item.electionRef)
    })
    console.log(this.groups)
  }
}
import api from '@/services/api'
</script>
<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;

  /* --scrollbar --*/
  .scrollbar::-webkit-scrollbar {
      width: 10px;
      background-color: #d7d7df ;
      @include borderRadius(10px)
    }
  .scrollbar::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #d7d7df ;
    @include borderRadius(10px)
  }
  .scrollbar::-webkit-scrollbar-thumb {
    background-color:#87899c ;
    @include borderRadius(10px);
  }
</style>

