<template>
  <div>
    <v-container grid-list-xl>
      <v-card flat tile style='min-height:100px'>
        <v-toolbar dense flat color="grey lighten-1" dark>
          <v-subheader class="font-weight-bold white--text">Recent Broadcasts</v-subheader>
          <v-spacer></v-spacer>
          <v-btn color="success" right small outline @click="dialog = true">
            <v-icon>add</v-icon>
            New broadcast</v-btn>
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
                        
                        <p class="mt-5">Choose the audience for your broadcast message</p>
                        <v-select class="mt-3" outline color="secondary"
                          label="Select group" v-model="form.group"
                          :items="myContests" item-value="electionId"
                          item-text="title"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-card>
                  <v-btn flat @click="e13 = 1">Previous</v-btn>
                  <v-btn color="success" outline :disabled="b_group_rules" flat @click="submit">Publish Message</v-btn>
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
      group:'',
    },
    radio:null,
    group:[],
    groups:[],
  }),
  props:['myContests','user','broadcasts'],
  computed:{
    b_msg_rules(){
      return !this.form.message.trim()
    },
    b_group_rules(){
      return !this.form.group.trim()
    },
  },
  methods:{
    async submit(){
      try {
        let msgId = btoa(Math.random()).substring(0,12) + Date.now()
        let post = {
          message:this.form.message,
          type:'broadcast',
          group:this.form.group,
          timestamp:Date.now(),
          msgId:msgId,
          seenBy:[],
          department:this.user.department,
          faculty:this.user.faculty,
          school:this.user.school,
          sender:this.user.uid,
          name:this.user.name,
          imgSrc:this.user.photoURL,
          reciever:'everyone'
        }

        db.collection('broadcasts').doc(post.msgId).set(post)
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

