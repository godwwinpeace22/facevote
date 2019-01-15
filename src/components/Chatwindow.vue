<template>
  <loading-bar v-if='loading_messages'>
    <v-subheader slot='loading_info' class='d-block mx-auto' style='width:fit-content;'>Loading messages...</v-subheader>
  </loading-bar>
  <div v-else style="background:#fff;" class="pa-0 pt-3 chat_home chat_space" id="chat_home">
    <div flat pa-0 id="chat_space" class="chat_space" style="height:60vh;margin-top:px;overflow-y:auto;">
      <div v-for="(msg,i) in getChatMessages" :key="i">
        <div v-if="divide(msg.timestamp, getChatMessages[i-1])" style="background:oldlace;font-weight:bold;text-align:center;">
          {{divide(msg.timestamp, getChatMessages[i-1])}}
        </div>
        <div class="chat_rectangle ">
          <div class="chat_avartar"><img :src="Img(msg.sender)" alt="avartar"></div>
          
          <div class="chat_content">
            <div style="width:100%;margin-top:0px;margin-bottom:0px;">
              <span class="text-capitalize" v-if="msg.sender != getUser.uid " style="font-size:15px;margin-right:5px;">
                <a class="subheading" @click.prevent="$router.push(`/forum/${msg.room}/profile/${getSender(msg.sender).email}`); 
                  $eventBus.$emit('Toggle_drawerRight', true)">
                {{msg.name}}</a>
              </span>
              <span v-else style="margin-right:5px;"><strong>You  </strong></span>
              <span style="font-size:.9em;color:#555;" color="grey lighten-5">  {{parseDate(msg.timestamp)}}</span>
            </div>
            
            <div style="width:100%;">

              <!-- the spice of life -->
              <template v-for="item in msg.chat.split(' ')">
                
                <router-link event="" @click.native.prevent="goto(item,msg.room)" 
                  v-if="item.charAt(0) == '@'" 
                  :to="'/forum/' + msg.room + '/profile/' + item.slice(1)" :key="item">
                  @{{findAMember(item.slice(1))}}
                </router-link>

                <router-link v-else-if="item.charAt(0) == '#'" :to="item" append :key="item">{{item}} </router-link>

                <template v-else>{{item}} </template>

              </template>
              <v-container grid-list-md v-if="msg.images">
                <v-layout row wrap>
                  <v-flex xs12 sm4 v-for="(image,i) in msg.images" :key="i">
                    <v-card height="150" class="mb-1" flat>
                      <v-img :src='image' height="150" @click="carouselDialog(msg.images,i)"></v-img>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </div>
            
            <div class="show_reactions">
              <div class="reactions">
                <v-btn icon small @click="add_reaction(msg,'like')">
                  <img alt="Thumbs Up Hand Gesture" width=30 height=30 src="http://www.sherv.net/cm/emoticons/hand-gestures/thumbs-up-hand-gesture-smiley-emoticon.gif">
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'love')">
                  <v-icon color="red">favorite</v-icon>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'haha')">
                  <span class="emojis">😃</span>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'wow')">
                  <span class="emojis">😲</span>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'angry')">
                  <span class="emojis">😣</span>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'excited')">
                  <img alt="Big Dancing Banana" width=20 height=20 src="http://www.sherv.net/cm/emo/funny/2/big-dancing-banana-smiley-emoticon.gif">
                </v-btn>
              </div>
              <v-tooltip bottom>
                <v-btn icon small slot="activator">
                  <v-icon color="success">mood</v-icon>
                </v-btn>
                <span>Add reactions</span>
                
              </v-tooltip>
            </div>
            <div style="display:inline-block;">
              <v-btn icon small @click="add_reaction(msg,'like')" v-show="msg.reactions.like.length > 0">
                {{msg.reactions.like.length}}<img alt="Thumbs Up Hand Gesture" width=30 height=30 src="http://www.sherv.net/cm/emoticons/hand-gestures/thumbs-up-hand-gesture-smiley-emoticon.gif">
              </v-btn>
              <v-btn icon small @click="add_reaction(msg,'love')" v-show="msg.reactions.love.length > 0">
                {{msg.reactions.love.length}}<v-icon color="red">favorite</v-icon>
              </v-btn>
              <v-btn icon small @click="add_reaction(msg,'haha')" v-show="msg.reactions.haha.length > 0">
                {{msg.reactions.haha.length}}<span class="emojis">😃</span>
              </v-btn>
              <v-btn icon small @click="add_reaction(msg,'wow')" v-show="msg.reactions.wow.length > 0">
                {{msg.reactions.wow.length}}<span class="emojis">😲</span>
              </v-btn>
              <v-btn icon small @click="add_reaction(msg,'angry')" v-show="msg.reactions.angry.length > 0">
                {{msg.reactions.angry.length}}<span class="emojis">😣</span>
              </v-btn>
              <v-btn icon small @click="add_reaction(msg,'excited')" v-show="msg.reactions.excited.length > 0">
                {{msg.reactions.excited.length}}<img alt="Big Dancing Banana" width=20 height=20 src="http://www.sherv.net/cm/emo/funny/2/big-dancing-banana-smiley-emoticon.gif">
              </v-btn>
            </div>
          </div>
        </div>
      </div>
        
    </div>

    <!-- carousel dialog -->
    <v-dialog v-model="carousel_dialog"
      fullscreen transition="dialog-transition">
      <v-toolbar dense flat color="grey" tile>
        <v-toolbar-title class="white--text">Media files</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="" dark icon @click="carousel_dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <template>
        <v-card color="" dark
          flat tile>
          <v-container fluid fill-height d-flex px-0>
            <v-layout align-center justify-center>
              <v-flex xs1 v-if="$vuetify.breakpoint.smAndUp">
                <v-btn color="" depressed icon @click="prev">
                  <v-icon>chevron_left</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12 sm10 md8>
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
          </v-container>
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
    </v-dialog>
  </div>
</template>

<script>

export default {
  props:{
    icons:{
      type:Array
    },
    source:String
  },
  data:()=>({
    password: 'Password',
    show_reactions:false,
    carousel_dialog:false,
    carousel_images:[],
    onboarding:0,
    drawer: null,
    message: 'Hey!',
    chat_messages:[],
    basemsgs:[],
    marker: true,
    iconIndex: 0,
    menu:false,
    chat:'',
    fab:true,
    curr_date:null,
    loading_messages:true,
  }),
  props:['members','room'],
  computed: {
    icon () {
      return this.icons[this.iconIndex]
    },
    ...mapGetters([
      'isAuthenticated',
      'token',
      'getUser',
      'getChatMessages'
    ]),
  },

  methods: {
    carouselDialog(images,index){
      this.carousel_dialog = true
      this.carousel_images = images
      this.onboarding = index
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
    findAMember(memberEmail){
      let member = this.members.find(member=> member.email == memberEmail)
      return member ? member.name : memberEmail
    },
    sameUser(msg){
      return msg.sender == this.getUser.uid
    },
    getSender(uid){
      return this.members.find(member => member.uid == uid)
    },
    Img(sender){
      //console.log('regvoters!: ', this.regVoters)
      let found = this.members.find(member=> member.uid == sender)
      return this.members ? found ? found.photoURL : null : null
    },
    parseDate(timestamp){
      let d = new Date(timestamp)
      let options = {hour:'numeric', minute:'numeric' };
      return d.toLocaleString("en-US",options)
    },
    getRep(chat){
      return chat.replace(/@([\w]+)/g,'<router-link to="/tag/$1">#$1</router-link>')
    },
    goto(item,room){
      console.log(item,room)
      if(this.members.find(member => member.email == item.slice(1))){
        this.$router.push(`/forum/${room}/profile/${item.slice(1)}`)
        this.$eventBus.$emit('Toggle_drawerRight', true)
      }
      else{}
      
    },
    doSomething(){
      alert('Do something!')
    },
    divide(timestamp,prev){
      let options = {year: 'numeric', month: 'numeric', day: 'numeric' };
      let then = new Date(timestamp)
      let that_day = then.toLocaleString("en-US",options)
      let that_day2 = then.toLocaleString('en-Us', {
          year:'numeric', month:'short', weekday:'short', day:'numeric'
        })

      if(prev && prev.timestamp){
        // for msg other than the first. If the previous date is same as the cur date return false
        if((new Date(prev.timestamp)).toLocaleString("en-US", options) == that_day){
          return false
        }
        else{
          // else return true (the previous date is different from the cur date, hence its another day)
          let today = new Date()
          if((new Date()).toLocaleString('en-Us',options) == that_day2){
            return 'Today'
          }else{
            return that_day2
          }
          
          
        }
      }
      else{ // for the very first msg
        // if today's date is same with message's date return 'today' else show that date
        return (new Date()).toLocaleString('en-Us',options) == that_day ? 'Today' : that_day2
      }
    },
    async add_reaction(msg,reaction){
      try {
        console.log(msg,reaction)
        let a_reaction = msg.reactions[reaction]
        let me = this.getUser.uid

        if(a_reaction.indexOf(me) != -1){ // if current user has reacted same way before
          
          a_reaction.splice(a_reaction.indexOf(me)) // this is reactive, so view are updated immediately
          
          
          db.collection('chat_messages').doc(msg.msgId).update({
            reactions:msg.reactions
          })
        }
        else if(a_reaction.indexOf(me) == -1){ // if current user hasn't reacted same way before
          a_reaction.push(this.getUser.uid) // this is reactive, so view are updated immediately
          db.collection('chat_messages').doc(msg.msgId).update({
            reactions:msg.reactions
          })
          //$('chat_home').scrollTop($('#chat_home')[0].scrollHeight);
        }
        else{}
  
      } catch(err) {
        console.log(err)
      }
    },
    scrollChat(){
       let doc = document.getElementById('chat_space')
      doc ? doc.scrollTop = doc.scrollHeight - doc.clientHeight : ''
      //console.log(doc.scrollTop)
    },
    chatUpdate(){
      
      //console.log(this.$route.params.electionId)
      if(this.$route.params.electionId){
        db.collection('chat_messages').where('room','==',this.$route.params.electionId).onSnapshot(snapshot=>{
          let msgs = []
          snapshot.forEach(doc=>{
            msgs.push(doc.data())
            
          })
        
          this.$store.dispatch('updateFromDb', msgs)
          this.loading_messages = false
          //console.log(msgs)
          console.log(this.$store.state.chat_messages)
        })
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.scrollChat()
    }, 4000);
    
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        // User is signed in.
        this.chatUpdate()
        
      } else {
        console.log('No user is signed in.')
      }
    });
    

    this.$eventBus.$on('Scroll_Chat', data=>{
      //this.scrollChat()
      console.log(data)
    })
    
  },
  components:{
    'settings':Settings,
    LoadingBar,
    //'users':Users,
  }
}
import io from 'socket.io-client';
  import {mapGetters} from 'vuex'
  import api from '@/services/api'
  import Settings from '@/components/Settings'
  import LoadingBar from '@/spinners/LoadingBar'
  //import Users from '@/components/Users'
  import { promisfy } from "@/helpers/promisify";
  
</script>
<style lang="scss" scoped>

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;
$secondary:#1867c0;

a{
  color:$secondary;
}

.chat_home{
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  height:75vh;
  //background-color: #00aabb;
}
.chat_avartar{
  width:40px;
  height: 40px;
  border-radius:5px;
  //float:left;
  //display:inline-block;
  margin-right:1%;
  float:left;
  img{
    width:100%;
    height:100%;
    border-radius:5px;
  }
}
.chat_content{
  display:inline-block;
  //background:yellow;
  width:90%;
  min-height: 40px;
}
.chat_rectangle {
  padding:5px 15px;
  margin-bottom: 5px;
	//position: relative;
	//background: #00aabb;
	text-align: left;
  text-overflow:wrap;
  width:100%;
  word-wrap: break-word;
  &:hover{
    background-color:rgb(241, 241, 241);
  }
  a{
    text-decoration:none;
    color:#00aabb;
  }
}

/* --scrollbar --*/
.chat_space::-webkit-scrollbar {
    width: 10px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }
.chat_space::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: $mainBgColor;
  @include borderRadius(10px)
}
.chat_space::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
.show_reactions{
  position: relative;
  width:50px;
  width:fit-content;
  display:inline-block;
  &:hover .reactions{
    display:block;
    
  }
}
.reactions{
  display:none;
  position: absolute;
  z-index: 1;
  top:-90%;
  width:280px;
  height: 40px;
  @include borderRadius(10px);
  //opacity: .8;
  background: #d4d4d4;
}
.emojis{
  font-size: 22px;
}
</style>